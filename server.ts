import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import mongoose from "mongoose";
import config from "config";
import { authRouter } from "./routes/auth";

class App {
    private readonly PORT: number = +process.env.PORT! | 9999;
    private readonly app: Express = express();



    constructor() {


        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(authRouter)
    }



    public start = async () => {

        const URI: string = config.get('CONNECT_DB');

        try {

            await mongoose.connect(URI);
            this.app.listen(this.PORT, () => {
                console.log(`Server started in http://localhost:${this.PORT}`);
            });
        } catch (e) {
            console.log(`Server not working: ${e}`)
        }
    }

}

const app = new App();
app.start();