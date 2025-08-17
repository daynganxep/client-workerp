import { useSelector } from "react-redux";
import {
    Typography,
    Stack,
    Button,
} from "@mui/material";
import toast from "@hooks/toast";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { EMPTY_VALUES } from "@configs/const.config";
import CreatePositionDialog from "./create-position-dialog";
import ConfirmDialog from "@components/dialog/confirm-dialog";
import PositionService from "@services/hr-module-service/position.service";
import UpdatePositionDialog from "./update-position-dialog";

function PositionTab() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);

    const { data: positions = [], refetch, isLoading } = useQuery({
        queryKey: ["hr-position", companyId],
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

    async function handleDelete(positionId) {
        const [res, err] = await PositionService.deletePosition(positionId);
        if (err) return toast.error(err.code);
        refetch();
        toast.success(res.code);
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{t('working.hr.position.position-list')}</Typography>
                <CreatePositionDialog refetch={refetch} />
            </Stack>
            <DataGrid
                loading={isLoading}
                rowHeight={80}
                rows={positions}
                getRowId={(row) => row?.id}
                disableRowSelectionOnClick
                columns={[
                    {
                        field: 'name',
                        headerName: t('model.hr.position.name'),
                        flex: 1,
                        valueGetter: (value) => value || EMPTY_VALUES.STRING
                    },
                    {
                        field: 'description',
                        headerName: t('model.hr.position.description'),
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
                            <UpdatePositionDialog position={params?.row} refetch={refetch} />
                            <ConfirmDialog
                                type="delete"
                                title="working.hr.position.confirm-delete-position"
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

export default PositionTab;
