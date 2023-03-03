import { encryptPassword, comparePassword } from "./utils.js";
import db from "../Database/Database.js";

class Session {
    constructor() {}


    async login(req, res) {
        let { password, user } = req.body;

        let userData = await db.loadDBSentences(db.sentences.getUserData, [user]);

        if (userData.rows.length == 1) {
            if (comparePassword(user, password)) {
                this.createSession(req, res, user, profile);
            }
        } else {
            res.send({ error: "User or Password are not correct" });
        }
    }

    async register(req, res) {
        
        let { password, email } = req.body;
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length == 1) {
            res.status(200).send({ message: "User already registered", status:400 });
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
}

let sess = new Session();

export default sess;
