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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const jwt_1 = __importDefault(require("../models/jwt"));
class TokenService {
    static generateToken(data) {
        const accessToken = jsonwebtoken_1.default.sign(data, config_1.default.get('SECRET'), { expiresIn: '30m' });
        const refreshToken = jsonwebtoken_1.default.sign(data, config_1.default.get('SECRET'), { expiresIn: '40d' });
        return {
            accessToken,
            refreshToken
        };
    }
    static saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield jwt_1.default.findOne({ userId });
            if (tokenData) {
                tokenData.jwtRefresh = refreshToken;
                return tokenData.save();
            }
            const token = new jwt_1.default({ userId, jwtRefresh: refreshToken });
            token.save();
            return token;
        });
    }
}
_a = TokenService;
TokenService.validateRefreshToken = (token) => {
    const userData = jsonwebtoken_1.default.verify(token, config_1.default.get('SECRET'));
    return userData;
};
TokenService.validateAccessToken = (token) => {
    const userData = jsonwebtoken_1.default.verify(token, config_1.default.get('SECRET'));
    return userData;
};
TokenService.removeToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield jwt_1.default.deleteOne({ refreshToken });
    return tokenData;
});
TokenService.findToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield jwt_1.default.findOne({ refreshToken });
    return tokenData;
});
exports.default = TokenService;
