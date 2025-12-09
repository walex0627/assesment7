// src/ticket/dto/create-ticket.dto.ts

import { IsString, IsNotEmpty, IsInt, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  
  @ApiProperty({ description: 'The concise title of the support issue.', example: 'Application crashes on startup' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'A detailed description of the problem and steps to reproduce.', example: 'The application fails to initialize after the last update, showing error code 500.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The current status of the ticket.',
    example: 'Open',
    default: 'Open',
    enum: ['Open', 'In Progress', 'Closed', 'Resolved']
  })
  @IsString()
  @IsOptional()
  @IsIn(['Open', 'In Progress', 'Closed', 'Resolved'])
  status: string = 'Open';

  @ApiProperty({
    description: 'The priority level of the ticket.',
    example: 'High',
    default: 'Medium',
    enum: ['Low', 'Medium', 'High']
  })
  @IsString()
  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  priority: string = 'Medium';

  @ApiProperty({ description: 'The ID of the category this ticket belongs to (Foreign Key to Category entity).', example: 2 })
  @IsInt()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ description: 'The ID of the client who submitted this ticket (Foreign Key to Client entity).', example: 10 })
  @IsInt()
  @IsNotEmpty()
  client_id: number;
}