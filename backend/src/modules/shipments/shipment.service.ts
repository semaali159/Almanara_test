import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { Shipment, ShipmentDocument } from "./entities/shipment.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateShipmentDto } from "./dtos/create-shipment.dto";

@Injectable()
export class ShipmentService{
constructor(
          @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
){}
async create(dto: CreateShipmentDto):Promise<Shipment>{
    const last = await this.shipmentModel.findOne().sort({number:-1})
    const nextNumber = last ? last.number + 1 : 1;
    const shipment = await this.shipmentModel.create({
      ...dto,
      number: nextNumber,
    });
    return shipment;
}
async getById(shipmentId: string): Promise<Shipment>{
    const shipment = await this.shipmentModel.findById(shipmentId).exec()
    if(!shipment) throw new NotFoundException("shipment not found")
        return shipment
}
async getAll(): Promise<Shipment[]>{
    return this.shipmentModel.find().exec();

}
}