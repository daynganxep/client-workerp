import { useState, useEffect } from "react";
import CompanyModuleRolesService from "@services/compay-module-service/company-module-roles.service";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox, Button, Select, MenuItem } from "@mui/material";
import toast from "@hooks/toast";
import "./.scss";
import { useSelector } from "react-redux";

function CompanyModuleRolesTab() {
    const [cmrs, setCmrs] = useState([]);
    const [users, setUsers] = useState([]);
    const [modules, setModules] = useState([]);
    const employeesMap = useSelector((state) => state.company.employeesMap);

    // Lấy dữ liệu từ API
    async function fetchCmrs() {
        const [res, err] = await CompanyModuleRolesService.getAllByManager();
        if (err) return toast.error(err.code);
        const data = res.data;

        // Nhóm dữ liệu theo userId và moduleCode
        const uniqueUsers = [...new Set(data.map((item) => item.userId))];
        const uniqueModules = [...new Set(data.map((item) => item.moduleCode))];
        setUsers(uniqueUsers);
        setModules(uniqueModules);
        setCmrs(data);
    }

    useEffect(() => {
        fetchCmrs();
    }, []);

    // Tìm CMR theo userId và moduleCode
    const getCmr = (userId, moduleCode) => {
        return (
            cmrs.find(
                (cmr) => cmr.userId === userId && cmr.moduleCode === moduleCode,
            ) || { active: false, moduleRoles: [] }
        );
    };

    // Xử lý thay đổi active
    const handleActiveChange = (userId, moduleCode, checked) => {
        setCmrs((prev) =>
            prev.map((cmr) =>
                cmr.userId === userId && cmr.moduleCode === moduleCode
                    ? { ...cmr, active: checked }
                    : cmr,
            ),
        );
    };

    // Xử lý thay đổi moduleRoles
    const handleRolesChange = (userId, moduleCode, roles) => {
        setCmrs((prev) =>
            prev.map((cmr) =>
                cmr.userId === userId && cmr.moduleCode === moduleCode
                    ? { ...cmr, moduleRoles: roles }
                    : cmr,
            ),
        );
    };

    // Lưu thay đổi
    const handleSave = async () => {
        const requests = cmrs.map((cmr) => ({
            id: cmr.id,
            active: cmr.active,
            moduleRoles: cmr.moduleRoles,
        }));
        const [res, err] = await CompanyModuleRolesService.modifyMany(requests);
        if (err) return toast.error(err.code);
        toast.success("Roles updated successfully");
        fetchCmrs();
    };

    // Định nghĩa cột cho DataGrid
    const columns = [
        { field: "id", headerName: "Mã nhân viên", width: 200 },
        {
            field: "userId",
            headerName: "Nhân viên",
            width: 250,
            renderCell: (params) => {
                const employee = employeesMap[params.value];
                return employee ? `${employee.name}` : params.value;
            },
        },
        ...modules.map((module) => ({
            field: module,
            headerName: module,
            width: 200,
            renderCell: (params) => {
                const cmr = getCmr(params.row.userId, module);
                return (
                    <div className="cell-content">
                        <Checkbox
                            checked={cmr.active}
                            onChange={(e) =>
                                handleActiveChange(
                                    params.row.userId,
                                    module,
                                    e.target.checked,
                                )
                            }
                        />
                        <Select
                            multiple
                            value={cmr.moduleRoles}
                            onChange={(e) =>
                                handleRolesChange(
                                    params.row.userId,
                                    module,
                                    e.target.value,
                                )
                            }
                            disabled={!cmr.active}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="USER">USER</MenuItem>
                            <MenuItem value="MANAGER">MANAGER</MenuItem>
                        </Select>
                    </div>
                );
            },
        })),
    ];

    // Định nghĩa hàng cho DataGrid
    const rows = users.map((userId) => ({
        id: userId, // DataGrid yêu cầu id duy nhất
        userId,
    }));

    return (
        <div className="company-roles-tab">
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                />
            </div>
            <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
            >
                Lưu thay đổi
            </Button>
        </div>
    );
}

export default CompanyModuleRolesTab;
