import Joi from 'joi'

const object = {
  id: Joi.string().guid({ version: ['uuidv4'] }),
  title: Joi.string().trim().min(3).max(32).required(),
  description: Joi.string().trim().min(3).max(256).required(),
  updatedAt: Joi.date().required(),
  algorithm: Joi.string().equal('aes'),
}

export const vaultSchema = Joi.object({
  ...object,
  password: Joi.string().alphanum().min(8).max(32).required(),
})

export const vaultSchemaHashedPassword = Joi.object({
  ...object,
  password: Joi.string().min(32).max(1024).required(),
})
