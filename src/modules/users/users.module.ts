import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './entities/profile.model';
import { User } from './entities/user.model';

@Module({
  imports:[SequelizeModule.forFeature([User,Profile])],
  exports:[SequelizeModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
