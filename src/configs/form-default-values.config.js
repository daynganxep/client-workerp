import { MODULE_OPTIONS } from "./const.config";

export const AUTH_LOGIN_DEFAULT_VALUES = {
    email: "",
    password: "",
};


export const AUTH_REGISTER_DEFAULT_VALUES = {
    email: "",
    password: "",
};

export const AUTH_FORGOT_PASSWORD_STEP_1_DEFAULT_VALUES = {
    email: "",
};

export const AUTH_FORGOT_PASSWORD_STEP_2_DEFAULT_VALUES = {
    code: "",
    password: "",
    confirmNewPassword: "",
};

export const COMMON_CREATE_COMPANY_DEFAULT_VALUES = {
    name: "",
    domain: "",
    moduleCodes: [MODULE_OPTIONS[0].code, MODULE_OPTIONS[1].code, MODULE_OPTIONS[2].code],
};