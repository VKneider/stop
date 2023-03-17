import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: "./env/local.env" });
import { Server as socketIO } from "socket.io";
import { room, genRoomID, verifyRoom, verifyRoomFull, getRoomMax, removeUserRoom, deleteRoom, getDisconnectData, getSocketsFromRoom, getRoomUsers} from "./utils/utils.js";

//Components
import sess from "./components/Session/Session.js";

//Schemas and Middlewares
import { userLoginSchema, userRegisterSchema } from "./Validations/userValidation.js";
import validationYup from "./Middlewares/validationMiddleware.js";

//Routers
import profileRouter from "./Routes/profileRouter.js";
import homeRouter from "./Routes/homeRouter.js";

const app = express();
const bodyParser = express.json();
app.set("port", process.env.PORT || 3003);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));
app.use(sess.sessionConfig());

//app.use("/profile", profileRouter);
app.use("/home", homeRouter);


const server = app.listen(app.get("port"), "", (req, res) => {
    console.log("Server is running on port: " + app.get("port"));
});

//Socket.io
const io = new socketIO(server);
let socketClients = new Map();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landingPage", "index.html"));
});

app.get("/login", (req, res) => {
    if (sess.isLogged(req, res) == true) {
        res.redirect("/home");
    } else {
        res.sendFile(path.join(__dirname, "public", "loginRegister", "index.html"));
    }
});

app.get("/validate", (req, res) => {
    sess.validateAccount(req, res);
});

app.post("/login", validationYup(userLoginSchema), (req, res) => {
    sess.login(req, res);
});

app.post("/logout", (req, res) => {
    sess.logout(req, res);
});

app.post("/register", validationYup(userRegisterSchema), (req, res) => {
    sess.register(req, res);
});




app.post("/createRoom", sess.sessionMiddleware, (req, res) => {

    let newRoom = genRoomID();
    socketClients.set(req.session.user, { room: newRoom, status: "waiting", max:req.body.max, role:"host" });
    res.status(200).send({ room: newRoom, status:200, user:req.session.user});
    
})

app.post("/joinRoom", sess.sessionMiddleware, (req, res) => {

    if(verifyRoom(req.body.room, socketClients) == false){
        res.status(200).send({ message: "Room not found", status: 404 });
        return;
    }

    if(verifyRoomFull(req.body.room, socketClients) == true){
        res.status(200).send({ message: "Room is full", status: 400 });
        return;
    }

    
    let roomMax = getRoomMax(req.body.room, socketClients);
    let myRoom = req.body.room;
    

    socketClients.set(req.session.user, { room: req.body.room, status: "waiting", max:roomMax, role:"player" });
    res.status(200).send({ room: req.body.room, user:req.session.user, status:200, max:roomMax });

})


app.get("/game", sess.sessionMiddleware, (req, res) => {

    if(socketClients.get(req.session.user).room == req.query.room){
        req.session.room = req.query.room;
        res.sendFile(path.join(__dirname, "public", "gamePage", "index.html"));
    } else {
        res.redirect("/");
    }

    
});

app.post("/changeSocket", sess.sessionMiddleware, (req, res) => {
    res.status(200).send({ status:200, user:req.session.user, room:req.session.room });
})





io.on("connection", socket => {
    

    socket.on("disconnect", () => {
        

        let data = getDisconnectData(socket.id, socketClients);
        if(data!=null){
            
                if(data.role=="host"){
                    deleteRoom(data.room, socketClients)
                    socket.broadcast.to(data.room).emit("update:closedRoom");
                }else{
                    if(io.sockets.adapter.rooms.get(data.room).size!=undefined){
                        let players = getRoomUsers(data.room, socketClients)-1;
                        socket.broadcast.to(data.room).emit("update:waitingPlayers", {players:players, max:getRoomMax(data.room, socketClients)} );
                        removeUserRoom(data.user, socketClients);
                    }
                }

        }else {
            console.log("solo tenia el modal abierto ")
        }

        

    });


    socket.on("waiting:join", data => {

        socketClients.get(data.user).socket = socket; 
            socket.join(data.room);
            io.in(data.room).emit("update:waitingPlayers", {players:io.sockets.adapter.rooms.get(data.room).size, max:data.max} );

        });

    socket.on("waiting:leave", data => {
        socket.leave(data.room);
        io.in(data.room).emit("update:waitingPlayers", {players:io.sockets.adapter.rooms.get(data.room).size, max:data.max} ); //falta una validacion
        removeUserRoom(data.user, socketClients);
    });

    socket.on("joinRoom", data => {

        socketClients.get(data.user).socket = socket; 
        socket.join(data.room);
    });


    socket.on("waiting:deleteRoom", room => {


        socket.broadcast.to(room).emit("update:closedRoom");
        let sockets = getSocketsFromRoom(room, socketClients);
        sockets.forEach(socket => {
            socket.leave(room);
        });

        deleteRoom(room, socketClients)

    });

    socket.on("changeSocket", data => {
        socketClients.get(data.user).socket = socket; 
        socketClients.get(data.user).status="playing";
    })




});
