import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { Folder, CalendarToday, AccessTime } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatDateForUI } from '@tools/date.tool';
import { PROJECT_STATUSES_MAP } from '@configs/const.config';

function ProjectCard({ project, linkPath }) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[4],
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Folder
                        sx={{
                            color: 'primary.main',
                            fontSize: 32,
                            mr: 2
                        }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {project.name}
                    </Typography>
                </Box>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: '40px' }}
                >
                    {project.description || 'Chưa có mô tả'}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday
                            sx={{
                                fontSize: 20,
                                mr: 1,
                                color: 'text.secondary'
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {formatDateForUI(project.startDate)} - {formatDateForUI(project.endDate)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime
                            sx={{
                                fontSize: 20,
                                mr: 1,
                                color: 'text.secondary'
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: "primary.main",
                                fontWeight: 'medium',
                                px: 1,
                                py: 0.5,
                                bgcolor: 'action.hover',
                                borderRadius: 1
                            }}
                        >
                            {PROJECT_STATUSES_MAP[project.status]?.label}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    component={Link}
                    to={linkPath}
                    size="small"
                    sx={{ ml: 'auto' }}
                >
                    Xem chi tiết
                </Button>
            </CardActions>
        </Card>
    );
}

export default ProjectCard;