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
    useTheme,
    InputLabel,
    FormControl,
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
import { formatDateForInput, formatDateForUI } from "@tools/date.tool";
import { TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import Employee from "@components/Employee";
import useIsDark from "@hooks/useIsDark";
import DateField from "@components/DateField";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "./project-tasks.scss";

function ProjectTasks({ projectId, isManager = false, isMyTasks = false }) {
    const theme = useTheme();
    const isDarkMode = useIsDark();
    const employeeInfo = useEmployee();
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("dueDate");
    const [order, setOrder] = useState("asc");
    const [openTask, setOpenTask] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [viewMode, setViewMode] = useState("kanban");
    const [members, setMembers] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, taskId: null });
    const initialTask = {
        title: "",
        description: "",
        projectId,
        assignees: [],
        priority: TASK_PRIORITY_MAP.LOW.code,
        status: TASK_STATUSES_MAP.TO_DO.code,
        dueDate: "",
    }

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
        setValues,
    } = useFormValidation(taskSchema, initialTask);

    useEffect(() => {
        fetchTasks();
        fetchMembers();
    }, [projectId, isManager, isMyTasks, sortBy, order]);

    const fetchTasks = async () => {
        TaskService.getMyTasks()
        const [res, err] = await TaskService[isMyTasks ? "getMyTasks" : "getTasksByProjectId"](projectId, {
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
        const [res, err] = await TaskService.createTask(projectId, data);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success(res.code);
        setOpenTask(false);
        setValues(initialTask);
        fetchTasks();
    };

    const handleEditTask = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = await TaskService.updateTask(editTask.id, data);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success(res.code);
        setEditTask(null);
        fetchTasks();
    };

    const handleDeleteTask = async (taskId) => {
        setDeleteConfirm({ open: false, taskId: null });
        const [res, err] = await TaskService.deleteTask(taskId);
        if (err) return toast.error(err.code);
        toast.success(res.code);
        fetchTasks();
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode) setViewMode(newViewMode);
    };

    const renderKanbanView = () => {

        const getStatusColor = (status) => {
            const baseColor = TASK_STATUSES_MAP[status]?.color || 'default';
            return isDarkMode
                ? theme.palette[baseColor].dark
                : theme.palette[baseColor].light;
        };

        return (
            <Grid container spacing={3}>
                {Object.entries(TASK_STATUSES_MAP).map(([status, { label }]) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Box
                            sx={{
                                bgcolor: getStatusColor(status),
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
                                {label}
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
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                {task.dueDate && (
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                                        {formatDateForUI(task.dueDate)}
                                                    </Typography>
                                                )}
                                                <Chip
                                                    label={TASK_PRIORITY_MAP[task.priority]?.label}
                                                    size="small"
                                                    color={TASK_PRIORITY_MAP[task.priority]?.color}
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 'medium'
                                                    }}
                                                />
                                            </Box>

                                            {task.assignees?.length > 0 && (
                                                <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column', gap: 1 }}>
                                                    {task?.assignees?.map((assignee) => (
                                                        <Employee
                                                            key={assignee}
                                                            employeeId={assignee}
                                                            size={1}
                                                            tooltipSize={10}
                                                            showName={true}
                                                        />
                                                    )).slice(0, 2)}
                                                    {task.assignees.length > 2 && (
                                                        <Chip
                                                            label={`+${task?.assignees?.length - 2}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>

                                        {(isManager || isMyTasks) &&
                                            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>

                                                {(isManager || isMyTasks) &&
                                                    <Button
                                                        size="small"
                                                        component={Link}
                                                        to={`/working/project/${isManager ? "manager" : "user"}/task/${task.id}`}
                                                        sx={{ mr: 'auto' }}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                }
                                                {isManager &&
                                                    <Box>
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
                                                    </Box>
                                                }
                                            </CardActions>
                                        }
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
                                            label={TASK_STATUSES_MAP[task.status]?.label}
                                            size="small"
                                            color={TASK_STATUSES_MAP[task.status]?.color}
                                        />
                                        <Chip
                                            label={TASK_PRIORITY_MAP[task.priority]?.label}
                                            size="small"
                                            color={TASK_PRIORITY_MAP[task.priority]?.color}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                                        {formatDateForUI(task.dueDate) || "Chưa có hạn"}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {task.assignees?.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {task.assignees.map(assignee => (
                                        <Employee key={assignee} employeeId={assignee} showName></Employee>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {(isManager || isMyTasks) &&
                            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1, gap: 6 }}>

                                {(isManager || isMyTasks) &&
                                    <Button
                                        size="small"
                                        component={Link}
                                        to={`/working/project/${isManager ? "manager" : "user"}/task/${task.id}`}
                                        sx={{ mr: 'auto' }}
                                    >
                                        Chi tiết
                                    </Button>
                                }
                                {isManager &&
                                    <Box>
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
                                    </Box>
                                }
                            </CardActions>
                        }
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
                    <MenuItem value="dueDate">Hạn chót</MenuItem>
                    <MenuItem value="priority">Độ ưu tiên</MenuItem>
                    <MenuItem value="status">Trạng thái</MenuItem>
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
                {isManager &&
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setValues(initialTask);
                            setOpenTask(true)
                        }}
                        sx={{ ml: 2 }}
                    >
                        NHIỆM VỤ MỚI
                    </Button>
                }
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
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <ReactQuill
                        palaceholder="Mô tả công việc..."
                        value={data.description}
                        onChange={(value) => handleChange("description", value)}
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
