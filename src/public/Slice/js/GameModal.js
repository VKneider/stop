import mainFetch from "../fetch.js";

export default class GameModal extends HTMLElement {
    constructor() {
        super();

        slice.controller.loadTemplate("./Slice/templates/GameModal.html").then(template => {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this.roundWords;
            this.block = false;

            if (this.props != undefined) {
                if (this.props.id != undefined) {
                    this.id = this.props.id;
                }

                if (this.props.socket != undefined) {
                    this.socket = this.props.socket;

                    this.socket.on("game:startGame", a => {
                        this.setCategories();
                        this.showLetter();
                        console.log("start game");
                    });

                    this.socket.on("game:stopRound", data => {
                        if(!this.block){
                            this.blockInputs();
                            this.sendValues();
                        }
                    });

                    this.socket.on("game:updatePoints", map => {
                        for (const key in map) {
                            this.shadowRoot.getElementById(`${key}-score`).innerHTML = map[key];
                        }
                    });

                    this.socket.on("game:endGame", data => {
                        this.endGame(data);
                    });

                    this.socket.on("game:startVotations", data => {
                        if (!this.block) {
                            this.roundWords = data.words;
                            this.startVotations();
                        }
                    });

                    this.socket.on("game:nextVotation", data => {
                        this.nextVotation(data);
                    });

                    this.socket.on("game:endRoundVotation", data => {
                        if (!this.block) {
                            this.endRoundVotation();
                        }
                    });

                    this.socket.on("game:startNewRound", data => {
                        this.socket.emit("game:unblockDisconnectedPlayer", { room: this.room, user: this.user })
                        this.unblockModal();
                        this.block=false;
                        this.startNewRound();
                    });

                    this.socket.on("game:reJoinGame", data => {
                        this.block=true;
                        this.blockModal();
                    });
                }

                if (this.props.nickname != undefined) {
                    this.nickname = this.props.nickname;
                }

                if (this.alertFailStop != undefined) {
                    this.alertFailStop = this.props.alertFailStop;
                }

                if (this.alertStop != undefined) {
                    this.alertStop = this.props.alertStop;
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

                if (this.props.roomPlayers != undefined) {
                    this.roomPlayers = this.props.roomPlayers;
                    this.setUsers();
                }

                if (this.props.letters != undefined) {
                    this.letters = this.props.letters;
                }

                if (this.props.actualRound != undefined) {
                    this.actualRound = this.props.actualRound;
                }

                this.players;
                this.categories = ["Nombre", "Apellido", "Cosa", "Color", "Animal", "Comida", "Lugar", "Profesión", "Deporte"];
            }
            this.shadowRoot.getElementById("stopBtn").addEventListener("click", async () => {
                this.socket.emit("game:userStop", { room: this.room, user: this.user });
            });
            slice.controller.toRegister(this);
            this.socket.emit("game:userConnected", { room: this.room, user: this.user });
            console.log(this);
        });
    }

    startNewRound() {
        this.setCategories();
        this.showLetter();
        this.actualRound++;
        this.shadowRoot.getElementById("stopBtn").disabled = false;
        this.shadowRoot.getElementById("title-game").innerHTML = `Fill all the Inputs and press STOP! - Round ${this.actualRound + 1}`;
    }

    setCategories() {
        let categoryContainer = this.shadowRoot.getElementById("categoryContainer");
        categoryContainer.innerHTML = "";
        this.categories.forEach(category => {
            categoryContainer.innerHTML += ` <div class="category">
                <div  id="label-${category}" class="label">${category} </div>
                <Input class="cate" id="input-${category}"></Input>
              </div>`;
        });
    }

    setUsers() {
        let playersContainer = this.shadowRoot.getElementById("playersContainer");
        playersContainer.innerHTML = "";
        for (let player in this.roomPlayers) {
            playersContainer.innerHTML += `
            <div class="playersGrid"> 
            <span class="userImg material-symbols-outlined"> Person </span>
                <div class="userGrid">
                    <div id="${this.roomPlayers[player].nickname}">${this.roomPlayers[player].nickname}</div>
                    <div id="${this.roomPlayers[player].nickname}-score">${this.roomPlayers[player].score}</div>
                </div>
            </div>
            `;
        }
    }

    showLetter() {
        let letterContainer = this.shadowRoot.getElementById("letter");
        letterContainer.innerHTML = this.letters[this.actualRound];
    }

    sendValues() {
        let values = [];
        this.categories.forEach(category => {
            let input = this.shadowRoot.getElementById(`input-${category}`);
            if (input.value != "") {
                values.push({ category: category, value: input.value, votes: 0, user: this.user, room: this.room, nickname: this.nickname, round: this.actualRound, points: 0 });
            }
        });
        this.socket.emit("game:sendWords", { room: this.room, words: values, user: this.user, round: this.actualRound, votes: 0 });
    }

    stop() {
        let flag = true;
        let categories = this.shadowRoot.querySelectorAll(".cate");
        categories.forEach(category => {
            if (category.value == "") {
                flag = false;
            }
        });

        if (flag) {
            this.socket.emit("game:userStop", { room: this.room });
        } else {
            //this.alertFailStop.show()
        }
    }

    endRoundVotation() {
        let title = this.shadowRoot.getElementById("title-game");
        title.innerHTML = `Votation ended`;
        this.shadowRoot.getElementById("categoryContainer").innerHTML = "";
        let roundCategories = this.getRoundCategories(this.roundWords);
        let finalWordsArray = [];

        for (let j = 0; j < roundCategories.length; j++) {
            for (let k = 0; k < this.groupedRoundWords[roundCategories[j]].length; k++) {
                let word = this.groupedRoundWords[roundCategories[j]][k];
                finalWordsArray.push(word.getProperties());
            }
        }

        this.socket.emit("game:sendVotation", { user: this.user, finalWords: finalWordsArray, room: this.room, round: this.actualRound });
    }

    nextVotation(data) {
        console.log("nextVotation");
        let title = this.shadowRoot.getElementById("title-game");
        title.innerHTML = `Category: ${data.category}`;
        let categoryContainer = this.shadowRoot.getElementById("categoryContainer");

        console.log(this.groupedRoundWords);
        categoryContainer.innerHTML = "";
        for (let i = 0; i < this.groupedRoundWords[data.category].length; i++) {
            let word = this.groupedRoundWords[data.category][i];
            let div = document.createElement("div");
            div.classList.add("category");
            div.appendChild(word);
            let categoryContainer = this.shadowRoot.getElementById("categoryContainer");
            categoryContainer.appendChild(div);
        }

        this.categoryIndex++;
    }

    async startVotations() {
        async function groupWordsByRound(words) {
            const groupedWords = {};
            words.forEach(async word => {
                if (!groupedWords[word.category]) {
                    groupedWords[word.category] = [];
                }
                delete word.votes;
                word.voted = true;
                let voteBox = await slice.getInstance("VoteBox", {value: word.value, voted: word.voted, nickname: word.nickname, room: word.room, round: word.round, category: word.category, user: word.user });
                groupedWords[word.category].push(voteBox);
            });
            return groupedWords;
        }

        this.groupedRoundWords = await groupWordsByRound(this.roundWords);
        this.categoryIndex = 0;
    }

    getRoundCategories(array) {
        let categories = [];
        for (let i = 0; i < array.length; i++) {
            if (!categories.includes(array[i].category)) {
                categories.push(array[i].category);
            }
        }
        return categories;
    }

    async endGame(data) {
        let title = this.shadowRoot.getElementById("title-game");
        if (data.winner.length > 1) {
            title.innerHTML = `Game ended, there is a tie between`;
            data.winner.forEach(winner => {
                title.innerHTML += ` ${winner}, `;
            });
        } else {
            title.innerHTML = `Game ended, the winner is ${data.winner[0]}`;
        }

        let call = await mainFetch.request("POST", { room: this.room }, "/game/deleteRoomSession");
        if (call.status == 200) {
            setTimeout(() => {
                window.location.href = "http://localhost:3003/home";
            }, 5000);
        }
    }

    blockInputs() {
        let categories = this.shadowRoot.querySelectorAll(".cate");
        categories.forEach(category => {
            category.disabled = true;
        });
        this.shadowRoot.getElementById("stopBtn").disabled = true;
    }

    blockModal() {
        this.shadowRoot.getElementById("modal").style.pointerEvents = "none";
        this.shadowRoot.getElementById("modal").style.opacity = "0.5";
    }

    unblockModal() {
        this.shadowRoot.getElementById("modal").style.pointerEvents = "auto";
        this.shadowRoot.getElementById("modal").style.opacity = "1";
    }
}

customElements.define("game-modal", GameModal);
