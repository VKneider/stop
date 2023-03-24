import { getRandomValues, deepCopyArray } from "../../socketManager/rooms/utils.js";
class SocketManager{
    constructor(){
        this.socketClients = new Map();
        this.rooms = new Map();
        this.room=0;
        
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


        

    }

    getRoomUsers(room){
        let usersqtt = 0;
        for(let [key, value] of this.socketClients){
            if(value.room == room){
                usersqtt+=1;
            }
        }
        return usersqtt;
    }

    getSocketsFromRoom(room, ){
        let sockets = [];
        for(let [key, value] of this.socketClients){
            if(value.room == room){
                sockets.push(value.socket);
            }
        }
        return sockets;
    }

    getDisconnectData(socketID){

        let idx=false;
        for(let [key, value] of this.socketClients){
            if( value.socket.id!=undefined && value.socket.id == socketID){
                idx = key;
            }
        }
        if(idx == false){
            return null;
        }
        
        let user = this.socketClients.get(idx);
        return {room: user.room, id: user.socket.id, max: user.max, role:user.role, user:idx, status:user.status}
     
    }

    deleteRoom(room){
        for(let [key, value] of this.socketClients){
            if(value.room == room){
                this.socketClients.delete(key);
            }
        }
    }

    removeUserRoom(user, socketClients){
        this.socketClients.delete(user)
    }

    getRoomMax(room){
        let max;
        for(let [key, value] of this.socketClients){
            if(value.room == room){
                return value.max;
                break;
            }
        }
    }

    verifyRoomFull(room){
        let max;
        for(let [key, value] of this.socketClients){
            if(value.room == room && value.max!=0){
                max = value.max;
                break;
            }
        }
    
        let total = 0;
        for(let [key, value] of this.socketClients){
    
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

    verifyRoom(room){
        let flag = false;
        for(let [key, value] of this.socketClients){
            if(value.room == room && value.status == "waiting" && value.max!=0 ){
                flag = true;
                break;
            }
        }
        return flag;
    }

    genRoomID(){
        let id=  `ROOM${this.room}`
        this.room++;
        return id;
        }
    
    setUser(user, values){
        this.socketClients.set(user, values);
    }

    getUser(user){
        return this.socketClients.get(user);
    }

    changeGameStatus(room, status){
        for(let [key, value] of this.socketClients){
            if(value.room==room){
                value.status = status;
                console.log("function: ", value.status)
            }
        }
    }

    getPlayersDataInRoom(room){
        let players = [];
        for(let [key, value] of this.socketClients){
            if(value.room==room){
                players.push({user:key, role:value.role, status:value.status,nickname:value.nickname });
            }
        }
        return players;
    }

   //Functions to create rooms that are playing
    createRoom(roomID){
        let data = this.getPlayersDataInRoom(roomID);
        let users = [];
        let roomPlayerData = new Map();
        for(let i=0; i<data.length; i++){
            roomPlayerData.set(data[i].user, {score:0});
        }
        this.rooms.set(roomID, {letters: getRandomValues(deepCopyArray(this.letters), 9), players: roomPlayerData, connected:0, started:false, received:0, votations:0, words:[], round:0}   );
    }


    

    getRoomData(room){
        return this.rooms.get(room);
    }




}



let socketManager = new SocketManager();
export default socketManager;