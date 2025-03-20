import env from "@configs/env.config";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
    COMPANY: { code: "COMPANY", label: "Công ty", icon: <BusinessIcon /> },
    HR: { code: "HR", label: "Nhân sự", icon: <PeopleIcon /> },
    CHAT: { code: "CHAT", label: "Trò chuyện", icon: <ChatIcon /> },
    PROJECT: { code: "PROJECT", label: "Dự án", icon: <AssignmentIcon /> },
    TIMEKEEPING: {
        code: "TIMEKEEPING",
        label: "Chấm công",
        icon: <AccessTimeIcon />,
    },
};

export const MODULE_OPTIONS = Object.keys(MODULE_OPTIONS_MAP).map(
    (module_key) => MODULE_OPTIONS_MAP[module_key],
);
