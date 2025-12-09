import { Module } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { TechnicianController } from './technician.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Technician])],
  controllers: [TechnicianController],
  providers: [TechnicianService],
})
export class TechnicianModule {}
