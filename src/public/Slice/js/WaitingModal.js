export default class WaitingModal extends HTMLElement {
    constructor() {
      super();
      this.players=0;
      //var slice = document.getElementById('slice'); Esta linea no hace falta
      slice.controller.loadTemplate("./Slice/templates/WaitingModal.html").then(template => {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.getElementById("closeBtn").addEventListener("click", () => {
            this.remove();
        });

  
        
        slice.controller.toRegister(this);
      })
    }
  
    getCurrentPlayers(){
      return this.players;
    }

    addPlayer(){
        this.players++;
        this.shadowRoot.getElementById("players").innerHTML=`${this.players}/3`;
        }
  
  }
  
  customElements.define('waiting-modal', WaitingModal);