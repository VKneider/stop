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
import socketManager from "./components/SocketManager/SocketManager.js";

//Schemas and Middlewares
import { userLoginSchema, userRegisterSchema } from "./Validations/userValidation.js";
import validationYup from "./Middlewares/validationMiddleware.js";
import gameMiddleware from "./Middlewares/gameMiddleware.js";
import { generateRoundWords,  getCategories, generateRepeatedWords, generateTotalRoundPointsMap } from "./components/SocketManager/utils.js";

//Routers
import homeRouter from "./Routes/homeRouter.js";
import profileRouter from "./Routes/profileRouter.js";

const app = express();
const bodyParser = express.json();
app.set("port", process.env.PORT || 3003);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));
app.use(sess.sessionConfig());
app.use("/home", homeRouter);

//app.use("/profile", profileRouter);

const server = app.listen(app.get("port"), "", (req, res) => {
    console.log("Server is running on port: " + app.get("port"));
});

const io = new socketIO(server);

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
    if (req.session.room) {
        res.status(200).send({ message: "You are already in a room", status: 403, room: req.session.room });
        return;
    }

    let newRoom = socketManager.genRoomID();
    socketManager.setUser(req.session.user, { room: newRoom, status: "waiting", max: req.body.max, role: "host", nickname: req.session.nickname });
    res.status(200).send({ room: newRoom, status: 200, user: req.session.user });
});

app.post("/joinRoom", sess.sessionMiddleware, (req, res) => {
    if (req.session.room) {
        res.status(200).send({ message: "You are already in a room", status: 403, room: req.session.room });
        return;
    }

    if (socketManager.verifyRoom(req.body.room) == false) {
        res.status(200).send({ message: "Room not found", status: 404 });
        return;
    }

    if (socketManager.verifyRoomFull(req.body.room) == true) {
        res.status(200).send({ message: "Room is full", status: 400 });
        return;
    }

    let roomMax = socketManager.getRoomMax(req.body.room);
    let myRoom = req.body.room;

    socketManager.setUser(req.session.user, { room: req.body.room, status: "waiting", max: roomMax, role: "player", nickname: req.session.nickname });
    res.status(200).send({ room: req.body.room, user: req.session.user, status: 200, max: roomMax });
});

app.get("/game", sess.sessionMiddleware, (req, res) => {
    if (socketManager.getUser(req.session.user).room == req.query.room) {
        req.session.room = req.query.room;
        res.sendFile(path.join(__dirname, "public", "gamePage", "index.html"));
    } else {
        res.redirect("/");
    }
});

app.get("/getPlayersDataInRoom", sess.sessionMiddleware, (req, res) => {
    let players = socketManager.getPlayersDataInRoom(req.query.room);
    res.status(200).send({ players: players, status: 200 });
});

app.get("/getUserData", sess.sessionMiddleware, (req, res) => {
    let user = socketManager.getUser(req.session.user);
    res.status(200).send({ user: req.session.user, room: req.session.room, status: 200, nickname: req.session.nickname, role: user.role });
});

app.get("/getRoomData", sess.sessionMiddleware, (req, res) => {
    let room = socketManager.getRoomData(req.session.room);
    res.status(200).send({ room: room, status: 200 });
});

io.on("connection", socket => {
    socket.on("disconnect", () => {
        let data = socketManager.getDisconnectData(socket.id);

        if (data != null && data != undefined) {
            if (data.status != "playing") {
                if (data.role == "host") {
                    socketManager.deleteRoom(data.room);
                    socket.broadcast.to(data.room).emit("update:closedRoom");
                } else {
                    if (io.sockets.adapter.rooms.get(data.room).size != undefined) {
                        let players = socketManager.getRoomUsers(data.room) - 1;
                        socket.broadcast.to(data.room).emit("update:waitingPlayers", { players: players, max: socketManager.getRoomMax(data.room) });
                        socketManager.removeUserRoom(data.user);
                    }
                }
            } else {
                if (socketManager.getRoomData(data.room).connected > 0) {
                    socketManager.getRoomData(data.room).connected--;
                }
            }
        } else {
            console.log("solo tenia el modal abierto ");
        }
    });

    socket.on("waiting:join", data => {
        socketManager.getUser(data.user).socket = socket;
        socket.join(data.room);
        io.in(data.room).emit("update:waitingPlayers", { players: io.sockets.adapter.rooms.get(data.room).size, max: data.max });
    });

    socket.on("waiting:leave", data => {
        socket.leave(data.room);
        io.in(data.room).emit("update:waitingPlayers", { players: io.sockets.adapter.rooms.get(data.room).size, max: data.max }); //falta una validacion
        socketManager.removeUserRoom(data.user);
    });

    socket.on("joinRoom", data => {
        socketManager.getUser(data.user).socket = socket;
        socket.join(data.room);
    });

    socket.on("waiting:deleteRoom", room => {
        //if(socketManager.getUser(data.user).status=="playing") return;

        socket.broadcast.to(room).emit("update:closedRoom");
        let sockets = socketManager.getSocketsFromRoom(room);
        sockets.forEach(socket => {
            socket.leave(room);
        });
        socketManager.deleteRoom(room);
    });

    socket.on("changeSocket", data => {
        socketManager.getUser(data.user).socket = socket;

        socket.join(data.room);
    });

    socket.on("startGame", room => {
        socketManager.changeGameStatus(room, "playing");
        io.in(room).emit("redirectToRoom", room);
    });

    socket.on("room:connected", room => {
        let myRoom = socketManager.getRoomData(room);
        socketManager.getRoomData(room).connected++;

        if (myRoom.connected == myRoom.players.size && myRoom.started != true) {
            socketManager.getRoomData(room).started = true;
            io.in(room).emit("timer:on");
        }
    });

    socket.on("createRoom", room => {
        socketManager.createRoom(room);
    });

    socket.on("game:endGame", room => {
        io.in(room).emit("game:stopInput");
    });

    

    socket.on("game:sendValues", data => {
        let myRoom = socketManager.getRoomData(data.room);
        myRoom.words = [...myRoom.words, ...data.values];
        myRoom.received++;

        if (myRoom.received == myRoom.players.size) {
            //io.in(data.room).emit("game:startVotations")
            //se deberia enviar las palabras a los jugadores para que hagan las votaciones, luego deberia verificarse que las 3 votaciones se recibieron y se deberia enviar el result

            let roundWords = generateRoundWords(myRoom.words, data.round);
            let categories = getCategories(roundWords);
            console.log(categories, "categories")
            let repeatedWords = generateRepeatedWords(categories, roundWords);
            console.log(repeatedWords, "repeated")
                for(let k = 0; k < roundWords.length; k++){
                    let word = roundWords[k];
                    if(word.value=="none"){
                        word.points=0;
                        continue;
                    }
                    if(repeatedWords.includes(word.value)){
                        word.points=50;
                    }else{
                        word.points=100;
                    }
                }
                console.log(roundWords);

            let mapPoints = generateTotalRoundPointsMap(roundWords);

            const responseJson = {}
            mapPoints.forEach((value, key) => {
                responseJson[key] = value;
            });

            io.in(data.room).emit("game:updatePoints", responseJson);
        } 
    });
});

export default io;
