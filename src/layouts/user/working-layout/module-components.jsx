import { MODULE_OPTIONS_MAP } from "@configs/const.config.jsx";
import CompanyManagerModule from "@pages/user/modules/company/mompany-manager-module";
import CompanyUserModule from "@pages/user/modules/company/company-user-module";
import HrManagerModule from "@pages/user/modules/hr/hr-manager-module";
import HrUserModule from "@pages/user/modules/hr/hr-user-module";
import ProjectManagerModule from "@pages/user/modules/project/project-manager-module";
import ProjectUserModule from "@pages/user/modules/project/project-user-module";
import ChatManagerModule from "@pages/user/modules/chat/chat-manager-module";
import ChatUserModule from "@pages/user/modules/chat/chat-user-module";

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
