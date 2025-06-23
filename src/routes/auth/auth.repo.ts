import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/service/prisma.service";

type CreateUserType = {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    roleId: number;
}
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
}