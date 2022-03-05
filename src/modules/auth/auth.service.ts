import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.model';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Token } from './entities/token.model';
import { ChangePassword } from './dto/change-password.dto';
import { RefreshToken } from './dto/token.dto';
import { Profile } from '../users/entities/profile.model';
@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User) private userModel: typeof User,
      @InjectModel(Token) private tokenModel: typeof Token,
      @InjectModel(Profile) private profileModel: typeof Profile
  ){}

  async login(createAuthDto: CreateAuthDto){

      if (!createAuthDto.username || !createAuthDto.password || createAuthDto.username === "" || createAuthDto.password === "") {
        throw new HttpException({
            success: false,
            message: 'field username or password cant be empty',
            data: null
        }, HttpStatus.BAD_REQUEST)
      }
      const user = await this.userModel.findOne({
          attributes:['ID','USERNAME','PASSWORD','ROLE','IS_ACTIVE'],
          where: {
              USERNAME: createAuthDto.username
          }
      })
      const { ID, USERNAME, PASSWORD, ROLE, IS_ACTIVE } = user
      if (!user) {
        throw new HttpException({
            success: false,
            message: 'user not found',
            data: null
        }, HttpStatus.BAD_REQUEST)
      }
      const comparePassword = bcrypt.compareSync(createAuthDto.password,PASSWORD);
      if (!comparePassword) {
        throw new HttpException({
            success: false,
            message: 'password not match',
            data: null
        }, HttpStatus.BAD_REQUEST)
      }
      if (IS_ACTIVE === false) {
        throw new HttpException({
            success: false,
            message: 'user inactive',
            data: null
        }, HttpStatus.BAD_REQUEST)
      }
      let token = await this.generateToken({id: ID});
      let isToken = await this.tokenModel.findOne({ where: { USER_ID: ID }});

      if (!isToken) {
        await this.tokenModel.create({ USER_ID: ID,TOKEN: token});
      }

      await this.tokenModel.update({ TOKEN: token },{ where: { USER_ID: ID }});

      return {
          success: true,
          message: 'successfully login',
          token: token
      }

  }
  async changePassword(changePassword: ChangePassword,id: number){
    if(!changePassword.new_password || !changePassword.old_password || changePassword.new_password === "" || changePassword.old_password === "") {
        throw new HttpException({
            success: false,
            message: 'field new password or old password cant be empty',
            data: null
        }, HttpStatus.BAD_REQUEST)
    }
    const oldPassword = await this.userModel.findOne({ where: { ID: id }});
    const { PASSWORD } = oldPassword;
    const isMatch = bcrypt.compareSync(changePassword.old_password,PASSWORD);
    if (!isMatch) {
        throw new HttpException({
            success: false,
            message: 'old password not match',
            data: null
        }, HttpStatus.BAD_REQUEST)
    }
    if (changePassword.new_password.length < 6) {
        throw new HttpException({
            success: false,
            message: 'new password must be at least 6 characters.',
            data: null
        }, HttpStatus.BAD_REQUEST)
    }
    await this.userModel.update({
        PASSWORD: bcrypt.hashSync(changePassword.new_password,10)
    },{
        where: {
            ID: id
        }
    })
    return {
        success: true,
        message: 'successfully change password'
    }
  }
  async refreshToken(refreshToken: RefreshToken){
    if (!refreshToken.token || refreshToken.token === "") {
        throw new HttpException({
            success: false,
            message: 'field token cant be empty',
            data: null
        }, HttpStatus.BAD_REQUEST)
    }
    const oldToken = await this.tokenModel.findOne({ where: { TOKEN: refreshToken.token }});
    if (!oldToken) {
        throw new HttpException({
            success: false,
            message: 'token not found',
            data: null
        }, HttpStatus.BAD_REQUEST)
    }
    const newToken = await this.generateToken({ id: oldToken.USER_ID });
    await this.tokenModel.update({ TOKEN: newToken },{ where: { USER_ID: oldToken.USER_ID }})
    return {
        success: true,
        message: 'successfully refresh token',
        token: newToken
    }
  }

  async verifyUser(token:any){
    const verify = jwt.verify(token,process.env.SECRET_KEY);
    const user = await this.userModel.findOne({ 
        attributes: { 
          exclude: ['PASSWORD']
        },
        where: { ID: verify.id },
        include: [
          {
            attributes: {
                exclude:['USERS_ID']
            },
            model: Profile,
            as: 'profile',
          }
        ]
    })
    return user
  }

  private async generateToken(payload:any){
    return jwt.sign(payload,process.env.SECRET_KEY,{ expiresIn: '7d'})
  }
}
