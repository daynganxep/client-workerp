import Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên công ty không được để trống",
    "any.required": "Tên công ty là trường bắt buộc",
  }),
  domain: Joi.string().allow("").optional(),
  moduleCodes: Joi.array().min(1).required().messages({
    "array.min": "Phải chọn ít nhất một module",
    "any.required": "Danh sách module là trường bắt buộc",
  }),
});
