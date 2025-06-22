
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';


import { TokenService } from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';
import { AccessTokenGuard } from './auth.guard';



export type AuthType = {
    authType: string[];
    options: string;
}
@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService,
        private readonly reflector: Reflector,
        private readonly apiKeyGuard: ApiKeyGuard,
        private readonly accessTokenGuard: AccessTokenGuard
    ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const authType = this.reflector.getAllAndOverride<AuthType>("auth", [
        context.getHandler(),
        context.getClass(),
      ]);
    
   
    if(authType.options==='or'){

        return  this.accessTokenGuard.canActivate(context) || this.apiKeyGuard.canActivate(context); 
        // ưu tiên kiểm tra access token trước tránh lỗi không thêm user vào request
    }
    if(authType.options==='and'){
        return this.apiKeyGuard.canActivate(context) && this.accessTokenGuard.canActivate(context);
    }
    return true;


    
  }

}
