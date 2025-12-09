📘 Decoradores y Autorización en NestJS

Guía completa: @Public, @Roles, @CurrentUser + RolesGuard + Guards Globales
```
🔥 Ejemplos de Uso de los Decoradores
🔓 Ruta pública (no requiere autenticación)
@Public()
@Post('login')
login() { 
  return this.authService.login();
}
```

```
🔐 Ruta que requiere autenticación JWT
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user) {
  return user;
}
```

```
🛡 Ruta restringida solo para ciertos roles
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get('admin/users')
getAllUsers() {
  return this.userService.getAllUsers();
}
```

```
🔑 Ruta que permite múltiples roles
@Roles('ADMIN', 'SUPPORT')
@Get('restricted')
handleRestricted() {
  return { message: 'Access granted for ADMIN or SUPPORT' };
}
```
🧩 Activación Global de Guards

Para que todas las rutas:

requieran autenticación por defecto

validen roles automáticamente

permitan rutas públicas con @Public()

Agrega esto en tu auth.module.ts:

```
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard, // Primero: autenticación
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,   // Segundo: autorización por roles
  },
],
```