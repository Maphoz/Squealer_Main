import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop()
  id: string;

  @Prop({ required: true })
  type: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);