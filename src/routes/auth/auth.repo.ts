import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { VerificationCode } from "@prisma/client";
import { PrismaService } from "src/shared/service/prisma.service";

type CreateUserType = {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    roleId: number;
}

type CreateOtpType = Pick<VerificationCode, "email" | "type" | "code" | "expiresAt">;

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async createUser(user: CreateUserType) {
        return this.prisma.user.create({
            data: user,
            omit: {
                password: true,
                totpSecret: true,
            }
        });
    }

    async createOtp(otp: CreateOtpType): Promise<VerificationCode> {
        //1 check exist otp
        const existOtp = await this.prisma.verificationCode.findFirst({
            where: {
                email: otp.email,
                type: otp.type,
                expiresAt: {
                    gt: new Date()
                }
            },
        });
        if(existOtp){
            throw new UnprocessableEntityException('Please wait 5 minute to send otp again');
        }
        const verificationCode = await this.prisma.verificationCode.create({
            data: otp,
        });
        return verificationCode;
    }
}