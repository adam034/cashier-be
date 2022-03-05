import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.model';
import { Op } from 'sequelize';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category
  ){}
  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name || !createCategoryDto.photo) {
      throw new HttpException({
        success: false,
        message: 'field name or photo cant be empty',
        data: null
      }, HttpStatus.BAD_REQUEST)
    }
    const [category,created] = await this.categoryModel.findOrCreate({
      where: {
        NAME: createCategoryDto.name
      },
      defaults: {
        PHOTO: createCategoryDto.photo
      }
    })
    if (created) {
      return {
        success: true,
        message: 'successfully add category'
      }
    }
    throw new HttpException({
      success: false,
      message: 'title already exist',
      data: null
    }, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  async findAll(pagination:string,limit:string,search:string) {
    let option = {}
    let condition = {
      where: {}
    }
    let data:any = []

    if(pagination && limit) {
      option = {
        offset: (parseInt(pagination) - 1) * parseInt(limit),
        limit: parseInt(limit)
      }
    }

    if(search) {
      condition.where['NAME'] = {
        [Op.iLike]: `%${search}%`
      }
    }

    const categories:any = await this.categoryModel.findAndCountAll({
      attributes: ['ID', 'NAME', 'PHOTO'],
      ...condition,
      ...option
    })

    data = categories.rows.map((m:any) => {
      return {
        id: m.ID,
        name: m.NAME,
        photo: m.PHOTO
      }
    })

    return {
      success: true,
      message: 'list users',
      data: data,
      meta: {
        pagination: pagination ? Number(pagination) : 0,
        limit: limit ? Number(limit) : 0,
        total_page : limit ? Math.ceil(parseInt(categories.count) / Number(limit)) : 0,
        count: categories.count ? parseInt(categories.count) : 0
      }
    }
  }

  async findOne(id: string) {
    let data = null;
    try {
      const category = await this.categoryModel.findOne({
        where: {
          ID: parseInt(id)
        }
      })

      if (category) {
        data = {
          id: category.ID,
          name: category.NAME,
          photo: category.PHOTO
        }

        return {
          success: true,
          message: 'success get detail category',
          data: data
        }
      }

      throw new HttpException({
        success: false,
        message: 'category not found',
        data: null
      }, HttpStatus.BAD_REQUEST)

    } catch (error) {
      console.log(error)
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryModel.update({
      NAME: updateCategoryDto.name,
      PHOTO: updateCategoryDto.photo
    },{
      where: {
        ID: parseInt(id)
      }
    })

    return {
      success: true,
      message: 'successfully update category'
    }
  }

 
}
