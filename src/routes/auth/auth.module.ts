import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleService } from './role.service';
import { AuthRepository } from './auth.repo';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleService, AuthRepository]
})
export class AuthModule {}
