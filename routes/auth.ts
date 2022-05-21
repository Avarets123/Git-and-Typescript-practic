import { Router, Request, Response } from "express";
import AuthService from "../services/authService";

const authRouter = Router();


authRouter.post('/api/register', async (req: Request, res: Response) => {

    try {
        const userData = await AuthService.createUser(req, res)
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

        return res.json(userData);

    } catch (e) {
        console.log(e)
    }
});

authRouter.post('/api/login', async (req: Request, res: Response) => {
    try {

        const userData = await AuthService.login(req, res);
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);

    } catch (e) {
        console.log(e);
    }
});

authRouter.get('/api/logout', async (req: Request, res: Response) => {
    try {

        const { refreshToken } = req.cookies;
        const token = await AuthService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);

    } catch {
        console.log(`Error`)
    }
});




export { authRouter };