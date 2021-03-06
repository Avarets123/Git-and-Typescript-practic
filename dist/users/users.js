"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.use((req, res, next) => {
    console.log('Обработчик users');
    next();
});
userRouter.post('/login', (req, res) => {
    res.end('register');
});
userRouter.post('/register', (req, res) => {
    res.send('register');
});
exports.default = userRouter;
