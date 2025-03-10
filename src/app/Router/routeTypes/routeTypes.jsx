import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

import AdminMainLayout from "@layouts/admin/MainLayout";
import UserMainLayout from "@layouts/user/MainLayout";

import { ROLES } from "@configs/const.config";

const ADMIN_ROUTE_TYPES = {
    PUBLIC: PublicRoute,
    PRIVATE: ({ children }) => (
        <PrivateRoute AccessDeniedLayout={AdminMainLayout} role={ROLES.ADMIN}>
            {children}
        </PrivateRoute>
    ),
};

const USER_ROUTE_TYPES = {
    PUBLIC: PublicRoute,
    PRIVATE: ({ children }) => (
        <PrivateRoute AccessDeniedLayout={UserMainLayout} role={ROLES.USER}>
            {children}
        </PrivateRoute>
    ),
};

export { ADMIN_ROUTE_TYPES, USER_ROUTE_TYPES };
