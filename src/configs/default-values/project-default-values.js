import { PROJECT_MEMBER_ROLE } from "@configs/const.config"

export const MANAGER_CREATE_PROJECT_DEFAULT_VALUES = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
}

export const MANAGER_ADD_MEMBER_DEFAULT_VALUES = {
    employeeId: "",
    role: PROJECT_MEMBER_ROLE.MEMBER.code,
}