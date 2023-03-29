import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: "./env/local.env" });
import { Server as socketIO } from "socket.io";

//Components
import sess from "./components/Session/Session.js";


//Routers
import homeRouter from "./Routes/homeRouter.js";
import profileRouter from "./Routes/profileRouter.js";
import gameRouter from "./Routes/gameRouter.js";
import sessionRouter from "./Routes/sessionRouter.js";
import { genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, removePlayerFromRoom, verifyRoomExists, getPlayerDataFromSocketID } from "./socketManager/rooms/newRoomSchema.js";


import homeEvents from "./socketManager/events/homeEvents.js";
import gameEvents from "./socketManager/events/gameEvents.js";

const app = express();
const bodyParser = express.json();
app.set("port", process.env.PORT || 3003);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));
app.use(sess.sessionConfig());

app.use("/game", gameRouter);
app.use("/home", homeRouter);
app.use(sessionRouter);

//app.use("/profile", profileRouter);

const server = app.listen(app.get("port"), "", (req, res) => {
    console.log("Server is running on port: " + app.get("port"));
});

const io = new socketIO(server);
homeEvents(io);
gameEvents(io);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landingPage", "index.html"));
});




app.get("/getUserData", sess.sessionMiddleware, (req, res) => {
    let user = getRoomById(req.session.room).players.get(req.session.user);
    res.status(200).send({ user: req.session.user, room: req.session.room, status: 200, nickname: req.session.nickname, role: user.role });
});



io.on("connection", socket => {
    socket.on("disconnecting", () => {
        if(socket.rooms.size>1){

            let rooms = Array.from(socket.rooms);
            let myRoom = rooms[1];
            let myRoomData = getRoomById(myRoom);
            if(myRoomData==undefined) return;
  
    
            let playerData = getPlayerDataFromSocketID(socket.id);
            if (myRoomData.status!="playing") {
                if (playerData.player.role == "host") {
                    deleteRoom(myRoom);
                    socket.broadcast.to(myRoom).emit("update:closedRoom");
                } else {
                    if (io.sockets.adapter.rooms.get(myRoom).size != undefined) {
                        removePlayerFromRoom(myRoom, playerData.userEmail)
                        let players = myRoomData.players.size;
                        socket.broadcast.to(myRoom).emit("update:waitingPlayers", { players: players, max: myRoomData.max });
                    }
                }
            }else{
                playerData.player.disconnected = true;
                console.log(playerData.player.nickname, "disconnected");
            }
        }
    });


    
});

