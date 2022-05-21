import jwt from 'jsonwebtoken';
import config from 'config';
import Jwt from '../models/jwt';




class TokenService {

    public static generateToken(data: any) {
        const accessToken = jwt.sign(data, config.get('SECRET'), { expiresIn: '30m' });
        const refreshToken = jwt.sign(data, config.get('SECRET'), { expiresIn: '40d' });


        return {
            accessToken,
            refreshToken
        }
    }

    public static async saveToken(userId: any, refreshToken: any) {
        const tokenData = await Jwt.findOne({ userId });

        if (tokenData) {
            tokenData.jwtRefresh = refreshToken;
            return tokenData.save();
        }

        const token = new Jwt({ userId, jwtRefresh: refreshToken });
        token.save();
        return token;
    }

    public static removeToken = async (refreshToken: string) => {
        const tokenData = await Jwt.deleteOne({ refreshToken });
        return tokenData;
    }
}

export default TokenService;