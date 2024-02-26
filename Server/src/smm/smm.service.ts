import { Inject, Injectable, InternalServerErrorException, forwardRef} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SmmUserDocument } from './model/smm.schema';
import { CreateSMMInput } from './dto/SMMInput';
import { FileUpload} from 'graphql-upload';
import { UserDocument } from 'src/users/models/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ActivePath } from 'src/const';
import { createWriteStream } from 'fs';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { SQUEAL_CLASSIFICATION } from 'src/squeals/types/squeal.classification';
import { ClientStats } from './dto/ClientStats.args';
import { SquealsService } from 'src/squeals/squeals.service';
import { SquealReturn } from 'src/squeals/types/squeal-return';
import { ClientActivity } from './dto/ClientActivity.args';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationFeed } from 'src/notifications/dto/NotificationFeed.args';
import { BasicusersService } from 'src/basicusers/basicusers.service';
import { Squeal } from 'src/squeals/model/squeal.model';
import { SquealDocument } from 'src/squeals/model/squeal.schema';
import { PotentialReceivers } from 'src/users/dto/args/PotentialReceivers.args';
import { CreateSquealInput } from 'src/squeals/dto/squealInput';
import { Review } from './dto/review.model';
import { UpdateSmm } from './dto/UpdateSmm.args';
import { SmmProfile } from './dto/SmmProfile.args';
import { NewReview } from './dto/NewReview.args';
import { MonthSqueals } from 'src/squeals/dto/MonthSqueals';


@Injectable()
export class SmmService {
    private positiveReactions = ["laugh", "agree", "emotional", "like"];
    constructor(
        @InjectModel('SMMUser') private readonly smmUserModel: Model<SmmUserDocument>,
        @Inject(forwardRef( () => UsersService)) private readonly userService: UsersService,
        @Inject(forwardRef( () => SquealsService)) private readonly squealService: SquealsService,
        @Inject(forwardRef( () => NotificationsService)) private readonly notificationService: NotificationsService,
        @Inject(forwardRef( () => BasicusersService)) private readonly basicUserService: BasicusersService,

    ) { }
    
  async createSmm(userInfo: CreateSMMInput, file: FileUpload) : Promise<SmmUserDocument>{
    try{
    var existingUser = await this.smmUserModel.find({email: userInfo.email})
    if(existingUser.length > 0){
        throw new Error("Email già utilizzata.");
    }

    existingUser = await this.smmUserModel.find({username: userInfo.username})
    if(existingUser.length > 0){
        throw new Error("Username già in uso.")
    }

    const { createReadStream, filename } = await file;

    const filePath = `${ActivePath}/smm/uploads/${filename}`;
    await createReadStream()
        .pipe(createWriteStream(filePath));

    const createdDocument = await new this.smmUserModel({
        ...userInfo,
        _id: new Types.ObjectId(),
        password: await bcrypt.hash(userInfo.password, 14),
        assistedList: [],
        isBlocked: false,
        profileImage: 'https://site222344.tw.cs.unibo.it/smmUploads/' + filename,
        rating: 0.0,
        reviews: [],
        income: 0.0
    })

    if (!createdDocument) {
        throw new InternalServerErrorException('Could not create user');
    }

    await createdDocument.save();
    return createdDocument;
  } catch(error){
    console.log(error);
  }
  }

  async getClients(smmId: string) : Promise<BasicUser[]>{
    try{
    const smm = await this.userService.getUserById(smmId);
    if(!smm || smm.typeOfUser !== 'SMM') throw new Error("SMM non trovato.");

    var clients = [];

    for(var client of smm.assistedList){
        var clientDocument = await this.userService.getUserById(client);
        if(clientDocument !== null) clients.push(clientDocument);
    }
    
    return clients;
  } catch(error){
    console.log(error);
  }
  }

  async getClientStats(smmId: string, clientId: string) : Promise<ClientStats>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Utente non trovato!");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    const totalPosts = client.squeals.length;
    var totalPositive = 0;
    var totalNegative = 0;
    var totalComments = 0;
    var totalViews = 0;

    var populars = 0;
    var impopulars = 0;
    var controverse = 0;
    var regular = 0;
    for(let i = 0; i < client.squeals.length; i++){
        const squeal = await this.squealService.getSquealById(client.squeals[i]);
        if(!squeal) continue;
        squeal.reactions.forEach(reaction => {
            if (this.positiveReactions.includes(reaction.type)) {
                totalPositive++;
            } else {
                totalNegative++;
            }
        });
        totalComments += squeal.comments.length;
        totalViews += squeal.views;
        if (squeal.classification == SQUEAL_CLASSIFICATION.POPOLARE) populars++;
        else if (squeal.classification == SQUEAL_CLASSIFICATION.IMPOPOLARE) impopulars++;
        else if (squeal.classification == SQUEAL_CLASSIFICATION.CONTROVERSO) controverse++;
        else regular++;
    }

    return{
        totalPosts: totalPosts,
        totalComments: totalComments,
        totalNegative: totalNegative,
        totalPositive: totalPositive,
        totalViews: totalViews,
        populars: populars,
        impopulars: impopulars,
        controverse: controverse,
        regular: regular,
        client: client
    }
  } catch(error){
    console.log(error);
  }
  }

  async getClient(smmId: string, clientId: string) : Promise<BasicUser>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return client;
    } catch(error){
      console.log(error);
    }
  }

  async addCharsClient(smmId: string, clientId: string, chars: number, period: string) : Promise<BasicUser> {
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return await this.basicUserService.addCharacters(clientId, chars, period);
    } catch(error){
      console.log(error);
    }
  }

  async getClientSqueals(smmId: string, clientId: string) : Promise<ClientActivity>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    const squeals = await this.squealService.getNonPrivateSqueals(clientId);

    return{
        squeals: squeals.reverse(),
        client: client
    }
  } catch(error){
    console.log(error);
  }
  }
    async acceptFriendRequest(smmId: string, notificationId: string, clientId: string){
      try{
        const client = await this.userService.getUserById(clientId);
        if(!client) throw new Error("Cliente non trovato.");
        if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

        return await this.notificationService.acceptFriendRequest(clientId, notificationId);
      } catch(error){
        console.log(error);
      }

    }
    async refuseFriendRequest(smmId: string, notificationId: string, clientId: string){
      try{
        const client = await this.userService.getUserById(clientId);
        if(!client) throw new Error("Cliente non trovato.");
        if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

        return await this.notificationService.refuseFriendRequest(clientId, notificationId);
      } catch(error){
        console.log(error);
      }
    }
    async acceptChannelRequest(smmId: string, notificationId: string, clientId: string){
      try{
        const client = await this.userService.getUserById(clientId);
        if(!client) throw new Error("Cliente non trovato.");
        if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

        return await this.notificationService.acceptChannelRequest(clientId, notificationId);
      } catch(error){
        console.log(error);
      }

    }
    async refuseChannelRequest(smmId: string, notificationId: string, clientId: string){
      try{
        const client = await this.userService.getUserById(clientId);
        if(!client) throw new Error("Cliente non trovato.");
        if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

        return await this.notificationService.refuseChannelRequest(clientId, notificationId);
      } catch(error){
        console.log(error);
      }
    }

  async getClientNotifications(smmId: string, clientId: string) : Promise<NotificationFeed>{
    try{

    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return await this.notificationService.getNotifications(clientId);
  } catch(error){
    console.log(error);
  }
  }

  async getClientReceivers(smmId: string, clientId: string) : Promise<PotentialReceivers>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return await this.userService.getReceivers(clientId);
    } catch(error){
      console.log(error);
    }
  }


  async deleteClientSqueal(smmId: string, squealId: string, clientId: string) : Promise<SquealDocument[]>{
    try{
    const smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Non sei un manager!");

    await this.squealService.deleteSqueal(squealId);
    return await this.squealService.getNonPrivateSqueals(clientId);
    } catch(error){
        console.error('Error saving changes:', error);
        throw new InternalServerErrorException('Error saving changes');
    }
  }

  async createClientSqueal(squealInput: CreateSquealInput, smmId: string, file, clientId: string): Promise<boolean> {
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return await this.squealService.createSqueal(squealInput, clientId, file);
    } catch(error){
      console.log(error);
    }
  }

  async createTemporizedClientSqueal(smmId: string, squealInput: CreateSquealInput, file, clientId: string) : Promise<boolean>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Cliente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo utente!");

    return await this.squealService.publicateTemporizedSqueals(squealInput, clientId, file);
    } catch(error){
      console.log(error);
    }
  }



  /**
   * REVIEW FUNCTIONS
   */

  async addReview(clientId: string, smmId: string, reviewInfo: NewReview) : Promise<Review[]>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Utente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei cliente di questo manager!");

    const smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Manager non trovato.");
    
    var newRating = (smm.rating * smm.reviews.length + reviewInfo.rating) / (smm.reviews.length + 1);
    smm.reviews.push({
      ...reviewInfo,
      senderId: clientId
    });
    smm.rating = newRating;

    await smm.save();
    await this.notificationService.createReviewNotification({
      senderId: clientId,
      senderName: client.username,
      receiversId: [smmId],
      senderType: 'user',
      notificationType: null
    })
    return smm.reviews;
  } catch(error){
    console.log(error);
  }
  }

  async deleteReview(clientId: string, smmId: string) : Promise<Review[]>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Utente non trovato.");
    const smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Manager non trovato.");

    smm.reviews = smm.reviews.filter((review) => review.senderId !== clientId);

    // Save the updated smm document
    await smm.save();

    // Return the updated reviews array
    return smm.reviews;
    } catch(error){
      console.log(error);
    }
  }


  /**
   * Profile functions
   */
  async getSmmProfile(smmId: string) : Promise<SmmProfile>{
    try{
    const smm = await this.userService.getUserById(smmId);
    if(!smm) throw new Error("Manager non trovato.");

    var userReviews = [];
    for (const review of smm.reviews){
      var user = await this.userService.getUserById(review.senderId);
      if(user) userReviews.push(user);
    }

    return({
      smm: smm,
      reviewers: userReviews
    });
  } catch(error){
    console.log(error);
  }
  }

  async getSmmClient(clientId: string, smmId: string) : Promise<SmmUserDocument>{
    try{
    const smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Manager non trovato.");

    if(smm.assistedList.indexOf(clientId) < 0) throw new Error("Non sei cliente di questo manager.")

    return smm;
    } catch(error){
      console.log(error);
    }
  }

  async deleteSmm(smmId: string) : Promise<boolean>{
    try{
    const smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Manager non trovato.");

    await this.basicUserService.removeSmmFromVips(smmId);
    await smm.deleteOne();
    return true;
    } catch(error){
      console.log(error);
    }
  }

  async reduceClientChars(smmId: string, clientId: string, chars: number) : Promise<boolean>{
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Utente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo client!");

    return await this.basicUserService.decresePurchasable(clientId, chars);
    } catch(error){
      console.log(error);
    }
  }

  async updateProfile(smmId: string, updateInfo: UpdateSmm, file: FileUpload) :Promise<SmmUserDocument>{
    try{
    var smm = await this.smmUserModel.findOne({_id: smmId});
    if(!smm) throw new Error("Manager non trovato.");

    const { price, bio, username, email} = updateInfo;

    if(price) smm.price = price;
    if(bio) smm.bio = bio;
    if(username) smm.username = username;
    if(email) smm.email = email;

    await smm.save();

    if(file)  return await this.updateImage(smmId, file);
    else return smm;
    } catch(error){
      console.log(error);
    }
  }

  async updateImage(smmId: string, file: FileUpload) : Promise<SmmUserDocument>{
    try{
    const { createReadStream, filename } = await file;

    const filePath = `${ActivePath}/smm/uploads/${filename}`;
    await createReadStream()
        .pipe(createWriteStream(filePath));

    var smm = await this.smmUserModel.findOne({_id: smmId});
    smm.profileImage = 'https://site222344.tw.cs.unibo.it/smmUploads/' + filename;
    await smm.save();
    return smm;
    } catch(error){
      console.log(error);
    }
  }

  async getClientMonthData(smmId: string, clientId: string) : Promise<MonthSqueals> {
    try{
    const client = await this.userService.getUserById(clientId);
    if(!client) throw new Error("Utente non trovato.");
    if(client.social_media_manager_id !== smmId) throw new Error("Non sei manager di questo cliente!");

    return await this.squealService.getSquealsMonthData(clientId);
    } catch(error){
      console.log(error);
    }
  }

  async getSmms(): Promise<SmmUserDocument[]> {
    try{
    return await this.smmUserModel.find().sort({ rating: -1 });
    } catch(error){
      console.log(error);
    }
    
  }

  async removeClient(smmId: string, vipId: string) : Promise<BasicUser[]> {
    await this.basicUserService.removeSmmFromVip(vipId, smmId);
    return await this.getClients(smmId);
  }
}
