import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.model';
import { User } from './entities/user.model';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import * as moment from 'moment';
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
      where: {
        deletedAt : {
          [Op.is] : null
        },
        ROLE : {
          [Op.ne]: 1
        }
      }
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
    let data = null
    try {
      const user = await this.userModel.findOne({
        where: {
          ID: parseInt(id),
          deletedAt: null
        },
        include: [
          {
            model: Profile,
            as: 'profile'
          }
        ]
      })

      if (user) {
        data = {
          id: user.ID,
          username: user.USERNAME,
          role: user.ROLE,
          is_active: user.IS_ACTIVE,
          profile: {
            name: user.profile.FULL_NAME,
            address: user.profile.ADDRESS,
            phone: user.profile.PHONE,
            photo: user.profile.PHOTO
          }
        }
        
        return {
          success: true,
          message: 'success get detail user',
          data: data
        }
      }
      
      return {
        success: false,
        message: 'user not found',
        data: data
      }

    } catch (error) {
      console.log(error)
    }

  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.userModel.update({
      ROLE: updateUserDto.role
    },{
      where: {
        ID: parseInt(id)
      }
    })

    const profileUpdate = await this.profileModel.update({
      FULL_NAME: updateUserDto.profile.full_name,
      ADDRESS: updateUserDto.profile.address,
      PHONE: updateUserDto.profile.phone,
      PHOTO: updateUserDto.profile.photo
    },{
      where: {
        USERS_ID: parseInt(id)
      }
    })

    return {
      success: true,
      message: 'successfully update user'
    }

  }

  async remove(id: string) {
    const deleteUser = await this.userModel.update({
      deletedAt: moment().format('YYYY-MM-DD')
    },{
      where: {
        ID: parseInt(id)
      }
    })

    return {
      success: true,
      message: 'successfully delete user'
    }
  }
}
