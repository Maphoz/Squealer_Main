import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location extends Document {
  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Number, required: true })
  latitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
