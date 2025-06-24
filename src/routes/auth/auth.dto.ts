
import { createZodDto } from "nestjs-zod";

import { RegisterBodySchema, RegisterResponseSchema, SendOtpSchema } from "./auth.model";


export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}


export class UserResponseDto extends createZodDto(RegisterResponseSchema  ) {}

export class SendOtpDto extends createZodDto(SendOtpSchema) {}