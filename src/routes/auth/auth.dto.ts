import { UserStatus } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100),

    confirmPassword: z.string().min(8),
    phoneNumber: z.string().min(10).max(15),
}).strict().superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Password and confirm password do not match",
            path: ["confirmPassword"],
        });
    }
});
export class RegisterBodyDto extends createZodDto(RegisterSchema) {}

const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    avatar: z.string().nullable(),
   
    status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
    roleId: z.number(),
    createdAt: z.union([z.date(), z.string().transform((str) => new Date(str))]),
    updatedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
});
export class UserResponseDto extends createZodDto(UserSchema) {}