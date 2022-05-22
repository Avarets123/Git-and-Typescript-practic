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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const auth_1 = require("./routes/auth");
class App {
    constructor() {
        this.PORT = +process.env.PORT | 9999;
        this.app = (0, express_1.default)();
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            const URI = config_1.default.get('CONNECT_DB');
            try {
                yield mongoose_1.default.connect(URI);
                this.app.listen(this.PORT, () => {
                    console.log(`Server started in http://localhost:${this.PORT}`);
                });
            }
            catch (e) {
                console.log(`Server not working: ${e}`);
            }
        });
        this.app.use(express_1.default.json());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use(auth_1.authRouter);
    }
}
const app = new App();
app.start();
