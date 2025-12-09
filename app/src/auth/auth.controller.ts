import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateAccessDto } from 'src/access/dto/create-access.dto';
// 🔑 Import the Public decorator
import { Public } from 'src/common/decorators/public.decorator'; 


@ApiTags('Auth')
@Controller('auth')
// NOTE: Assuming PolicyGuard/JwtAuthGuard is configured GLOBALLY.
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔑 REGISTER - Marked as Public
  @Public() 
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user access (Public Access)',
    description:
      'Registers a new access record by linking user, role, and credentials (email + password). This endpoint bypasses authorization guards.',
  })
  @ApiBody({
    description: 'Registration payload',
    type: CreateAccessDto,
    examples: {
      basic: {
        summary: 'Basic registration example',
        value: {
          email: 'john.doe@example.com',
          password: 'MySecurePassword123',
          user_id: 1,
          role_id: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Access record created successfully. Password is not returned in the response.',
  })
  async register(@Body() dto: CreateAccessDto) {
    return await this.authService.register(dto);
  }

  // 🔑 LOGIN - Marked as Public
  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login (Public Access)',
    description:
      'Validates the provided email and password and returns a signed JWT token if successful. This endpoint bypasses authorization guards.',
  })
  @ApiBody({
    description: 'Login payload',
    type: LoginAuthDto,
    examples: {
      basic: {
        summary: 'Basic login example',
        value: {
          email: 'john.doe@example.com',
          password: 'MySecurePassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a JWT access token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() dto: LoginAuthDto) {
    return await this.authService.login(dto);
  }
}