import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {

                const host = configService.get<string>('POSTGRES_HOST');
                const port = configService.get<number>('POSTGRES_PORT');
                const username = configService.get<string>('POSTGRES_USER');
                const password = configService.get<string>('POSTGRES_PASSWORD');
                const database = configService.get<string>('POSTGRES_DB');

                if (!host || !port || !username || !password || !database) {
                    throw new Error(
                        `❌ Missing database environment variables.
            Host: ${host}
            Port: ${port}
            User: ${username}
            Password: ${password}
            DB: ${database}`
                    );
                }

                return {
                    type: 'postgres',
                    host,
                    port,
                    username,
                    password,
                    database,
                    autoLoadEntities: true,
                    synchronize: true, // SOLO DEV
                    logging: ['error'],
                };
            },
        }),
    ],
})
export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger(DatabaseModule.name);

    constructor(@InjectDataSource() private dataSource: DataSource) { }

    async onModuleInit() {
        try {
            await this.dataSource.query('SELECT 1');
            this.logger.log('✔️ Database connection established successfully.');
        } catch (err) {
            this.logger.error('❌ Database connection failed:', err?.message ?? err);
            throw err;
        }
    }
}
