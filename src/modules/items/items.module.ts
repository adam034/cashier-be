import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports:[SequelizeModule.forFeature([Item])],
  exports:[SequelizeModule],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
