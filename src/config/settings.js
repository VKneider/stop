import { Client } from "pg";
import { config } from "dotenv";
config({ path: ".././env/local.env" });

console.log(PROCESS.ENV)