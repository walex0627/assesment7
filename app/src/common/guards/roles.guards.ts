import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * RolesGuard
 *
 * This guard performs two tasks:
 *  1. Checks whether a route is PUBLIC (@Public() decorator).
 *  2. Verifies that the authenticated user's role matches all required roles.
 *
 * It works together with:
 *  - JwtAuthGuard → Authenticate the user
 *  - @Roles() decorator → Restrict access by role
 *
 * Flow:
 *   If route is public → allow access
 *   Else → user must be authenticated AND have the correct role
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        // Get required roles from decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Provided by JwtStrategy.validate()

        if (!requiredRoles || requiredRoles.length === 0) return true;

        if (!user) {
            throw new ForbiddenException('You must be authenticated.');
        }

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException(
                `Role '${user.role}' does not have access to this resource.`,
            );
        }

        return true;
    }
}
