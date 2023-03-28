import { genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull,getPlayerFromNickname, addPlayerToRoom, allPlayersVoted, allPlayersSent, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer, changeRoomStatus, allPlayersConnected } from "../rooms/newRoomSchema.js";
import { getCategories, generateRepeatedWords, generateTotalRoundPointsMap } from "../rooms/utils.js";

export default function gameEvents(io) {
    io.on("connection", socket => {
        socket.on("game:userConnected", data => {
            let myRoom = getRoomById(data.room);

            if (allPlayersConnected(data.room)) {
                //se devuelve la misma informacion de la sala
            } else {
                myRoom.players.get(data.user).connected = true;
                if (allPlayersConnected(data.room)) {
                    io.in(data.room).emit("game:startGame");
                }
            }
        });


        socket.on("game:sendVotation", data => {
            console.log("sendVotation", data)
            let myRoom = getRoomById(data.room);
            myRoom.players.get(data.user).votation = true;
            myRoom.temporalWords = [...myRoom.temporalWords, ...data.finalWords];
            let playersAmmount = myRoom.players.size;

            if (allPlayersVoted(data.room)) {

                let mainWords = myRoom.words.get(myRoom.actualRound);
                for (let i = 0; i < myRoom.temporalWords.length; i++) {
                    const temporalWord = myRoom.temporalWords[i];
                    const mainWordIndex = mainWords.findIndex(mainWord => (
                      mainWord.category === temporalWord.category &&
                      mainWord.value === temporalWord.value &&
                      mainWord.round === temporalWord.round &&
                      mainWord.nickname === temporalWord.nickname
                    ));
                    
                    if (mainWordIndex >= 0) {
                      const mainWord = mainWords[mainWordIndex];
                      if (temporalWord.voted) {
                        mainWord.votes += 1;
                      } else {
                        mainWord.votes -= 1;
                      }
                    }
                  }
                
                
                
                for(let i=0; i<mainWords.length; i++){
                    let word = mainWords[i];
                    if(word.votes >= playersAmmount/2){
                        word.valid=true;
                    }else{
                        word.valid=false;
                    }

                }


                let roundWords = mainWords;
                let categories = getCategories(roundWords);
                let repeatedWords = generateRepeatedWords(categories, roundWords);
                console.log("repeatedWords", repeatedWords)

                for (let k = 0; k < roundWords.length; k++) {
                    let word = roundWords[k];
                    if (!word.valid) {
                        word.points = 0;
                        continue;
                    }

                    if (repeatedWords.includes(word.value)) {
                        word.points = 50;
                    } else {
                        word.points = 100;
                    }

                }
                

                let mapPoints = generateTotalRoundPointsMap(roundWords);

                const responseJson = {};
                mapPoints.forEach((value, key) => {
                    responseJson[key] = value;
                    responseJson[key] += getPlayerFromNickname(data.room,key).score;
                    getPlayerFromNickname(data.room,key).score += value;
                    
                });


                console.log("responseJson", responseJson)
                io.in(data.room).emit("game:updatePoints", responseJson);


                myRoom.temporalWords = [];
                myRoom.actualRound++;
                myRoom.players.forEach(player => {
                    player.votation = false;
                    player.sent = false;
                });

                if (myRoom.actualRound == myRoom.rounds) {
                    io.in(data.room).emit("game:endGame");
                } else {
                    io.in(data.room).emit("game:startNewRound");
                }

                }

        });



        socket.on("game:changeSocket", data => {
            socket.join(data.room);
            assignSocketIDToPlayer(data.room, data.user, socket.id);
        });

        socket.on("game:sendWords", async data => {
            let myRoom = getRoomById(data.room);
            myRoom.words.set(myRoom.actualRound, [...myRoom.words.get(myRoom.actualRound), ...data.words]);
            myRoom.players.get(data.user).sent = true;
            
            if (allPlayersSent(data.room)) {
                io.in(data.room).emit("game:startVotations", { words: myRoom.words.get(myRoom.actualRound) });
                let counter = 0;
                let roundCategories = getCategories(myRoom.words.get(myRoom.actualRound));
                
                let x = () => {
                    io.in(data.room).emit("game:nextVotation", { category: roundCategories[counter] });
                    counter++;
                    if (counter == roundCategories.length) {
                        clearInterval(myInterval);
                        setTimeout(() => {
                            io.in(data.room).emit("game:endRoundVotation");
                        }, 10000);
                    }
                };
                setTimeout(x, 3000);
                let myInterval = setInterval(x, 10000);
            }
        });

        socket.on("game:userStop", data => {
            io.in(data.room).emit("game:stopRound");
        });
    });
}
