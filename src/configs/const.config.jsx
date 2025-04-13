import env from "@configs/env.config";
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const ROUTE_TYPES = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
};

export const SERVER_URL = {
    API: `${env.serverUrl}/api`,
    AUTH: `${env.serverUrl}/auth`,
    OAUTH2_GOOGLE: `${env.serverUrl}/oauth2/authorization/google`,
    OAUTH2_GITHUB: `${env.serverUrl}/oauth2/authorization/github`,
};

export const ROLES = {
    USER: "USER",
    ADMIN: "ADMIN",
};

export const PRODUCT_STATUSES = {
    PENDING: {
        title: "Đang chờ duyệt",
        actions: { ACTIVE: "Duyệt", REJECTED: "Từ chối" },
    },
    ACTIVE: {
        title: "Đang bán",
        actions: { BLOCKED: "Khóa" },
    },
    BLOCKED: {
        title: "Đang bị khóa",
        actions: { DRAFT: "Mở khóa (Nháp)" },
    },
    DRAFT: {
        title: "",
        actions: {},
    },
};

export const MODULE_ROLES = {
    MANAGER: "MANAGER",
    USER: "USER",
};

export const MODULE_OPTIONS_MAP = {
    COMPANY: {
        code: "COMPANY",
        label: "Công ty",
        icon: <ApartmentIcon />
    },
    HR: {
        code: "HR",
        label: "Nhân sự",
        icon: <GroupsIcon />
    },
    CHAT: {
        code: "CHAT",
        label: "Thảo luận",
        icon: <ForumIcon />
    },
    PROJECT: {
        code: "PROJECT",
        label: "Dự án",
        icon: <AccountTreeIcon />
    },
    TIMEKEEPING: {
        code: "TIMEKEEPING",
        label: "Chấm công",
        icon: <CalendarMonthIcon />,
    },
};

export const MODULE_OPTIONS = Object.keys(MODULE_OPTIONS_MAP).map(
    (module_key) => MODULE_OPTIONS_MAP[module_key],
);

export const TASK_STATUSES = {
    TO_DO: "TO_DO",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
};
