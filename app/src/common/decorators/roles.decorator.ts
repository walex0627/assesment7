import { SetMetadata } from '@nestjs/common';

/**
 * KEY: metadata key used to store required roles for a specific route.
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles('ADMIN', 'MANAGER')
 *
 * Assigns required roles to the route. The RolesGuard reads these roles
 * and checks if the authenticated user has the required permissions.
 *
 * Example:
 *  @Roles('ADMIN')
 *  @Get('admin/dashboard')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
