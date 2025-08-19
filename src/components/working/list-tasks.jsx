import { TASK_PRIORITY_MAP, TASK_STATUSES_MAP } from "@configs/const.config";
import { useTheme } from "@emotion/react";
import useIsDark from "@hooks/use-is-dark";
import { Assignment, CalendarToday, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Grid, IconButton, List, ListItem, Typography } from "@mui/material";
import { formatDateForUI } from "@tools/date.tool";
import Employee from "./employee";
import { Link } from "react-router-dom";

function ListTasks({ tasks, isManager, isMyTasks }) {
    const isDarkMode = useIsDark();
    const theme = useTheme();

    const getStatusColor = (status) => {
        const baseColor = TASK_STATUSES_MAP[status]?.color || 'default';
        return isDarkMode
            ? theme.palette[baseColor].dark
            : theme.palette[baseColor].light;
    };

    return (
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
                                        <IconButton
                                            size="small"
                                        // onClick={() => setDeleteConfirm({ open: true, taskId: task.id })}
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
};

export default ListTasks;