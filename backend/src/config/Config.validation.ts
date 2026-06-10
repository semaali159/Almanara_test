import * as Joi from 'joi'

export const configValidationSchema = Joi.object({

    NODE_ENV:Joi.string().valid('development','production', 'test'),
    PORT:Joi.number().default(3002),
    ALLOWED_ORIGINS:Joi.string().required(),

    MONGODB_URI:Joi.string().required(),

    JWT_ACCESS_SECRET:Joi.string().min(32).required(),
    JWT_REFRESH_SECRET:Joi.string().min(32).required(),
    JWT_ACCESS_EXPIRE_IN:Joi.string().default('15m'),
    JWT_REFRESH_EXPIRE_IN: Joi.string().default('7d')
})