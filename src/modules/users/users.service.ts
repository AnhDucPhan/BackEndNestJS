import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { }

  IsEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email })
    console.log('check', user)
    if (user) return true;
    return false
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    //check email
    const isExist = await this.IsEmailExist(email);
    console.log('check ', isExist)
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}`)
    }
    const hashPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: user._id
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)
    if (filter.current) delete filter.current;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (current - 1) * (pageSize)
    const results = await this.userModel
      .find(filter).limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        totalItems: totalItems //tổng số phần tử (số bản ghi)
      },
      results
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, ...updateFields } = updateUserDto
    return await this.userModel.updateOne(
      { _id }, { ...updateFields }
    );
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id })
    }
    else {
      throw new BadRequestException('ID ko hợp lệ')
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    //check email
    const isExist = await this.IsEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}`)
    }
    const hashPassword = await hashPasswordHelper(password)
    const codeId = uuidv4()
    const user = await this.userModel.create({
      name, email, password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minute')
    })

    this.mailerService.sendMail(
      {
        to: user.email, // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        template: "register",
        context: {
          name: user?.name ?? user.email,
          activationCode: codeId
        }
      }
    )

    return {
      _id: user._id
    }
  }

  async handleCheckCode(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException('Verify error!!!')
    }

    //check expire code
    const isBeforeCheck = await dayjs().isBefore(user.codeExpired)

    if (isBeforeCheck) {
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
    }
    return { isBeforeCheck }
  }
}
