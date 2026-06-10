import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ShipmentsModule } from './modules/shipments/shipment.module';
import { UsersModule } from './modules/user/user.module';
import { configValidationSchema } from './config/Config.validation';

import appConfig from './config/App.config';
import databaseConfig from './config/Database.config';
import jwtConfig from './config/Jwt.config';

@Module({
  imports: [  
    ConfigModule.forRoot({ isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: configValidationSchema
     }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ShipmentsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
