import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { formatDateForUI } from "@tools/date.tool";
import { Link } from "react-router-dom";
import { stringToColor } from "@tools/string.tool";
import { EMPTY_VALUES, TASK_PRIORITY_MAP } from "@configs/const.config";
import Employee from "./employee";
import ConfirmDialog from "@components/dialog/confirm-dialog";
import TaskService from "@services/project-module-service/task.service";
import toast from "@hooks/toast";

function KanbanTaskCard({ task, isManager, isMyTasks, refetch }) {

    async function deleteTask() {
        const [res, err] = await TaskService.deleteTask(task.id);
        if (err) return toast.error(err.code);
        toast.success(res.code);
        refetch();
    }

    return (<Card
        key={task.id}
        sx={{ borderRadius: 3 }}
    >
        <CardContent
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 1
            }}
        >
            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: stringToColor(task.id, 0.2),
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {task.title || EMPTY_VALUES.STRING}
                </Typography>
            </Box>
            {task.assignees?.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", columnGap: 4, rowGap: 1, flexWrap: "wrap" }}>
                    {task?.assignees?.map((assignee) => (
                        <Employee
                            key={assignee}
                            employeeId={assignee}
                            size={0.5}
                            tooltipSize={10}
                            showName
                        />
                    ))}
                </Box>
            )}
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "space-between", borderTop: 1, borderColor: "divider", }}>
            <Chip
                size="small"
                label={TASK_PRIORITY_MAP[task.priority]?.label}
                color={TASK_PRIORITY_MAP[task.priority]?.color}
                variant="outlined"
                sx={{ borderRadius: 2 }}
            />
            <Typography variant="caption" color="textDisabled">
                {formatDateForUI(task.dueDate) || EMPTY_VALUES.DATE}
            </Typography>
            {(isManager) &&
                <ConfirmDialog
                    title="Xác nhận xóa nhiệm vụ này!"
                    description={task.title}
                    type="delete"
                    action={deleteTask}
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
                    to={`/working/project/${isManager ? "manager" : "user"}/task/${task.id}`}
                    sx={{ fontWeight: "bold" }}
                >
                    CHI TIẾT
                </Button>}
        </CardActions>
    </Card>);
}

export default KanbanTaskCard;