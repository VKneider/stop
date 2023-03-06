import { encryptPassword, comparePassword } from "./utils.js";
import db from "../Database/Database.js";
import session from "express-session";

class Session {
    constructor() {}


    async login(req, res) {
        let { password, email } = req.body;

        let userData = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userData.rows.length != 0) {
            if (await comparePassword(email, password)) {
                req = this.createSession(req, res, email, userData.rows[0].id_profile);
                res.status(200).send({ message: "User logged in", status:200 });
            }
        } else {
            res.status(200).send({ message: "Password and email dont match", status:403 });
        }
        

        console.log(await comparePassword(email, password))

    }

    async register(req, res) {
        
        let { password, email } = req.body;
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length != 0) {
            res.status(200).send({ message: "User already registered", status:409 });
        } else {
            let encryptedPassword = await encryptPassword(password);
            await db.loadDBSentences(db.sentences.insertUser, [email, encryptedPassword,2]);
            this.createSession(req,res,email, 2)
            res.status(200).send({ message: "User created", status:200 });
        }
        
    }

    createSession(req, res, userEmail, profile) {
        req.session.logged = true;
        req.session.user = userEmail;
        req.session.profile = profile;
        return req;
    }

    sessionMiddleware(req, res, next) {
        if (req.session.logged == true) {
            next();
        } else {
            res.status(401).send({ error: "Unauthorized" });
        }
    }

    destroySession(req, res) {
        req.session.logged = false;
        req.session.destroy();
        res.status(200).send({ message: "Session destroyed" });
    }

    sessionConfig() {
        return session({
            secret: "secret",
            resave:false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000*60*60*24,
                httpOnly:true,
                secure: false
            }
        })}


}

let sess = new Session();

export default sess;
