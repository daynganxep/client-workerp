import {
    Typography,
    Box,
    CardContent,
    Chip,
    Stack,
    Divider,
    Card,
    useTheme,
} from "@mui/material";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { EMPTY_VALUES, TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import { formatDateForUI } from "@tools/date.tool";
import { stringToColor } from "@tools/string.tool";
import Employee from "@components/working/employee";
import LeaderUpdateTaskDialog from "./upate-task/leader-udpate-task-dialog";
import AssigneeUpdateTaskDialog from "./upate-task/assignee-update-task-dialog";
import "react-quill/dist/quill.snow.css";

function TaskInfor({ task, isManager, refetch }) {
    const theme = useTheme();

    return (<Card
        sx={{
            borderRadius: 3,

            mx: "auto",
            my: 2,
            width: "100%",
        }}
        variant="outlined"
    >
        <CardContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    p: 2,
                    bgcolor: stringToColor(task.id, 0.2),
                    "&:hover": { bgcolor: stringToColor(task.id, 0.3) },
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "medium",
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

            <Divider />

            <ReactQuill
                value={DOMPurify.sanitize(task.description || EMPTY_VALUES.STRING)}
                readOnly={true}
                theme="bubble"
            />

            <Divider />

            <Box sx={{ p: 2, display: "flex", flexDirection: "row", columnGap: 4, rowGap: 1, flexWrap: "wrap" }}>
                {task.assignees?.length > 0 ? task.assignees.map((assignee) => (
                    <Employee
                        key={assignee}
                        employeeId={assignee}
                        size={0.5}
                        tooltipSize={10}
                        showName
                    />
                )) : <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Chưa có người được giao
                    </Typography>
                </Box>}
            </Box>

            <Divider />

            <Stack direction={"row"} sx={{ p: 2, pb: 0 }} justifyContent={"space-between"} alignItems={"start"}>
                <Box sx={{ p: 0, display: "flex", flexDirection: "row", gap: 1, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: theme.palette.background.default, px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Hạn:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDateForUI(task.dueDate) || EMPTY_VALUES.DATE}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: theme.palette.background.default, px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Ước tính:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{task.estimatedTime || EMPTY_VALUES.STRING} giờ</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: theme.palette.background.default, px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Trạng thái:</Typography>
                        <Chip
                            size="small"
                            label={TASK_STATUSES_MAP[task.status]?.label || EMPTY_VALUES.STRING}
                            color={TASK_STATUSES_MAP[task.status]?.color}
                            variant="outlined"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: theme.palette.background.default, px: 2, py: 1, borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Ưu tiên:</Typography>
                        <Chip
                            size="small"
                            label={TASK_PRIORITY_MAP[task.priority]?.label || EMPTY_VALUES.STRING}
                            color={TASK_PRIORITY_MAP[task.priority]?.color}
                            variant="outlined"
                            sx={{ borderRadius: 2, fontWeight: 600 }}
                        />
                    </Box>
                </Box>
                {isManager ? <LeaderUpdateTaskDialog task={task} refetch={refetch} /> : <AssigneeUpdateTaskDialog task={task} refetch={refetch} />}
            </Stack>
        </CardContent>
    </Card>);
}

export default TaskInfor;