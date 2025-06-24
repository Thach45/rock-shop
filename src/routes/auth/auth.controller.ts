import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AccessTokenGuard } from 'src/shared/guards/auth.guard';
import { RegisterBodyDto, SendOtpDto, UserResponseDto } from './auth.dto';
import { ZodSerializerDto    } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    @ZodSerializerDto(UserResponseDto)
    async register(@Body() body: RegisterBodyDto) {
        const user = await this.authService.register(body);
        return user;
    }
    @Post('send-otp')
    async sendOtp(@Body() body: SendOtpDto) {
        const otp = await this.authService.sendOtp(body);
        return otp;
    }

    @Post('login')
    async login(@Body() body: any) {
        console.log(body);
        const user = await this.authService.login(body);
        return user;
    }

    @UseGuards(AccessTokenGuard)
    @Post('refresh-token')
    async refreshToken(@Body() body: any) {
        const user = await this.authService.refreshToken(body);
        return user;
       
    }
    @Post('logout')
    async logout(@Body() body: any) {
        const user = await this.authService.logout(body);
        return user;
    }
}
