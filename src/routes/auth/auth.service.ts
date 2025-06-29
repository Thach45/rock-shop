import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HashingService } from 'src/shared/service/hashing.service';
import { PrismaService } from 'src/shared/service/prisma.service';

import { TokenService } from 'src/shared/service/token.service';
import { Prisma, VerificationType } from '@prisma/client';
import { TokenExpiredError } from '@nestjs/jwt';

import { RoleService } from './role.service';
import { RegisterBodyType, SendOtpType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo';
import { generateOtp } from 'src/shared/helper/generate-otp';
import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import { SendEmailService } from 'src/shared/service/send-email.service';




@Injectable()
export class AuthService {
    constructor(
        private readonly hashingService: HashingService, 
        private readonly prisma: PrismaService,
        private readonly tokenService: TokenService,
        private readonly roleService: RoleService,
        private readonly authRepository: AuthRepository,
        private readonly sharedUserRepo: SharedUserRepo,
        private readonly sendEmailService: SendEmailService
    ) {}
    async register(body: RegisterBodyType) {
        try {
            if (body.password !== body.confirmPassword) {
                throw new Error('Password and confirm password do not match');
            }
            const otp = await this.authRepository.getOtp({
                email: body.email,
                type: VerificationType.REGISTER,
                code: body.otp
            });
            if(!otp){
                throw new UnprocessableEntityException({
                    field: 'otp',
                    message: 'Invalid otp'
                    
                });
            }
            if(otp.expiresAt < new Date()){
                throw new UnprocessableEntityException({
                    field: 'otp',
                    message: 'Otp has expired'
                });
            }
            const hashedPassword = await this.hashingService.hashPassword(body.password);
            const clientRole = await this.roleService.getClientRole();
            const user = await this.authRepository.createUser({
                email: body.email,
                password: hashedPassword,
                name: body.name,
                phoneNumber: body.phoneNumber,
                roleId: clientRole
            });
            return user;
            
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new UnprocessableEntityException('User already exists');
            }
            if (error instanceof UnprocessableEntityException) {
                throw error; 
            }
            
        }
    }
    async sendOtp(body: SendOtpType) {
        try {
            //1 check exsit mail
            const emailExist = await this.sharedUserRepo.findUserByEmail(body.email);
           
            if(emailExist){
                throw new UnprocessableEntityException('User already exists');
            }
            const code = generateOtp();
            const expireOtp = ms(process.env.EXPIRE_OTP as unknown as number);
            console.log(expireOtp);
            const otp = await this.authRepository.createOtp({
                email: body.email,
                type: VerificationType.REGISTER,
                code,
                expiresAt: addMilliseconds(new Date(), expireOtp as unknown as number)
            });
            await this.sendEmailService.sendOtpEmail({
                recipientEmail: body.email,
                otp: code
            });
            return otp;
          
        } catch (error) {
            throw error;    
        }
        
        

        
    }

    async login(body: any) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isPasswordValid = await this.hashingService.comparePassword(body.password, user.password);
        if (!isPasswordValid) {

            throw new UnprocessableEntityException({
                field: 'password',
                message: 'Invalid password'
            });
        }
        const { accessToken, refreshToken } = await this.generateTokens(user.id);
        return {
            accessToken,
            refreshToken
        };
        
    }


    async generateTokens(userId: number) {
        const accessToken = this.tokenService.signAccessToken({ userId });
        const refreshToken = this.tokenService.signRefreshToken({ userId });
        const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: userId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
            }
        });
  
        return {
            accessToken,
            refreshToken
        };
    }

    async refreshToken(body: any) {

        try {
            //1. Check if refresh token is valid
            const decodedRefreshToken = await this.tokenService.verifyRefreshToken(body.refreshToken);
            console.log(decodedRefreshToken);
            console.log(body.refreshToken);
            if(!decodedRefreshToken){
                throw new UnauthorizedException('Invalid refresh token');
            }
            // 2. Check if refresh token is in the database
            const checkRefreshToken = await this.prisma.refreshToken.findUniqueOrThrow({
                where: {
                    token: body.refreshToken
                }
            });
            console.log(checkRefreshToken);
        //    3. delete the refresh token from the database
           await this.prisma.refreshToken.delete({
            where: {
                token: body.refreshToken
            }
           });
           // 4. generate new tokens
            const { accessToken, refreshToken } = await this.generateTokens(decodedRefreshToken.userId);
            return {
                accessToken,
                refreshToken
            };
       
            
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Refresh token has expired');
            }
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new UnauthorizedException('Invalid refresh token');
            }
            throw new UnauthorizedException('Something went wrong');
        }
        
    }
    async logout(body: any) {
        try {
            const decodedRefreshToken = await this.tokenService.verifyRefreshToken(body.refreshToken);
            if(!decodedRefreshToken){
                throw new UnauthorizedException('Invalid refresh token');
            }
            await this.prisma.refreshToken.delete({
                where: {
                    token: body.refreshToken
                }
            });
            return {
                message: 'Logged out successfully'
            };
        } catch (error) {
            if(error instanceof TokenExpiredError){
                throw new UnauthorizedException('Refresh token has expired');
            }
            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'){
                throw new UnauthorizedException('Invalid refresh token');
            }
            throw new UnauthorizedException('Something went wrong');
        }
    }
}

