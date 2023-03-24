import mainFetch from "../fetch.js";

export default class GameModal extends HTMLElement {
    constructor() {
        super();

        slice.controller.loadTemplate("./Slice/templates/GameModal.html").then(template => {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            if (this.props != undefined) {
                if (this.props.id != undefined) {
                    this.id = this.props.id;
                }

                if (this.props.socket != undefined) {
                    this.socket = this.props.socket;

                    this.socket.on("timer:on", a => {
                        this.setCategories();
                        this.showLetter()
                    });

                    this.socket.on("game:stopInput", data => {
                        this.sendValues();
                        this.setCategories();
                        this.showLetter();
                    });

                    this.socket.on("game:updatePoints", map => {

                        for (const key in map) {
                            this.shadowRoot.getElementById(`${key}-score`).innerHTML = map[key];
                        }
                    });
                }

                if (this.props.nickname != undefined) {
                    this.nickname = this.props.nickname;
                }

                if (this.props.room != undefined) {
                    this.room = this.props.room;
                }

                if (this.props.user != undefined) {
                    this.user = this.props.user;
                }

                if (this.props.role != undefined) {
                    this.role = this.props.role;
                }

                if (this.props.letters != undefined) {
                    this.letters = this.props.letters;
                }

                this.players;
                this.categories = ["Nombre", "Apellido", "Cosa", "Color", "Animal", "Comida", "Lugar", "Profesión", "Deporte"];
                this.actualLetter = 0;
            }
            this.shadowRoot.getElementById("stopBtn").addEventListener("click", async () => {
                this.socket.emit("game:endGame", this.room);
            });
            slice.controller.toRegister(this);
        });
    }

    setCategories() {
        let categoryContainer = this.shadowRoot.getElementById("categoryContainer");
        categoryContainer.innerHTML = "";
        this.categories.forEach(category => {
            categoryContainer.innerHTML += ` <div class="category">
                <div  id="label-${category}" class="label">${category} </div>
                <Input id="input-${category}"></Input>
              </div>`;
        });
    }

     setUsers() {
    
        let playersContainer = this.shadowRoot.getElementById("playersContainer");
        playersContainer.innerHTML = "";
        console.log(this.roomPlayers)
        for(let player in this.roomPlayers){
            playersContainer.innerHTML += `
            <div class="playersGrid"> 
            <span class="userImg material-symbols-outlined"> Person </span>
                <div class="userGrid">
                    <div id="${player.nickname}">${player.nickname}</div>
                    <div id="${player.nickname}-score">${player.score}</div>
                </div>
            </div>
            `;
        }        

    }

    showLetter() {
        let letterContainer = this.shadowRoot.getElementById("letter");
        letterContainer.innerHTML = this.letters[this.actualLetter];
        this.actualLetter++;
    }

    startTimer() {
        let timerContainer = this.shadowRoot.getElementById("timer");
        timerContainer.innerHTML=this.actualLetter;
    }

    sendValues() {
        let values = [];
        this.categories.forEach(category => {
            let input = this.shadowRoot.getElementById(`input-${category}`);
            if (input.value == "") {
                values.push({ category: category, value: "none", votes: 0, user: this.user, room: this.room, round: this.actualLetter, nickname: this.nickname, points: 0 });
            } else {
                values.push({ category: category, value: input.value, votes: 0, user: this.user, room: this.room, nickname: this.nickname, round: this.actualLetter, points: 0 });
            }
        });
        this.socket.emit("game:sendValues", { room: this.room, values: values, user: this.user, round: this.actualLetter, votes: 0 });
    }

    stop() {
        this.socket.emit("game:endGame", { room: this.room });
    }
}

customElements.define("game-modal", GameModal);
