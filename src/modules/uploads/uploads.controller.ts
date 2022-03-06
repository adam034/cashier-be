import { Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { extname } from 'path';
import * as dotenv from 'dotenv';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
dotenv.config();
@Controller('uploads')
@ApiTags('CASHIER - Uploads')
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/category')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: (req,file,cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null,true)
      } else {
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/category',
      filename: (req,file,cb) => {
        cb(null,`${moment().format('DDMMYYYYHmmss')}-${file.originalname}`)
      }
    })
  }))
  async categoriPhoto(
    @UploadedFile() file:any, @Req() req:any
  ){
    return {
      success: true,
      message: 'successfully upload file',
      url: await this.uploadsService.getFileUrl(req,file)
    }
  }

  @Post('/item')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: (req,file,cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null,true)
      } else {
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/item',
      filename: (req,file,cb) => {
        cb(null,`${moment().format('DDMMYYYYHmmss')}-${file.originalname}`)
      }
    })
  }))
  async itemsPhoto(
    @UploadedFile() file:any, @Req() req:any
  ){
    return {
      success: true,
      message: 'successfully upload file',
      url: await this.uploadsService.getFileUrl(req,file)
    }
  }

  @Post('/profile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: (req,file,cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null,true)
      } else {
        cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    },
    storage: diskStorage({
      destination: './uploads/profile',
      filename: (req,file,cb) => {
        cb(null,`${moment().format('DDMMYYYYHmmss')}-${file.originalname}`)
      }
    })
  }))
  async profilePhoto(
    @UploadedFile() file:any, @Req() req:any
  ){
    return {
      success: true,
      message: 'successfully upload file',
      url: await this.uploadsService.getFileUrl(req,file)
    }
  }
}
