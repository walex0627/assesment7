// src/ticket-technician/dto/create-ticket-technician.dto.ts

import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketTechnicianDto {
  
  @ApiProperty({ description: 'The ID of the technician being assigned.', example: 1 })
  @IsInt()
  @IsNotEmpty()
  technician_id: number;

  @ApiProperty({ description: 'The ID of the ticket to which the technician is assigned.', example: 101 })
  @IsInt()
  @IsNotEmpty()
  ticket_id: number;
}