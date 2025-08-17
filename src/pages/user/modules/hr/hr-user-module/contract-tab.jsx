import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
    Typography,
    Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ContractService from "@services/hr-module-service/contract.service";
import toast from "@hooks/toast";
import { formatDateForUI } from "@tools/date.tool";
import { CONTRACT_STATUSES_MAP, CONTRACT_TYPES_MAP, EMPTY_VALUES } from "@configs/const.config";
import { currencyFormat } from "@tools/string.tool";


function HrUserModule() {
    const { t } = useTranslation();

    const { data: contracts = [], isLoading } = useQuery({
        queryKey: ["hr-contracts-me"],
        queryFn: async () => {
            const [res, err] = await ContractService.getMyContracts();
            if (err) return [];
            return res.data;
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    return (
        <Stack spacing={3}>
            <Typography variant="h6">
                {t('working.hr.contract.my-contracts')}
            </Typography>

            <DataGrid
                loading={isLoading}
                rowHeight={80}
                rows={contracts}
                getRowId={(row) => row?.id}
                disableRowSelectionOnClick
                columns={[
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
                    }
                ]}
            />
        </Stack>
    );
}

export default HrUserModule;