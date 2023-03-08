export default class Input extends HTMLElement {
    constructor() {
      super();
      //var slice = document.getElementById('slice'); Esta linea no hace falta
      slice.controller.loadTemplate("./Slice/templates/Input.html").then(template => {
    
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
  
        if(this.props!=undefined){

            if(this.props.placeholder!=undefined){
                this.shadowRoot.getElementById('input').placeholder = this.props.placeholder;
            }

            
        }
     
        slice.controller.toRegister(this);
      })
    }
  
    clear(){
        this.shadowRoot.getElementById('input').value = "";
    }
  
  }
  
  customElements.define('my-input', Input);