import jwt from 'jsonwebtoken';
import config from 'config';
import Jwt from '../models/jwt';




class TokenService {

    generateToken(data: any) {
        const accessToken = jwt.sign(data, config.get('SECRET'), { expiresIn: '30m' });
        const refreshToken = jwt.sign(data, config.get('SECRET'), { expiresIn: '40d' });


        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await Jwt.findOne({ userId });

        if (tokenData) {
            tokenData.jwtRefresh = refreshToken;
            return tokenData.save();
        }

        const token = new Jwt({ userId, jwtRefresh: refreshToken });
        return token;
    }
}

export default TokenService;