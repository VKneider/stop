export default class VoteBox extends HTMLElement {
    constructor() {
      super();
      slice.controller.loadTemplate("./Slice/templates/VoteBox.html").then(template => {
    
        this.attachShadow({ mode: 'open' });
    
        this.shadowRoot.appendChild(template.content.cloneNode(true));
  
        if(this.props != undefined){
          
            this.nickname=this.props.nickname;
            this.value=this.props.value;
            this.category=this.props.category;
            this.voted=this.props.voted;
            this.room=this.props.room;
            this.round=this.props.round;
            this.shadowRoot.getElementById("voteBtn").innerHTML=this.value;

        }

        this.shadowRoot.getElementById("voteBtn").addEventListener("click", e => {
            if(this.voted){
                this.shadowRoot.getElementById("voteBtn").style.background="red";
                this.voted=false;
            } else {
                this.shadowRoot.getElementById("voteBtn").style.background="green";
                this.voted=true;
            }



        });
        slice.controller.toRegister(this);
      })
    }
  
    getProperties(){
        return {
            nickname:this.nickname,
            value:this.value,
            category:this.category,
            voted:this.voted,
            room:this.room,
            round:this.round
        }
    }
  
  }
  
  customElements.define('vote-box', VoteBox);