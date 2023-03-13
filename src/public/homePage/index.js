import mainFetch from "../Slice/fetch.js";


let init = async () => {
    
    let NB = await slice.getInstance("complexNavbar", {
        logo: "Stoppery",
        id: "myNavbar",
        sections: [
            { link: "#profile", text: "My Profile", id: "profile" },
            { link: "#profile", text: "Log Out", id: "logOut" }
        ]
    });


    let btnContainer = document.getElementById("btnContainer");

    
    let playBtn = await slice.getInstance("Button", { value: "Create Room", style: { width: "50%", margin: "50px", background: "#2B3467"} });
    let joinRoomBtn = await slice.getInstance("Button", { value: "Join Room", style: { width: "50%", margin: "50px", background: "#EB455F" } });
    
    btnContainer.appendChild(playBtn);
    btnContainer.appendChild(joinRoomBtn);

    
    let waitingModal = await slice.getInstance("WaitingModal", { id: "waitingModal", socket:io() });
    let createRoomModal = await slice.getInstance("CreateRoomModal", { id: "createRoomModal", socket:io() });

    playBtn.addEventListener("click", async () => {
        await createRoomModal.init();
        document.body.appendChild(createRoomModal);
    });

    joinRoomBtn.addEventListener("click", async () => {
        
        await waitingModal.init();
        document.body.appendChild(waitingModal);
    });

    NB.getElement("logOut").addEventListener("click", async (e) => {
        e.preventDefault();

        let call = await mainFetch.request("POST", {}, "/logout");
        console.log(call)
        if (call.status == 200) {
            window.location.href = "http://localhost:3003";
        }

    });

    
    
    document.body.appendChild(NB);
}

init();



		
		