import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { BasicUserDocument } from 'src/basicusers/model/basic-user.schema';
import { User } from 'src/users/models/user.model';
import { Reaction } from '../types/reaction.model';
import { Comment } from '../types/comment.model';
import { Location } from '../types/geo.model';


export type SquealDocument = Squeal & Document;

@Schema()
export class Squeal {

  @Prop({ required: true })
  senderId: string;


  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  destinationChannels?: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  destinationUserIds?: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], default: [] })
  mentionedUserIds?: string[];

  @Prop()
  uploadedFile?: string;

  @Prop()
  typeOfUpload?: string;

  @Prop()
  geolocation?: Location;

  @Prop()
  text?: string;

  @Prop({nullable: true})
  views?: number;

  @Prop({nullable: true})
  channelName?: string;

  @Prop()
  reactions: Reaction[];

  @Prop()
  comments: Comment[]; // array di commenti

  @Prop({ type: Date, nullable: true})
  publicationDate?: Date;

  @Prop({ type: Date, nullable: true})
  publicationAnticipation?: Date;

  @Prop({nullable: true})
  keyword?: string;
  
  @Prop({nullable: true})
  isPublic?: string;

  @Prop({nullable: true})
  classification?: string;
}

export const SquealSchema = SchemaFactory.createForClass(Squeal)
