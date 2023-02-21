export default class navSection extends HTMLElement{

    constructor(){
        super();

        slice.controller.loadTemplate("./Slice/templates/navSection.html").then(template => {

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            let sectionContainers = this.shadowRoot.querySelector(".menu")
            let logo = this.shadowRoot.querySelector(".logo")

            if (this.props != undefined) {
                for(let i=0; i<this.props.sections.length; i++){
                    let prop = this.props.sections;
                    sectionContainers.innerHTML+=(`<li><a href="#${prop[i]}">${prop[i]}</a></li>`)
                }
                logo.innerHTML=`<a href="#">${this.props.logo}</a>`
            }

            slice.controller.toRegister(this);
            
        });


    }

}

customElements.define('nav-section', navSection);