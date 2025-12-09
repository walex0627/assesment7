import { SetMetadata } from '@nestjs/common';

/**
 * KEY: metadata key used internally to identify public routes.
 * If a route is marked as 'public', the authentication guard will skip it.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public()
 *
 * This decorator marks a route as PUBLIC, meaning it does NOT require
 * authentication (JWT).
 *
 * Example:
 *  @Public()
 *  @Post('login')
 *  login() { ... }
 *
 * Any guard using this metadata must allow the request through.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
