export default class complexNavbar extends HTMLElement {

    constructor() {
        super();
        slice.controller.loadTemplate("./Slice/templates/complexNavbar.html").then(template => {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            let menu = this.shadowRoot.querySelector("#menu-icon")
            let navbar = this.shadowRoot.querySelector(".navbar")

            menu.addEventListener("click", () => {
                navbar.classList.toggle("open");
                menu.classList.toggle("fa-navicon");
                menu.classList.toggle("fa-close");
            })

            if (this.props != undefined) {
                
                if(this.props.id != undefined){
                    this.id=this.props.id;
                }

                let sign  = this.shadowRoot.querySelector("#sign-in");
                sign.href = this.props.sign;
/*
                let register = this.shadowRoot.querySelector("#register");
                register.href = this.props.register;
*/

                let logo = this.shadowRoot.querySelector("#logo");
                logo.innerHTML = this.props.logo;

                let titleContainer = this.shadowRoot.querySelector(".navbar");
                for (let i = 0; i < this.props.sections.length; i++) {
                    let prop = this.props.sections[i];
                    titleContainer.innerHTML += (`<li><a href="${prop.id}">${prop.text}</a></li>`)
                }
            }
            slice.controller.toRegister(this);
        });

    }


    connectedCallback() { }




}


window.customElements.define('complex-navbar', complexNavbar);




