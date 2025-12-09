import { Test, TestingModule } from '@nestjs/testing';
import { TicketAssignmentService } from './tickettechnician.service';

describe('TicketAssignmentService', () => {
  let service: TicketAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketAssignmentService],
    }).compile();

    service = module.get<TicketAssignmentService>(TicketAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
