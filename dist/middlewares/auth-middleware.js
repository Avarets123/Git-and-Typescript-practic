"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtService_1 = __importDefault(require("../services/jwtService"));
exports.default = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
        return res.json(`Не авторизован!`);
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken)
        return res.json('Не авторизован !');
    const userData = jwtService_1.default.validateAccessToken(accessToken);
    if (!userData)
        return res.json('Не авторизован !');
    // @ts-ignore
    req.user = userData;
    next();
};
