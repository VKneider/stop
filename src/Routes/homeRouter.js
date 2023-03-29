import express from "express";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import sess from "../components/Session/Session.js";

import {genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer} from "../socketManager/rooms/newRoomSchema.js";
const homeRouter = express.Router();
homeRouter.use(sess.sessionMiddleware);



homeRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"..", "public", "homePage", "index.html"))
} );

homeRouter.post("/createRoom", (req, res) => {
    if (req.session.room) {
        res.status(200).send({ message: "You are already in a room", status: 403, room: req.session.room });
        return;
    }

    let newRoom = genRoomID();
    let rounds = 3
    createRoom(newRoom, req.body.max, rounds)
    addPlayerToRoom(newRoom, req.session.user, {nickname: req.session.nickname, role: "host", score:0, connected:false, sent:false, votation: false})
    res.status(200).send({ room: newRoom, status: 200, user: req.session.user});
});

homeRouter.post("/joinRoom", (req, res) => {
    if (req.session.room) {
        res.status(200).send({ message: "You are already in a room", status: 403, room: req.session.room});
        return;
    }

    if (verifyRoomExists(req.body.room) == false) {
        res.status(200).send({ message: "Room not found", status: 404 });
        return;
    }

    if (isRoomFull(req.body.room) == true) {
        res.status(200).send({ message: "Room is full", status: 400 });
        return;
    }

    let roomMax = getRoomById(req.body.room).max;
    addPlayerToRoom(req.body.room, req.session.user, {nickname: req.session.nickname, role: "player", score:0, connected:false, sent:false, votation: false, disconnected: false})

    res.status(200).send({ room: req.body.room, user: req.session.user, status: 200, max: roomMax });

});








export default homeRouter;