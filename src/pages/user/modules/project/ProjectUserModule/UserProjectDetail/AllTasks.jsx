import { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    List,
    ListItem,
    Divider,
} from "@mui/material";
import { ViewList, ViewKanban, SwapVert } from "@mui/icons-material";
import TaskService from "@services/project-module-service/task.service";
import TaskCard from "@components/TaskCard";
import KanbanBoard from "@components/KanbanBoard";
import toast from "@hooks/toast";
import useEmployee from "@hooks/useEmployee";
import { Link } from "react-router-dom";

function AllTasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState("dueDate");
    const [order, setOrder] = useState("asc");
    const [viewMode, setViewMode] = useState("kanban");
    const [isLoading, setIsLoading] = useState(true);
    const employeeInfo = useEmployee();

    useEffect(() => {
        fetchTasks();
    }, [projectId, sortBy, order]);

    const fetchTasks = async () => {
        setIsLoading(true);
        const [res, err] = await TaskService.getTasksByProjectId(projectId, {
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

    const renderListView = () => (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 0 }}>
            {tasks.map((task, index) => (
                <>
                    <ListItem
                        key={task.id}
                        component={Link}
                        to={`/working/project/task/${task.id}`}
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            gap: 2,
                            py: 2,
                            px: 3,
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <TaskCard
                            task={task}
                            employeeInfo={employeeInfo}
                            variant="list"
                        />
                    </ListItem>
                    {index < tasks.length - 1 && <Divider />}
                </>
            ))}
        </List>
    );

    if (isLoading) {
        return (
            <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <div className="all-tasks">
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Tất cả công việc ({tasks.length})
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

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                        startIcon={<SwapVert />}
                    >
                        {order === "asc" ? "Tăng dần" : "Giảm dần"}
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
                viewMode === "kanban" ? (
                    <KanbanBoard tasks={tasks} employeeInfo={employeeInfo} />
                ) : (
                    renderListView()
                )
            ) : (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                }}>
                    <Typography>Chưa có công việc nào</Typography>
                </Box>
            )}
        </div>
    );
}

export default AllTasks;