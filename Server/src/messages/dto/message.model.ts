import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { SingleMessage } from "./singleMessage.model";

/*
    Crea un nuovo documento per Mongo
*/

@ObjectType()
export class Message{
    @Field()
    _id: string
    
    //indica se la notifica è stata generata da un utente o da un canale
    @Field()
    smmId: string

    @Field()
    clientId: string

    @Field(() => [SingleMessage])
    texts: SingleMessage[]
}
