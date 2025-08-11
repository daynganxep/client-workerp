import { PROJECT_STATUSES_MAP } from "@configs/const.config";
import Joi from "joi";

export const projectSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Tên dự án không được để trống",
        "any.required": "Tên dự án là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
    companyId: Joi.string().required().messages({
        "string.empty": "ID công ty không được để trống",
        "any.required": "ID công ty là bắt buộc",
    }),
    startDate: Joi.date().required().messages({
        "date.base": "Ngày bắt đầu không hợp lệ",
        "any.required": "Ngày bắt đầu là bắt buộc",
    }),
    endDate: Joi.date().min(Joi.ref("startDate")).required().messages({
        "date.base": "Ngày kết thúc không hợp lệ",
        "date.min": "Ngày kết thúc phải sau ngày bắt đầu",
        "any.required": "Ngày kết thúc là bắt buộc",
    }),
    status: Joi.string()
        .valid(...Object.keys(PROJECT_STATUSES_MAP))
        .default("OPEN")
        .messages({
            "any.only": "Trạng thái phải là OPEN, IN_PROGRESS hoặc COMPLETED",
        }),
    tags: Joi.array().items(Joi.string()).optional(),
});

export const taskSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Tên task không được để trống",
        "any.required": "Tên task là bắt buộc",
    }),
    description: Joi.string().allow("").optional(),
    projectId: Joi.string().required().messages({
        "string.empty": "ID dự án không được để trống",
        "any.required": "ID dự án là bắt buộc",
    }),
    assignees: Joi.array().items(Joi.string()).optional(),
    priority: Joi.string()
        .valid("LOW", "MEDIUM", "HIGH")
        .default("MEDIUM")
        .messages({
            "any.only": "Ưu tiên phải là LOW, MEDIUM hoặc HIGH",
        }),
    status: Joi.string()
        .valid("TO_DO", "IN_PROGRESS", "DONE")
        .default("TO_DO")
        .messages({
            "any.only": "Trạng thái phải là TO_DO, IN_PROGRESS hoặc DONE",
        }),
    estimatedTime: Joi.number().min(0).optional().messages({
        "number.min": "Thời gian ước tính phải lớn hơn hoặc bằng 0",
    }),
    dueDate: Joi.alternatives()
        .try(
            Joi.date().messages({
                "date.base": "Hạn không hợp lệ",
            }),
            Joi.string().allow("").optional(),
        )
        .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
});

export const projectMemberSchema = Joi.object({
    employeeId: Joi.string().required().messages({
        "string.empty": "ID nhân viên không được để trống",
        "any.required": "ID nhân viên là bắt buộc",
    }),
    role: Joi.string().valid("LEADER", "MEMBER").default("MEMBER").messages({
        "any.only": "Vai trò phải là LEADER hoặc MEMBER",
    }),
});

export const taskUpdateSchema = Joi.object({
    status: Joi.string()
        .valid("TO_DO", "IN_PROGRESS", "DONE")
        .required()
        .messages({
            "any.only": "Trạng thái phải là TO_DO, IN_PROGRESS hoặc DONE",
            "any.required": "Trạng thái là bắt buộc",
        }),
    dueDate: Joi.alternatives()
        .try(
            Joi.date().messages({
                "date.base": "Hạn không hợp lệ",
            }),
            Joi.string().allow("").optional(),
        )
        .optional(),
    estimatedTime: Joi.alternatives()
        .try(
            Joi.number().min(0).messages({
                "number.base": "Thời gian ước tính phải là số",
                "number.min": "Thời gian ước tính phải lớn hơn hoặc bằng 0",
            }),
            Joi.string().allow("").optional(),
        )
        .optional(),
}).options({ stripUnknown: true });
