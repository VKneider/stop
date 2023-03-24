
import {genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer, changeRoomStatus} from "../rooms/newRoomSchema.js";


export default function homeEvents(io){
    
    io.on("connection", (socket) => {


        //en teoria lito
        socket.on("waiting:deleteRoom", room => {
            
            if(getRoomById(room).players.size>1){
                
                socket.broadcast.to(room).emit("update:closedRoom");
                const socketsInRoom = io.sockets.adapter.rooms[room];
                if (socketsInRoom) {
                    Object.keys(socketsInRoom.sockets).forEach((socketId) => {
                      const socket = io.sockets.connected[socketId];
                      socket.leave(room);
                    });
                  }
               
            }
            deleteRoom(room);
            
        });
    
    
        //lito
        socket.on("waiting:joinRoom", data => {
            socket.join(data.room);
            assignSocketIDToPlayer(data.room,data.user, socket.id);
            if(data.role!="host"){
                io.in(data.room).emit("update:waitingPlayers", { players: getRoomById(data.room).players.size, max: getRoomById(data.room).max });
            }

        });
    
        //lito
        socket.on("waiting:leaveRoom", data => {
            socket.leave(data.room);
            removePlayerFromRoom(data.room,data.user);
            io.in(data.room).emit("update:waitingPlayers", { players: getRoomById(data.room).players.size,  max: getRoomById(data.room).max }); 
        });
    

        socket.on("waiting:redirect", room =>{
            changeRoomStatus(room, "playing");
            io.in(room).emit("redirectToRoom", room);
        })
        
        
    });

}