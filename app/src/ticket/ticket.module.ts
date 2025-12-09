import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import  { Ticket } from './entities/ticket.entity';
import { TicketTechnician } from '../tickettechnician/entities/tickettechnician.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Ticket, TicketTechnician])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
