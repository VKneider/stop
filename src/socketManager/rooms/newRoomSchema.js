import { getRandomValues, deepCopyArray } from "./utils.js";

let rooms = new Map();
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export function getRooms(){
    return rooms;
}

export function getRoomById(id){
    return rooms.get(id);
}

export function createRoom(roomID, max, rounds){

    let room = {
        players: new Map(),
        max: max,
        words:new Map(),
        rounds: rounds,
        actualRound: 0,
        started: false,
        status: "waiting",
        letters: getRandomValues(deepCopyArray(letters), 9),
        temporalWords: []
    }

    for (let i = 0; i < rounds; i++) {
        room.words.set(i, []);
    }


    rooms.set(roomID, room);
}

export function deleteRoom(roomID){
    rooms.delete(roomID);
}

export function isRoomFull(roomID){
    let room = rooms.get(roomID);
    if(room.max == room.players.size){
        return true;
    }
}




export function addPlayerToRoom(roomID, userEmail, userData ){
    let room = rooms.get(roomID);
    room.players.set(userEmail, userData);
}

export function removePlayerFromRoom(roomID, userEmail){
    let room = rooms.get(roomID);
    room.players.delete(userEmail);
}

export function getRoomPlayers(roomID){
    let room = rooms.get(roomID);
    return room.players;
}

export function verifyRoomExists(roomID){
    return rooms.has(roomID);
}

let roomID=0;
export function genRoomID(){
    let id=  `ROOM${roomID}`
    roomID++;
    return id;
}

export function assignSocketIDToPlayer(roomID, userEmail, socketID){
    let room = rooms.get(roomID);
    let player = room.players.get(userEmail);
    player.socket = socketID;
}

export function getPlayerDataFromSocketID(socketID){
    for(let [roomID, room] of rooms){
        for(let [userEmail, player] of room.players){
            if(player.socket == socketID){
                return {roomID, userEmail, player};
            }
        }
    }
}

export function changeRoomStatus(roomID, status){
    let room = rooms.get(roomID);
    room.status = status;
}

export function allPlayersConnected(roomID){
    let room = rooms.get(roomID);
    for(let [userEmail, player] of room.players){
        if(!player.connected){
            return false;
        }
    }
    return true;
}

export function allPlayersVoted(roomID){
    let room = rooms.get(roomID);
    for(let [userEmail, player] of room.players){
        if(!player.votation){
            return false;
        }
    }
    return true;
}

export function allPlayersSent(roomID){
    let room = rooms.get(roomID);
    for(let [userEmail, player] of room.players){
        if(!player.sent){
            return false;
        }
    }
    return true;
}

export function getPlayerFromNickname(roomID, nickname){
    let room = rooms.get(roomID);
    for(let [userEmail, player] of room.players){
        if(player.nickname == nickname){
            return player;
        }
    }
}