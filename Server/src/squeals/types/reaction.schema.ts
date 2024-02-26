import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BasicUser } from 'src/basicusers/model/basic-user.model';

@Schema()
export class Reaction extends Document {
  @Prop({ required: true})
  type: string;


    @Prop()
    user: BasicUser;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);