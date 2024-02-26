import { ObjectType, Field, Float } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";

@ObjectType()
export class Location {
    @Field( () => Float)
    longitude: GLfloat;
  
    @Field(() => Float)
    latitude: GLfloat;
}
