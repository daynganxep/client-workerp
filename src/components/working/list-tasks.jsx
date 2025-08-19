import { Box, Button, Chip, Stack } from "@mui/material";
import { formatDateForUI } from "@tools/date.tool";
import { EMPTY_VALUES, TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import { Link } from "react-router-dom";
import Employee from "./employee";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "@components/dialog/confirm-dialog";
import TaskService from "@services/project-module-service/task.service";
import toast from "@hooks/toast";


function ListTasks({ tasks, isManager, isMyTasks, refetch }) {
    const { t } = useTranslation();

    async function deleteTask(taskId) {
        const [res, err] = await TaskService.deleteTask(taskId);
        if (err) return toast.error(err.code);
        toast.success(res.code);
        refetch();
    }

    const columns = [
        {
            field: 'title',
            headerName: t('model.project.task.title'),
            flex: 2,
            valueGetter: (value) => value || EMPTY_VALUES.STRING
        },
        {
            field: 'assignees',
            headerName: t('model.project.task.assignees'),
            flex: 1,
            renderCell: (params) => (<Box sx={{ height: "100%", display: "flex", alignItems: "center", flexDirection: "row", columnGap: 4, rowGap: 1, flexWrap: "wrap" }}>
                {params?.row?.assignees.map((assignee) => (
                    <Employee
                        key={assignee}
                        employeeId={assignee}
                        size={0.5}
                        tooltipSize={10}
                        showName
                    />
                ))}
            </Box>)
        },
        {
            field: 'status',
            headerName: t('model.project.task.status'),
            flex: 1,
            renderCell: (params) => (<Chip
                size="small"
                label={TASK_STATUSES_MAP[params?.row?.status]?.label || EMPTY_VALUES.STRING}
                color={TASK_STATUSES_MAP[params?.row?.status]?.color}
                variant="outlined"
                sx={{ borderRadius: 2 }}
            />)
        },
        {
            field: 'priority',
            headerName: t('model.project.task.priority'),
            flex: 1,
            renderCell: (params) => (<Chip
                size="small"
                label={TASK_PRIORITY_MAP[params?.row?.priority]?.label || EMPTY_VALUES.STRING}
                color={TASK_PRIORITY_MAP[params?.row?.priority]?.color}
                variant="outlined"
                sx={{ borderRadius: 2 }}
            />)
        },
        {
            field: 'dueDate',
            headerName: t('model.project.task.due-date'),
            flex: 1,
            valueGetter: (value) => formatDateForUI(value) || EMPTY_VALUES.DATE
        }
    ];

    if (isManager || isMyTasks) {
        columns.push({
            field: 'actions',
            headerName: t('common.actions'),
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack height="100%" direction="row" justifyContent="start" alignContent="center" gap={2}>
                    {(isManager) &&
                        <ConfirmDialog
                            title="Xác nhận xóa nhiệm vụ này!"
                            description={params?.row?.title}
                            type="delete"
                            action={() => deleteTask(params?.row?.id)}
                            triggerButton={<Button
                                size="small"
                                variant="text"
                                sx={{ fontWeight: "bold" }}
                                color="error"
                            >
                                XÓA
                            </Button>}
                        />
                    }
                    {(isManager || isMyTasks) &&
                        <Button
                            size="small"
                            variant="text"
                            component={Link}
                            to={`/working/project/${isManager ? "manager" : "user"}/task/${params.row?.id}`}
                            sx={{ fontWeight: "bold" }}
                        >
                            CHI TIẾT
                        </Button>
                    }
                </Stack>
            )
        });
    }
    return (
        <DataGrid
            rowHeight={80}
            rows={tasks}
            getRowId={(row) => row?.id}
            columns={columns}
            disableRowSelectionOnClick
        />
    );
}

export default ListTasks;