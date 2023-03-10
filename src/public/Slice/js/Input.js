export default class Input extends HTMLElement {
    constructor() {
        super();
        //var slice = document.getElementById('slice'); Esta linea no hace falta
        slice.controller.loadTemplate("./Slice/templates/Input.html").then(template => {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (this.props != undefined) {
              if (this.props.id != undefined) {
                  this.id = this.props.id;
              }

              if (this.props.placeholder != undefined) {
                  this.shadowRoot.getElementById("input").placeholder = this.props.placeholder;
              }
                if (this.props.style != undefined) {
                    this.setCss();
                }
            }

            slice.controller.toRegister(this);
        });
    }

    clear() {
        this.shadowRoot.getElementById("input").value = "";
    }

    setCss() {
        let style = document.createElement("style");
        let keys = Object.keys(this.props.style);
        style.innerHTML += `#input{`;
        for (let i = 0; i < keys.length; i++) {
            style.innerHTML += `${keys[i]}:${this.props.style[keys[i]]};\n`;
        }
        style.innerHTML += `}`;
        let css = this.shadowRoot.getElementById("css");
        css.appendChild(style);
    }
}

customElements.define("my-input", Input);
