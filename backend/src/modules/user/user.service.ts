import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "./Dtos/create-user.dto";
import { User, UserDocument } from "./entities/user.entity";
import { Model } from "mongoose";
import { NotFoundError } from "rxjs";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService{
    constructor(
        
         @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}

    async createUser(input: CreateUserDto){
        const existing = await this.findByEmail(input.email)
         if(existing) throw new ConflictException('User with this email already exists')
        const hash = await this.hashPassword(input.password)
        const user= await this.userModel.create({email:input.email,password:hash})
        return user

    }

    async findByEmail(email: string){
        return this.userModel
      .findOne({ email })
      .select('+password +refreshToken');
    }
    async findById(id: string){
        const user = await this.userModel
      .findById(id)
      .select('+password +refreshToken');
        if(!user) throw new NotFoundException('User not found')
            return user
    }

    async updateRefreshTokenHash(userId: string, refreshToken: string){
        const hash = await this.hashPassword(refreshToken)
        await this.userModel.findByIdAndUpdate(userId,{refreshToken:hash})
    }

    async clearRefreshToken(userId:string){
        await this.userModel.findByIdAndUpdate(userId,{refreshToken:null})
    }

    private async hashPassword(input:string){
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(input,salt)
    }
}