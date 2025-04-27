import {
    CONTRACT_STATUSES_MAP,
    CONTRACT_TYPES_MAP,
} from "@configs/const.config";
import Joi from "joi";

export const inviteEmployeeSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "ID User không được để trống",
        "any.required": "ID User là bắt buộc",
    }),
});

export const departmentSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên phòng ban không được để trống",
        "any.required": "Tên phòng ban là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
});

export const positionSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên vị trí không được để trống",
        "any.required": "Tên vị trí là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
});

export const contractSchema = Joi.object({
    employeeId: Joi.string().required().messages({
        "any.required": "ID nhân viên là bắt buộc",
    }),
    startDate: Joi.date().required().messages({
        "any.required": "Ngày bắt đầu là bắt buộc",
    }),
    endDate: Joi.date().optional(),
    type: Joi.string()
        .valid(...Object.keys(CONTRACT_TYPES_MAP))
        .required()
        .messages({
            "any.required": "Loại hợp đồng là bắt buộc",
            "any.only": "Loại hợp đồng không hợp lệ",
        }),
    salary: Joi.number().min(0).required().messages({
        "any.required": "Lương là bắt buộc",
        "number.min": "Lương phải lớn hơn hoặc bằng 0",
    }),
    status: Joi.string()
        .valid(...Object.keys(CONTRACT_STATUSES_MAP))
        .required()
        .messages({
            "any.required": "Trạng thái là bắt buộc",
            "any.only": "Trạng thái không hợp lệ",
        }),
    companyId: Joi.string().required().messages({
        "any.required": "ID công ty là bắt buộc",
    }),
});

export const employeeSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên không được để trống",
        "any.required": "Tên là bắt buộc",
    }),
    dob: Joi.date().optional().messages({
        "date.base": "Ngày sinh không hợp lệ",
    }),
    department: Joi.string().allow(null, "").optional(),
    position: Joi.string().allow(null, "").optional(),
});

export const employeeUpdateMyInfoSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên không được để trống",
        "any.required": "Tên là bắt buộc",
    }),
    avatar: Joi.string()
        .uri({ scheme: ["http", "https"] })
        .allow(null, "")
        .optional()
        .messages({
            "string.uri": "Avatar phải là một URL hợp lệ (http hoặc https)",
            "string.base": "Avatar phải là chuỗi ký tự",
        }),
    dob: Joi.date().optional().messages({
        "date.base": "Ngày sinh không hợp lệ",
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(null, "")
        .optional()
        .messages({
            "string.email": "Email không hợp lệ",
            "string.base": "Email phải là chuỗi ký tự",
        }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .allow(null, "")
        .optional()
        .messages({
            "string.pattern.base": "Số điện thoại không hợp lệ",
            "string.base": "Số điện thoại phải là chuỗi ký tự",
        }),
});
