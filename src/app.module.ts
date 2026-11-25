import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalasModule } from './salas/salas.module';
import { GenerosModule } from './generos/generos.module';
import { ClientesModule } from './clientes/clientes.module';
import { PeliculasModule } from './peliculas/peliculas.module';

@Module({
  imports: [
    // Lee el archivo .env y lo deja disponible en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        // Carga todas las clases *.entity del proyecto
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // crea/actualiza tablas automáticamente (solo desarrollo)
      }),
    }),

    SalasModule,
    GenerosModule,
    ClientesModule,
    PeliculasModule,
    // Pendientes: FuncionesModule, BoletosModule
  ],
})
export class AppModule {}
