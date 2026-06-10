import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './entities/shipment.entity';
import { ShipmentsController } from './shipment.controller';
import { ShipmentService } from './shipment.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipment.name, schema: ShipmentSchema },
    ]),
    AuthModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentService],
})
export class ShipmentsModule {}
