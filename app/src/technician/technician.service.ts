import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from './entities/technician.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';

@Injectable()
export class TechnicianService {
    constructor(
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
    ) {}

    /**
     * Creates a new technician in the database.
     * Handles conflict exceptions if unique constraints are violated.
     */
    async createTechnician(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
        try {
            const technician = this.technicianRepository.create(createTechnicianDto);
            return await this.technicianRepository.save(technician);
        } catch (error) {
            // Check for PostgreSQL unique constraint error code
            if (error.code === '23505') { 
                throw new ConflictException('Technician already exists or a unique field is duplicated.');
            }
            throw new InternalServerErrorException('Failed to create technician due to an unexpected error.');
        }
    }

    /**
     * Retrieves all technicians.
     */
    async getAllTechnicians(): Promise<Technician[]> {
        return this.technicianRepository.find({
             // Load the related User entity
             relations: ['user'] 
        });
    }

    /**
     * Retrieves a technician by ID. Throws NotFoundException if not found.
     */
    async getTechnicianById(id: number): Promise<Technician> {
        const technician = await this.technicianRepository.findOne({ 
            where: { id },
            relations: ['user'] 
        });
        if (!technician) {
            throw new NotFoundException(`Technician with ID ${id} not found.`);
        }
        return technician;
    }

    /**
     * Updates an existing technician.
     * Throws NotFoundException if the technician doesn't exist.
     */
    async updateTechnician(id: number, updateTechnicianDto: UpdateTechnicianDto): Promise<Technician> {
        const technician = await this.getTechnicianById(id); // Uses method above, handles 404
        
        // Merge updates into the existing entity
        this.technicianRepository.merge(technician, updateTechnicianDto);

        try {
            return await this.technicianRepository.save(technician);
        } catch (error) {
            // Check for PostgreSQL unique constraint error code
            if (error.code === '23505') { 
                throw new ConflictException('Update failed: Unique constraint violation.');
            }
            throw new InternalServerErrorException('Failed to update technician due to an unexpected error.');
        }
    }

    /**
     * Deletes a technician by ID (Hard Delete).
     * Throws NotFoundException if the technician doesn't exist.
     */
    async deleteTechnician(id: number): Promise<void> {
        const result = await this.technicianRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Technician with ID ${id} not found.`);
        }
    }
}