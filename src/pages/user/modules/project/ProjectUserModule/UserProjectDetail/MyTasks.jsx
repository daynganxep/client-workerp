import { useEffect, useState } from "react";
import TaskService from "@services/project-module-service/task.service";
import {
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Button,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    List,
    ListItem,
    Divider,
    Chip,
} from "@mui/material";
import {
    Assignment,
    ViewList,
    ViewKanban,
    CalendarToday,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import toast from "@hooks/toast";

function MyTasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("dueDate");
    const [order, setOrder] = useState("asc");
    const [viewMode, setViewMode] = useState("kanban");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMyTasks();
    }, [projectId, sortBy, order]);

    const fetchMyTasks = async () => {
        setIsLoading(true);
        const [res, err] = await TaskService.getMyTasks(projectId, {
            sortBy,
            order,
        });
        setIsLoading(false);
        if (err) return toast.error(err.code);
        setTasks(res.data);
    };

    const handleViewModeChange = (event, newMode) => {
        if (newMode) setViewMode(newMode);
    };

    const getFilteredTasks = () => {
        if (statusFilter === "ALL") return tasks;
        return tasks.filter(task => task.status === statusFilter);
    };

    const renderKanbanView = () => {
        const statusColumns = {
            TO_DO: { title: 'To Do', color: 'info.light' },
            IN_PROGRESS: { title: 'In Progress', color: 'warning.light' },
            DONE: { title: 'Done', color: 'success.light' }
        };

        return (
            <Grid container spacing={3}>
                {Object.entries(statusColumns).map(([status, { title, color }]) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Box sx={{
                            bgcolor: color,
                            borderRadius: 2,
                            p: 2,
                            minHeight: 'calc(100vh - 250px)',
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                                {title}
                                <Chip
                                    label={tasks.filter(t => t.status === status).length}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {tasks
                                    .filter(task => task.status === status)
                                    .map((task) => (
                                        <Card
                                            key={task.id}
                                            sx={{
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 3,
                                                },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
                                                    <Assignment sx={{ fontSize: 20, mr: 1, verticalAlign: 'text-bottom' }} />
                                                    {task.title}
                                                </Typography>

                                                <Box sx={{ mb: 2, color: 'text.secondary' }}>
                                                    {task.description}
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <Chip
                                                        label={task.priority}
                                                        size="small"
                                                        color={
                                                            task.priority === 'HIGH' ? 'error' :
                                                                task.priority === 'MEDIUM' ? 'warning' : 'success'
                                                        }
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                                                        <Typography variant="body2">
                                                            {new Date(task.dueDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Button
                                                    component={Link}
                                                    to={`/working/project/user/task/${task.id}`}
                                                    size="small"
                                                    sx={{ width: '100%' }}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </CardContent>
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
            {getFilteredTasks().map((task, index) => (
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
                            <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1 }}>
                                <Assignment sx={{ mr: 1 }} />
                                {task.title}
                            </Typography>

                            <Grid container spacing={2} sx={{ color: 'text.secondary' }}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button
                            component={Link}
                            to={`/working/project/user/task/${task.id}`}
                            size="small"
                            variant="outlined"
                        >
                            Xem chi tiết
                        </Button>
                    </ListItem>
                    {index < getFilteredTasks().length - 1 && <Divider />}
                </>
            ))}
        </List>
    );

    if (isLoading) {
        return <Box sx={{ textAlign: 'center', py: 3 }}>Đang tải...</Box>;
    }

    return (
        <div className="my-tasks">
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Task của tôi ({tasks.length})
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select
                        size="small"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="dueDate">Theo hạn</MenuItem>
                        <MenuItem value="priority">Theo độ ưu tiên</MenuItem>
                        <MenuItem value="status">Theo trạng thái</MenuItem>
                    </Select>

                    {viewMode === "list" && (
                        <Select
                            size="small"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="ALL">Tất cả</MenuItem>
                            <MenuItem value="TO_DO">To Do</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="DONE">Done</MenuItem>
                        </Select>
                    )}

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    >
                        {order === "asc" ? "↑" : "↓"}
                    </Button>

                    <ToggleButtonGroup
                        size="small"
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                    >
                        <ToggleButton value="kanban">
                            <ViewKanban />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewList />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {tasks.length > 0 ? (
                viewMode === "kanban" ? renderKanbanView() : renderListView()
            ) : (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    <Typography>Bạn chưa được giao task nào</Typography>
                </Box>
            )}
        </div>
    );
}

export default MyTasks;