import mainFetch from "../Slice/fetch.js";

//let mySocket = io();

let init = async () => {
    
    let NB = await slice.getInstance("complexNavbar", {
        logo: "Stoppery",
        id: "myNavbar",
        sections: [
            { link: "#leave", text: "Leave Room", id: "leave" },
        ]
    });
    
    document.body.appendChild(NB);
    
    let call = await mainFetch.request("POST", {}, "/changeSocket");
		
	if(call.status == 200){
        let socket = io();
        socket.emit("changeSocket", { user: call.user, room: call.room });
        //aqui se deberia instanciar el modal que se encarga de todo en la vida y mandarle al constructor el socket
    }else{
        window.location.href = "/";
    }
}