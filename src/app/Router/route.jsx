import { createBrowserRouter, Navigate } from 'react-router-dom';
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
// import CompanyDashboard from '@pages/user/modules/company/CompanyDashboard';
// import CompanyEmployeesTab from '@pages/user/modules/company/CompanyEmployeesTab';
import HrManagerModule from '@pages/user/modules/hr/HrManagerModule';
import HrUserModule from '@pages/user/modules/hr/HrUserModule';
// import HrDashboard from '@pages/user/modules/hr/HrDashboard';
// import EmployeeList from '@pages/user/modules/hr/EmployeeList';
// import DepartmentList from '@pages/user/modules/hr/DepartmentList';
import ProjectManagerModule from '@pages/user/modules/project/ProjectManagerModule';
import ProjectUserModule from '@pages/user/modules/project/ProjectUserModule';
//import ProjectDashboard from '@pages/user/modules/project/ProjectDashboard';
// import ProjectList from '@pages/user/modules/project/ProjectList';
// import ProjectDetail from '@pages/user/modules/project/ProjectDetail';
// import ProjectOverview from '@pages/user/modules/project/ProjectOverview';
// import ProjectTasks from '@pages/user/modules/project/ProjectTasks';
// import ProjectMembers from '@pages/user/modules/project/ProjectMembers';
// import ProjectSettings from '@pages/user/modules/project/ProjectSettings';
// import TaskDetail from '@pages/user/modules/project/TaskDetail';
// import UserTasks from '@pages/user/modules/project/UserTasks';
// import UserProjects from '@pages/user/modules/project/UserProjects';

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
                            // Default redirect
                            {
                                path: '',
                                element: <Navigate to="user" replace />,
                            },
                            // Company Module Routes
                            {
                                path: 'company',
                                children: [
                                    {
                                        path: 'manager',
                                        element: <CompanyManagerModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="dashboard" replace />
                                            },
                                            // {
                                            //     path: 'dashboard',
                                            //     element: <CompanyDashboard />
                                            // },
                                            {
                                                path: 'info',
                                                element: <CompanyInfoTab />
                                            },
                                            {
                                                path: 'roles',
                                                element: <CompanyModuleRolesTab />
                                            },
                                            // {
                                            //     path: 'employees',
                                            //     element: <CompanyEmployeesTab />
                                            // }
                                        ]
                                    },
                                    {
                                        path: 'user',
                                        element: <CompanyUserModule />
                                    }
                                ]
                            },
                            // Project Module Routes
                            {
                                path: 'project',
                                children: [
                                    {
                                        path: 'manager',
                                        element: <ProjectManagerModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="dashboard" replace />
                                            },
                                        ]
                                    },
                                    {
                                        path: 'user',
                                        element: <ProjectUserModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="my-tasks" replace />
                                            },
                                        ]
                                    }
                                ]
                            },
                            /*{
                                path: 'project',
                                children: [
                                    {
                                        path: 'manager',
                                        element: <ProjectManagerModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="dashboard" replace />
                                            },
                                            {
                                                path: 'dashboard',
                                                element: <ProjectDashboard />
                                            },
                                            {
                                                path: 'projects',
                                                element: <ProjectList />,
                                            },
                                            {
                                                path: 'projects/:projectId',
                                                element: <ProjectDetail />,
                                                children: [
                                                    {
                                                        index: true,
                                                        element: <Navigate to="overview" replace />
                                                    },
                                                    {
                                                        path: 'overview',
                                                        element: <ProjectOverview />
                                                    },
                                                    {
                                                        path: 'tasks',
                                                        element: <ProjectTasks />
                                                    },
                                                    {
                                                        path: 'members',
                                                        element: <ProjectMembers />
                                                    },
                                                    {
                                                        path: 'settings',
                                                        element: <ProjectSettings />
                                                    }
                                                ]
                                            },
                                            {
                                                path: 'tasks/:taskId',
                                                element: <TaskDetail />
                                            }
                                        ]
                                    },
                                    {
                                        path: 'user',
                                        element: <ProjectUserModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="my-tasks" replace />
                                            },
                                            {
                                                path: 'my-tasks',
                                                element: <UserTasks />
                                            },
                                            {
                                                path: 'my-projects',
                                                element: <UserProjects />
                                            }
                                        ]
                                    }
                                ]
                            },*/
                            // HR Module Routes
                            {
                                path: 'hr',
                                children: [
                                    {
                                        path: 'manager',
                                        element: <HrManagerModule />,
                                        children: [
                                            {
                                                index: true,
                                                element: <Navigate to="dashboard" replace />
                                            },
                                            // {
                                            //     path: 'dashboard',
                                            //     element: <HrDashboard />
                                            // },
                                            // {
                                            //     path: 'employees',
                                            //     element: <EmployeeList />
                                            // },
                                            // {
                                            //     path: 'departments',
                                            //     element: <DepartmentList />
                                            // }
                                        ]
                                    },
                                    {
                                        path: 'user',
                                        element: <HrUserModule />
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ],
    },
]);

export default router;