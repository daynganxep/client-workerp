import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddMemberDialog from "./add-member-dialog";
import UpdatateMemberDialog from "./update-member-dialog";
import Employee from "@components/working/employee";
import { EMPTY_VALUES, PROJECT_MEMBER_ROLE } from "@configs/const.config";
import ConfirmDialog from "@components/dialog/confirm-dialog";
import ProjectService from "@services/project-module-service/project.service";
import toast from "@hooks/toast";


function ProjectMembers() {
    const { t } = useTranslation();
    const { projectId } = useParams();

    const { data: members = [], refetch, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const [res, err] = await ProjectService.getProjectById(projectId);
            if (err) throw new Error(err.code);
            return res?.data?.members || [];
        },
        onError: (code) => toast.error(code),
    });

    async function handleDelete(employeeId) {
        const [res, err] = await ProjectService.removeMember(projectId, employeeId);
        if (err) return toast.error(err.code);
        refetch();
        toast.success(res.code);
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{t('working.hr.position.position-list')}</Typography>
                <AddMemberDialog projectId={projectId} refetch={refetch} />
            </Stack>
            <DataGrid
                loading={isLoading}
                rowHeight={80}
                rows={members}
                getRowId={(row) => row?.employeeId}
                disableRowSelectionOnClick
                columns={[
                    {
                        field: 'employeeId',
                        headerName: t('model.project.project.member'),
                        flex: 1,
                        renderCell: (params) => <Employee employeeId={params?.row?.employeeId} showName />
                    },
                    {
                        field: 'role',
                        headerName: t('model.project.project.role'),
                        flex: 1,
                        valueGetter: (value) => value ? PROJECT_MEMBER_ROLE[value].label : EMPTY_VALUES.STRING
                    },
                    {
                        field: 'actions',
                        headerName: t('common.actions'),
                        flex: 1,
                        sortable: false,
                        filterable: false,
                        renderCell: (params) => (<Stack height="100%" direction="row" justifyContent="start" alignContent="center" gap={2}>
                            <UpdatateMemberDialog projectId={projectId} member={params?.row} refetch={refetch} />
                            <ConfirmDialog
                                type="delete"
                                title="working.project.detail.member.delete-member-title"
                                cancelTitle="common.cancel"
                                confirmTitle="common.delete"
                                action={() => handleDelete(params?.row?.employeeId)}
                                triggerButton={
                                    <Button variant="text" color="error">
                                        {t('common.delete')}
                                    </Button>
                                }
                            />
                        </Stack>)
                    },
                ]}
            />
        </Stack >
    );
}

export default ProjectMembers;
