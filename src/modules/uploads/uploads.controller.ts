import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import * as moment from 'moment';
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/category')
  async categoriPhoto(){}

  @Post('/items')
  async itemsPhoto(){}

  @Post('/profile')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './uploads/profile',
      filename: (req,file,cb) => {
        cb(null,`${moment().format('YYYY-MM-DD')}${file.originalname}`)
      }
    })
  }))
  async profilePhoto(
    @UploadedFile() file
  ){
    console.log(file)
  }
}
