import { MODULE_OPTIONS_MAP } from "@configs/const.config.jsx";
import CompanyManagerModule from "@pages/user/modules/company/CompanyManagerModule";
import CompanyUserModule from "@pages/user/modules/company/CompanyUserModule";
import HrManagerModule from "@pages/user/modules/hr/HrManagerModule";
import HrUserModule from "@pages/user/modules/hr/HrUserModule";
import ProjectManagerModule from "@pages/user/modules/project/ProjectManagerModule";
import ProjectUserModule from "@pages/user/modules/project/ProjectUserModule";
import ChatManagerModule from "@pages/user/modules/chat/ChatManagerModule";
import ChatUserModule from "@pages/user/modules/chat/ChatUserModule";

export const ModuleComponents = {
    [MODULE_OPTIONS_MAP.COMPANY.code]: {
        ManagerModule: CompanyManagerModule,
        UserModule: CompanyUserModule,
    },
    [MODULE_OPTIONS_MAP.HR.code]: {
        ManagerModule: HrManagerModule,
        UserModule: HrUserModule,
    },
    [MODULE_OPTIONS_MAP.PROJECT.code]: {
        ManagerModule: ProjectManagerModule,
        UserModule: ProjectUserModule,
    },
    [MODULE_OPTIONS_MAP.CHAT.code]: {
        ManagerModule: ChatManagerModule,
        UserModule: ChatUserModule,
    },
};
