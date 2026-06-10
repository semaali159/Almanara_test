import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ShipmentDocument = Shipment & Document;
@Schema({
    timestamps: true,
    versionKey: false,
})
export class Shipment{
    @Prop({
        required: true,
        unique:true,
    })
    number:number;
    @Prop({
        required: true
    })
    orderId:string
    @Prop({
        required: false
    })
    weight:number
    @Prop({
        default: true
    })
    isAvailable:boolean
}


export const ShipmentSchema = SchemaFactory.createForClass(Shipment)
ShipmentSchema.index({number:1})
ShipmentSchema.index({orderId:1})