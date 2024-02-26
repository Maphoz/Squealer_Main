import { BasicUser } from "src/basicusers/model/basic-user.model";
import { SMMUser } from "src/smm/model/smm.model";
import { SquealerUser } from "src/squealer_moderator/model/squealer-moderator.model";
import { createUnionType } from "@nestjs/graphql";


export const UserUnion = createUnionType({
  name: "UserUnion", // the name of the GraphQL union
  types: () => [BasicUser,  SMMUser, SquealerUser], // function that returns the union types
  resolveType: value => {
    if (value.typeOfUser === 'USER_NORMALE' || value.typeOfUser === 'VIP') {
      return BasicUser; // return the type of the object
    }
    if (value.typeOfUser === 'SMM') {
      return SMMUser;
    }
    if (value.typeOfUser === 'SQUEALER') {
      return SquealerUser;
    }
    return undefined;
  },
});