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

                let logoLink = this.shadowRoot.getElementById("logoLink");
                if(this.props.logoLink != undefined){
                    logoLink.href = this.props.logoLink;
                } 

                let sign  = this.shadowRoot.querySelector("#sign-in");
                if(this.props.sign!=undefined){
                    sign.href = this.props.sign;
                } else{
                    sign.style.display="none";
                }
                

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




