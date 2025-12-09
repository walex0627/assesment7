import {
    Injectable,
    UnauthorizedException,
    InternalServerErrorException,
    BadRequestException,
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
            // 1. Hash password
            const hashedPassword = await bcrypt.hash(dto.password, 10);

            // 2. Create the access with hashed password
            const access = await this.accessService.createAccess({
                ...dto,
                password: hashedPassword,
            });

            // 3. Never return the password
            const { password, ...safeAccess } = access;
            return safeAccess;
        } catch (err: any) {
            // If AccessService already threw an HTTP exception, rethrow it
            if (err?.response?.statusCode) throw err;

            throw new InternalServerErrorException('Error during registration.');
        }
    }

    // LOGIN (validates credentials and returns JWT)
    async login(dto: LoginAuthDto): Promise<{ access_token: string }> {
        const access = await this.accessService.getAccessByEmail(dto.email);

        if (!access) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            access.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Payload for JWT
        const payload = {
            sub: access.user.id_user,
            email: access.email,
            // ajusta el nombre del campo según tu RoleEntity (role_name / name / etc.)
            role: access.role.role_name,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };
    }
}
