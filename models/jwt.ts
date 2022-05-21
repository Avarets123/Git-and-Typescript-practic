import { Schema, model } from 'mongoose';

export interface IJwt {
    userId: string,
    jwtAccess?: string,
    jwtRefresh: string
}

const jwtSchema = new Schema<IJwt>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
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


export default model('jwtData', jwtSchema);

