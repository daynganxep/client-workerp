import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, Routes, Route } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MODULE_OPTIONS_MAP } from "@configs/const.config.jsx";
import { ModuleComponents } from "./ModuleComponents";
import ModuleContentLayout from "./ModuleContentLayout";
import CompanyModuleRolesService from "@services/compay-module-service/company-module-roles.service";
import { companyActions } from "@redux/slices/company.slide";
import toast from "@hooks/toast";
import ".scss";

function WorkingLayout() {
    const {
        id: companyId,
        name,
        companyModuleRoles: modules,
    } = useSelector((state) => state.company);
    const { moduleCode } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useDispatch();

    const currentModule = modules.find(
        (m) => m.moduleCode.toLowerCase() === moduleCode?.toLowerCase(),
    );

    const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const fetchCompanyModuleRoles = async () => {
        const [res, err] = await CompanyModuleRolesService.getByEmployee(
            companyId,
        );
        if (err) {
            toast.error("Lỗi khi lấy company-module-roles");
            return;
        }
        dispatch(companyActions.setCompanyModuleRoles(res.data));
    };

    useEffect(() => {
        if (!modules || modules.length === 0) fetchCompanyModuleRoles();
    }, []);

    return (
        <div className="working-layout">
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                className={`sidebar ${
                    isSidebarOpen ? "expanded" : "collapsed"
                }`}
                classes={{
                    paper: `sidebar-paper ${
                        isSidebarOpen ? "expanded" : "collapsed"
                    }`,
                }}
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
                <Divider />
                <List className="module-list">
                    {modules.map((module) => {
                        const moduleConfig =
                            MODULE_OPTIONS_MAP[module.moduleCode.toUpperCase()];
                        return (
                            <ListItem
                                button
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
                <Divider />
                <Box className="sidebar-footer">
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    {isSidebarOpen && (
                        <Avatar alt="Employee Name" src="/path/to/avatar.jpg" />
                    )}
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box className="main-content">
                <Box className="content-header">
                    <Typography variant="h5" className="module-title">
                        {currentModule
                            ? MODULE_OPTIONS_MAP[
                                  currentModule.moduleCode.toUpperCase()
                              ]?.label
                            : "Working"}
                    </Typography>
                </Box>
                <Box className="module-content">
                    <Routes>
                        {modules.map(({ moduleCode, moduleRoles }) => {
                            const components =
                                ModuleComponents[moduleCode] || {};
                            const { ManagerModule, UserModule } = components;
                            return (
                                <Route
                                    key={`module-content-${moduleCode}`}
                                    path={moduleCode.toLowerCase()}
                                    element={
                                        <ModuleContentLayout
                                            ManagerModule={ManagerModule}
                                            UserModule={UserModule}
                                            moduleRoles={moduleRoles}
                                        />
                                    }
                                />
                            );
                        })}
                        <Route path="*" element={<div>Module not found</div>} />
                    </Routes>
                </Box>
            </Box>
        </div>
    );
}

export default WorkingLayout;
