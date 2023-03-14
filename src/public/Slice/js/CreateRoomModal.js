import mainFetch from "../fetch.js";

export default class CreateRoomModal extends HTMLElement {
    constructor() {
      super();
      //var slice = document.getElementById('slice'); Esta linea no hace falta
      slice.controller.loadTemplate("./Slice/templates/CreateRoomModal.html").then(template => {
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(template.content.cloneNode(true));
          
          this.activePlayers=1;
          this.maximumPlayers;
          if(this.props!=undefined){

          if(this.props.id!=undefined){
              this.id=this.props.id;
          }
          
          if(this.props.socket!=undefined){
            this.socket=this.props.socket;
          }


        }
        
        slice.controller.toRegister(this);
        
      })
    }
    
    getCurrentPlayers(){
      return this.players;
    }

    async changeHTML(){
      
      this.maximumPlayers=Number(this.shadowRoot.getElementById("playersInput").value);
      
      let call = await mainFetch.request("POST", {max:this.maximumPlayers}, "/createRoom");
      this.room = call.room;
      this.socket.emit('joinRoom', this.room);
      slice.controller.components.delete("myBtn2")
      slice.controller.components.delete("playersInput")

      this.socket.on('update:waitingPlayers', (data) => {
        this.players=data.players;
        this.maximumPlayers=data.max;
        this.shadowRoot.getElementById("players").innerHTML=`${this.players}/${this.maximumPlayers}`;
      })

      this.shadowRoot.getElementById("center").innerHTML=`
      <div id="main-text">  Waiting for other players to Join </div>
      <div class="spacing">a</div>
      <div class="players"> Room: ${this.room} </div>
      <div id="players">1/${this.maximumPlayers}</div>
      <button id="closeBtn">X</button>  
      `;

      this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
        slice.controller.components.delete("myBtn2")
        this.socket.emit('waiting:deleteRoom', this.room)
        slice.controller.components.delete("playersInput")
        this.remove();
    });

    }

    addPlayer(){
        this.players++;
        this.shadowRoot.getElementById("players").innerHTML=`${this.players}/3`;
        }

      async init (){
        const centeredContainer = this.shadowRoot.getElementById("center");

        centeredContainer.innerHTML="";
        const text = document.createElement("div");
        text.id = "main-text";
        text.innerHTML="Type the maximum number of players you want to play with"

        //centeredContainer.innerHTML+=`<div id="main-text">  Type the ID of the room you want to Join </div>`

        let joinRoomBtn = await slice.getInstance("Button", { value: "Join Room", id:"myBtn2", style: { width: "80%", margin: "20px", background: "#EB455F" } });
        let myInput = await slice.getInstance("Input", { type: "number", id:"playersInput", min:2, max:9, placeholder: "Ammount of Players", style: { width: "80%", "margin-top": "40px" }});


        joinRoomBtn.addEventListener("click", async () => {
          await this.changeHTML()
        });

        let btn=document.createElement("button")
        btn.id="closeBtn"
        btn.innerHTML="X"

        centeredContainer.appendChild(text);
        centeredContainer.appendChild(myInput);
        centeredContainer.appendChild(joinRoomBtn);
        centeredContainer.appendChild(btn);

        this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
          slice.controller.components.delete("myBtn2")
         // slice.controller.components.delete(this.id)
          slice.controller.components.delete("playersInput")

          this.remove();
        });
        
        


      }
  
      getElement(id){
        return this.shadowRoot.getElementById(id);
      }

  }
  
  customElements.define('create-room-modal', CreateRoomModal);