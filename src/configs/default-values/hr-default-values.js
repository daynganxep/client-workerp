import { CONTRACT_STATUSES_MAP, CONTRACT_TYPES_MAP } from "@configs/const.config";

export const MANAGER_INVITE_EMPLOYEE_DEFAULT_VALUES = {
    userId: "",
};
export const MANAGER_CREATE_CONTRACT_DEFAULT_VALUES = {
    companyId: "",
    employeeId: "",
    startDate: "",
    endDate: "",
    salary: 0,
    type: CONTRACT_TYPES_MAP.FULL_TIME.code,
    status: CONTRACT_STATUSES_MAP.ACTIVE.code,
}