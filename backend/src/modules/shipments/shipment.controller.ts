import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateShipmentDto } from './dtos/create-shipment.dto';

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentService) {}

  @Post()
  create(@Body() dto: CreateShipmentDto) {
    return this.shipmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.shipmentsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipmentsService.getById(id);
  }}