import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: "./env/local.env" });
import sess from "./components/Session/Session.js";
import session from "express-session";

const app = express();
const bodyParser = express.json();
app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "secret",
    resave:false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24,
        httpOnly:true,
        secure: false
    }
}));


import profileRouter from "./Routes/profileRouter.js";








const server = app.listen(app.get("port"), "", (req,res) => {
    console.log("Server is running on port: " + app.get("port"));
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landingPage", "index.html"))
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "LoginRegister", "index.html"))
});

app.post("/login", sess.login);

app.post("/register", (req,res) => sess.register(req,res));

app.use("/profile", profileRouter);

export default server;