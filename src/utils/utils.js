function genRoomID(){
let id=  `ROOM${room}`
room++;
return id;
}

let room = 0;


function verifyRoom(room, socketClients){
    let flag = false;
    for(let [key, value] of socketClients){
        if(value.room == room && value.status == "waiting" && value.max!=0 ){
            flag = true;
            break;
        }
    }
    return flag;
}

function verifyRoomFull(room, socketClients){
    
    let max;
    for(let [key, value] of socketClients){
        if(value.room == room && value.max!=0){
            max = value.max;
            break;
        }
    }

    let total = 0;
    for(let [key, value] of socketClients){

        if(value.room == room){
            total+=1;
        }

    }

    if(total == max){
        return true;
    }else{
        return false;
    }

}

function getRoomMax(room, socketClients){
    let max;
    for(let [key, value] of socketClients){
        if(value.room == room){
            return value.max;
            break;
        }
    }
}

//Function to remove a room from a client in the socketClients map
function removeUserRoom(user, socketClients){
    socketClients.delete(user)
}

//Function to remove a room from all clients that have it in the socketClients map
function deleteRoom(room, socketClients){
    for(let [key, value] of socketClients){
        if(value.room == room){
            socketClients.delete(key);
        }
    }
}

function getDisconnectData(socketID, socketClients){

    let idx=false;
    for(let [key, value] of socketClients){
        if( value.socket.id!=undefined && value.socket.id == socketID){
            idx = key;
        }
    }

    if(idx == false){
        return null;
    }
    

    let user = socketClients.get(idx);
    return {room: user.room, id: user.socket.id, max: user.max, role:user.role, user:idx}

    

}

function getSocketsFromRoom(room, socketClients){
    let sockets = [];
    for(let [key, value] of socketClients){
        if(value.room == room){
            sockets.push(value.socket);
        }
    }
    return sockets;
}

function getRoomUsers(room, socketClients){
    let users = 0;
    for(let [key, value] of socketClients){
        if(value.room == room){
            users+=1;
        }
    }
    return users;
}

export {room, genRoomID, verifyRoom, verifyRoomFull, getRoomMax, removeUserRoom, deleteRoom, getDisconnectData, getSocketsFromRoom, getRoomUsers}