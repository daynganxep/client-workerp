import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Breadcrumbs,
    Tabs,
    Tab,
    Container,
    Avatar,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MODULE_OPTIONS_MAP } from '@configs/const.config';
import CompanyModuleRolesService from '@services/compay-module-service/company-module-roles.service';
import EmployeeService from '@services/hr-module-service/employee.service';
import { companyActions } from '@redux/slices/company.slide';
import '.scss';
import ThemeToggleButton from '@components/ThemeToggleButton';

function WorkingLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        id: companyId,
        name,
        companyModuleRoles: modules,
    } = useSelector((state) => state.company);
    const { moduleCode, role } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const dispatch = useDispatch();
    const location = useLocation();


    // Module và role hiện tại
    const currentModule = modules.find(
        (m) => m.moduleCode.toLowerCase() === moduleCode?.toLowerCase()
    );
    const moduleRoles = currentModule?.moduleRoles || ['USER'];
    const hasMultipleRoles = moduleRoles.length > 1;

    // Toggle sidebar
    const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Fetch dữ liệu công ty
    const handleComeInCompany = useCallback(async () => {
        const [[res1, err1], [res2, err2], [res3, err3]] = await Promise.all([
            EmployeeService.getCompanyEmployees(companyId),
            CompanyModuleRolesService.getByEmployee(companyId),
            EmployeeService.getMyEmployeeInfo(),
        ]);

        if (!err1 && !err2 && !err3) {
            dispatch(companyActions.setEmployees(res1.data));
            dispatch(companyActions.setCompanyModuleRoles(res2.data));
            dispatch(companyActions.setEmployeeInfo(res3.data));
        }
    }, [companyId, dispatch]);

    useEffect(() => {
        if (companyId) {
            handleComeInCompany();
        }
    }, [companyId, handleComeInCompany]);

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        // Check for duplicate role in URL
        const pathParts = location.pathname.split('/');
        const lastTwo = pathParts.slice(-2);

        if (lastTwo[0] === lastTwo[1]) {
            // Remove duplicate by navigating to correct path
            const newPath = pathParts.slice(0, -1).join('/');
            navigate(newPath, { replace: true });
        }
    }, [location.pathname]);


    // Breadcrumbs
    const breadcrumbs = [
        <Typography
            key="module"
            sx={{ color: theme.palette.text.primary }}
        >
            {MODULE_OPTIONS_MAP[moduleCode?.toUpperCase()]?.label || 'Working'}
        </Typography>,
    ];

    // Drawer content
    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%', // Thêm width 100%
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden', // Thêm overflow hidden
            }}
        >
            {/* Sidebar header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <IconButton onClick={handleToggleSidebar}>
                    {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                {isSidebarOpen && (
                    <Tooltip title={name}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.text.primary,
                                ml: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '160px',
                            }}
                        >
                            {name}
                        </Typography>
                    </Tooltip>
                )}
            </Box>

            {/* Module list */}
            < List
                sx={{
                    flexGrow: 1,
                    px: isSidebarOpen ? 1.5 : 1, // Giảm padding khi thu nhỏ
                    py: 1,
                    overflow: 'hidden',
                    '& .MuiListItem-root': {
                        width: isSidebarOpen ? 'auto' : '40px', // Cố định width khi thu nhỏ
                        height: isSidebarOpen ? 'auto' : '40px', // Cố định height khi thu nhỏ
                        mx: isSidebarOpen ? 0 : 'auto', // Căn giữa item khi thu nhỏ
                    }
                }}
            >
                {
                    modules.map((module) => {
                        const moduleConfig = MODULE_OPTIONS_MAP[module.moduleCode.toUpperCase()];
                        const isActive = module.moduleCode.toLowerCase() === moduleCode?.toLowerCase();
                        return (
                            <ListItem
                                key={module.id}
                                button
                                component={Link}
                                to={`/working/${module.moduleCode.toLowerCase()}/${module.moduleRoles[0].toLowerCase()}`} // Use module's roles directly
                                sx={{
                                    borderRadius: theme.shape.borderRadius,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                    transition: 'all 0.3s ease',
                                    bgcolor: isActive ? theme.palette.primary.main : 'transparent',
                                    p: isSidebarOpen ? undefined : '12px', // Điều chỉnh padding khi thu nhỏ
                                    justifyContent: 'center', // Căn giữa khi thu nhỏ
                                    '&:hover': {
                                        bgcolor: isActive
                                            ? theme.palette.primary.dark
                                            : theme.palette.action.hover,
                                        transform: 'scale(1.02)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive
                                            ? theme.palette.primary.contrastText
                                            : theme.palette.text.primary,
                                        minWidth: isSidebarOpen ? 40 : 'auto', // Bỏ minWidth khi thu nhỏ
                                        mr: isSidebarOpen ? undefined : 0, // Bỏ margin khi thu nhỏ
                                        justifyContent: 'center', // Căn giữa icon
                                    }}
                                >
                                    {moduleConfig?.icon}
                                </ListItemIcon>
                                {isSidebarOpen && (
                                    <ListItemText
                                        primary={moduleConfig?.label}
                                        primaryTypographyProps={{
                                            color: isActive
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.primary,
                                        }}
                                    />
                                )}
                            </ListItem>
                        );
                    })
                }
            </List >

            {/* Sidebar footer */}
            < Box
                sx={{
                    px: 1.5, // Padding đồng nhất với List
                    py: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <IconButton sx={{ color: theme.palette.text.primary }}>
                    <NotificationsIcon />
                </IconButton>
                {
                    isSidebarOpen && (
                        <ThemeToggleButton></ThemeToggleButton>
                    )
                }
                {
                    isSidebarOpen && (
                        <Avatar alt="Employee Name" src="/path/to/avatar.jpg" />
                    )
                }
            </Box >
        </Box >
    );

    return (
        <Box
            className={`working-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
            sx={{ bgcolor: theme.palette.background.default }}
        >
            {/* Sidebar */}
            <Box
                className="working-sidebar"
                sx={{
                    borderRadius: theme.shape.borderRadius,
                    width: isSidebarOpen ? 240 : 60,
                    transition: 'width 0.3s ease-in-out',
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isSidebarOpen}
                    onClose={handleToggleSidebar}
                    sx={{
                        '& .MuiDrawer-paper': {
                            border: 'none',
                            position: 'relative',
                            height: '100%',
                            transition: 'width 0.3s ease-in-out',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Content wrapper */}
            <Box className="working-content">
                {/* Header */}
                <Box
                    className="working-header"
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        sx={{ color: theme.palette.text.primary }}
                    >
                        {breadcrumbs}
                    </Breadcrumbs>
                    {hasMultipleRoles && (
                        <Tabs
                            value={role?.toUpperCase() || moduleRoles[0]}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: '4px',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.3s ease',
                                },
                            }}
                        >
                            {moduleRoles.map((r) => (
                                <Tab
                                    key={r}
                                    label={r}
                                    value={r}
                                    component={Link}
                                    to={`/working/${moduleCode}/${r.toLowerCase()}`}
                                    sx={{
                                        borderRadius: theme.shape.borderRadius,
                                        textTransform: 'none',
                                        color: theme.palette.text.primary,
                                        mx: 0.5,
                                        transition: 'all 0.3s ease',
                                        bgcolor:
                                            role?.toUpperCase() === r
                                                ? theme.palette.primary.main
                                                : 'transparent',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            bgcolor: role?.toUpperCase() === r
                                                ? theme.palette.primary.dark
                                                : theme.palette.action.hover,
                                        },
                                    }}
                                />
                            ))}
                        </Tabs>
                    )}
                </Box>

                {/* Main content */}
                <Box
                    className="working-main"
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                    }}
                >
                    <Container maxWidth="lg" sx={{ py: 3 }}>
                        <Outlet />
                        {/* Placeholder nếu Outlet trống */}
                        {!Outlet && (
                            <Typography
                                variant="h6"
                                sx={{ color: theme.palette.text.secondary, textAlign: 'center', mt: 4 }}
                            >
                                Chưa có nội dung cho module này
                            </Typography>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default WorkingLayout;