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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const jwtService_1 = __importDefault(require("./jwtService"));
class AuthService {
}
_a = AuthService;
AuthService.createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const candidate = yield user_1.default.findOne({ email });
    if (candidate)
        return res.json('Пользователь с таким email уже зарегистрирован !');
    const hashPassword = yield bcrypt_1.default.hash(password, 8);
    const user = new user_1.default({ email, password: hashPassword });
    yield user.save();
    const userId = user._id;
    const tokens = jwtService_1.default.generateToken({ userId, email: user.email });
    yield jwtService_1.default.saveToken(userId, tokens.refreshToken);
    return { refreshToken: tokens.refreshToken, accessToken: tokens.accessToken, user };
});
AuthService.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const candidate = yield user_1.default.findOne({ email });
    if (!candidate)
        return res.json(`Пользователь не найден !`);
    const checkPassword = yield bcrypt_1.default.compare(password, candidate.password);
    if (!checkPassword)
        return res.json(`Неправильный пароль !`);
    const userId = candidate._id;
    const tokens = jwtService_1.default.generateToken({ userId, email });
    yield jwtService_1.default.saveToken(userId, tokens.refreshToken);
    return Object.assign(Object.assign({}, tokens), { user: candidate });
});
AuthService.logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield jwtService_1.default.removeToken(refreshToken);
    return token;
});
AuthService.refresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    if (!refreshToken) {
        return `Пользователь не авторизован !`;
    }
    const userData = jwtService_1.default.validateRefreshToken(refreshToken);
    const tokenFromDb = yield jwtService_1.default.findToken(refreshToken);
    if (!userData || !tokenFromDb)
        return `Пользователь не авторизован !`;
    const user = yield user_1.default.findById((_b = userData.userId) !== null && _b !== void 0 ? _b : (_c = userData._doc) === null || _c === void 0 ? void 0 : _c._id);
    const tokens = jwtService_1.default.generateToken(Object.assign({}, user));
    yield jwtService_1.default.saveToken(user === null || user === void 0 ? void 0 : user._id, tokens.refreshToken);
    return Object.assign(Object.assign({}, tokens), { user });
});
AuthService.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find();
    return users;
});
exports.default = AuthService;
