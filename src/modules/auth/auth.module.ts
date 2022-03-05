import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.model';
import { Token } from './entities/token.model';
import { Profile } from '../users/entities/profile.model';

@Module({
  imports:[SequelizeModule.forFeature([User,Token,Profile])],
  exports:[SequelizeModule,AuthService],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
