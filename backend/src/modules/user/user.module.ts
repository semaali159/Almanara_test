import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
@Module({
  imports: [
       MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
        ]),
     ],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
