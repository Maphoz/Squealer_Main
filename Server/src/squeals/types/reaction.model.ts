import { ObjectType, Field } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";

@ObjectType()
export class Reaction {
    @Field(() => String)
    type: string;


    @Field(() => BasicUser)
    user: BasicUser;


  
}
