import { SetMetadata } from "@nestjs/common";

export const Auth=(authType: string[], options: string)=>{
    return SetMetadata('auth', {authType, options});
}