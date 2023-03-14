function genRoomID(){
let id=  `ROOM${room}`
room++;
return id;
}

let room = 0;

export {room, genRoomID}