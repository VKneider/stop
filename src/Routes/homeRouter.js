import express from "express";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import sess from "../components/Session/Session.js";

const homeRouter = express.Router();

homeRouter.use(sess.sessionMiddleware);

homeRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"..", "public", "homePage", "index.html"))
} );





export default homeRouter;