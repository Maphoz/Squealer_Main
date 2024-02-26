import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Reaction } from "../types/reaction.model";
import { stringify } from "querystring";
import { Comment } from "../types/comment.model";
import { Location } from "../types/geo.model";

@ObjectType()
export class Squeal {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    senderId: string;

    
    @Field(() => [String], { nullable: true })
    destinationChannels?: string[];

    @Field(() => [String], { nullable: true })
    destinationUserIds?: string[];

    @Field(() => [String], { nullable: true })
    mentionedUserIds?: string[];

    @Field(() => String, { nullable: true })
    uploadedFile?: string;

    @Field(() => String, { nullable: true })
    channelName?: string;

    @Field(() => String, { nullable: true })
    text?: string;

    @Field( () => String, {nullable: true})
    typeOfUpload?: string;

    @Field(() => Location, { nullable: true })
    geolocation?: Location;

    @Field(type => [Reaction]) 
    reactions: Reaction[];

    
    @Field(() => [Comment], { nullable: true })
    comments?: Comment[];

    @Field(() => Date, {nullable: true})
    publicationDate?: Date;

    @Field(() => Date, { nullable: true })
    publicationAnticipation?: Date;

    @Field(() => String, {nullable: true})
    keyword?: string;

    @Field(() => String, {nullable: true})
    isPublic?: string; 

    @Field(() => String, {nullable: true})
    classification?: string;

    @Field(() => Int, {nullable: true})
    views?: number;


}
