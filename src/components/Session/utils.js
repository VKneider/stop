import bcrypt from "bcrypt"
import CryptoJS from "crypto-js";

async function encryptPassword(password){

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}

async function comparePassword(password, hash){
 
    let result = await bcrypt.compare(password, hash);
    return result //devuelve true o false
}


function encryptJSON(data){
    let encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.ENCRYPT_KEY || "mySecret").toString();
    return encryptedData;
}

function decryptJSON(data){
    let bytes = CryptoJS.AES.decrypt(data, process.env.ENCRYPT_KEY || "mySecret").toString(CryptoJS.enc.Utf8);
    let decryptedData = JSON.parse(bytes);
    return decryptedData
}

export {encryptPassword, comparePassword, encryptJSON, decryptJSON};

