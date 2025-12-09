import { PartialType } from '@nestjs/swagger';
import { CreateTicketTechnicianDto } from './create-tickettechnician.dto';

// Makes the technician_id and ticket_id fields optional for partial updates.
export class UpdateTicketTechnicianDto extends PartialType(CreateTicketTechnicianDto) {}