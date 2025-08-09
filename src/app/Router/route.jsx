import { createBrowserRouter } from 'react-router-dom';
import { ADMIN_ROUTE_TYPES, USER_ROUTE_TYPES } from '@app/Router/routeTypes/routeTypes';
import AdminMainLayout from '@layouts/admin/MainLayout';
import UserMainLayout from '@layouts/user/MainLayout';
import UserAuthLayout from '@layouts/user/AuthLayout';
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
import HrManagerModule from '@pages/user/modules/hr/HrManagerModule';
import HrUserModule from '@pages/user/modules/hr/HrUserModule';
import ProjectManagerModule from '@pages/user/modules/project/ProjectManagerModule';
import ProjectUserModule from '@pages/user/modules/project/ProjectUserModule';
import ProjectDashboard from '@pages/user/modules/project/ProjectManagerModule/ProjectDashboard';
import ProjectDetail from '@pages/user/modules/project/ProjectManagerModule/ProjectDetail';
import TaskDetail from '@pages/user/modules/project/ProjectManagerModule/TaskDetail';
import UserProjectDashboard from '@pages/user/modules/project/ProjectUserModule/UserProjectDashboard';
import UserProjectDetail from '@pages/user/modules/project/ProjectUserModule/UserProjectDetail';
import WrapPage from '@components/WrapPage';

const router = createBrowserRouter([
    {
        element: <ADMIN_ROUTE_TYPES.PRIVATE />,
        children: [
            {
                element: <AdminMainLayout />,
                children: [
                    { path: '/admin', element: <WrapPage title="Admin Dashboard" Component={Home} /> },
                ],
            },
        ],
    },
    {
        element: <USER_ROUTE_TYPES.PUBLIC />,
        children: [
            {
                element: <UserMainLayout />,
                children: [
                    { path: '/', element: <WrapPage title="Trang chủ" Component={Home} /> },
                    { path: '/home', element: <WrapPage title="Trang chủ" Component={Home} /> },
                    { path: '/404', element: <WrapPage title="Không tìm thấy trang" Component={NotFound} /> },
                    { path: '*', element: <WrapPage title="Không tìm thấy trang" Component={NotFound} /> },
                ],
            },
            {
                element: <UserAuthLayout />,
                path: '/auth',
                children: [
                    { path: 'login', element: <WrapPage title="Đăng nhập" Component={Login} /> },
                    { path: 'register', element: <WrapPage title="Đăng ký" Component={Register} /> },
                    { path: 'forgot-password', element: <WrapPage title="Lấy lại mật khẩu" Component={ForgotPassword} /> },
                    { path: 'logout', element: <WrapPage title="Đăng xuất" Component={Logout} /> },
                    { path: 'receive-refresh-token', element: <WrapPage title="Nhận tokens" Component={ReceiveTokens} /> },
                ],
            },
        ],
    },
    {
        element: <USER_ROUTE_TYPES.PRIVATE />,
        children: [
            {
                element: <UserMainLayout />,
                children: [
                    { path: '/companies', element: <WrapPage title="Danh sách công ty" Component={Companies} /> },
                ],
            },
            {
                path: '/working/:moduleCode?/:role?/*',
                element: <WorkingLayout />,
                children: [
                    {
                        path: 'company/manager/:tab?',
                        element: <WrapPage title="Quản lý công ty" Component={CompanyManagerModule} />,
                    },
                    {
                        path: 'company/user/:tab?',
                        element: <WrapPage title="Công ty của tôi" Component={CompanyUserModule} />,
                    },
                    {
                        path: 'project/manager/*',
                        element: <WrapPage title="Quản lý dự án" Component={ProjectManagerModule} />,
                        children: [
                            {
                                index: true,
                                element: <WrapPage title="Dashboard dự án" Component={ProjectDashboard} />,
                            },
                            {
                                path: ":projectId/:tab?",
                                element: <WrapPage title="Chi tiết dự án" Component={ProjectDetail} />,
                            },
                            {
                                path: "task/:taskId",
                                element: <WrapPage title="Chi tiết công việc" element={<TaskDetail isManager={true} />} />,
                            }
                        ]
                    },
                    {
                        path: 'project/user/*',
                        element: <WrapPage title="Dự án của tôi" Component={ProjectUserModule} />,
                        children: [
                            {
                                index: true,
                                element: <WrapPage title="Dashboard dự án" Component={UserProjectDashboard} />,
                            },
                            {
                                path: ":projectId/:tab?",
                                element: <WrapPage title="Chi tiết dự án" Component={UserProjectDetail} />,
                            },
                            {
                                path: "task/:taskId",
                                element: <WrapPage title="Chi tiết công việc" element={<TaskDetail isManager={false} />} />,
                            }
                        ]
                    },
                    {
                        path: 'hr/manager/:tab?',
                        element: <WrapPage title="Quản lý nhân sự" Component={HrManagerModule} />,
                    },
                    {
                        path: 'hr/user/:tab?',
                        element: <WrapPage title="Nhân sự của tôi" Component={HrUserModule} />,
                    },
                ],
            }
        ],
    },
]);

export default router;