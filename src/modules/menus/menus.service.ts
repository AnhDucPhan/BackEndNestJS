import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './schemas/menu.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>,
  ) { }

  async create(createMenuDto: CreateMenuDto) {
    const { title, image } = createMenuDto
    const menu = await this.menuModel.create({ title, image })
    return { _id: menu._id }
  }

  async findAll() {
    const menus=await this.menuModel.find();
    return menus;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
