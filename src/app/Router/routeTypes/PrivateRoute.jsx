import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AccessDeniedPage from '@components/AccessDeniedPage';
import Title from '@components/Title';

function PrivateRoute({ AccessDeniedLayout }) {
    const isLoging = useSelector((state) => state.auth.isLoging);
    // const userRoles = useSelector((state) => state.auth?.user?.roles || {});
    // const location = useLocation();

    // const moduleMatch = location.pathname.match(/\/working\/([^/]+)\/(manager|employee)/);
    // const moduleCode = moduleMatch ? moduleMatch[1] : null;
    // const requiredRole = moduleMatch ? moduleMatch[2] : null;

    if (!isLoging) {
        return <Navigate to="/auth/login" replace />;
    }

    // if (moduleCode && requiredRole && !userRoles[moduleCode]?.includes(requiredRole)) {
    //     return (
    //         <AccessDeniedLayout>
    //             <Title>Không có quyền truy cập</Title>
    //             <AccessDeniedPage />
    //         </AccessDeniedLayout>
    //     );
    // }

    return <Outlet />;
}

export default PrivateRoute;