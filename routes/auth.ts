import { Router, Request, Response } from "express";
import AuthService from "../services/authService";
import authMiddleware from "../middlewares/auth-middleware";

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

authRouter.get('/api/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await AuthService.refresh(refreshToken);
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    } catch {
        console.log(`Error`)
    }
})

authRouter.get('/api/users', authMiddleware, async (req: Request, res: Response) => {
    const users = await AuthService.getAllUsers();
    return res.json(users);
})




export { authRouter };