import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

/*
    Crea un nuovo documento per Mongo
*/

@ObjectType()
export class SingleMessage{
    @Field(() => Date)
    date: Date

    @Field()
    text: string;

    @Field()
    senderId: string;
}
