import {default as server} from "./server.js";
import { Server as socketIO } from "socket.io";

const io = new socketIO(server);

io.on("connection", (socket) => {
    console.log("New client connected");


    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });


})

console.log("wat")