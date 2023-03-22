import mainFetch from "../fetch.js";

export default class WaitingModal extends HTMLElement {
    constructor() {
        super();
        this.events=false;
        this.players;
        this.maximumPlayers;
        this.active = false;

        //var slice = document.getElementById('slice'); Esta linea no hace falta
        slice.controller.loadTemplate("./Slice/templates/WaitingModal.html").then(template => {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (this.props != undefined) {
                if (this.props.id != undefined) {
                    this.id = this.props.id;
                }

                if (this.props.socket != undefined) {
                  this.socket = this.props.socket;
              }
                
            }

            slice.controller.toRegister(this);
        });
    }

    getCurrentPlayers() {
        return this.players;
    }

    async changeHTML() {
        this.room = slice.controller.getInstance("myInput2").value;
        let call = await mainFetch.request("POST", { room: this.room }, "/joinRoom");

        if (call.status == 200) {
            this.active = true;
            this.socket.emit("waiting:join", { user: call.user, room: this.room, max: call.max });
            slice.controller.components.delete("myBtn2");
            slice.controller.components.delete("myInput2");

            this.shadowRoot.getElementById("center").innerHTML = `
                        <div id="main-text">  Waiting for other players to Join </div>
                        <div class="spacing">a</div>
                        <div id="players">1/3</div>
                        <button id="closeBtn">X</button>  
                        `;

            if(!this.events){

              this.socket.on("update:waitingPlayers", data => {
                if (this.active != false) {
                    this.players = data.players;
                    this.maximumPlayers = data.max;
                    this.shadowRoot.getElementById("players").innerHTML = `${this.players}/${this.maximumPlayers}`;
                }
            });

            this.socket.on("redirectToRoom", data =>{
                window.location.href=`http://localhost:3003/game?room=${data}`
            })


            this.socket.on("update:closedRoom", async () => {
                if (this.active != false) {
                    console.log("room closed");
                    this.players = 0;
                    this.maximumPlayers = 0;

                    slice.controller.components.delete("myBtn2");
                    slice.controller.components.delete("myInput2");

                    await this.init();
                    alertClosed.show();
                }
            });
                this.events=true;
            }

            this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
                console.log("close");
                slice.controller.components.delete("myBtn2");
                this.socket.emit("waiting:leave", { room: this.room, user: call.user, max: call.max });
                slice.controller.components.delete("myBtn2");
                slice.controller.components.delete("myInput2");
                this.remove();
            });

        } else if (call.status == 404) {
            alertNotFound.show();
        } else if(call.status==403){
            window.location.href=`http://localhost:3003/game?room=${call.room}`
          }else{
            alertFull.show();
        }
    }

    addPlayer() {
        this.players++;
        this.shadowRoot.getElementById("players").innerHTML = `${this.players}/3`;
    }

    async init() {
        const centeredContainer = this.shadowRoot.getElementById("center");

        centeredContainer.innerHTML = "";
        const text = document.createElement("div");
        text.id = "main-text";
        text.innerHTML = "Type the ID of the room you want to Join";

        if (slice.controller.components.has("myBtn2") || slice.controller.components.has("myInput2")) {
            await slice.controller.components.delete("myBtn2");
            await slice.controller.components.delete("myInput2");
            console.log("deleted");
        }

        let joinRoomBtn = await slice.getInstance("Button", { value: "Join Room", id: "myBtn2", style: { width: "80%", margin: "20px", background: "#EB455F" } });
        let myInput = await slice.getInstance("Input", { type: "text", id: "myInput2", placeholder: "Room ID", style: { width: "60%", "margin-top": "40px" } });

        joinRoomBtn.addEventListener("click", async () => {
            await this.changeHTML(this.shadowRoot.getElementById("myInput2").value);
        });

        let btn = document.createElement("button");
        btn.id = "closeBtn";
        btn.innerHTML = "X";

        centeredContainer.appendChild(text);
        centeredContainer.appendChild(myInput);
        centeredContainer.appendChild(joinRoomBtn);
        centeredContainer.appendChild(btn);

        this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
            slice.controller.components.delete("myBtn2");
            // slice.controller.components.delete(this.id)
            slice.controller.components.delete("myInput2");

            this.remove();
        });
    }

    getElement(id) {
        return this.shadowRoot.getElementById(id);
    }

   


}
const alertNotFound = await slice.getInstance("ToastAlert", { color: "red", text: "Room not Found", icon: "error" });
const alertFull = await slice.getInstance("ToastAlert", { color: "red", text: "Current Room is Full", icon: "error" });
const alertClosed = await slice.getInstance("ToastAlert", { color: "red", text: "Room was closed by the Owner", icon: "error" });
customElements.define("waiting-modal", WaitingModal);
