import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Stack } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Employee from "@components/working/employee";
import UpdateEmployeeDialog from "./update-employee-dialog";
import EmployeeService from "@services/hr-module-service/employee.service";
import DepartmentService from "@services/hr-module-service/department.service";
import PositionService from "@services/hr-module-service/position.service";
import toast from "@hooks/toast";
import { formatDateForUI } from "@tools/date.tool";
import InviteEmployeeDialog from "./invite-employee-dialog";
import { useQuery } from "@tanstack/react-query";
import { EMPTY_VALUES } from "@configs/const.config";

function EmployeeTab() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);

    const { data: employees = [], refetch } = useQuery({
        queryKey: ["hr-employees", companyId],
        queryFn: async () => {
            const [res, err] = await EmployeeService.getEmployeesByCompanyId(
                companyId,
            );
            if (err) return toast.error(err.code);
            return res.data
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    const { data: departments = [] } = useQuery({
        queryKey: ["hr-departments", companyId],
        queryFn: async () => {
            const [res, err] = await DepartmentService.getDepartmentsByCompanyId(
                companyId,
            );
            if (err) return toast.error(err.code);
            return res.data
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    const { data: positions = [] } = useQuery({
        queryKey: ["hr-positions", companyId],
        queryFn: async () => {
            const [res, err] = await PositionService.getPositionsByCompanyId(
                companyId,
            );
            if (err) return toast.error(err.code);
            return res.data
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{t('working.hr.employee.employee-list')}</Typography>
                <InviteEmployeeDialog></InviteEmployeeDialog>
            </Stack>
            <DataGrid
                rowHeight={80}
                rows={employees}
                getRowId={(row) => row?.id}
                disableRowSelectionOnClick
                columns={[
                    {
                        field: 'name',
                        headerName: t('model.hr.employee.name'),
                        flex: 2,
                        renderCell: (params) => <Employee employeeId={params?.row?.id} size={1.2} showName />
                    },
                    {
                        field: 'dob',
                        headerName: t('model.hr.employee.dob'),
                        flex: 1,
                        valueGetter: (value) => value ? formatDateForUI(value) : EMPTY_VALUES.DATE
                    },
                    {
                        field: 'department',
                        headerName: t('model.hr.employee.department'),
                        flex: 1,
                        valueGetter: (value) => value?.name || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'position',
                        headerName: t('model.hr.employee.position'),
                        flex: 1,
                        valueGetter: (value) => value?.name || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'email',
                        headerName: t('model.hr.employee.email'),
                        flex: 1,
                        valueGetter: (value) => value || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'phone',
                        headerName: t('model.hr.employee.phone'),
                        flex: 1,
                        valueGetter: (value) => value || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'actions',
                        headerName: t('common.actions'),
                        flex: 1,
                        sortable: false,
                        filterable: false,
                        renderCell: (params) => <UpdateEmployeeDialog employee={params?.row} departments={departments} positions={positions} refetch={refetch} />
                    }
                ]}
            />
        </Stack >
    );
}

export default EmployeeTab;
