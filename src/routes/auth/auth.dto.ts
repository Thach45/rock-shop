
import { createZodDto } from "nestjs-zod";

import { RegisterBodySchema, RegisterResponseSchema } from "./auth.model";


export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}


export class UserResponseDto extends createZodDto(RegisterResponseSchema  ) {}