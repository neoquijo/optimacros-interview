import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Car {
    @Prop({ default: () => new Date().getTime() })
    id: Number
    @Prop()
    manufacturer: String
    @Prop()
    model: String
    @Prop()
    price: Number
    @Prop()
    year: Number

}

export const CarSchema = SchemaFactory.createForClass(Car)

