import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.model';
import { User } from './entities/user.model';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Profile) private profileModel: typeof Profile
  ) { }

  async create(createUserDto: CreateUserDto) {

    if (!createUserDto.username || !createUserDto.password || createUserDto.username === "" || createUserDto.password === "") {
      throw new HttpException({
        success: false,
        message: 'field username or password cant be empty',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }
    const [user, created] = await this.userModel.findOrCreate({
      where: {
        USERNAME: createUserDto.username
      },
      defaults: {
        PASSWORD: bcrypt.hashSync(createUserDto.password, 10),
        ROLE: createUserDto.role,
        IS_ACTIVE: !createUserDto.is_active ? true : createUserDto.is_active
      }
    })

    if (created) {
      const profile = await this.profileModel.create({
        USERS_ID: user.ID,
        FULL_NAME: createUserDto.profile.full_name,
        ADDRESS: createUserDto.profile.address,
        PHONE: createUserDto.profile.phone,
        PHOTO: createUserDto.profile.photo
      })

      return {
        success: true,
        message: 'user created',
        data: {
          id: user.ID,
          username: user.USERNAME,
          password: user.PASSWORD,
          role: user.ROLE,
          is_active: user.IS_ACTIVE,
          profile: {
            full_name: profile.FULL_NAME,
            address: profile.ADDRESS,
            phone: profile.PHONE,
            photo: profile.PHOTO
          }
        }
      }

    }

    throw new HttpException({
      success: false,
      message: 'username already exist',
      data: null
    }, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  async findAll(pagination: string, limit: string, search: string) {

    let option = {}
    let condition = {
      where: {}
    }

    let data:any = []

    if (pagination && limit) {
      option = {
        limit: parseInt(limit),
        offset: (parseInt(pagination) - 1) * parseInt(limit)
      }
    }
    
    if (search) {
      condition.where['USERNAME'] = {
        [Op.iLike]: `%${search}%`
      }
    }
  
    const users:any = await this.userModel.findAndCountAll({
      attributes: ['ID', 'USERNAME', 'IS_ACTIVE'],
      ...condition,
      include: [
        {
          attributes: ['FULL_NAME'],
          model: Profile,
          as: 'profile'
        }
      ],
      ...option
    })

    data = users.rows.map((m:any) => {
      const { profile } = m
      return {
        id: m.ID,
        username: m.USERNAME,
        name: profile.FULL_NAME,
        is_active: m.IS_ACTIVE
      }
    })

    return {
      success: true,
      message: 'list users',
      data: data,
      meta: {
        pagination: pagination ? Number(pagination) : 0,
        limit: limit ? Number(limit) : 0,
        total_page : limit ? Math.ceil(parseInt(users.count) / Number(limit)) : 0,
        count: users.count ? parseInt(users.count) : 0
      }
    }

  }

  async findOne(id: string) {
    
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
