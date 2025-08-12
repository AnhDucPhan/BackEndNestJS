import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { Model } from 'mongoose';

@Injectable()

export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItem>,
  ) { }


  async create(createMenuItemDto: CreateMenuItemDto) {
    const { menu, title, description, basePrice, image } = createMenuItemDto
    const item = await this.menuItemModel.create({ menu, title, description, basePrice, image })
    return { _id: item._id }
  }

  async findAll() {
    const result = await this.menuItemModel.find().lean()
    const backendUrl = 'http://localhost:8080';
    return result.map(item => ({
      ...item,
      image: item.image ?
        `${backendUrl}/public/${item.image}`
        :
        null
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
