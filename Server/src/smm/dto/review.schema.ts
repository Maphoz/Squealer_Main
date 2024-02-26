import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop()
  text: string;

  @Prop()
  senderId: string;
  
  @Prop()
  rating: number
}

export const ReviewSchema = SchemaFactory.createForClass(Review);