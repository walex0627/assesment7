import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser()
 *
 * Allows controllers to easily extract authenticated user information
 * attached to the request by JwtStrategy.validate().
 *
 * Example:
 *  @Get('me')
 *  getProfile(@CurrentUser() user) {
 *      return user;
 *  }
 *
 * Whatever your JwtStrategy returns becomes "user".
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user; // populated by JwtAuthGuard + JwtStrategy
    },
);
