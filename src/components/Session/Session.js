import { encryptPassword, comparePassword, encryptJSON, decryptJSON } from "./utils.js";
import db from "../Database/Database.js";
import session from "express-session";
import mailer from "../Nodemailer/Nodemailer.js";

/**
 * @class Session
 * @description Class that handles the session of the user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} next - Next object
 * @param {Object} db - Database object
 * @param {Object} session - Session object
 * @param {Object} mailer - Mailer object
 * @param {Object} encryptPassword - Encrypt password function
 * @param {Object} comparePassword - Compare password function
 * @param {Object} encryptJSON - Encrypt JSON function
 * @param {Object} decryptJSON - Decrypt JSON function
 * @param {Object} sess - Session object, singleton
 */



class Session {
    constructor() {}


    async login(req, res) {
        let { password, email } = req.body;

        let userData = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userData.rows.length!=0) {
            if (await comparePassword(password, userData.rows[0].password)) {
                req = this.createSession(req, res, email, 2, userData.rows[0].username);
                res.status(200).send({ message: "User logged in", status:200 });
            }else{
                res.status(200).send({ message: "Password and email dont match", status:403 });
            }
        } else {
            res.status(200).send({ message: "Password and email dont match", status:403 });
        }
        

    }

    async register(req, res) {
        
        let { password, email, username } = req.body;
        console.log(req.body.username)
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length != 0) {
            res.status(200).send({ message: "User already registered", status:409 });
        } else {
            let encryptedData =  encryptJSON({email:email, password:password, username:username})
            let html = mailer.createValidationTemplate(`http://localhost:3003/validate?data=${encryptedData}`);
            let mailOptions = mailer.configureMail(email, "Validate your account", html);
            await mailer.sendMail(mailOptions);
            res.status(200).send({ message: "Email Sent", status:200 });
        }
        
    }

    async validateAccount(req, res) {

        let { password, email, username } = req.body;
        let userExists = await db.loadDBSentences(db.sentences.getUserData, [email]);
        if (userExists.rows.length != 0) {
            res.status(200).send({ message: "User already registered", status:409 });
        } else {
            
            let token = req.originalUrl.split("?")[1].slice(5)
            let decryptedData = decryptJSON(token);

            let {email, password,username} = decryptedData;

            let encryptedPassword = await encryptPassword(password);
            await db.loadDBSentences(db.sentences.insertUser, [email, encryptedPassword,2, username]);
            res.redirect("http://localhost:3003");
        }
        
    }

    logout(req, res) {
        req = this.destroySession(req, res);
        res.status(200).send({ message: "Session destroyed", status:200 });
    }

    createSession(req, res, userEmail, profile, nickname) {
        req.session.logged = true;
        req.session.user = userEmail;
        req.session.profile = profile;
        req.session.nickname= nickname;
        return req;
    }

    sessionMiddleware(req, res, next) {
        if (req.session.logged == true) {
            next();
        } else {
            res.redirect("http://localhost:3003")
        }
    }

    isLogged(req, res, next) {
        if (req.session.logged == true) {
            return true;
        } 
        return false;
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
