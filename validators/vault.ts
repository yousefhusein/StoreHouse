import Joi from 'joi'

export const vaultSchema = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }),
  title: Joi.string().trim().min(3).max(32).required(),
  password: Joi.string().alphanum().min(8).max(32).required(),
  description: Joi.string().trim().min(3).max(256).required(),
})
