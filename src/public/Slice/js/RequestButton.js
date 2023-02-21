export default class RequestButton extends HTMLElement {
    constructor() {
        super();
        //var slice = document.getElementById('slice'); Esta linea no hace falta
        slice.controller.loadTemplate("./Slice/templates/RequestButton.html").then(template => {

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            let title = this.shadowRoot.getElementById('title');

            let btn = this.shadowRoot.querySelector(".button"),
                spinIcon = this.shadowRoot.querySelector(".spinner"),
                btnText = this.shadowRoot.querySelector(".btn-text");

            btn.addEventListener("click", async () => {
                btn.style.cursor = "wait";
                btn.classList.add("checked");
                spinIcon.classList.add("spin");
                btnText.textContent = "Loading";

                let req = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
                let res = await req.json();

                this.res=res;

                btn.style.pointerEvents = "none";
                spinIcon.classList.replace("spinner", "check");
                spinIcon.classList.replace("fa-circle-notch", "fa-check");
                btnText.textContent = "Done";
            }, 4500)

            if (this.props != undefined) {
                if(this.props.id!=undefined){this.id=this.props.id;}
            }
            slice.controller.toRegister(this);
            
        });

        
    }


    connectedCallback() {

    }

}

customElements.define('request-btn', RequestButton);