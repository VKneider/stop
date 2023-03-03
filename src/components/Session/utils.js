import bcrypt from "bcrypt"
import db from "../Database/Database.js";

async function encryptPassword(password){

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}

async function comparePassword(email,password){
    
    let hash = db.loadDBSentences(db.sentences.getHashPassword, [email]);
    return await bcrypt.compare(password, hash); //devuelve true o false
}

export {encryptPassword, comparePassword};