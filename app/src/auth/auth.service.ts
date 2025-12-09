import {
    Injectable,
    UnauthorizedException,
    InternalServerErrorException,
    BadRequestException,
    ConflictException, 
    NotFoundException, // Import for better error specificity
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AccessService } from 'src/access/access.service';
import { CreateAccessDto } from 'src/access/dto/create-access.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Access } from 'src/access/entities/access.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly accessService: AccessService,
        private readonly jwtService: JwtService,
    ) { }

    // REGISTER (creates Access with hashed password)
    async register(dto: CreateAccessDto): Promise<Omit<Access, 'password'>> {
        if (!dto) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            // 1. Hash password with 10 salt rounds
            const hashedPassword = await bcrypt.hash(dto.password, 10);

            // 2. Create the access with hashed password
            const access = await this.accessService.createAccess({
                ...dto,
                password: hashedPassword,
            });

            // 3. Destructure and return the object without the password field
            const { password, ...safeAccess } = access;
            return safeAccess;
        } catch (error: any) {
            // Check for PostgreSQL unique violation error (code '23505')
            if (error.code === '23505') { 
                throw new ConflictException('Email address already registered.');
            }
            // If AccessService threw an expected Not Found exception (e.g., invalid FKs)
            if (error instanceof NotFoundException) { 
                throw error; 
            }
            // Rethrow any existing HTTP exceptions
            if (error?.response?.statusCode) throw error;

            throw new InternalServerErrorException('Error during registration.');
        }
    }

    // LOGIN (validates credentials and returns JWT)
    async login(dto: LoginAuthDto): Promise<{ access_token: string }> {
        // Retrieve access record, CRUCIALLY loading 'role' and 'user' relations
        // This relies on AccessService.getAccessByEmail accepting the relations argument.
        const access = await this.accessService.getAccessByEmail(dto.email, ['role', 'user']); 

        if (!access) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 1. Password Comparison
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            access.password,
        );

        if (!isPasswordValid) {
            // Throws 401 if the input password does not match the stored hash
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 2. JWT Payload Construction
        const payload = {
            // 'sub' (subject) should be the User ID (PK)
            sub: access.user.id,
            email: access.email,
            // Role name is required by the PolicyGuard
            role: access.role.name, 
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };
    }
}