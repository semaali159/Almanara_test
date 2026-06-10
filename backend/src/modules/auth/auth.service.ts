import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/Dtos/create-user.dto';
import * as bcrypt from 'bcryptjs'
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import { bsonType } from 'bson';
@Injectable()
export class AuthService{
    constructor(
        private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    
    ){}
    async register(dto: RegisterDto){
        const user = await this.userService.createUser(dto)
        const userId = user._id.toString()
        const tokens = await this.generateToken(userId,user.email)
        await this.userService.updateRefreshTokenHash(userId,tokens.refreshToken)
        return tokens
    }

    async login(dto:LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
    
        if (!user) {
          throw new UnauthorizedException(
            'Invalid credentials',
          );
        }
    
        const passwordMatches = await bcrypt.compare(
          dto.password,
          user.password,
        );
    
        if (!passwordMatches) {
          throw new UnauthorizedException(
            'Invalid credentials',
          );
        }
        
        const userId = user._id.toString()

    
        const tokens = await this.generateToken(
          userId,
          user.email,
        );
    
        await this.userService.updateRefreshTokenHash(
          userId,
          tokens.refreshToken,
        )
        return tokens}
    async refreshToken(userId: string, refToken: string){
        const user = await this.userService.findById(userId);
        
            if (!user.refreshToken) {
              throw new ForbiddenException('Access denied');
            }
        
            const refreshMatches = await bcrypt.compare(
              refToken,
              user.refreshToken,
            );
        
            if (!refreshMatches) {
              throw new ForbiddenException('Access denied');
            }
        
            const tokens = await this.generateToken(
              user._id.toString(),
              user.email,
            );
        
            await this.userService.updateRefreshTokenHash(
              user._id.toString(),
              tokens.refreshToken,
            );
        
            return tokens;
    }

    private async generateToken(userId: string, email:string){
        const payload = {
            sub:userId,
            email
        }

         const accessToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn:this.configService.getOrThrow<number>('jwt.accessExpireIn'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshsSecret'),
        expiresIn: this.configService.getOrThrow<number>('jwt.refreshExpireIn'),
      },
    );
    return{
        accessToken,refreshToken
    }
    }

}