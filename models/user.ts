import { Schema, model } from "mongoose";


export interface IUser {
    email: string;
    password: string;
}


const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { _id: true });


export default model('users', userSchema);