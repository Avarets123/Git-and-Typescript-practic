import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import TokenService from './jwtService';

class AuthService {

    public static createUser = async (req: Request, res: Response, next?: NextFunction) => {
        const { email, password } = req.body

        const candidate = await User.findOne({ email });
        if (candidate) return res.json('Пользователь с таким email уже зарегистрирован !');

        const hashPassword = await bcrypt.hash(password, 8);

        const user = new User({ email, password: hashPassword });
        await user.save();

        const userId = user._id;

        const tokens = TokenService.generateToken({ userId, email: user.email });
        await TokenService.saveToken(userId, tokens.refreshToken);

        return { refreshToken: tokens.refreshToken, accessToken: tokens.accessToken, user };
    }

    public static login = async (req: Request, res: Response, next?: NextFunction) => {
        const { email, password } = req.body

        const candidate = await User.findOne({ email });
        if (!candidate) return res.json(`Пользователь не найден !`);

        const checkPassword = await bcrypt.compare(password, candidate.password);
        if (!checkPassword) return res.json(`Неправильный пароль !`);

        const userId = candidate._id;

        const tokens = TokenService.generateToken({ userId, email });
        await TokenService.saveToken(userId, tokens.refreshToken);

        return {
            ...tokens,
            user: candidate
        }

    }

    public static logout = async (refreshToken: string) => {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }



}


export default AuthService;