import { useState, useEffect } from "react";
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
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Chip,
} from "@mui/material";
import {
    Assignment,
    Add,
    Edit,
    Delete,
    ViewList,
    ViewKanban,
    CalendarToday,
} from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { taskSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import useEmployee from "@hooks/useEmployee";
import { Link } from "react-router-dom";
import { formatDateForBackend, formatDateForInput } from "@tools/date.tool";
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
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, taskId: null });

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

    const handleCreateTask = async () => {
        if (!validate()) return;
        startSubmitting();
        const taskData = {
            ...data,
            dueDate: formatDateForBackend(data.dueDate), // Xử lý an toàn trước khi gửi BE
        };
        const [, err] = await TaskService.createTask(projectId, taskData);
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
            dueDate: formatDateForBackend(data.dueDate),
        };
        const [, err] = await TaskService.updateTask(editTask.id, taskData);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Task updated successfully");
        setEditTask(null);
        fetchTasks();
    };

    const handleDeleteTask = async (taskId) => {
        setDeleteConfirm({ open: false, taskId: null });
        const [, err] = await TaskService.deleteTask(taskId);
        if (err) return toast.error(err.code);
        toast.success("Xóa task thành công");
        fetchTasks();
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode) setViewMode(newViewMode);
    };

    const renderKanbanView = () => {
        const statusColumns = {
            TO_DO: { title: 'To Do', color: 'info.light' },
            IN_PROGRESS: { title: 'In Progress', color: 'warning.light' },
            DONE: { title: 'Done', color: 'success.light' }
        };

        const getPriorityColor = (priority) => {
            switch (priority) {
                case 'HIGH': return 'error.main';
                case 'MEDIUM': return 'warning.main';
                case 'LOW': return 'success.main';
                default: return 'text.secondary';
            }
        };

        return (
            <Grid container spacing={3}>
                {Object.entries(statusColumns).map(([status, { title, color }]) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Box
                            sx={{
                                bgcolor: color,
                                borderRadius: 2,
                                p: 2,
                                minHeight: 'calc(100vh - 250px)',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    fontWeight: 'medium',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {title}
                                <Chip
                                    label={tasks.filter(t => t.status === status).length}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {tasks.filter(task => task.status === status).map((task) => (
                                    <Card
                                        key={task.id}
                                        elevation={1}
                                        sx={{
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 3,
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <CardContent sx={{ pb: 1 }}>
                                            <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
                                                <Assignment sx={{ fontSize: 20, mr: 1, verticalAlign: 'text-bottom' }} />
                                                {task.title}
                                            </Typography>

                                            <Box sx={{ mb: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                                                {task.description}
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <Chip
                                                    label={task.priority}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getPriorityColor(task.priority),
                                                        color: 'white',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                                {task.dueDate && (
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                                        {formatDateForInput(task.dueDate)}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {task.assignees?.length > 0 && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    {task.assignees.map((assignee) => (
                                                        <Chip
                                                            key={assignee}
                                                            label={employeeInfo(assignee)?.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ maxWidth: 120 }}
                                                        />
                                                    )).slice(0, 2)}
                                                    {task.assignees.length > 2 && (
                                                        <Chip
                                                            label={`+${task.assignees.length - 2}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>

                                        <CardActions sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                                            {/* <Button
                                                size="small"
                                                component={Link}
                                                to={`/working/project/manager/task/${task.id}`}
                                                sx={{ mr: 'auto' }}
                                            >
                                                Chi tiết
                                            </Button> */}
                                            <IconButton size="small" onClick={() => {
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
                                            }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => setDeleteConfirm({ open: true, taskId: task.id })}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const renderListView = () => (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 0 }}>
            {tasks.map((task, index) => (
                <>
                    <ListItem
                        key={task.id}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            gap: 2,
                            py: 2,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1rem',
                                    mb: 1
                                }}
                            >
                                <Assignment sx={{ mr: 1 }} />
                                {task.title}
                            </Typography>

                            <Grid container spacing={2} sx={{ color: 'text.secondary', mb: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={task.status}
                                            size="small"
                                            color={
                                                task.status === 'DONE' ? 'success' :
                                                    task.status === 'IN_PROGRESS' ? 'warning' : 'info'
                                            }
                                        />
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            color={
                                                task.priority === 'HIGH' ? 'error' :
                                                    task.priority === 'MEDIUM' ? 'warning' : 'success'
                                            }
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                                        {formatDateForInput(task.dueDate) || "Chưa có hạn"}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {task.assignees?.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {task.assignees.map(assignee => (
                                        <Chip
                                            key={assignee}
                                            label={employeeInfo(assignee)?.name}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            alignSelf: { xs: 'stretch', sm: 'center' }
                        }}>
                            {/* <Button
                                component={Link}
                                to={`/working/project/manager/task/${task.id}`}
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 100 }}
                            >
                                Chi tiết
                            </Button> */}
                            <IconButton
                                size="small"
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
                            <IconButton
                                size="small"
                                onClick={() => setDeleteConfirm({ open: true, taskId: task.id })}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </ListItem>
                    {index < tasks.length - 1 && <Divider />}
                </>
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
                    Task mới
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
                    {/* <Select
                        fullWidth
                        value={data.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="TO_DO">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
                    </Select> */}
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

            {/* Remove Task Dialog */}
            <Dialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, taskId: null })}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <Delete sx={{ mr: 1 }} />
                        Xác nhận xóa
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa task này không?
                        Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteConfirm({ open: false, taskId: null })}
                        variant="outlined"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => handleDeleteTask(deleteConfirm.taskId)}
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectTasks;
