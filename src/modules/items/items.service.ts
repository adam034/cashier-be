import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.model';
import { Op } from 'sequelize';
@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item) private itemModel: typeof Item
  ){}

  async create(createItemDto: CreateItemDto) {
    if (!createItemDto.name || !createItemDto.category_id || !createItemDto.desc || !createItemDto.photo || !createItemDto.price) {
      throw new HttpException({
        success: false,
        message: 'field cant be empty',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }
    const [item,created] = await this.itemModel.findOrCreate({
      where: {
        NAME: createItemDto.name
      },
      defaults: {
        CATEGORY_ID: createItemDto.category_id,
        PHOTO: createItemDto.photo,
        DESC: createItemDto.desc,
        PRICE: createItemDto.price
      }
    })
    if (created) {
      return {
        success: true,
        message: 'successfully add item'
      }
    }
    throw new HttpException({
      success: false,
      message: 'title already exist',
      data: null
    }, HttpStatus.UNPROCESSABLE_ENTITY)

  }

  async findAll(pagination:string,limit:string,search:string,category_id:string) {
    let option = {}
    let condition = {
      where: {}
    }
    let data:any = []

    if (pagination && limit) {
      option = {
        offset: (parseInt(pagination) - 1) * parseInt(limit),
        limit: parseInt(limit)
      }
    }

    if (search) {
      condition.where['NAME'] = {
        [Op.iLike]: `%${search}%`
      }
    }

    if (category_id) {
      condition.where['CATEGORY_ID'] = parseInt(category_id)
    }

    const items:any = await this.itemModel.findAndCountAll({
      attributes: ['ID', 'NAME', 'PHOTO'],
      ...condition,
      ...option
    })

    data = items.rows.map((m:any) => {
      return {
        id: m.ID,
        category_id: m.CATEGORY_ID,
        name: m.NAME,
        price: m.PRICE,
        photo: m.PHOTO,
        desc: m.DESC
      }
    })
    return {
      success: true,
      message: 'list items',
      data: data,
      meta: {
        pagination: pagination ? Number(pagination) : 0,
        limit: limit ? Number(limit) : 0,
        total_page : limit ? Math.ceil(parseInt(items.count) / Number(limit)) : 0,
        count: items.count ? parseInt(items.count) : 0
      }
    }
  }

  async findOne(id: string) {
    let data:any = null;
    try {
      const item = await this.itemModel.findOne({ where: { ID: parseInt(id) } });
      if (item) {
        data = {
          id: item.ID,
          category_id: item.CATEGORY_ID,
          name: item.NAME,
          price: item.PRICE,
          desc: item.DESC,
          photo: item.PHOTO
        }
        return {
          success: true,
          message: 'success get detail item',
          data: data
        }
      }

      throw new HttpException({
        success: false,
        message: 'item not found',
        data: null
      }, HttpStatus.BAD_REQUEST)

    } catch (error) {
      console.log(error)
    }
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    if (!updateItemDto.category_id || !updateItemDto.desc || !updateItemDto.name || !updateItemDto.photo || !updateItemDto.price) {
      throw new HttpException({
        success: false,
        message: 'field cant be empty',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }

    await this.itemModel.update({
      CATEGORY_ID: updateItemDto.category_id,
      NAME: updateItemDto.name,
      PRICE: updateItemDto.price,
      DESC: updateItemDto.desc,
      PHOTO: updateItemDto.photo
    },{
      where: {
        ID: parseInt(id)
      }
    })

    return {
      success: true,
      message: 'successfully update item'
    }
  }

}
