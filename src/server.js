import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: "./env/local.env" });
const app = express();
const bodyParser = express.json();

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser);
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(app.get("port"), "", (req,res) => {
    console.log("Server is running on port: " + app.get("port"));
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});



export default server;