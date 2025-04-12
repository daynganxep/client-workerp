import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskService from "@services/project-module-service/task.service";
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Box,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import { Add, Send } from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { taskSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import useEmployee from "@hooks/useEmployee";
import { TASK_STATUSES } from "@configs/const.config";
import ".scss";

function UserTaskDetail() {
    const { taskId } = useParams();
    const employee = useEmployee();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [subTasks, setSubTasks] = useState([]);
    const [openSubtask, setOpenSubtask] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [estimatedTimeInput, setEstimatedTimeInput] = useState("");

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
        setValues,
    } = useFormValidation(taskSchema, {
        title: "",
        description: "",
        projectId: "",
        assignees: [],
        priority: "MEDIUM",
        status: TASK_STATUSES.TO_DO,
        dueDate: "",
    });

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const fetchTask = async () => {
        const [res, err] = await TaskService.getTaskById(taskId);
        if (err) return toast.error(err.code);
        setTask(res.data);
        setComments(res.data.comments || []);
        setSubTasks(res.data.subTasks || []);
        setValues({
            ...res.data,
            dueDate: res.data.dueDate
                ? new Date(res.data.dueDate).toISOString().split("T")[0]
                : "",
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date) ? "N/A" : date.toLocaleDateString();
    };

    const handleStatusChange = async (newStatus) => {
        const [res, err] = await TaskService.updateTaskStatus(
            taskId,
            newStatus,
        );
        if (err) return toast.error(err.code);
        toast.success("Task status updated");
        fetchTask();
    };

    const handleEstimateTime = async () => {
        if (!estimatedTimeInput || isNaN(parseFloat(estimatedTimeInput))) {
            toast.error("Vui lòng nhập số giờ hợp lệ");
            return;
        }
        const [res, err] = await TaskService.updateTask(taskId, {
            estimatedTime: parseFloat(estimatedTimeInput),
        });
        if (err) return toast.error(err.code);
        toast.success("Estimated time updated");
        setEstimatedTimeInput("");
        fetchTask();
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }
        const [res, err] = await TaskService.addComment(taskId, {
            content: commentInput,
        });
        if (err) return toast.error(err.code);
        toast.success("Comment added");
        setCommentInput("");
        fetchTask();
    };

    const handleCreateSubtask = async () => {
        if (!validate()) return;
        startSubmitting();
        const subtaskData = {
            ...data,
            parentTaskId: taskId,
            projectId: task.projectId,
        };
        const [res, err] = await TaskService.createSubtask(taskId, subtaskData);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Subtask created");
        setOpenSubtask(false);
        setValues({
            title: "",
            description: "",
            projectId: task.projectId,
            assignees: [],
            priority: "MEDIUM",
            status: "TO_DO",
            dueDate: "",
        });
        fetchTask();
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Task: {task.title}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Thông tin Task</Typography>
                            <Typography>Trạng thái: {task.status}</Typography>
                            <Select
                                value={task.status}
                                onChange={(e) =>
                                    handleStatusChange(e.target.value)
                                }
                                sx={{ mt: 1, mb: 2, minWidth: 120 }}
                            >
                                {Object.keys(TASK_STATUSES).map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography>Ưu tiên: {task.priority}</Typography>
                            <Typography>
                                Hạn: {formatDateForInput(task.dueDate)}
                            </Typography>
                            <Typography>
                                Người thực hiện:{" "}
                                {task?.assignees
                                    ?.map((id) => employee(id)?.name || id)
                                    .join(", ") || "N/A"}
                            </Typography>
                            <Typography>
                                Thời gian ước lượng:{" "}
                                {task.estimatedTime || "N/A"} giờ
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    label="Thời gian ước lượng (giờ)"
                                    type="number"
                                    value={estimatedTimeInput}
                                    onChange={(e) =>
                                        setEstimatedTimeInput(e.target.value)
                                    }
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleEstimateTime}
                                >
                                    Cập nhật
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Thêm bình luận</Typography>
                            <Box sx={{ display: "flex", mt: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Bình luận"
                                    value={commentInput}
                                    onChange={(e) =>
                                        setCommentInput(e.target.value)
                                    }
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddComment}
                                    sx={{ ml: 1 }}
                                >
                                    <Send />
                                </Button>
                            </Box>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Danh sách bình luận
                            </Typography>
                            <List dense>
                                {comments.map((comment, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={comment.content}
                                            secondary={formatDateForInput(
                                                comment.createdAt,
                                            )}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Subtasks */}
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6">Subtasks</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenSubtask(true)}
                        startIcon={<Add />}
                        sx={{ mb: 2 }}
                    >
                        Tạo Subtask
                    </Button>
                    <List dense>
                        {subTasks?.map((subtask) => (
                            <ListItem key={subtask.id}>
                                <ListItemText
                                    primary={subtask.title}
                                    secondary={`Trạng thái: ${
                                        subtask.status
                                    } | Hạn: ${formatDateForInput(
                                        subtask.dueDate,
                                    )}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Create Subtask Form */}
            {openSubtask && (
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Tạo Subtask</Typography>
                        <TextField
                            fullWidth
                            label="Tiêu đề"
                            value={data.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            error={!!errors.title}
                            helperText={errors.title}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            value={data.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            sx={{ mt: 2 }}
                        />
                        <Select
                            fullWidth
                            value={data.status}
                            onChange={(e) =>
                                handleChange("status", e.target.value)
                            }
                            sx={{ mt: 2 }}
                        >
                            {Object.keys(TASK_STATUSES).map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            fullWidth
                            label="Hạn"
                            type="date"
                            value={data.dueDate}
                            onChange={(e) =>
                                handleChange("dueDate", e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            sx={{ mt: 2 }}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button
                                onClick={handleCreateSubtask}
                                disabled={isSubmitting}
                                variant="contained"
                            >
                                {isSubmitting ? "Đang tạo..." : "Tạo"}
                            </Button>
                            <Button
                                onClick={() => setOpenSubtask(false)}
                                sx={{ ml: 1 }}
                            >
                                Hủy
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UserTaskDetail;
