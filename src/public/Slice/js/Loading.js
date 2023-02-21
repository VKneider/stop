export default class Loading extends HTMLElement {

    constructor() {
        super();
        slice.controller.loadTemplate("./Slice/templates/Loading.html").then(template => {
            this.shadow = this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            slice.controller.toRegister(this);
        })
    }

    connectedCallback() { }

    start(){
        document.body.appendChild(this)
        document.body.classList.add("blocked")
    }

    stop(){
        document.body.classList.remove("blocked")
        this.remove();
        
    }
   
}

window.customElements.define('load-popup', Loading);




