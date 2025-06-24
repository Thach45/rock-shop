import { VerificationType } from "src/shared/constants/auth.constants";
import { z } from "zod";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().min(1).max(100),
    phoneNumber: z.string().min(9).max(15),
    password: z.string().min(6).max(100),
    avatar: z.string().nullable(),
    totpSecret: z.string().nullable(),
    status: z.nativeEnum(UserStatus),
    roleId: z.number().positive(),
    createdAt: z.union([z.date(), z.string().transform((str) => new Date(str))]),
    updatedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]),
    deletedAt: z.date().nullable(),
    createdById: z.number().nullable(),
    updatedById: z.number().nullable(),
});
export type UserType = z.infer<typeof UserSchema>;


export const RegisterBodySchema = UserSchema.pick({
    email: true,
    name: true,
    phoneNumber: true,
    password: true,
}).extend({
    confirmPassword: z.string().min(6).max(100),
    otp: z.string().length(6),
}).strict().superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Password and confirm password do not match",
            path: ["confirmPassword"],
        });
    }
});
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const RegisterResponseSchema = UserSchema.omit({
    password: true,
    totpSecret: true,
   
});

export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>;

export const VerificationSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    code: z.string().length(6),
    type: z.nativeEnum(VerificationType),
    expiresAt: z.date(),
    createdAt: z.date(),
})
export type VerificationType = z.infer<typeof VerificationSchema>;

export const SendOtpSchema = VerificationSchema.pick({
    email: true,
    type: true,
}).strict();

export type SendOtpType = z.infer<typeof SendOtpSchema>;
