let init = async () => {
    
    let NB = await slice.getInstance("complexNavbar", {
        logo: "Stoppery",
        id: "myNavbar",
        sections: [
            { id: "#description", text: "Description" },
            { id: "#howtoplay", text: "How to Play" },
            { id: "#aboutus", text: "About Us" }
        ]
    });


    document.body.appendChild(NB);
}

init();