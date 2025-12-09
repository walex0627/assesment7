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

    ) {}

    //Method to create user
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        try {
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('User already exists');
            }
            throw new InternalServerErrorException();
        }
    }

    //Method to get all users
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    //Method to get user by id
    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }   

    //Method to update a user
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        this.userRepository.merge(user, updateUserDto);
        try {
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }   

    //Method to delete a user 
    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }
}
