import { Injectable } from '@nestjs/common';
import {User} from './schemas/user.schema';
import {Model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel:Model<User>,
        private jwtService: JwtService,
    ){} 
    async signUp(SignUpDto)
    {
        const {name, email, password} = SignUpDto;

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
          });

        const token = this.jwtService.sign({ id: user._id });
        //const token = this.jwtService.sign({ id: user._id });

        return { token };
      
    }
}
