export default class Card extends HTMLElement {
  constructor() {
    super();
    //var slice = document.getElementById('slice'); Esta linea no hace falta
    slice.controller.loadTemplate("./Slice/templates/Card.html").then(template => {
  
      this.attachShadow({ mode: 'open' });
      if(this.props.color!=undefined){
        template.innerHTML+=`
        <style> 
        .c:hover .icon{
          background: ${this.props.color};
        }

        .c .icon i{
          color: ${this.props.color}};
        }
        
        </style>`
      } else {
        template.innerHTML+=`
        <style> .c .icon i{
          color: black;
        }
        .c:hover .icon{
          background: black;
        }
        
        </style>`

      }
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      if(this.props != undefined){
        
      
          let iconContainer = this.shadowRoot.getElementById('icon-con');
          iconContainer.innerHTML +=`<i  ${this.props.css} class="${this.props.icon}"></i>`
          let text= this.shadowRoot.getElementById('text');
          text.innerHTML = this.props['text'];
          let title = this.shadowRoot.querySelector('.title');
          title.innerHTML = this.props['title']
      }
      slice.controller.toRegister(this);
    })
  }

  connectedCallback() {

  }

}

customElements.define('card-box', Card);