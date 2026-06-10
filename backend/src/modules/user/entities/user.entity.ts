import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;
@Schema({
    timestamps: true,
    versionKey: false,
})
export class User{
    @Prop({
        required: true,
        unique:true,
        lowercase:true,
        trim:true
    })
    email:string;
    @Prop({required: true, select:false})
    password:string

    @Prop({ select: false})
    refreshToken:string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({email:1})