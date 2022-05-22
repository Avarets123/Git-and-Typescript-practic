import { NextFunction, Request, Response } from "express";
import TokenService from "../services/jwtService";

export default (req: Request, res: Response, next: NextFunction) => {

    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.json(`Не авторизован!`);

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) return res.json('Не авторизован !');

    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) return res.json('Не авторизован !');

    // @ts-ignore
    req.user = userData;
    next();

}