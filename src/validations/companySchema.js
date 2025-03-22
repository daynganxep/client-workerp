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

export const updateCompanyInforSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên công ty không được để trống",
        "any.required": "Tên công ty là trường bắt buộc",
    }),
    domain: Joi.string().allow("").optional().messages({
        "string.base": "Domain phải là chuỗi ký tự",
    }),
    avatar: Joi.string()
        .uri({ scheme: ["http", "https"] })
        .allow("")
        .optional()
        .messages({
            "string.uri": "Avatar phải là một URL hợp lệ (http hoặc https)",
            "string.base": "Avatar phải là chuỗi ký tự",
        }),
    active: Joi.boolean().required().messages({
        "boolean.base": "Trạng thái hoạt động phải là true hoặc false",
        "any.required": "Trạng thái hoạt động là trường bắt buộc",
    }),
});
