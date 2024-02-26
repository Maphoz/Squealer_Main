import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BasicUser } from 'src/basicusers/model/basic-user.model';

@Schema()
export class Comment extends Document {
  @Prop({ required: true})
  text: string;


    @Prop()
    user: BasicUser;
    
    @Prop({type: Date, nullable: true})
    date?: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment);