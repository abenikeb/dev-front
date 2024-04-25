// validation.js
import Joi from "joi-browser";

export const validateForm = (data) => {
  const schema = Joi.object({
    // firstName: Joi.string().min(3).max(50).required().label("First Name"),
    // lastName: Joi.string().min(3).max(50).required().label("Last Name"),
    // tel: Joi.string().regex(/^251/).required(),
    email: Joi.string().required().email().label("Email"),
    // password: Joi.string().min(8).required().label("Password"),
    // emailVerification: Joi.string()
    //   .allow("")
    //   .label("Email Verification")
    //   .optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
