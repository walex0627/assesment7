import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // CREATE USER
    async createUser(dto: CreateUserDto): Promise<User> {
        if (!dto) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            const newUser = this.userRepository.create(dto);
            return await this.userRepository.save(newUser);
        } catch (err: any) {
            // Unique constraint (email, username, etc.)
            if (err.code === '23505') {
                throw new ConflictException(
                    'User already exists or violates a unique constraint.',
                );
            }

            throw new InternalServerErrorException('Error creating user.');
        }
    }

    // GET ALL USERS (solo activos, sin withDeleted)
    async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.userRepository.find();

            if (!users || users.length === 0) {
                throw new NotFoundException('No users found.');
            }

            return users;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error fetching users.');
        }
    }

    // GET USER BY ID
    async getUserById(id: number): Promise<User> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const user = await this.userRepository.findOne({
                where: { id_user: id },

            });

            if (!user) {
                throw new NotFoundException(`User with id ${id} not found.`);
            }

            return user;
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error fetching user by id.');
        }
    }

    // UPDATE USER
    async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('Payload is required.');
        }

        try {
            const existing = await this.userRepository.findOne({
                where: { id_user: id },
            });

            if (!existing) {
                throw new NotFoundException(`User with id ${id} not found.`);
            }

            Object.assign(existing, dto);
            const updated = await this.userRepository.save(existing);
            return updated;
        } catch (err: any) {
            if (err?.response?.statusCode) throw err;

            if (err.code === '23505') {
                throw new ConflictException('User data violates unique constraint.');
            }

            throw new InternalServerErrorException('Error updating user.');
        }
    }

    // SOFT DELETE USER
    async softDeleteUser(id: number) {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const existing = await this.userRepository.findOneBy({ id_user: id });

            if (!existing) {
                throw new NotFoundException(`User with id ${id} not found.`);
            }

            const result = await this.userRepository.softDelete({ id_user: id });

            if (!result || result.affected === 0) {
                throw new NotFoundException(
                    `User with id ${id} not found or not deleted.`,
                );
            }

            return { message: 'User soft-deleted successfully.' };
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error soft-deleting user.');
        }
    }

    // HARD DELETE USER
    async deleteUser(id: number) {
        if (!id || id <= 0) {
            throw new BadRequestException('A valid id is required.');
        }

        try {
            const existing = await this.userRepository.findOneBy({ id_user: id });

            if (!existing) {
                throw new NotFoundException(`User with id ${id} not found.`);
            }

            const result = await this.userRepository.delete({ id_user: id });

            if (!result || result.affected === 0) {
                throw new NotFoundException(
                    `User with id ${id} not found or not deleted.`,
                );
            }

            return { message: 'User deleted successfully.' };
        } catch (err: any) {
            if (err.response?.statusCode) throw err;
            throw new InternalServerErrorException('Error deleting user.');
        }
    }
}
