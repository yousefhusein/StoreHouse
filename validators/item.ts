import Joi from 'joi'

export const itemSchema = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }),
  vaultId: Joi.string().guid({ version: ['uuidv4'] }),
  label: Joi.string().trim().min(3).max(32).required(),
  password: Joi.string().alphanum().min(8).max(32),
  value: Joi.string().trim().min(3).max(2048).required(),
  type: Joi.string().equal(...supportedTypes),
})
