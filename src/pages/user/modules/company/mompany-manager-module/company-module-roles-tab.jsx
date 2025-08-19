import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import { Checkbox, Button, Select, MenuItem, Stack } from "@mui/material";
import CompanyModuleRolesService from "@services/compay-module-service/company-module-roles.service";
import { MODULE_OPTIONS_MAP, MODULE_ROLES_MAP } from "@configs/const.config";
import toast from "@hooks/toast";
import { Cancel, Save } from "@mui/icons-material";
import Employee from "@components/working/employee";

function CompanyModuleRolesTab() {
    const { t } = useTranslation();
    const [cmrs, setCmrs] = useState([]);
    const users = [...new Set(cmrs.map((item) => item.userId))];
    const modules = [...new Set(cmrs.map((item) => item.moduleCode))];

    const { refetch, isLoading } = useQuery({
        queryKey: ["company-module-roles"],
        queryFn: async () => {
            const [res, err] = await CompanyModuleRolesService.getAllByManager();
            if (err) throw new Error(err.code);
            setCmrs(res.data);
            return res.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate, isPending: isSaving } = useMutation({
        mutationFn: async (requests) => {
            const [res, err] = await CompanyModuleRolesService.modifyMany(requests);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            toast.success(res.code);
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const getCmr = (userId, moduleCode) => {
        return (
            cmrs.find((cmr) => cmr.userId === userId && cmr.moduleCode === moduleCode) || {
                active: false,
                moduleRoles: [],
            }
        );
    };

    const handleActiveChange = (userId, moduleCode, checked) => {
        setCmrs((prev) =>
            prev.map((cmr) =>
                cmr.userId === userId && cmr.moduleCode === moduleCode ? { ...cmr, active: checked } : cmr
            )
        );
    };

    const handleRolesChange = (userId, moduleCode, roles) => {
        setCmrs((prev) =>
            prev.map((cmr) =>
                cmr.userId === userId && cmr.moduleCode === moduleCode
                    ? { ...cmr, moduleRoles: roles }
                    : cmr
            )
        );
    };

    const handleSave = () => { mutate(cmrs) };

    const columns = [
        { field: "id", headerName: t("working.company.user-id"), width: 120 },
        {
            field: "userId",
            headerName: t("working.company.employee"),
            width: 200,
            renderCell: (params) => <Employee employeeId={params?.row?.id} showName />
        },
        ...modules.map((module) => ({
            field: module,
            headerName: MODULE_OPTIONS_MAP[module].label,
            width: 260,
            renderCell: (params) => {
                const cmr = getCmr(params.row.userId, module);
                return (
                    <div>
                        <Checkbox
                            checked={cmr.active}
                            onChange={(e) => handleActiveChange(params.row.userId, module, e.target.checked)}
                        />
                        <Select
                            multiple
                            value={cmr.moduleRoles}
                            onChange={(e) => handleRolesChange(params.row.userId, module, e.target.value)}
                            disabled={!cmr.active}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="USER">{MODULE_ROLES_MAP["USER"].label}</MenuItem>
                            <MenuItem value="MANAGER">{MODULE_ROLES_MAP["MANAGER"].label}</MenuItem>
                        </Select>
                    </div>
                );
            },
        })),
    ];

    const rows = users.map((userId) => ({
        id: userId,
        userId,
    }));

    return (
        <Stack spacing={2}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowHeight={80}
                disableSelectionOnClick
                sx={{ maxHeight: 600, minHeight: 300 }}
                loading={isLoading}
            />
            <Stack direction="row" justifyContent="flex-end" gap={2}>
                <Button
                    onClick={refetch}
                    variant="outlined"
                    color="info"
                    startIcon={<Cancel />}
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isSaving}
                    loading={isSaving}
                    startIcon={<Save />}
                >
                    {t("working.company.save-changes")}
                </Button>
            </Stack>
        </Stack>
    );
}

export default CompanyModuleRolesTab;