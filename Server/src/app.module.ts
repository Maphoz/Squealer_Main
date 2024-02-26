import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { BasicusersModule } from './basicusers/basicusers.module';
import { SmmModule } from './smm/smm.module';
import { SquealerModeratorModule } from './squealer_moderator/squealer_moderator.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SquealsModule } from './squeals/squeals.module';
import { ChannelModule } from './channel/channel.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import {  ActivePath, ActiveReactFiles, conoModPathHTMLlogin, ConoPathModImages, conoPathLandingPage, pathVueFiles, landing_pageHTML, ModPath, pathVueFilesServer } from './const';
import { RandomModule } from './randomModule';
import { MessagesModule } from './messages/messages.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: landing_pageHTML,
      serveRoot: '/',
      exclude: ['/graphql', '/graphql/playground', '/uploads', '/squealUploads', '/channelUploads', '/smmUploads', '/app', '/mod'],
    }
    ),

    ServeStaticModule.forRoot({
      rootPath: `${ActivePath}/users/uploads/`,
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: `${ActivePath}/squeals/uploads/`,
      serveRoot: '/squealUploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: `${ActivePath}/channel/uploads/`,
      serveRoot: '/channelUploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: `${ActivePath}/smm/uploads/`,
      serveRoot: '/smmUploads',
    }),

    ServeStaticModule.forRoot({
      rootPath: ModPath,
      serveRoot: '/mod',
      exclude: ['/graphql', '/graphql/playground', '/uploads', '/squealUploads', '/channelUploads', '/smmUploads', '/app', '/'],

    }),
    
    ServeStaticModule.forRoot({
      rootPath: ActiveReactFiles,
      serveRoot: '/app',
      exclude: ['/graphql', '/graphql/playground', '/uploads', '/squealUploads', '/channelUploads', '/smmUploads', '/mod', '/'],
     
    }),
    ServeStaticModule.forRoot({
      rootPath: pathVueFilesServer,
      serveRoot: '/smm',
      exclude: ['/graphql', '/graphql/playground', '/uploads', '/squealUploads', '/channelUploads', '/smmUploads'],
      renderPath: '*',

    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:true,
      context: ({ req, res}) => ({ req, res}),
      csrfPrevention: false
    }),
    MongooseModule.forRoot('mongodb://localhost:27017'),
    /*
  dbName: 'squealer44',
  auth: {
    username: 'site222344',
    password: 'Heeg5eiV',
  },
}),*/
    AuthModule,
    BasicusersModule,
    UsersModule,
    SmmModule,
    SquealerModeratorModule,
    FriendsModule,
    SquealsModule,
    ChannelModule,
    NotificationsModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('mod/utenti', 'mod/canaliUfficiali', 'mod/canaliUtente', 'mod/canaliTemporanei', 'mod/creaCanale', 'mod/pubblica', 'mod/squeals', 'mod/analisi')
  }
}
