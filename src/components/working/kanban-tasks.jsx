import { TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import { useTheme } from "@emotion/react";
import useIsDark from "@hooks/use-is-dark";
import { Assignment, CalendarToday, Edit } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, IconButton, Typography } from "@mui/material";
import { formatDateForUI } from "@tools/date.tool";
import Employee from "./employee";
import { Link } from "react-router-dom";

function KanbanTasks({ tasks, isManager, isMyTasks }) {
    const isDarkMode = useIsDark();
    const theme = useTheme();

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
                                                        // setValues({
                                                        //     title: task.title,
                                                        //     description: task.description || "",
                                                        //     projectId,
                                                        //     assignees: task.assignees || [],
                                                        //     priority: task.priority,
                                                        //     status: task.status,
                                                        //     dueDate: formatDateForInput(task.dueDate),
                                                        // });
                                                        // setEditTask(task);
                                                    }}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    {/* <IconButton
                                                        size="small"
                                                        onClick={() => setDeleteConfirm({ open: true, taskId: task.id })}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton> */}
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

export default KanbanTasks;