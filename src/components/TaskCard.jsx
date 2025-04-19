import { Card, CardContent, Box, Typography, Chip, Stack } from '@mui/material';
import { Assignment, CalendarToday } from '@mui/icons-material';

function TaskCard({ task, employeeInfo }) {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DONE': return 'success';
            case 'IN_PROGRESS': return 'warning';
            case 'TO_DO': return 'info';
            default: return 'default';
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                }
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        mb: 2
                    }}
                >
                    <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                    {task.title}
                </Typography>

                {task.description && (
                    <Typography
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: '0.875rem' }}
                    >
                        {task.description}
                    </Typography>
                )}

                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label={task.status}
                            size="small"
                            color={getStatusColor(task.status)}
                        />
                        <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Hạn: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                    </Box>

                    {task.assignees?.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {task.assignees.map((assignee, index) => (
                                index < 2 && (
                                    <Chip
                                        key={assignee}
                                        label={employeeInfo(assignee)?.name}
                                        size="small"
                                        variant="outlined"
                                    />
                                )
                            ))}
                            {task.assignees.length > 2 && (
                                <Chip
                                    label={`+${task.assignees.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TaskCard;