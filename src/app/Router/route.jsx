import { createBrowserRouter, Navigate } from 'react-router-dom';
import Title from '@components/Title';
import PublicRoute from '@app/Router/routeTypes/PublicRoute';
import PrivateRoute from '@app/Router/routeTypes/PrivateRoute';
import AdminMainLayout from '@layouts/admin/MainLayout';
import UserMainLayout from '@layouts/user/MainLayout';
import AuthLayout from '@layouts/user/AuthLayout';
import WorkingLayout from '@layouts/user/WorkingLayout';
import NotFound from '@pages/user/common/NotFound';
import Home from '@pages/user/common/Home';
import Companies from '@pages/user/common/Companies';
import Login from '@pages/user/auth/Login';
import Register from '@pages/user/auth/Register';
import ReceiveTokens from '@pages/user/auth/ReceiveTokens';
import ForgotPassword from '@pages/user/auth/ForgotPassword';
import Logout from '@pages/user/auth/Logout';
import CompanyManagerModule from '@pages/user/modules/company/CompanyManagerModule';
import CompanyUserModule from '@pages/user/modules/company/CompanyUserModule';
import CompanyInfoTab from '@pages/user/modules/company/CompanyManagerModule/CompanyInfoTab';
import CompanyModuleRolesTab from '@pages/user/modules/company/CompanyManagerModule/CompanyModuleRolesTab';
import HrManagerModule from '@pages/user/modules/hr/HrManagerModule';
import HrUserModule from '@pages/user/modules/hr/HrUserModule';
import ProjectManagerModule from '@pages/user/modules/project/ProjectManagerModule';
import ProjectUserModule from '@pages/user/modules/project/ProjectUserModule';
import ProjectDashboard from '@pages/user/modules/project/ProjectManagerModule/ProjectDashboard';
import ProjectDetail from '@pages/user/modules/project/ProjectManagerModule/ProjectDetail';
import TaskDetail from '@pages/user/modules/project/ProjectManagerModule/TaskDetail';

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                element: <UserMainLayout />,
                children: [
                    { path: '/', element: <><Title>Trang chủ</Title><Home /></> },
                    { path: '/home', element: <><Title>Trang chủ</Title><Home /></> },
                    { path: '/404', element: <><Title>Không tìm thấy trang</Title><NotFound /></> },
                    { path: '*', element: <><Title>Không tìm thấy trang</Title><NotFound /></> },
                ],
            },
            {
                element: <AuthLayout />,
                children: [
                    { path: '/auth/login', element: <><Title>Đăng nhập</Title><Login /></> },
                    { path: '/auth/register', element: <><Title>Đăng ký</Title><Register /></> },
                    { path: '/auth/forgot-password', element: <><Title>Lấy lại mật khẩu</Title><ForgotPassword /></> },
                    { path: '/auth/logout', element: <><Title>Đăng xuất</Title><Logout /></> },
                    { path: '/auth/receive-refresh-token', element: <><Title>Nhận tokens</Title><ReceiveTokens /></> },
                ],
            },
        ],
    },
    {
        element: <PrivateRoute AccessDeniedLayout={AdminMainLayout} />,
        children: [
            {
                element: <AdminMainLayout />,
                children: [
                    { path: '/admin', element: <><Title>Admin Dashboard</Title><Home /></> },
                ],
            },
        ],
    },
    {
        element: <PrivateRoute AccessDeniedLayout={UserMainLayout} />,
        children: [
            {
                element: <UserMainLayout />,
                children: [
                    { path: '/companies', element: <><Title>Danh sách công ty</Title><Companies /></> },
                ],
            },
            {
                path: '/working/:moduleCode?/:role?/*',
                element: <WorkingLayout />,
                children: [
                    {
                        path: 'company/manager/:tab?',
                        element: <CompanyManagerModule />,
                    },
                    {
                        path: 'company/user/:tab?',
                        element: <CompanyUserModule />,
                    },
                    {
                        path: 'project/manager/*',
                        element: <ProjectManagerModule />,
                        children: [
                            {
                                index: true,
                                element: <ProjectDashboard />,
                            },
                            {
                                path: ":projectId/:tab?",
                                element: <ProjectDetail />,
                            },
                            {
                                path: "task/:taskId",
                                element: <TaskDetail />,
                            }
                        ]
                    },
                    {
                        path: 'roject/user/:tab?',
                        element: <ProjectUserModule />,
                    },
                    {
                        path: 'hr/manager/:tab?',
                        element: <HrManagerModule />,
                    },
                    {
                        path: 'hr/user/:tab?',
                        element: <HrUserModule />,
                    },
                ],
            }
        ],
    },
]);

export default router;