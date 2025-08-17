import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    MenuItem,
    Select,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Employee from "@components/working/employee";
import CreateContractDialog from "./create-contract-dialog";
import ContractService from "@services/hr-module-service/contract.service";
import EmployeeService from "@services/hr-module-service/employee.service";
import toast from "@hooks/toast";
import { formatDateForUI } from "@tools/date.tool";
import { currencyFormat } from "@tools/string.tool";
import { CONTRACT_STATUSES_MAP, CONTRACT_TYPES_MAP, EMPTY_VALUES } from "@configs/const.config";
import UpdateContractDialog from "./update-contract-dialog";
import ConfirmDialog from "@components/dialog/confirm-dialog";

function ContractTab() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    const { data: employees = [] } = useQuery({
        queryKey: ["hr-employees", companyId],
        queryFn: async () => {
            const [res, err] = await EmployeeService.getEmployeesByCompanyId(
                companyId,
            );
            if (err) return [];
            return res.data;
        },
        onError: (code) => {
            toast.error(code);
        },
        enabled: !!selectedEmployeeId,
    });

    const { data: contracts = [], refetch, isLoading } = useQuery({
        queryKey: ["hr-contracts", selectedEmployeeId],
        queryFn: async () => {
            const [res, err] = await ContractService.getContractsByEmployeeId(selectedEmployeeId);
            if (err) return [];
            return res.data;
        },
        onError: (code) => {
            toast.error(code);
        },
        enabled: !!selectedEmployeeId,
    });

    const handleDelete = async (contractId) => {
        const [res, err] = await ContractService.deleteContract(contractId);
        if (err) return toast.error(err.code);
        toast.success(res.code);
        refetch();
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="start">
                <Typography variant="h6">{t('working.hr.contract.contract-list')}</Typography>
                <Select
                    fullWidth
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    displayEmpty
                    sx={{ maxWidth: 300 }}
                >
                    {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.name}
                        </MenuItem>
                    ))}
                </Select>
                <CreateContractDialog employeeId={selectedEmployeeId} refetch={refetch} />
            </Stack>
            <DataGrid
                loading={isLoading}
                rowHeight={80}
                rows={contracts}
                getRowId={(row) => row?.id}
                disableRowSelectionOnClick
                columns={[
                    {
                        field: 'employeeId',
                        headerName: t('model.hr.contract.employee'),
                        flex: 2,
                        renderCell: (params) => <Employee employeeId={params?.row?.employeeId} size={1.2} showName />
                    },
                    {
                        field: 'startDate',
                        headerName: t('model.hr.contract.start-date'),
                        flex: 1,
                        valueGetter: (value) => value ? formatDateForUI(value) : EMPTY_VALUES.DATE
                    },
                    {
                        field: 'endDate',
                        headerName: t('model.hr.contract.end-date'),
                        flex: 1,
                        valueGetter: (value) => value ? formatDateForUI(value) : EMPTY_VALUES.DATE
                    },
                    {
                        field: 'salary',
                        headerName: t('model.hr.contract.salary'),
                        flex: 1,
                        valueGetter: (value) => value ? currencyFormat(value) : EMPTY_VALUES.STRING
                    },
                    {
                        field: 'type',
                        headerName: t('model.hr.contract.type'),
                        flex: 1,
                        valueGetter: (value) => value ? CONTRACT_TYPES_MAP[value].label : EMPTY_VALUES.STRING
                    },
                    {
                        field: 'status',
                        headerName: t('model.hr.contract.status'),
                        flex: 1,
                        valueGetter: (value) => value ? CONTRACT_STATUSES_MAP[value].label : EMPTY_VALUES.STRING
                    },
                    {
                        field: 'actions',
                        headerName: t('common.actions'),
                        flex: 1,
                        sortable: false,
                        filterable: false,
                        renderCell: (params) => (<Stack height="100%" direction="row" justifyContent="start" alignContent="center" gap={2}>
                            <UpdateContractDialog contract={params?.row} refetch={refetch} />
                            <ConfirmDialog
                                type="delete"
                                title="working.hr.contract.confirm-delete-contract"
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
        </Stack>
    );
}

export default ContractTab;
