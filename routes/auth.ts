import { Router, Request, Response } from "express";
import User, { IUser } from "../models/user";
import bcrypt from 'bcrypt';

class ControllerAuth {

    private readonly router: Router = Router();

    register = () => {

        this.router.post('/api/register', async (req: Request, res: Response) => {

            const { email, password }: IUser = req.body;

            const candidate = await User.findOne({ email });


            if (candidate) res.json('Такой пользователь существует !');

            const hashPassword = bcrypt.hash(password, 8);

            const user = new User({ email, password: hashPassword });
            user.save();


        });

    }
}

export { ControllerAuth };