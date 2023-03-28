import { genRoomID, getRoomById, getRooms, createRoom, deleteRoom, isRoomFull, addPlayerToRoom, allPlayersVoted, allPlayersSent, removePlayerFromRoom, verifyRoomExists, assignSocketIDToPlayer, changeRoomStatus, allPlayersConnected } from "../rooms/newRoomSchema.js";
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

        /*
        socket.on("game:sendValues", data => {
            let myRoom = getRoomById(data.room);
            myRoom.players.get(data.user).connected == true;

            if (allPlayersConnected(data.room)) {
                //io.in(data.room).emit("game:startVotations")
                //se deberia enviar las palabras a los jugadores para que hagan las votaciones, luego deberia verificarse que las 3 votaciones se recibieron y se deberia enviar el result

                let roundWords = generateRoundWords(myRoom.words, data.round);
                
            }
        });

        */

        //guardar el user, la palabra y la categoria,

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
                    console.log(temporalWord.voted)
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
                
                  console.log("mainWords", mainWords)
                
                
                for(let i=0; i<mainWords.length; i++){
                    let word = mainWords[i];
                    console.log(word.votes, playersAmmount/2)
                    if(word.votes >= playersAmmount/2){
                        word.valid=true;
                    }else{
                        word.valid=false;
                    }

                }

                console.log("mainWords", mainWords)

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
            let roundCategories = getCategories(myRoom.words.get(myRoom.actualRound));
            console.log("roundCategories", roundCategories)

            if (allPlayersSent(data.room)) {
                io.in(data.room).emit("game:startVotations", { words: myRoom.words.get(myRoom.actualRound) });
                let counter = 0;

                let x = () => {
                    io.in(data.room).emit("game:nextVotation");
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
