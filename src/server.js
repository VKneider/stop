import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: "./env/local.env" });

//Components
import sess from "./components/Session/Session.js";

//Schemas and Middlewares
import { userLoginSchema, userRegisterSchema } from "./Validations/userValidation.js";
import validationYup from "./Middlewares/validationMiddleware.js";

//Routers
import profileRouter from "./Routes/profileRouter.js";
import homeRouter from "./Routes/homeRouter.js";

const app = express();
const bodyParser = express.json();
app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));
app.use(sess.sessionConfig());



//app.use("/profile", profileRouter);
app.use("/home", homeRouter)



const server = app.listen(app.get("port"), "", (req,res) => {
    console.log("Server is running on port: " + app.get("port"));
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landingPage", "index.html"))
});

/*
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homePage", "index.html"))
});
*/

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "LoginRegister", "index.html"))
});

app.get("/validate",  (req, res) => {
    sess.validateAccount(req,res)
});


app.post("/login", validationYup(userLoginSchema),  (req,res) => {
    sess.login(req,res)
});

app.post("/logout",  (req,res) => {
    sess.logout(req,res)
});


app.post("/register", validationYup(userRegisterSchema),  (req,res) => {
    sess.register(req,res)
});



export default server;