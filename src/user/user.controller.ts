import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { SignUpDto } from './dto/signUp-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private UserService: UserService) {}
  @Post('/signUp')
  async registerUser(
    @Body() reqBody: SignUpDto,
  ): Promise<{ User: User; token: string }> {
    const { User, token } = await this.UserService.signUp(reqBody);
    return { User, token };
  }

  @Get('/login')
  async loginUser(@Body() loginDto: LoginDto) {
    const user = await this.UserService.loginUser(loginDto);
    return user;
  }

  @Get('/all')
  async findAllUser() {
    const user = await this.UserService.findAllUser();
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct Id');
    }
    const user = await this.UserService.findUser(id);
    return user;
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('update') updates: UpdateUserDto,
  ) {
    const updatedUser = await this.UserService.updateUser(id, updates);
    return updatedUser;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.UserService.deleteUser(id);
    return user;
  }
}
