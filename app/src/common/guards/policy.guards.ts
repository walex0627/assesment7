import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TicketService } from 'src/ticket/ticket.service'; 
import { TechnicianService } from 'src/technician/technician.service'; 

/**
 * PolicyGuard
 *
 * This Guard implements the central authorization logic for the entire application, 
 * centralizing both static role checks and dynamic resource access policies (RBAC + ABAC).
 *
 * It works under the assumption that JwtAuthGuard has already populated request.user 
 * with { id, role, clientId } data.
 */
@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly ticketService: TicketService,
        private readonly technicianService: TechnicianService,
    ) {}

    /**
     * Entry point for the Guard. Executes the authorization flow.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        // 1. Check for Public Access (@Public() decorator)
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) return true;

        const user = request.user;
        if (!user) {
            throw new ForbiddenException('Authentication is required to access this resource.');
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        
        // 2. Route the request to the correct authorization policy
        return this.handleAuthorization(request, user, requiredRoles);
    }

    /**
     * Determines authorization based on role, URL, and resource ownership/assignment.
     */
    private async handleAuthorization(request: any, user: any, requiredRoles: string[]): Promise<boolean> {
        const { role: userRole, id: userId, clientId } = user;
        const method = request.method;
        const url = request.url;
        const ticketId = parseInt(request.params.id || request.params.ticketId);
        
        // --- A. STATIC ROLE CHECK (@Roles() decorator) ---
        if (requiredRoles && requiredRoles.length > 0) {
            // Note: The role comparison should ideally be case-insensitive here if roles can vary in casing.
            if (requiredRoles.includes(userRole)) {
                return true; 
            }
            throw new ForbiddenException(`Role '${userRole}' does not have static access to this resource.`);
        }
        
        // --- B. DYNAMIC TICKET POLICY CHECK ---
        
        // 1. Administrator: Full access to all dynamic routes
        if (userRole === 'Administrator') return true;

        // 2. Policy for Ticket Creation (POST /tickets)
        if (method === 'POST' && url === '/tickets') {
            // This is normally handled by @Roles('Client'), but checked here as a fallback
            if (userRole === 'Client') return true;
            throw new ForbiddenException('Only clients are authorized to create new tickets.');
        }

        // 3. Policy for specific Ticket operations (GET/PATCH /tickets/:id)
        if (url.startsWith('/tickets/') && !isNaN(ticketId)) {
            
            // a) Ticket Status Change (PATCH /tickets/:id/status)
            if (method === 'PATCH' && url.includes('/status')) {
                if (userRole === 'Technician') {
                    return this.validateTechnicianAssignment(userId, ticketId);
                }
                // Only Admin/Technician can update status
                throw new ForbiddenException('Only assigned Technicians can update ticket status.');
            }

            // b) Ticket Read Access (GET /tickets/:id)
            if (method === 'GET') {
                if (userRole === 'Client') {
                    return this.validateClientOwnership(userId, ticketId);
                }
                if (userRole === 'Technician') {
                    return this.validateTechnicianAssignment(userId, ticketId);
                }
            }
        }
        
        // 4. Policy for Historial/List views
        
        // a) GET /tickets/client/:id (Client History)
        if (url.includes('/tickets/client/')) {
            const clientIdParam = parseInt(request.params.id);
            
            // Client can only view their own history (match the ID from the URL with user.clientId)
            if (userRole === 'Client' && clientId === clientIdParam) {
                return true; 
            }
            throw new ForbiddenException('Access denied to view this ticket history.');
        }
        
        // b) GET /tickets/technician/:id (Technician List)
        if (url.includes('/tickets/technician/')) {
            const technicianIdParam = parseInt(request.params.id);
            
            // 🔑 CORRECTION: Get Technician entity by USER ID and match its PK (id) with the URL parameter (technicianIdParam)
            if (userRole === 'Technician') {
                // Assuming technicianService has a method to map userId to Technician entity
                const technician = await this.technicianService.getTechnicianById(userId); 
                
                if (technician?.id === technicianIdParam) {
                    return true;
                }
                throw new ForbiddenException('Technicians can only view their own assigned ticket list.');
            }
        }

        // Default Denial: If no specific policy or role grants access.
        throw new ForbiddenException('Access denied: Policy requirements not met for this endpoint.');
    }
    
    // --- Dynamic Validation Methods ---

    /**
     * Validates that the authenticated User (Client) is the owner of the given ticket.
     * Requires ticket entity to eagerly load the client and the client's user relation.
     */
    private async validateClientOwnership(userId: number, ticketId: number): Promise<boolean> {
        try {
            // Get the ticket; ensures ticket exists (handles 404 via service)
            const ticket = await this.ticketService.getTicketById(ticketId); 
            
            // Check if the ticket's client is linked to the authenticated user ID
            if (ticket.client.user.id !== userId) {
                throw new ForbiddenException('Client does not own this ticket.');
            }
            return true;
        } catch (e) {
             if (e instanceof NotFoundException) {
                 throw e; // Relaunch 404 if resource wasn't found
             }
             throw new ForbiddenException('Access denied due to ownership policy failure.');
        }
    }

    /**
     * Validates that the authenticated User (Technician) is currently assigned to the given ticket.
     * This ensures only assigned technicians can modify/read the resource.
     */
    private async validateTechnicianAssignment(userId: number, ticketId: number): Promise<boolean> {
        // 1. Get Technician ID from User ID (We need the Technician entity's PK)
        // 🔑 Assuming technicianService has getTechnicianByUserId(userId)
        const technician = await this.technicianService.getTechnicianById(userId); 
        
        if (!technician) {
            throw new ForbiddenException('Technician profile not found for this user.');
        }

        // 2. Verify assignment status using the specialized service method
        const isAssigned = await this.ticketService.isTechnicianAssignedToTicket(technician.id, ticketId); 
        
        if (!isAssigned) {
            throw new ForbiddenException('Technician is not assigned to this ticket.');
        }
        return true;
    }
}