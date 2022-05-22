"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authService_1 = __importDefault(require("../services/authService"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth-middleware"));
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield authService_1.default.createUser(req, res);
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    }
    catch (e) {
        console.log(e);
    }
}));
authRouter.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield authService_1.default.login(req, res);
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    }
    catch (e) {
        console.log(e);
    }
}));
authRouter.get('/api/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const token = yield authService_1.default.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    }
    catch (_a) {
        console.log(`Error`);
    }
}));
authRouter.get('/api/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const userData = yield authService_1.default.refresh(refreshToken);
        //@ts-ignore
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json(userData);
    }
    catch (_b) {
        console.log(`Error`);
    }
}));
authRouter.get('/api/users', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield authService_1.default.getAllUsers();
    return res.json(users);
}));
