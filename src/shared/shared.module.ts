import { Global, Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { HashingService } from './service/hashing.service';
import { TokenService } from './service/token.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AccessTokenGuard } from './guards/auth.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

const sharedServices = [PrismaService, HashingService, TokenService, ApiKeyGuard, AccessTokenGuard, AuthenticationGuard];
@Global()
@Module({
    providers: sharedServices,
    exports: sharedServices,
    imports: [JwtModule],
})
export class SharedModule {}
