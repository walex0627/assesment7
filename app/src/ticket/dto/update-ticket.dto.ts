import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';

// PartialType makes all properties of CreateTicketDto optional.
export class UpdateTicketDto extends PartialType(CreateTicketDto) {

}