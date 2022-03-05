import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('items')
@ApiTags('CASHIER - Items')
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiQuery({ name: 'pagination', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category_id', required: false })
  findAll(
    @Query('pagination') pagination: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('category_id') category_id: string,
  ) {
    return this.itemsService.findAll(pagination,limit,search,category_id);
  }

  @Get('/:id')
  findOne(
    @Param('id') id: string
  ) {
    return this.itemsService.findOne(id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string, 
    @Body() updateItemDto: UpdateItemDto
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

}
