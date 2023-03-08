import { encryptPassword, comparePassword, encryptJSON, decryptJSON } from "./utils.js";
import db from "../Database/Database.js";
import session from "express-session";
import mailer from "../Nodemailer/Nodemailer.js";

class Session {
    constructor() {}


    async login(req, res) {
        let { password, email } = req.body;

        let userData = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userData.rows.length!=0) {
            if (await comparePassword(password, userData.rows[0].password)) {
                req = this.createSession(req, res, email, 2);
                res.status(200).send({ message: "User logged in", status:200 });
            }else{
                res.status(200).send({ message: "Password and email dont match", status:403 });
            }
        } else {
            res.status(200).send({ message: "Password and email dont match", status:403 });
        }
        

    }

    async register(req, res) {
        
        let { password, email } = req.body;
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length != 0) {
            res.status(200).send({ message: "User already registered", status:409 });
        } else {
            let encryptedData =  encryptJSON({email:email, password:password})
            let html = mailer.createValidationTemplate(`http://localhost:3003/validate?data=${encryptedData}`);
            let mailOptions = mailer.configureMail(email, "Validate your account", html);
            await mailer.sendMail(mailOptions);
            res.status(200).send({ message: "Email Sent", status:200 });
        }
        
    }

    async validateAccount(req, res) {

        let { password, email } = req.body;
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length != 0) {
            res.status(200).send({ message: "User already registered", status:409 });
        } else {
            
            let token = req.originalUrl.split("?")[1].slice(5)
            let decryptedData = decryptJSON(token);

            let {email, password} = decryptedData;

            let encryptedPassword = await encryptPassword(password);
            await db.loadDBSentences(db.sentences.insertUser, [email, encryptedPassword,2]);
            res.redirect("http://localhost:3003");
        }
        
    }

    logout(req, res) {
        req = this.destroySession(req, res);
        res.status(200).send({ message: "Session destroyed", status:200 });
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
            res.redirect("http://localhost:3003")
        }
    }

    destroySession(req) {
        req.session.logged = false;
        req.session.destroy();
        return req;
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
