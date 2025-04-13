import { Grid, Box, Typography, Chip } from '@mui/material';
import TaskCard from './TaskCard';

function KanbanBoard({ tasks, employeeInfo }) {
    const statusColumns = {
        TO_DO: { title: 'To Do', color: 'info.light' },
        IN_PROGRESS: { title: 'In Progress', color: 'warning.light' },
        DONE: { title: 'Done', color: 'success.light' }
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
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    employeeInfo={employeeInfo}
                                    linkPath={`/working/project/task/${task.id}`}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

export default KanbanBoard;