import { ObjectType, Field, Float } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";

@ObjectType()
export class Review {
    @Field(() => String)
    text: string;

    @Field(() => String)
    senderId: string;

    @Field(() => Float)
    rating: number
}
