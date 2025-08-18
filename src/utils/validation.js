import Joi from 'joi';

export const signupValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const deviceValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  type: Joi.string().valid('light', 'fan', 'ac', 'smart_meter', 'sensor').required(),
  status: Joi.string().valid('active', 'inactive', 'maintenance').default('active')
});
  
export const logValidation = Joi.object({
  event: Joi.string().required(),
  value: Joi.number().required()
});
