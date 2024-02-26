import { ObjectType, Field } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";

@ObjectType()
export class Comment {
    @Field(() => String)
    text: string;

    @Field(() => BasicUser)
    user: BasicUser;

    @Field( ( ) => Date, {nullable: true})
    date?: Date
}
