import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TaskService from "@services/project-module-service/task.service";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import {
    Assignment,
    Add,
    Edit,
    Delete,
    ViewList,
    ViewKanban,
} from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { taskSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import useEmployee from "@hooks/useEmployee";
import "./project-tasks.scss";

function ProjectTasks({ projectId }) {
    const employeeInfo = useEmployee();
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("dueDate");
    const [order, setOrder] = useState("asc");
    const [openTask, setOpenTask] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [viewMode, setViewMode] = useState("kanban");
    const [members, setMembers] = useState([]);

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
        projectId,
        assignees: [],
        priority: "LOW",
        status: "TO_DO",
        dueDate: "",
    });

    useEffect(() => {
        fetchTasks();
        fetchMembers();
    }, [projectId, sortBy, order]);

    const fetchTasks = async () => {
        const [res, err] = await TaskService.getTasksByProjectId(projectId, {
            sortBy,
            order,
        });
        if (err) return toast.error(err.code);
        setTasks(res.data);
    };

    const fetchMembers = async () => {
        const [res, err] = await ProjectService.getProjectById(projectId);
        if (err) return toast.error(err.code);
        setMembers(res.data.members || []);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Trả về YYYY-MM-DD hoặc rỗng nếu không hợp lệ
    };

    const formatDateForBackend = (dateString) => {
        if (!dateString) return null; // Gửi null nếu không có ngày
        const date = new Date(dateString);
        return isNaN(date) ? null : date.toISOString(); // Trả về ISO 8601 đầy đủ hoặc null nếu không hợp lệ
    };

    const handleCreateTask = async () => {
        if (!validate()) return;
        startSubmitting();
        const taskData = {
            ...data,
            dueDate: formatDateForBackend(data.dueDate), // Xử lý an toàn trước khi gửi BE
        };
        const [res, err] = await TaskService.createTask(projectId, taskData);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Task created successfully");
        setOpenTask(false);
        setValues({
            title: "",
            description: "",
            projectId,
            assignees: [],
            priority: "MEDIUM",
            status: "TO_DO",
            dueDate: "",
        });
        fetchTasks();
    };

    const handleEditTask = async () => {
        if (!validate()) return;
        startSubmitting();
        const taskData = {
            ...data,
            dueDate: formatDateForBackend(data.dueDate), // Xử lý an toàn trước khi gửi BE
        };
        const [res, err] = await TaskService.updateTask(editTask.id, taskData);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Task updated successfully");
        setEditTask(null);
        fetchTasks();
    };

    const handleDeleteTask = async (taskId) => {
        const [res, err] = await TaskService.deleteTask(taskId);
        if (err) return toast.error(err.code);
        toast.success("Task deleted successfully");
        fetchTasks();
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode) setViewMode(newViewMode);
    };

    const renderKanbanView = () => {
        const statusColumns = {
            TO_DO: [],
            IN_PROGRESS: [],
            DONE: [],
        };

        tasks.forEach((task) => {
            statusColumns[task.status].push(task);
        });

        return (
            <Grid container spacing={2}>
                {Object.entries(statusColumns).map(
                    ([status, tasksInStatus]) => (
                        <Grid item xs={12} md={4} key={status}>
                            <Typography variant="h6" gutterBottom>
                                {status.replace("_", " ")}
                            </Typography>
                            <Box sx={{ minHeight: 200 }}>
                                {tasksInStatus.map((task) => (
                                    <Card
                                        className="task-card"
                                        key={task.id}
                                        sx={{ mb: 2 }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">
                                                <Assignment
                                                    sx={{
                                                        verticalAlign: "middle",
                                                        mr: 1,
                                                    }}
                                                />
                                                {task.title}
                                            </Typography>
                                            <Typography>
                                                Ưu tiên: {task.priority}
                                            </Typography>
                                            <Typography>
                                                Hạn:{" "}
                                                {formatDateForInput(
                                                    task.dueDate,
                                                ) || "N/A"}
                                            </Typography>
                                            <Typography>
                                                Người thực hiện:{" "}
                                                {task?.assignees
                                                    ?.map(
                                                        (a) =>
                                                            employeeInfo(a)
                                                                ?.name || a,
                                                    )
                                                    .join(", ") || "N/A"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                href={`/working/project/task/${task.id}`}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Edit />}
                                                onClick={() => {
                                                    setValues({
                                                        title: task.title,
                                                        description:
                                                            task.description ||
                                                            "",
                                                        projectId,
                                                        assignees:
                                                            task.assignees ||
                                                            [],
                                                        priority: task.priority,
                                                        status: task.status,
                                                        dueDate:
                                                            formatDateForInput(
                                                                task.dueDate,
                                                            ),
                                                    });
                                                    setEditTask(task);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Delete />}
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                    ),
                )}
            </Grid>
        );
    };

    const renderListView = () => (
        <List>
            {tasks.map((task) => (
                <ListItem key={task.id} className="task-list-item">
                    <ListItemText
                        primary={
                            <Typography variant="h6">
                                <Assignment
                                    sx={{ verticalAlign: "middle", mr: 1 }}
                                />
                                {task.title}
                            </Typography>
                        }
                        secondary={
                            <>
                                <Typography>
                                    Trạng thái: {task.status}
                                </Typography>
                                <Typography>
                                    Ưu tiên: {task.priority}
                                </Typography>
                                <Typography>
                                    Hạn:{" "}
                                    {formatDateForInput(task.dueDate) || "N/A"}
                                </Typography>
                                <Typography>
                                    Người thực hiện:{" "}
                                    {task?.assignees
                                        ?.map((a) => employeeInfo(a)?.name || a)
                                        .join(", ") || "N/A"}
                                </Typography>
                            </>
                        }
                    />
                    <IconButton href={`/working/project/task/${task.id}`}>
                        View
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setValues({
                                title: task.title,
                                description: task.description || "",
                                projectId,
                                assignees: task.assignees || [],
                                priority: task.priority,
                                status: task.status,
                                dueDate: formatDateForInput(task.dueDate),
                            });
                            setEditTask(task);
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
                        <Delete />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <div className="project-tasks">
            <div className="task-controls">
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ mr: 2 }}
                >
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                </Select>
                <Button
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                >
                    {order === "asc" ? "↑" : "↓"}
                </Button>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    sx={{ ml: 2 }}
                >
                    <ToggleButton value="kanban">
                        <ViewKanban />
                    </ToggleButton>
                    <ToggleButton value="list">
                        <ViewList />
                    </ToggleButton>
                </ToggleButtonGroup>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenTask(true)}
                    sx={{ ml: 2 }}
                >
                    New Task
                </Button>
            </div>

            {viewMode === "kanban" ? renderKanbanView() : renderListView()}

            {/* Create/Edit Task Dialog */}
            <Dialog
                open={openTask || !!editTask}
                onClose={() => {
                    setOpenTask(false);
                    setEditTask(null);
                }}
            >
                <DialogTitle>
                    {editTask ? "Sửa Task" : "Tạo Task mới"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={data.title}
                        onChange={(e) => handleChange("title", e.target.value)}
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
                        sx={{ mt: 2 }}
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
                    <Select
                        fullWidth
                        value={data.priority}
                        onChange={(e) =>
                            handleChange("priority", e.target.value)
                        }
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                    </Select>
                    <Select
                        fullWidth
                        value={data.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="TO_DO">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
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
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenTask(false);
                            setEditTask(null);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={editTask ? handleEditTask : handleCreateTask}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Đang xử lý..."
                            : editTask
                            ? "Cập nhật"
                            : "Tạo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectTasks;
