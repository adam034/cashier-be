import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { CategoriesModule } from './modules/categories/categories.module';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/entities/user.model';
import { Profile } from './modules/users/entities/profile.model';
import { Token } from './modules/auth/entities/token.model';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { Category } from './modules/categories/entities/category.model';
import { Item } from './modules/items/entities/item.model';
import { UploadsModule } from './modules/uploads/uploads.module';
dotenv.config();
const node = process.env.STATE;
const host = node === 'staging' ? process.env.PG_STAGING_HOST : process.env.PG_PROD_HOST;
const username = node === 'staging' ? process.env.PG_STAGING_USERNAME : process.env.PG_PROD_USERNAME;
const password = node === 'staging' ? process.env.PG_STAGING_PASSWORD : process.env.PG_PROD_PASSWORD;
const port = node === 'staging' ? parseInt(process.env.PG_STAGING_PORT) : parseInt(process.env.PG_PROD_PORT);
const database = node === 'staging' ? process.env.PG_STAGING_DATABASE : process.env.PG_STAGING_DATABASE;
console.log(join(__dirname, '..', 'uploads/profile'))
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      models:[User,Profile,Token,Category,Item]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/profile'),
      serveRoot:'/profile'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/category'),
      serveRoot:'/category'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/item'),
      serveRoot:'/item'
    }),
    AuthModule, 
    UsersModule, 
    ItemsModule, 
    CategoriesModule, UploadsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      {
        path: `${process.env.BASE_PATH}/auth/login`,
        method: RequestMethod.POST
      },
      {
        path: `${process.env.BASE_PATH}/auth/refreshtoken`,
        method: RequestMethod.POST
      },
      {
        path: `${process.env.BASE_PATH}/user/detail/:id`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/user/list`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/categories`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/categories/:id`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/items/:id`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/items`,
        method: RequestMethod.GET
      },
      {
        path: `${process.env.BASE_PATH}/uploads/profile`,
        method: RequestMethod.POST
      }
    ).forRoutes(
      {
        path: `/**`,
        method: RequestMethod.ALL,
      }
    )
  }
}
