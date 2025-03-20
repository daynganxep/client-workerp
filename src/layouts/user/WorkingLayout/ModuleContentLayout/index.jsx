import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import ".scss";

function ModuleContentLayout({
    ManagerModule,
    UserModule,
    moduleRoles = ["USER"],
}) {
    const hasMultipleRoles = moduleRoles.length > 1;
    const [selectedRole, setSelectedRole] = useState(moduleRoles[0] || null);

    useEffect(() => {
        setSelectedRole(moduleRoles[0] || null);
    }, [moduleRoles]);

    const handleRoleChange = (event, newRole) => {
        setSelectedRole(newRole);
    };

    const renderModule = () => {
        switch (selectedRole) {
            case "MANAGER":
                return ManagerModule ? (
                    <ManagerModule />
                ) : (
                    <div>Manager view not available</div>
                );
            case "USER":
                return UserModule ? (
                    <UserModule />
                ) : (
                    <div>User view not available</div>
                );
            default:
                return <div>No role selected</div>;
        }
    };

    return (
        <Box className="module-content-layout">
            {hasMultipleRoles && (
                <Tabs
                    value={selectedRole}
                    onChange={handleRoleChange}
                    centered
                    className="role-switcher"
                >
                    {moduleRoles.map((role) => (
                        <Tab key={role} label={role} value={role} />
                    ))}
                </Tabs>
            )}

            <Box className="module-content">{renderModule()}</Box>
        </Box>
    );
}

export default ModuleContentLayout;
