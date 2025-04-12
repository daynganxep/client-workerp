import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    Typography,
    IconButton,
    Avatar,
    List,
    ListItem,
    Drawer,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
    Breadcrumbs,
    Tabs,
    Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { MODULE_OPTIONS_MAP } from "@configs/const.config";
import { ModuleComponents } from "./moduleComponents";
import CompanyModuleRolesService from "@services/compay-module-service/company-module-roles.service";
import { companyActions } from "@redux/slices/company.slide";
import "./.scss";
import EmployeeService from "@services/hr-module-service/employee.service";

function WorkingLayout() {
    const {
        id: companyId,
        name,
        companyModuleRoles: modules,
    } = useSelector((state) => state.company);
    const { moduleCode } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);
    const dispatch = useDispatch();

    const currentModule = modules.find(
        (m) => m.moduleCode.toLowerCase() === moduleCode?.toLowerCase(),
    );
    const moduleRoles = currentModule?.moduleRoles || ["USER"];
    const hasMultipleRoles = moduleRoles.length > 1;

    const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleRoleChange = (event, newRole) => setSelectedRole(newRole);

    const handleComeInCompany = async () => {
        const [[res1, err1], [res2, err2], [res3, err3]] = await Promise.all([
            EmployeeService.getCompanyEmployees(companyId),
            CompanyModuleRolesService.getByEmployee(companyId),
            EmployeeService.getMyEmployeeInfo(),
        ]);

        if (err1 || err2 || err3) {
            return;
        }

        dispatch(companyActions.setEmployees(res1.data));
        dispatch(companyActions.setCompanyModuleRoles(res2.data));
        dispatch(companyActions.setEmployeeInfo(res3.data));
    };

    useEffect(() => {
        handleComeInCompany();
    }, [companyId]);

    useEffect(() => {
        if (moduleRoles && moduleRoles.length > 0) {
            setSelectedRole(moduleRoles[0]);
        }
    }, [moduleRoles]);

    const renderModuleContent = () => {
        if (!moduleCode || !selectedRole) {
            return <div>Loading module...</div>;
        }

        const components = ModuleComponents[moduleCode.toUpperCase()] || {};
        const { ManagerModule, UserModule } = components;

        if (selectedRole === "MANAGER" && ManagerModule) {
            return <ManagerModule />;
        } else if (selectedRole === "USER" && UserModule) {
            return <UserModule />;
        } else {
            return <div>Module not available for this role</div>;
        }
    };

    return (
        <div className="working-layout">
            <div
                className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"
                    } layout-part`}
            >
                <Box className="sidebar-header">
                    <IconButton onClick={handleToggleSidebar}>
                        {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    {isSidebarOpen && (
                        <Typography variant="h6" className="company-name">
                            {name}
                        </Typography>
                    )}
                </Box>
                <List className="module-list">
                    {modules.map((module) => {
                        const moduleConfig =
                            MODULE_OPTIONS_MAP[module.moduleCode.toUpperCase()];
                        return (
                            <ListItem
                                button={true}
                                key={module.id}
                                component={Link}
                                to={`/working/${module.moduleCode.toLowerCase()}`}
                                className={
                                    module.moduleCode.toLowerCase() ===
                                        moduleCode
                                        ? "active"
                                        : ""
                                }
                            >
                                <ListItemIcon>
                                    {moduleConfig?.icon}
                                </ListItemIcon>
                                {isSidebarOpen && (
                                    <ListItemText
                                        primary={moduleConfig?.label}
                                    />
                                )}
                            </ListItem>
                        );
                    })}
                </List>
                <Box className="sidebar-footer">
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    {isSidebarOpen && (
                        <Avatar alt="Employee Name" src="/path/to/avatar.jpg" />
                    )}
                </Box>
            </div>
            <Box className="main-content">
                <Box className="content-header layout-part">
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        className="breadcrumb"
                    >
                        <Typography color="text.primary">
                            {MODULE_OPTIONS_MAP[
                                currentModule?.moduleCode.toUpperCase()
                            ]?.label || "Working"}
                        </Typography>
                    </Breadcrumbs>
                    {hasMultipleRoles && selectedRole && (
                        <Tabs
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="role-switcher"
                        >
                            {moduleRoles.map((role) => (
                                <Tab key={role} label={role} value={role} />
                            ))}
                        </Tabs>
                    )}
                </Box>
                <Box className="module-content layout-part">
                    {renderModuleContent()}
                </Box>
            </Box>
        </div>
    );
}

export default WorkingLayout;
