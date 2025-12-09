import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    /**
     * Creates a new client and links it to an existing user via user_id.
     */
    async createClient(createClientDto: CreateClientDto): Promise<Client> {
        // Prepare the client object, mapping user_id to the 'user' relation object.
        const clientData = {
            ...createClientDto,
            user: { id: createClientDto.user_id } // TypeORM looks up the User by this ID
        };
        
        try {
            const client = this.clientRepository.create(clientData);
            // Ensure the eager loaded 'user' relation is returned in the response
            return await this.clientRepository.save(client);
        } catch (error) {
            // Check for unique constraint violation on 'name' or 'contact_email'
            if (error.code === '23505') { 
                throw new ConflictException('Client name or email already registered.');
            }
            // Check for foreign key constraint violation (invalid user_id)
            if (error.code === '23503') {
                throw new NotFoundException(`User with ID ${createClientDto.user_id} not found or foreign key constraint failed.`);
            }
            throw new InternalServerErrorException('Failed to create client due to an unexpected error.');
        }
    }

    /**
     * Retrieves all clients, eagerly loading the associated User.
     */
    async getAllClients(): Promise<Client[]> {
        return this.clientRepository.find(); // The entity is marked with eager: true
    }

    /**
     * Retrieves a client by ID. Throws NotFoundException if not found.
     */
    async getClientById(id: number): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found.`);
        }
        return client;
    }

    /**
     * Updates an existing client.
     * Throws NotFoundException if the client doesn't exist.
     */
    async updateClient(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
        const client = await this.getClientById(id); // Handles 404

        // Map user_id from DTO to the user relation for TypeORM merge
        const clientUpdateData: any = updateClientDto;
        if (updateClientDto.user_id !== undefined) {
             clientUpdateData.user = { id: updateClientDto.user_id };
             delete clientUpdateData.user_id; // Remove temporary DTO field
        }
        
        // Merge updates into the existing entity
        this.clientRepository.merge(client, clientUpdateData);

        try {
            return await this.clientRepository.save(client);
        } catch (error) {
            // Check for unique constraint violation
            if (error.code === '23505') { 
                throw new ConflictException('Update failed: Client name or email already exists.');
            }
            // Check for foreign key constraint violation (invalid user_id)
            if (error.code === '23503') {
                throw new NotFoundException(`User ID in update data not found.`);
            }
            throw new InternalServerErrorException('Failed to update client due to an unexpected error.');
        }
    }

    /**
     * Deletes a client by ID.
     */
    async deleteClient(id: number): Promise<void> {
        // First check if it exists to provide a clean 404
        await this.getClientById(id);
        
        const result = await this.clientRepository.delete(id);
        if (result.affected === 0) {
            // Should be caught by getClientById, but kept as a safeguard
            throw new NotFoundException(`Client with ID ${id} not found.`);
        }
    }
}