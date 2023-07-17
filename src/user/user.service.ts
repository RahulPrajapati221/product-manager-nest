import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  //User SignUp
  async signUp(user: SignUpDto) {
    const { name, email, password, role } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = this.jwtService.sign({ id: User._id });
    return { User, token };
  }

  //User Login
  async loginUser(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
  //get All User
  async findAllUser(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }

  async findUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('user Not found');
    }
    return user;
  }
  //Update User
  async updateUser(userId: string, updates: object): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      updates,
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('user Not found');
    }
    return user;
  }

  //Delete User
  async deleteUser(userId: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete({ _id: userId });
    if (!user) {
      throw new NotFoundException('user Not found');
    }
    return user;
  }
}
