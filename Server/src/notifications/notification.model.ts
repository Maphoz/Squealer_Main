import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { NotificationType } from "./dto/notification.enum";

/*
    Crea un nuovo documento per Mongo
*/

@ObjectType()
export class Notification{
    @Field()
    _id: string
    
    //indica se la notifica è stata generata da un utente o da un canale
    @Field()
    senderType: string

    @Field()
    senderName: string

    @Field({nullable: true})
    channelReceiverId?: string

    //tipo di notifica, utile per il frontend per come rappresentare
    @Field()
    notificationType: NotificationType

    @Field()
    active: boolean

    @Field()
    senderId: string

    @Field(() => [String])
    receiversId: string[]

    @Field()
    notificationText: string

    @Field(() => Date)
    createdAt: Date

    @Field(() => String, {nullable: true})
    squealId?: string
}
