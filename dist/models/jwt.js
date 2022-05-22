"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jwtSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    jwtRefresh: {
        type: String,
        required: true
    },
    jwtAccess: {
        type: String,
        required: false
    }
}, { _id: true });
exports.default = (0, mongoose_1.model)('jwtData', jwtSchema);
