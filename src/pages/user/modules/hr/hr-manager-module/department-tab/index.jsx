import { useSelector } from "react-redux";
import {
    Typography,
    Stack,
    Button,
} from "@mui/material";
import DepartmentService from "@services/hr-module-service/department.service";
import toast from "@hooks/toast";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { EMPTY_VALUES } from "@configs/const.config";
import UpdateDepartmentDialog from "./update-department-dialog";
import CreateDepartmentDialog from "./create-department-dialog";
import ConfirmDialog from "@components/dialog/confirm-dialog";

function DepartmentTab() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);

    const { data: departments = [], refetch, isLoading } = useQuery({
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

    async function handleDelete(departmentId) {
        const [res, err] = await DepartmentService.deleteDepartment(departmentId);
        if (err) return toast.error(err.code);
        refetch();
        toast.success(res.code);
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{t('working.hr.department.department-list')}</Typography>
                <CreateDepartmentDialog refetch={refetch} />
            </Stack>
            <DataGrid
                loading={isLoading}
                rowHeight={80}
                rows={departments}
                getRowId={(row) => row?.id}
                disableRowSelectionOnClick
                columns={[
                    {
                        field: 'name',
                        headerName: t('model.hr.department.name'),
                        flex: 1,
                        valueGetter: (value) => value || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'description',
                        headerName: t('model.hr.department.description'),
                        flex: 1,
                        valueGetter: (value) => value || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'actions',
                        headerName: t('common.actions'),
                        flex: 1,
                        sortable: false,
                        filterable: false,
                        renderCell: (params) => (<Stack height="100%" direction="row" justifyContent="start" alignContent="center" gap={2}>
                            <UpdateDepartmentDialog department={params?.row} refetch={refetch} />
                            <ConfirmDialog
                                type="delete"
                                title="working.hr.department.confirm-delete-department"
                                cancelTitle="common.cancel"
                                confirmTitle="common.delete"
                                action={() => handleDelete(params?.row?.id)}
                                triggerButton={
                                    <Button variant="text" color="error">
                                        {t('common.delete')}
                                    </Button>
                                }
                            />
                        </Stack>)
                    }
                ]}
            />
        </Stack >
    );
}

export default DepartmentTab;
