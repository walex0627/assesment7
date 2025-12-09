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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // REGISTER
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user access',
    description:
      'Registers a new access record by linking user, role, and credentials (email + password).',
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
  @ApiResponse({
    status: 400,
    description: 'Invalid payload or missing data',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists or violates a unique constraint',
  })
  async register(@Body() dto: CreateAccessDto) {
    return await this.authService.register(dto);
  }

  // LOGIN
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Validates the provided email and password and returns a signed JWT token if successful.',
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