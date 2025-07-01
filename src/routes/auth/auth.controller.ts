import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AccessTokenGuard } from 'src/shared/guards/auth.guard';
import { LoginBodyDto, LoginResponseDto, LogoutBodyDto, RefreshTokenBodyDto, RefreshTokenResponseDto, RegisterBodyDto, SendOtpDto, UserResponseDto } from './auth.dto';
import { ZodSerializerDto    } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorator/user-agent.decorator';
import { GetIp } from 'src/shared/decorator/get-ip.decorator';
import { Public } from 'src/shared/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Public()
    @Post('register')

    @ZodSerializerDto(UserResponseDto)
    async register(@Body() body: RegisterBodyDto) {
        const user = await this.authService.register(body);
        return user;
    }
    @Public()
    @Post('send-otp')
    async sendOtp(@Body() body: SendOtpDto) {
        const otp = await this.authService.sendOtp(body);
        return otp;
    }
    @Public()
    @Post('login')
    @ZodSerializerDto(LoginResponseDto)
    async login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @GetIp() ip: string) {
        const user = await this.authService.login({...body, userAgent, ipAddress: ip});
        return user;
    }

  
    @Post('refresh-token')
    @ZodSerializerDto(RefreshTokenResponseDto)
    async refreshToken(@Body() body: RefreshTokenBodyDto, @UserAgent() userAgent: string, @GetIp() ip: string) {
        const user = await this.authService.refreshToken(
            {
                ...body,
                userAgent,
                ipAddress: ip
            }
        );
        return user;
       
    }
    @Post('logout')
    async logout(@Body() body: LogoutBodyDto) {
        const user = await this.authService.logout(body);
        return user;
    }
}
