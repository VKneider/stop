import express from "express";

const profileRouter = express.Router();

profileRouter.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "homePage", "index.html"))

});


export default profileRouter;