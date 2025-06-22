import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TokenService {
    private readonly algorithm = 'HS256';
    constructor(private readonly jwtService: JwtService) {}

    signAccessToken(payload: {userId: number }) {
    
        return this.jwtService.sign(payload, { 
            secret: process.env.ACCESS_TOKEN_SECRET, 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            algorithm: this.algorithm
        });
    }

    signRefreshToken(payload: {userId: number}) {
        return this.jwtService.sign(payload, { 
            secret: process.env.REFRESH_TOKEN_SECRET, 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
            algorithm: this.algorithm
        });
    }

    verifyAccessToken(token: string): Promise<{userId: number}>  {
        return this.jwtService.verifyAsync(token, { 
            secret: process.env.ACCESS_TOKEN_SECRET,
            algorithms: [this.algorithm]
        });
    }

    verifyRefreshToken(token: string): Promise<{userId: number}> {
        return this.jwtService.verifyAsync(token, { 
            secret: process.env.REFRESH_TOKEN_SECRET,
            algorithms: [this.algorithm]
        });
    }
}
