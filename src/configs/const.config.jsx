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

export const MODULE_ROLES = {
    MANAGER: "MANAGER",
    USER: "USER",
};

export const MODULE_ROLES_MAP = {
    MANAGER: {
        code: "MANAGER",
        label: "Quản lý"
    }, USER: {
        code: "USER",
        label: "Người dùng"
    },
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

export const CONTRACT_TYPES_MAP = {
    FULL_TIME: {
        code: "FULL_TIME",
        label: "Toàn thời gian",
        color: 'success',
    },
    PART_TIME: {
        code: "PART_TIME",
        label: "Bán thời gian",
        color: 'info',
    }, INTERN: {
        code: "INTERN",
        label: "Thực tập",
        color: 'warning',
    },
};

export const CONTRACT_STATUSES_MAP = {
    ACTIVE: {
        code: "ACTIVE",
        label: "Đang hoạt động",
        color: 'success',
    },
    EXPIRED: {
        code: "EXPIRED",
        label: "Hết hạn",
        color: 'info',
    }, TERMINATED: {
        code: "TERMINATED",
        label: "Đã chấm dứt",
        color: 'warning',
    },
};

export const PROJECT_STATUSES_MAP = {
    OPEN: {
        code: "OPEN",
        label: "Mới",
        color: 'info',
    },
    IN_PROGRESS: {
        code: "IN_PROGRESS",
        label: "Đang thực hiện",
        color: 'warning',
    },
    COMPLETED: {
        code: "COMPLETED",
        label: "Hoàn thành",
        color: 'success',
    },
    ON_HOLD: {
        code: "ON_HOLD",
        label: "Tạm dừng",
        color: 'secondary',
    },
    CANCELLED: {
        code: "CANCELLED",
        label: "Đã hủy",
        color: 'error',
    },
};

export const PROJECT_MEMBER_ROLE = {
    LEADER: {
        code: "LEADER",
        label: "Trưởng nhóm",
        color: 'success',
    }, MEMBER: {
        code: "MEMBER",
        label: "Thành viên",
        color: 'secondary',
    }
}

export const TASK_PRIORITY_MAP = {
    LOW: {
        code: "LOW",
        label: "Thấp",
        color: 'success',
    },
    MEDIUM: {
        code: "MEDIUM",
        label: "Trung bình",
        color: 'warning',
    },
    HIGH: {
        code: "HIGH",
        label: "Cao",
        color: 'error',
    },
};

export const TASK_STATUSES_MAP = {
    TO_DO: {
        code: "TO_DO",
        label: "Chưa thực hiện",
        color: 'info',
    },
    IN_PROGRESS: {
        code: "IN_PROGRESS",
        label: "Đang thực hiện",
        color: 'warning',
    },
    DONE: {
        code: "DONE",
        label: "Hoàn thành",
        color: 'success',
    },
}

