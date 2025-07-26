import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    useTheme,
} from "@mui/material";
import {
    Edit,
    CalendarToday,
    AccessTime,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import TaskService from "@services/project-module-service/task.service";
import useFormValidation from "@hooks/useForm";
import { taskSchema, taskUpdateSchema } from "@validations/projectSchema";
import { TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import toast from "@hooks/toast";
import { formatDateForUI } from "@tools/date.tool";
import DateField from "@components/DateField";
import Comments from "./Comments";
import useEmployee from "@hooks/useEmployee";
import ProjectService from "@services/project-module-service/project.service";


function TaskDetail({ isManager = false }) {
    const theme = useTheme();
    const { taskId } = useParams();
    const [projectId, setProjectId] = useState(null);
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [members, setMembers] = useState([]);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const employeeInfo = useEmployee()

    const initialManager = {
        title: "",
        description: "",
        assignees: [],
        priority: "",
        status: "",
        dueDate: "",
        projectId,
    }

    const initialUser = {
        status: "",
        dueDate: "",
        estimatedTime: "",
    }

    const {
        data,
        errors,
        handleChange,
        validate,
        resetForm,
        isSubmitting,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(isManager ? taskSchema : taskUpdateSchema, isManager ? initialManager : initialUser);

    const fetchMembers = async () => {
        const [res, err] = await ProjectService.getProjectById(projectId);
        if (err) return toast.error(err.code);
        setMembers(res.data.members || []);
    };

    const fetchTask = async () => {
        setIsLoading(true);
        const [res, err] = await TaskService.getTaskById(taskId);
        setIsLoading(false);
        if (err) return toast.error(err.code);
        setTask(res.data);
        setProjectId(res.data.projectId);
        const _comments = (res.data.comments || []);
        _comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(_comments);
    };

    const handleTaskUpdate = async () => {
        if (!validate()) return;

        startSubmitting();
        const [res, err] = await TaskService[isManager ? "updateTask" : "assignUpdateTask"](taskId, data);
        finishSubmitting();

        if (err) return toast.error(err.code);
        toast.success(res.code);
        setOpenUpdateDialog(false);
        resetForm();
        fetchTask();
    };

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    useEffect(() => {
        isManager && task != null && fetchMembers();
    }, [task]);

    useEffect(() => {
        if (task && openUpdateDialog) {
            resetForm();
            if (isManager) {
                handleChange("title", task.title || "");
                handleChange("description", task.description || "");
                handleChange("assignees", task.assignees || []);
                handleChange("priority", task.priority || "");
                handleChange(
                    "dueDate",
                    task.dueDate
                        ? new Date(task.dueDate).toISOString().split("T")[0]
                        : ""
                );
                handleChange("status", task.status || "");
                handleChange("projectId", projectId);
            } else {
                handleChange("status", task.status || "");
                handleChange(
                    "dueDate",
                    task.dueDate
                        ? new Date(task.dueDate).toISOString().split("T")[0]
                        : ""
                );
                handleChange("estimatedTime", task.estimatedTime || "");
            }
        }
    }, [task, openUpdateDialog]);

    if (isLoading || !task) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const quillStyles = {
        '& .ql-container': {
            border: 'none',
            fontFamily: theme.typography.fontFamily,
        },
        '& .ql-editor': {
            padding: 0,
            color: theme.palette.text.primary,
            fontFamily: 'inherit',
            '& h1, & h2': {
                color: theme.palette.text.primary,
                fontFamily: 'inherit',
            },
            '& p, & li': {
                color: theme.palette.text.primary,
                fontSize: theme.typography.body1.fontSize,
            },
            '& a': {
                color: theme.palette.primary.main,
            },
        },
        '& .ql-editor.ql-blank::before': {
            color: theme.palette.text.secondary,
            fontStyle: 'normal',
        },
    };

    return (
        <div className="task-detail">
            {/* Main Task Information */}
            <CardContent sx={{ p: 0, mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Chip
                            label={TASK_STATUSES_MAP[task.status]?.label}
                            color={TASK_STATUSES_MAP[task.status]?.color}
                        />
                        <Chip
                            label={TASK_PRIORITY_MAP[task.priority]?.label}
                            color={TASK_PRIORITY_MAP[task.priority]?.color}
                        />
                    </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {task.description ? (
                    <Box sx={quillStyles}>
                        <ReactQuill
                            value={DOMPurify.sanitize(task.description)}
                            readOnly={true}
                            theme="bubble"
                            modules={{ toolbar: false }}
                        />
                    </Box>
                ) : (
                    <Typography color="text.secondary">
                        Chưa có mô tả
                    </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Box spacing={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <CalendarToday
                            sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography>
                            Hạn:{" "}
                            {formatDateForUI(task.dueDate) ||
                                "Chưa có"}
                        </Typography>
                    </Box>
                    <Box
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <AccessTime
                            sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography>
                            Thời gian ước tính:{" "}
                            {task.estimatedTime || "Chưa có"} giờ
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => setOpenUpdateDialog(true)}
                    >
                        Cập nhật công việc
                    </Button>
                </Box>
            </CardContent>

            <Comments
                taskId={taskId}
                comments={comments}
                startSubmitting={startSubmitting}
                finishSubmitting={finishSubmitting}
                fetchTask={fetchTask}
                isSubmitting={isSubmitting}
            />

            {/* Update Task Dialog */}
            <Dialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Cập nhật công việc</DialogTitle>

                {isManager ?
                    (<DialogContent>
                        <TextField
                            fullWidth
                            label="Tiêu đề"
                            value={data.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
                            sx={{ mt: 1, mb: 2 }}
                        />
                        <ReactQuill
                            palaceholder="Mô tả công việc..."
                            value={data.description}
                            onChange={(value) => handleChange("description", value.trim())}
                            theme="snow"
                            modules={{
                                toolbar: [
                                    [{ header: [1, 2, false] }],
                                    ['bold', 'italic', 'underline'],
                                    ['link'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                ],
                            }}
                            style={{ backgroundColor: 'transparent' }}
                        />
                        <FormControl fullWidth
                            sx={{ mt: 2 }}
                            error={!!errors.assignees}
                            helperText={errors.assignees}
                        >
                            <InputLabel id="demo-simple-select-label">Người thực hiện</InputLabel>
                            <Select
                                fullWidth
                                multiple
                                value={data.assignees}
                                onChange={(e) =>
                                    handleChange("assignees", e.target.value)
                                }
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => employeeInfo(id)?.name || id)
                                        .join(", ")
                                }
                                label="Người thực hiện"
                            >
                                {members.map((member) => (
                                    <MenuItem
                                        key={member.employeeId}
                                        value={member.employeeId}
                                    >
                                        {employeeInfo(member.employeeId)?.name ||
                                            member.employeeId}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth
                            sx={{ mt: 2 }}
                        >
                            <InputLabel id="demo-simple-select-label">Độ ưu tiên</InputLabel>
                            <Select
                                fullWidth
                                value={data.priority}
                                onChange={(e) =>
                                    handleChange("priority", e.target.value)
                                }
                                label="Độ ưu tiên"
                            >

                                {Object.entries(TASK_PRIORITY_MAP).map(([key, { label }]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <DateField
                            fullWidth
                            label="Hạn"
                            type="date"
                            value={data.dueDate}
                            onChange={(e) =>
                                handleChange("dueDate", e.target.value)
                            }
                            sx={{ mt: 2 }}
                            error={!!errors.dueDate}
                            helperText={errors.dueDate}
                        />
                    </DialogContent>) : (<DialogContent
                        sx={{ display: "flex", gap: 4, flexDirection: "column" }}
                    >
                        <FormControl fullWidth
                            sx={{ mt: 2 }}
                        >
                            <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                            <Select
                                fullWidth
                                size="small"
                                value={data.status}
                                onChange={(e) =>
                                    handleChange("status", e.target.value)
                                }
                                error={!!errors.status}
                                label="Trạng thái"
                            >
                                {Object.entries(TASK_STATUSES_MAP).map(
                                    ([key, { label }]) => (
                                        <MenuItem key={key} value={key}>
                                            {label}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <DateField
                            fullWidth
                            size="small"
                            type="date"
                            value={data.dueDate}
                            onChange={(e) =>
                                handleChange(
                                    "dueDate",
                                    e.target.value
                                )
                            }
                            label="Hạn nhiệm vụ"
                            error={!!errors.dueDate}
                            helperText={errors.dueDate}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={data.estimatedTime}
                            onChange={(e) =>
                                handleChange(
                                    "estimatedTime",
                                    e.target.value
                                )
                            }
                            label="Thời gian ước tính (giờ)"
                            error={!!errors.estimatedTime}
                            helperText={errors.estimatedTime}
                        />
                    </DialogContent>)
                }
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenUpdateDialog(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleTaskUpdate}
                        disabled={isSubmitting}
                    >
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TaskDetail;