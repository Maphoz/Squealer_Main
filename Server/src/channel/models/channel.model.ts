import { Field,  ObjectType } from "@nestjs/graphql";
import { ChannelType } from "../dto/types/channels.enum"


@ObjectType()
export class Channel {
    @Field(() => String)
    _id: string;

    @Field(() => String, {nullable: true})
    name: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => String)
    channelType: ChannelType;

    @Field(() => String, { nullable: true })
    channelImage?: string;

    @Field(() => String, { nullable: true})
    keyword?: string;

    @Field(() => [String], {nullable: true})
    owners?: string[];

    @Field(() => String)
    createdAt: string;

    @Field(() => [String], {nullable: true})
    partecipants?: string[];

    @Field(() => [String])
    squeals: string[];

    @Field(() => Date, {nullable: true})
    expireAt?: Date;

    @Field(() => Boolean)
    isBlocked: boolean;
}