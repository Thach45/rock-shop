
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';




@Injectable()
export class ApiKeyGuard implements CanActivate {
   
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      
      return false;
    }
    if (apiKey !== process.env.API_KEY) {
      
        return false;
      }
    return true;
  }
}
