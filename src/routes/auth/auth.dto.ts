import { createZodDto } from 'nestjs-zod'

import {
  LoginBodySchema,
  LoginResponseSchema,
  RefreshTokenResponseSchema,
  RefreshTokenSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
  SendOtpSchema,
} from './auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class UserResponseDto extends createZodDto(RegisterResponseSchema) {}

export class SendOtpDto extends createZodDto(SendOtpSchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenSchema) {}

export class RefreshTokenResponseDto extends createZodDto(RefreshTokenResponseSchema) {}
