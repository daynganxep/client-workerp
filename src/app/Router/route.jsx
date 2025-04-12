import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import Title from '@components/Title';
// Route Type
import PublicRoute from '@app/Router/routeTypes/PublicRoute';
import PrivateRoute from '@app/Router/routeTypes/PrivateRoute';
// Layout
import AdminMainLayout from '@layouts/admin/MainLayout';
import UserMainLayout from '@layouts/user/MainLayout';
import AuthLayout from '@layouts/user/AuthLayout';
import WorkingLayout from '@layouts/user/WorkingLayout';
// Page
import NotFound from '@pages/user/common/NotFound';
// import Home from '@pages/user/common/Home';
import Home from '@pages/user/common/Home';
import Companies from '@pages/user/common/Companies';
import Login from '@pages/user/auth/Login';
import Register from '@pages/user/auth/Register';
import ReceiveTokens from '@pages/user/auth/ReceiveTokens';
import ForgotPassword from '@pages/user/auth/ForgotPassword';
import Logout from '@pages/user/auth/Logout';


import CompanyManagerModule from '@pages/user/modules/company/CompanyManagerModule';
import CompanyUserModule from '@pages/user/modules/company/CompanyUserModule';
// import CompanyInfoTab from '@pages/user/modules/company/CompanyInfoTab';
// import CompanyRolesTab from '@pages/user/modules/company/CompanyModuleRolesTab';
import HrManagerModule from '@pages/user/modules/hr/HrManagerModule';
import HrUserModule from '@pages/user/modules/hr/HrUserModule';
import ProjectManagerModule from '@pages/user/modules/project/ProjectManagerModule';
import ProjectUserModule from '@pages/user/modules/project/ProjectUserModule';

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                element: <UserMainLayout />,
                children: [
                    {
                        path: '/',
                        element: (
                            <>
                                <Title>Trang chủ</Title>
                                <Home />
                            </>
                        ),
                    },
                    {
                        path: '/home',
                        element: (
                            <>
                                <Title>Trang chủ</Title>
                                <Home />
                            </>
                        ),
                    },
                    {
                        path: '/404',
                        element: (
                            <>
                                <Title>Không tìm thấy trang</Title>
                                <NotFound />
                            </>
                        ),
                    },
                    {
                        path: '*',
                        element: (
                            <>
                                <Title>Không tìm thấy trang</Title>
                                <NotFound />
                            </>
                        ),
                    },
                ],
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: '/auth/login',
                        element: (
                            <>
                                <Title>Đăng nhập</Title>
                                <Login />
                            </>
                        ),
                    },
                    {
                        path: '/auth/register',
                        element: (
                            <>
                                <Title>Đăng ký</Title>
                                <Register />
                            </>
                        ),
                    },
                    {
                        path: '/auth/forgot-password',
                        element: (
                            <>
                                <Title>Lấy lại mật khẩu</Title>
                                <ForgotPassword />
                            </>
                        ),
                    },
                    {
                        path: '/auth/logout',
                        element: (
                            <>
                                <Title>Đăng xuất</Title>
                                <Logout />
                            </>
                        ),
                    },
                    {
                        path: '/auth/receive-refresh-token',
                        element: (
                            <>
                                <Title>Nhận tokens</Title>
                                <ReceiveTokens />
                            </>
                        ),
                    },
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
                    {
                        path: '/admin',
                        element: (
                            <>
                                <Title>Admin Dashboard</Title>
                                <Home />
                            </>
                        ),
                    },
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
                    {
                        path: '/companies',
                        element: (
                            <>
                                <Title>Danh sach cong ty</Title>
                                <Companies />
                            </>
                        ),
                    },
                ],
            },
            {
                path: '/working/:moduleCode',
                element: <WorkingLayout />,
                children: [
                    {
                        path: ':role',
                        children: [
                            {
                                path: '',
                                element: <Navigate to="user" replace />, // Mặc định role user
                            },
                            {
                                path: 'company',
                                element: (
                                    <>
                                        <Title>Company Module</Title>
                                        <Outlet />
                                    </>
                                ),
                                children: [
                                    {
                                        path: 'manager',
                                        element: <CompanyManagerModule />,
                                        children: [
                                            {
                                                path: 'info',
                                                element: (
                                                    <>
                                                        <Title>Company Info</Title>
                                                        {/* <CompanyInfoTab /> */}
                                                    </>
                                                ),
                                            },
                                            {
                                                path: 'roles',
                                                element: (
                                                    <>
                                                        <Title>Company Roles</Title>
                                                        {/* <CompanyRolesTab /> */}
                                                    </>
                                                ),
                                            },
                                        ],
                                    },
                                    {
                                        path: 'user',
                                        element: (
                                            <>
                                                <Title>Company User</Title>
                                                <CompanyUserModule />
                                            </>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'hr',
                                element: (
                                    <>
                                        <Title>HR Module</Title>
                                        {/* <Outlet /> */}
                                    </>
                                ),
                                children: [
                                    {
                                        path: 'manager',
                                        element: (
                                            <>
                                                <Title>HR Manager</Title>
                                                <HrManagerModule />
                                            </>
                                        ),
                                    },
                                    {
                                        path: 'user',
                                        element: (
                                            <>
                                                <Title>HR User</Title>
                                                <HrUserModule />
                                            </>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'project',
                                element: (
                                    <>
                                        <Title>Project Module</Title>
                                        {/* <Outlet /> */}
                                    </>
                                ),
                                children: [
                                    {
                                        path: 'manager',
                                        element: <ProjectManagerModule />,
                                        children: [
                                            {
                                                path: 'dashboard',
                                                element: (
                                                    <>
                                                        <Title>Project Dashboard</Title>
                                                        {/* <ProjectDashboard /> */}
                                                    </>
                                                ),
                                            },
                                            {
                                                path: 'task/:id',
                                                element: (
                                                    <>
                                                        <Title>Task Detail</Title>
                                                        {/* <TaskDetail /> */}
                                                    </>
                                                ),
                                            },
                                        ],
                                    },
                                    {
                                        path: 'user',
                                        element: (
                                            <>
                                                <Title>Project User</Title>
                                                <ProjectUserModule />
                                            </>
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default router;