import { Module } from '@nestjs/common';
import { TicketAssignmentService } from './tickettechnician.service';
import { TicketAssignmentController } from './tickettechnician.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTechnician } from './entities/tickettechnician.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { Client } from 'src/client/entities/client.entity';
import { Technician } from 'src/technician/entities/technician.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTechnician, Ticket, Technician])],
  controllers: [TicketAssignmentController],
  providers: [TicketAssignmentService],
  exports: [TicketAssignmentService],
})
export class TickettechnicianModule {}
