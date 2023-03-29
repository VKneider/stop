import express from "express";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import sess from "../components/Session/Session.js";
const sessionRouter = express.Router();
import { userLoginSchema, userRegisterSchema } from "../Validations/userValidation.js";
import validationYup from "../Middlewares/validationMiddleware.js";


sessionRouter.get("/login", (req, res) => {
    if (sess.isLogged(req, res) == true) {
        res.redirect("/home");
    } else {
        res.sendFile(path.join(__dirname,"..","..", "public", "loginRegister", "index.html"));
    }
});

sessionRouter.get("/validate", (req, res) => {
    sess.validateAccount(req, res);
});

sessionRouter.post("/login", validationYup(userLoginSchema), (req, res) => {
    sess.login(req, res);
});

sessionRouter.post("/logout", (req, res) => {
    sess.logout(req, res);
});

sessionRouter.post("/register", validationYup(userRegisterSchema), (req, res) => {
    sess.register(req, res);
});


export default sessionRouter;