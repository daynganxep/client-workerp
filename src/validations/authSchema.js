import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
      "any.required": "Email là trường bắt buộc",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "any.required": "Mật khẩu là trường bắt buộc",
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
      "any.required": "Email là trường bắt buộc",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "any.required": "Mật khẩu là trường bắt buộc",
  }),
});

export const forgotPasswordStep1Schema = Joi.object({
  // Định nghĩa schema cho quên mật khẩu ở đây
  // ...
});

export const forgotPasswordStep2Schema = Joi.object({
  // Định nghĩa schema cho quên mật khẩu ở đây
  // ...
});
