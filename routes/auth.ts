import { Router, Request, Response } from "express";
import User, { IUser } from "../models/user";

class ControllerAuth {

    private readonly router: Router = Router();

    register = () => {

        this.router.post('/api/register', async (req: Request, res: Response) => {

            const { email, password }: IUser = req.body;

            const candidate = await User.findOne({ email });


            if (candidate) res.json('Такой пользователь существует !');




        });

    }
}

export { ControllerAuth };