
import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { NotificationType } from 'src/notifications/dto/notification.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class FriendsService {
    constructor(
        private readonly usersService: UsersService,
        ) {}
    
        async addFriend(mainUsername: string, friendUsername: string): Promise<Boolean> {
            const mainUser = await this.usersService.getUserByUsername(mainUsername);
            const friend = await this.usersService.getUserByUsername(friendUsername);
        
            if (!mainUser || !friend) {
                throw new NotFoundException('User not found');
            }
        
            const friendExists = mainUser.friends.includes(friendUsername);
            if (friendExists) {
                throw new ConflictException('Friend already exists');
            }
        
            mainUser.friends.push(friendUsername);
            friend.friends.push(mainUsername);
        
            try {
                await mainUser.save();
                await friend.save();
                return true;
            } catch (error) {
                console.log('Error saving changes:', error);   
                
            }
        }
        

    async getUserFriends(userId: string): Promise<string[]>{
        const mainUser = await this.usersService.getUserById(userId)
        return mainUser.friends;
    }

    async getNumFriends(userId: string): Promise<number> {
        const userFriends = await this.getUserFriends(userId);
        return userFriends.length;
    }

    async deleteFriend(username: string, friendUsername: string): Promise<Boolean> {
        const mainUser = await this.usersService.getUserByUsername(username);
        const friend = await this.usersService.getUserByUsername(friendUsername);
    
        if (!mainUser || !friend) {
            throw new NotFoundException('User not found');
        }
    
        const friendExists = mainUser.friends.includes(friend.username);
        if (!friendExists) {
            throw new ConflictException('They are not friends');
        }
    
        mainUser.friends = mainUser.friends.filter(friendId => friendId !== friendUsername);
        friend.friends = friend.friends.filter(friendId => friendId !== username);
    
        try {
            await mainUser.save();
            await friend.save();
            return true;
        } catch (error) {
            console.log(error);
        }
    }
    
}
