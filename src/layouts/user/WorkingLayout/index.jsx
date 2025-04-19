import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
    Container,
    Avatar,
    useTheme,
    useMediaQuery,
    Tooltip,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MODULE_OPTIONS_MAP } from '@configs/const.config';
import CompanyModuleRolesService from '@services/compay-module-service/company-module-roles.service';
import EmployeeService from '@services/hr-module-service/employee.service';
import ThemeToggleButton from '@components/ThemeToggleButton';
import { companyActions } from '@redux/slices/company.slice';
import '.scss';

function WorkingLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {
        id: companyId,
        name,
        companyModuleRoles: modules,
    } = useSelector((state) => state.company);
    const location = useLocation();
    const [, , moduleCode, role, tab] = location.pathname.split("/");
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const dispatch = useDispatch();

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
        console.log({ err1, err2, err3 })
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

    // Breadcrumbs
    const breadcrumbs = [
        <Typography
            key="module"
            sx={{ color: theme.palette.text.primary }}
        >
            {moduleCode?.charAt(0).toUpperCase() + moduleCode?.slice(1).replace('-', ' ') || 'Working'}
        </Typography>,
        tab && (
            <Typography
                key="tab"
                sx={{ color: theme.palette.text.primary }}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </Typography>
        ),
    ];

    // Drawer content
    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                overflow: 'hidden',
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
            <List
                sx={{
                    flexGrow: 1,
                    px: isSidebarOpen ? 1.5 : 1,
                    py: 1,
                    overflow: 'hidden',
                    '& .MuiListItem-root': {
                        width: isSidebarOpen ? 'auto' : '40px',
                        height: isSidebarOpen ? 'auto' : '40px',
                        mx: isSidebarOpen ? 0 : 'auto',
                    },
                }}
            >
                {modules.map((module) => {
                    const moduleConfig = MODULE_OPTIONS_MAP[module.moduleCode.toUpperCase()];
                    const isActive = module.moduleCode.toLowerCase() === moduleCode?.toLowerCase();
                    return (
                        <ListItem
                            key={module.id}
                            button
                            component={Link}
                            to={`/working/${module.moduleCode.toLowerCase()}/${module.moduleRoles[0].toLowerCase()}`}
                            sx={{
                                borderRadius: theme.shape.borderRadius,
                                color: theme.palette.text.primary,
                                mb: 1,
                                transition: 'all 0.3s ease',
                                bgcolor: isActive ? theme.palette.primary.main : 'transparent',
                                p: isSidebarOpen ? undefined : '12px',
                                justifyContent: 'center',
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
                                    minWidth: isSidebarOpen ? 40 : 'auto',
                                    mr: isSidebarOpen ? undefined : 0,
                                    justifyContent: 'center',
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
                })}
            </List>

            {/* Sidebar footer */}
            <Box
                sx={{
                    px: 1.5,
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
                {isSidebarOpen && <ThemeToggleButton />}
                {isSidebarOpen && (
                    <Avatar alt="Employee Name" src="/path/to/avatar.jpg" />
                )}
            </Box>
        </Box>
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
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Left side - Breadcrumbs */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            sx={{ color: theme.palette.text.primary }}
                        >
                            {breadcrumbs}
                        </Breadcrumbs>
                    </Box>

                    {/* Right side - Role Switcher */}
                    {hasMultipleRoles && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: theme.palette.action.hover,
                                borderRadius: '20px',
                                p: 0.5,
                            }}
                        >
                            {moduleRoles.map((r) => {
                                const isActive = role?.toUpperCase() === r;
                                return (
                                    <Button
                                        key={r}
                                        component={Link}
                                        to={`/working/${moduleCode}/${r.toLowerCase()}`}
                                        variant={isActive ? 'contained' : 'text'}
                                        size="small"
                                        sx={{
                                            minWidth: 100,
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            px: 2,
                                            py: 0.75,
                                            color: isActive
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.text.primary,
                                            bgcolor: isActive ? theme.palette.primary.main : 'transparent',
                                            '&:hover': {
                                                bgcolor: isActive
                                                    ? theme.palette.primary.dark
                                                    : theme.palette.action.focus,
                                                transform: 'translateY(-1px)',
                                            },
                                            transition: theme.transitions.create(
                                                ['background-color', 'transform', 'box-shadow'],
                                                { duration: 200 }
                                            ),
                                            ...(isActive && {
                                                boxShadow: theme.shadows[2],
                                                '&:hover': {
                                                    boxShadow: theme.shadows[4],
                                                },
                                            }),
                                        }}
                                    >
                                        {r == "MANAGER" ? "QUẢN LÝ" : "NGƯỜI DÙNG"}
                                    </Button>
                                );
                            })}
                        </Box>
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
                    <Container maxWidth="100%" sx={{ py: 3 }}>
                        <Outlet context={{ moduleCode, role, tab }} />
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