import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { join } from 'path';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AccessModule } from './access/access.module';
import { AuthModule } from './auth/auth.module';
import { TechnicianModule } from './technician/technician.module';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { TicketModule } from './ticket/ticket.module';
import { TickettechnicianModule } from './tickettechnician/tickettechnician.module';



// Determine if running inside Docker container
const runningInDocker = process.env.RUNNING_IN_DOCKER === 'true';

//Resolve path to external .env file
const externalEnvPath = join(__dirname, '..', '..', '.env');
@Module({
  imports: [
    //Global configuration module
    ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validationSchema: validationSchema,
    ignoreEnvFile: runningInDocker,
    envFilePath: runningInDocker ? undefined : externalEnvPath,
  }),
    DatabaseModule,
    UserModule,
    RoleModule,
    AccessModule,
    AuthModule,
    TechnicianModule,
    CategoryModule,
    ClientModule,
    TicketModule,
    TickettechnicianModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}