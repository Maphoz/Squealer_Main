import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument} from "src/users/models/user.schema";


export class SquealerUserDocument extends UserDocument{
    @Prop()
    channels: string[]

    @Prop()
    squeals: string[]
}

export const SquealerUserSchema = SchemaFactory.createForClass(SquealerUserDocument).add({
    channels: [String],
    squeals: [String],
});
