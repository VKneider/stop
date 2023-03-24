import {genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer, changeRoomStatus, allPlayersConnected} from "../rooms/newRoomSchema.js";

export default function gameEvents(io){

    io.on("connection", (socket) => {

        socket.on("game:sendValues", data => {
            let myRoom = getRoomById(data.room)
            myRoom.players.get(data.user).connected==true;
            
        
            if (allPlayersConnected(data.room)) {
                //io.in(data.room).emit("game:startVotations")
                //se deberia enviar las palabras a los jugadores para que hagan las votaciones, luego deberia verificarse que las 3 votaciones se recibieron y se deberia enviar el result
    
                let roundWords = generateRoundWords(myRoom.words, data.round);
                let categories = getCategories(roundWords);
                console.log(categories, "categories");
                let repeatedWords = generateRepeatedWords(categories, roundWords);
                console.log(repeatedWords, "repeated");
                for (let k = 0; k < roundWords.length; k++) {
                    let word = roundWords[k];
                    if (word.value == "none") {
                        word.points = 0;
                        continue;
                    }
                    if (repeatedWords.includes(word.value)) {
                        word.points = 50;
                    } else {
                        word.points = 100;
                    }
                }
                console.log(roundWords);
    
                let mapPoints = generateTotalRoundPointsMap(roundWords);
    
                const responseJson = {};
                mapPoints.forEach((value, key) => {
                    responseJson[key] = value;
                });
    
                io.in(data.room).emit("game:updatePoints", responseJson);
            }

        });

        socket.on("game:sendVotation", data => {
            let myRoom = getRoomById(data.room);
            myRoom.players.get(data.user).votation = data.votation;
            if (allPlayersVoted(data.room)) {
                io.in(data.room).emit("game:startVotations");
            }
        });

        socket.on("game:changeSocket", data => {
            socket.join(data.room);
            assignSocketIDToPlayer(data.room, data.user, socket.id);
        })

    }); 

}