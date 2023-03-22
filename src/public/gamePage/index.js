import mainFetch from "../Slice/fetch.js";


let init = async () => {
    
    
    let call = await mainFetch.request("GET", null, "/getUserData");
		
	if(call.status == 200){

        let socket = io();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const room = urlParams.get('room');
        socket.emit("changeSocket", { user: call.user, room:room});
        let roomCall = await mainFetch.request("GET", null, "/getRoomData");
        
        console.log(roomCall)
        let gameModal = await slice.getInstance("gameModal", { room: room, role:call.role, user:call.user, nickname:call.nickname, socket:socket, letters: roomCall.room.letters });
        await gameModal.setUsers(room)
        document.body.appendChild(gameModal);
        socket.emit("room:connected", room)
        
        


    }else{
        window.location.href = "/";
    }

    

    
}

init();

