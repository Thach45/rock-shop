import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request);
    return request.user;
  },
);