import { Test, TestingModule } from '@nestjs/testing';
import { TickettechnicianController } from './tickettechnician.controller';
import { TickettechnicianService } from './tickettechnician.service';

describe('TickettechnicianController', () => {
  let controller: TickettechnicianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TickettechnicianController],
      providers: [TickettechnicianService],
    }).compile();

    controller = module.get<TickettechnicianController>(TickettechnicianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
