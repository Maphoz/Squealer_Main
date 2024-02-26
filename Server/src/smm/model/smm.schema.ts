import { Field, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument} from "src/users/models/user.schema";
import { Review } from "../dto/review.model";

@Schema({versionKey: false})
export class SmmUserDocument extends UserDocument{
    @Prop()
    assistedList: string[];

    @Prop()
    isBlocked: boolean

    @Prop({nullable: true})
    profileImage?: string; 

    @Prop({nullable: true})
    bio?: string;

    @Prop(() => Float)
    price: number;

    @Prop(() => Float)
    rating: number;

    @Prop()
    reviews: Review[];

    @Prop(() => Float)
    income: number;
}

export const SmmUserSchema = SchemaFactory.createForClass(SmmUserDocument);
