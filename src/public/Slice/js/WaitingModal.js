export default class WaitingModal extends HTMLElement {
    constructor() {
      super();
      this.players=0;
      //var slice = document.getElementById('slice'); Esta linea no hace falta
      slice.controller.loadTemplate("./Slice/templates/WaitingModal.html").then(template => {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        if(this.props!=undefined){

          if(this.props.id!=undefined){
              this.id=this.props.id;
          }
          slice.controller.toRegister(this);

      }

        
      })
    }
  
    getCurrentPlayers(){
      return this.players;
    }

    changeHTML(){
      slice.controller.components.delete("myBtn2")
      slice.controller.components.delete("myInput2")
      this.shadowRoot.getElementById("center").innerHTML=`
      <div id="main-text">  Waiting for other players to Join </div>
      <div class="spacing">a</div>
      <div id="players">1/3</div>
      <button id="closeBtn">X</button>  
      `;

      this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
        slice.controller.components.delete("myBtn2")
        slice.controller.components.delete(this.id)
        slice.controller.components.delete("myInput2")
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
        text.innerHTML="Type the ID of the room you want to Join"

        //centeredContainer.innerHTML+=`<div id="main-text">  Type the ID of the room you want to Join </div>`

        let joinRoomBtn = await slice.getInstance("Button", { value: "Join Room", id:"myBtn2", style: { width: "70%", margin: "20px", background: "#EB455F" } });
        let myInput = await slice.getInstance("Input", { type: "text", id:"myInput2", placeholder: "Room ID", style: { width: "60%", "margin-top": "40px" }});

        joinRoomBtn.addEventListener("click", () => {
          this.changeHTML()
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
          slice.controller.components.delete(this.id)
          slice.controller.components.delete("myInput2")

          this.remove();
        });
        
        


      }
  
      getElement(id){
        return this.shadowRoot.getElementById(id);
      }

  }
  
  customElements.define('waiting-modal', WaitingModal);