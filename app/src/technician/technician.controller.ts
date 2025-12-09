import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { TechnicianService } from './technician.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Technician } from './entities/technician.entity';

@ApiTags('Technicians')
@Controller('technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  // CREATE TECHNICIAN
  @Post()
  @ApiOperation({
      summary: 'Create a new technician',
      description: 'Registers a new technician with their core information and associates them with a User ID.',
  })
  @ApiBody({
      type: CreateTechnicianDto,
      examples: {
          basic: {
              summary: 'Basic technician creation example',
              value: {
                  name: 'Alex Johnson',
                  speciality: 'Network Security',
                  availability: 'Available', 
                  userId: 5,
              } as CreateTechnicianDto,
          },
      },
  })
  @ApiResponse({
      status: 201,
      description: 'Technician successfully created.',
      type: Technician,
  })
  @ApiResponse({
      status: 409,
      description: 'Conflict: A unique constraint was violated (e.g., availability value already exists if that column is unique).',
  })
  async create(@Body() dto: CreateTechnicianDto): Promise<Technician> {
      return await this.technicianService.createTechnician(dto);
  }

  // GET ALL TECHNICIANS
  @Get()
  @ApiOperation({
      summary: 'Get all technicians',
      description: 'Retrieves a list of all registered technicians.',
  })
  @ApiResponse({
      status: 200,
      description: 'List of technicians retrieved successfully.',
      type: [Technician],
  })
  async findAll(): Promise<Technician[]> {
      return await this.technicianService.getAllTechnicians();
  }

  // GET TECHNICIAN BY ID
  @Get(':id')
  @ApiOperation({
      summary: 'Get a technician by ID',
      description: 'Retrieves a single technician using their unique ID.',
  })
  @ApiParam({
      name: 'id',
      description: 'Technician ID',
      example: 1,
  })
  @ApiResponse({
      status: 200,
      description: 'Technician found successfully.',
      type: Technician,
  })
  @ApiResponse({
      status: 404,
      description: 'Technician not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Technician> {
      return await this.technicianService.getTechnicianById(id);
  }

  // UPDATE TECHNICIAN
  @Patch(':id')
  @ApiOperation({
      summary: 'Update a technician',
      description: 'Updates an existing technician\'s details using their ID and a partial payload.',
  })
  @ApiParam({
      name: 'id',
      description: 'Technician ID',
      example: 1,
  })
  @ApiBody({
      type: UpdateTechnicianDto,
      examples: {
          partial: {
              summary: 'Partial update example (changing speciality and availability)',
              value: {
                  speciality: 'Cloud Infrastructure',
                  availability: 'Busy',
              } as UpdateTechnicianDto,
          },
      },
  })
  @ApiResponse({
      status: 200,
      description: 'Technician successfully updated.',
      type: Technician,
  })
  @ApiResponse({
      status: 404,
      description: 'Technician not found.',
  })
  @ApiResponse({
      status: 409,
      description: 'Conflict: Unique constraint violation (e.g., trying to set a duplicate unique availability).',
  })
  async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateTechnicianDto,
  ): Promise<Technician> {
      return await this.technicianService.updateTechnician(id, dto);
  }

  // DELETE TECHNICIAN (HARD DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({
      summary: 'Permanently delete a technician',
      description: 'Permanently removes the technician record from the database. This operation is irreversible.',
  })
  @ApiParam({
      name: 'id',
      example: 3,
      description: 'Technician ID',
  })
  @ApiResponse({
      status: 204,
      description: 'Technician deleted successfully (No Content).',
  })
  @ApiResponse({
      status: 404,
      description: 'Technician not found.',
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.technicianService.deleteTechnician(id);
  }
}