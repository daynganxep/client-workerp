import { PROJECT_MEMBER_ROLE, TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config"

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

export const MANAGER_CREATE_TASK_DEFAULT_VALUES = {
    title: "",
    description: "",
    projectId: "",
    assignees: [],
    priority: TASK_PRIORITY_MAP.LOW.code,
    status: TASK_STATUSES_MAP.TO_DO.code,
    dueDate: "",
}