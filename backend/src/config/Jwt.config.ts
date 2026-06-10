import { registerAs } from "@nestjs/config";

export default registerAs('jwt',()=>({
    accessSecret:process.env.JWT_ACCESS_SECRET,
    refreshsSecret:process.env.JWT_REFRESH_SECRET,
    accessExpireIn:process.env.JWT_ACCESS_EXPIRE_IN,
    refreshExpireIn:process.env.JWT_REFRESH_EXPIRE_IN
}))