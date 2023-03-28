import express from "express";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import sess from "../components/Session/Session.js";

import {genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer} from "../socketManager/rooms/newRoomSchema.js";
import { mapToObject } from "../socketManager/rooms/utils.js";
const gameRouter = express.Router();
gameRouter.use(sess.sessionMiddleware);


gameRouter.get("/", (req, res) => {

    if (getRoomById(req.query.room).players.has(req.session.user)) {
        req.session.room = req.query.room;
        res.sendFile(path.join(__dirname,"..", "public", "gamePage", "index.html"))    } else {
        res.redirect("/");
    }
} );

gameRouter.get("/getRoomData", (req, res) => {
    let room = getRoomById(req.session.room);
    res.status(200).send({ letters:room.letters, players:mapToObject(room.players),  status: 200 });
});

export default gameRouter;