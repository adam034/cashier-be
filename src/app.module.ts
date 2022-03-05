import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/entities/user.model';
import { Profile } from './modules/users/entities/profile.model';
import { Token } from './modules/auth/entities/token.model';
import { AuthMiddleware } from './middlewares/auth.middleware';
dotenv.config();
const node = process.env.STATE;
const host = node === 'staging' ? process.env.PG_STAGING_HOST : process.env.PG_PROD_HOST;
const username = node === 'staging' ? process.env.PG_STAGING_USERNAME : process.env.PG_PROD_USERNAME;
const password = node === 'staging' ? process.env.PG_STAGING_PASSWORD : process.env.PG_PROD_PASSWORD;
const port = node === 'staging' ? parseInt(process.env.PG_STAGING_PORT) : parseInt(process.env.PG_PROD_PORT);
const database = node === 'staging' ? process.env.PG_STAGING_DATABASE : process.env.PG_STAGING_DATABASE;

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      models:[User,Profile,Token]
    }),
    AuthModule, 
    UsersModule, 
    ItemsModule, 
    OrdersModule, 
    CategoriesModule],
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
      }
    ).forRoutes(
      {
        path: `/**`,
        method: RequestMethod.ALL,
      }
    )
  }
}
