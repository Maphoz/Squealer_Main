import { ObjectType, Field, Int, Float } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Channel } from "src/channel/models/channel.model";
import { User } from "src/users/models/user.model";
import { UserUnion } from "src/users/user-union";
import { Notification } from "../notification.model";
import { NotificationDocument } from "../notification.schema";


@ObjectType()
export class NotificationFeed{
  @Field(type => [Notification], {nullable: true})
  relationalNotifications: NotificationDocument[];

  @Field(type => [Notification], {nullable: true})
  interactiveNotifications: NotificationDocument[];
}