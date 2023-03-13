

let init = async () => {
    let NB = await slice.getInstance("complexNavbar", {
        logo: "Stoppery",
        sign: "/login",
        register: "/login",
        id: "myNavbar",
        sections: [
            { id: "#description", text: "Description" },
            { id: "#howtoplay", text: "How to Play" },
            { id: "#aboutus", text: "About Us" }
        ]
    });


    document.body.appendChild(NB);

    let cardDemocracy = await slice.getInstance("Card", { title: "Democracy Rules", text: "Each of the players will have the right to vote and decide if any of the words entered are correct or not. Vote wisely in order to prevent fraudulent points!", icon: "fa fa-gavel", color: "#2B3467" });
    let cardMultiplayer = await slice.getInstance("Card", { title: "Multiplayer", text: "You can play with your friends, the minimum ammount of players required to create a Room is 3. Invite your friends to play and have fun!", icon: "fa fa-users", color: "#2B3467" });
    let cardContext = await slice.getInstance("Card", { title: "Think rapidly", text: "The game consists of input fields where you have to write down words depending on the category and all of them must start with the letter chosen in each round.", icon: "fa fa-font", color: "#2B3467" });

    
    let path = "./landingPage/img/stock"
    let carousel = await slice.getInstance("img-carousel", {id:"main-carousel", jumpInterval:2 ,motion:"fw", images:[`${path}1.jpg`, `${path}2.jpg`, `${path}3.jpeg`,`${path}4.jpg` ]});


    

    let btnContainer = document.getElementById("btn-container");
    btnContainer.appendChild(carousel);


    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    cardContainer.appendChild(cardContext);
    cardContainer.appendChild(cardDemocracy);
    cardContainer.appendChild(cardMultiplayer);
    document.getElementById("howtoplay").appendChild(cardContainer);

    
    //https://colorhunt.co/palette/2b3467bad7e9fcffe7eb455f
};
init();



