import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // 🔑 Agregado 'In' para el mock de findByIds/find
import { Ticket } from './entities/ticket.entity';
import { TicketTechnician } from '../tickettechnician/entities/tickettechnician.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';

// --- MOCK DATA ---
const mockTicket: Ticket = {
  id: 1,
  title: 'Fallo de Conexión',
  description: 'No hay conexión a la base de datos.',
  status: 'Open',
  priority: 'High',
  client: { id: 5, user: { id: 10, email: 'client@test.com' } } as any,
  category: { id: 1 } as any,
  created_at: new Date(),
  updated_at: new Date(),
} as Ticket;

const mockCreateTicketDto: CreateTicketDto = {
  title: 'Nuevo Ticket',
  description: 'Necesito ayuda',
  status: 'Open',
  priority: 'Low',
  category_id: 2,
  client_id: 6,
};

// --- MOCK REPOSITORIES ---
const mockTicketRepository = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockResolvedValue(mockTicket),
  findOne: jest.fn().mockResolvedValue(mockTicket),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  find: jest.fn().mockResolvedValue([mockTicket]),
  // 🔑 Modificado para simular find() usando el operador In() que es la práctica moderna
  findByIds: jest.fn().mockResolvedValue([mockTicket]), 
};

const mockAssignmentRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
};

describe('TicketService', () => {
  let service: TicketService;
  let ticketRepository: Repository<Ticket>;
  let assignmentRepository: Repository<TicketTechnician>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
        {
          provide: getRepositoryToken(TicketTechnician),
          useValue: mockAssignmentRepository,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    assignmentRepository = module.get<Repository<TicketTechnician>>(getRepositoryToken(TicketTechnician));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==========================================================
  // 1. PRUEBA REQUERIDA: CREACIÓN DE TICKETS (createTicket)
  // ==========================================================
  describe('createTicket', () => {
    it('should successfully create a ticket', async () => {
      // Act
      const result = await service.createTicket(mockCreateTicketDto);
      
      // Assert
      expect(mockTicketRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          title: mockCreateTicketDto.title,
          category: { id: mockCreateTicketDto.category_id },
      }));
      expect(mockTicketRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTicket);
    });

    it('should throw NotFoundException on foreign key constraint violation (e.g., invalid client_id)', async () => {
      // Arrange: Simular error de BD por FK (código '23503' en Postgres)
      const mockError = { code: '23503' };
      mockTicketRepository.save.mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow(NotFoundException);
      await expect(service.createTicket(mockCreateTicketDto)).rejects.toThrow('Invalid Category ID or Client ID provided.');
    });
  });

  // ==========================================================
  // 2. PRUEBA REQUERIDA: CAMBIO DE ESTADO (updateTicketStatus)
  // ==========================================================
  describe('updateTicketStatus', () => {
    const ticketId = 1;
    const newStatus = 'In Progress';

    it('should successfully update the ticket status', async () => {
      // 🔑 CORRECCIÓN: Espiar getTicketById y simular la respuesta del ticket actualizado.
      // Así verificamos que updateTicketStatus llame a la función interna (getTicketById)
      const getTicketByIdSpy = jest.spyOn(service, 'getTicketById').mockResolvedValue({ ...mockTicket, status: newStatus } as Ticket);
      
      // Act
      const result = await service.updateTicketStatus(ticketId, newStatus);

      // Assert
      expect(mockTicketRepository.update).toHaveBeenCalledWith(ticketId, expect.objectContaining({
          status: newStatus,
      }));
      expect(getTicketByIdSpy).toHaveBeenCalledTimes(1); // La función interna fue llamada
      expect(result.status).toBe(newStatus);

      getTicketByIdSpy.mockRestore(); // Limpiar el espía
    });

    it('should throw BadRequestException for an invalid status value', async () => {
      // Act & Assert
      await expect(service.updateTicketStatus(ticketId, 'InvalidStatus')).rejects.toThrow(BadRequestException);
      expect(mockTicketRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if the ticket ID is not found during update', async () => {
      // Arrange: Simular que update no afectó ninguna fila
      mockTicketRepository.update.mockResolvedValue({ affected: 0 });
      
      // Act & Assert
      await expect(service.updateTicketStatus(ticketId, newStatus)).rejects.toThrow(NotFoundException);
      expect(mockTicketRepository.update).toHaveBeenCalled();
    });
  });

  // ==========================================================
  // 3. PRUEBA ELEGIDA: OBTENER TICKET POR ID (getTicketById)
  // ==========================================================
  describe('getTicketById', () => {
    it('should return the ticket and ensure necessary relations are loaded for PolicyGuard', async () => {
      // Arrange
      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      // Act
      const result = await service.getTicketById(mockTicket.id);

      // Assert
      expect(mockTicketRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTicket.id },
        // Verifica que las relaciones se carguen (crucial para el PolicyGuard)
        relations: ['client', 'client.user'], 
      });
      expect(result).toEqual(mockTicket);
    });

    it('should throw NotFoundException if the ticket is not found', async () => {
      // Arrange: Simular que findOne no encontró el ticket
      mockTicketRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getTicketById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ==========================================================
  // 4. PRUEBA ELEGIDA: VALIDACIÓN DE ASIGNACIÓN (isTechnicianAssignedToTicket)
  // ==========================================================
  describe('isTechnicianAssignedToTicket', () => {
    const technicianId = 10;
    const ticketId = 1;

    it('should return TRUE if the technician is assigned to the ticket', async () => {
      // Arrange: Simular que el registro en la tabla de unión existe
      mockAssignmentRepository.findOne.mockResolvedValue({
        technician_id: technicianId,
        ticket_id: ticketId,
      } as TicketTechnician);

      // Act
      const result = await service.isTechnicianAssignedToTicket(technicianId, ticketId);

      // Assert
      expect(mockAssignmentRepository.findOne).toHaveBeenCalledWith({
        where: { technician_id: technicianId, ticket_id: ticketId },
      });
      expect(result).toBe(true);
    });

    it('should return FALSE if the technician is NOT assigned to the ticket', async () => {
      // Arrange: Simular que el registro no existe
      mockAssignmentRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.isTechnicianAssignedToTicket(technicianId, ticketId);

      // Assert
      expect(result).toBe(false);
    });
  });

  // ==========================================================
  // 5. PRUEBA ELEGIDA: OBTENER TICKETS POR CLIENTE (getTicketsByClientId)
  // ==========================================================
  describe('getTicketsByClientId', () => {
    const clientId = 5;

    it('should return a list of tickets filtered by the client ID', async () => {
      // Act
      await service.getTicketsByClientId(clientId);

      // Assert
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        where: { client: { id: clientId } }, 
        relations: ['category', 'assignedTechnicians'],
      });
    });
    
    it('should return an empty array if no tickets are found for the client', async () => {
      // Arrange
      mockTicketRepository.find.mockResolvedValue([]);
      
      // Act
      const result = await service.getTicketsByClientId(99);

      // Assert
      expect(result).toEqual([]);
    });
  });
});