import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { formatDateForUI } from '@tools/date.tool';
import { EMPTY_VALUES } from '@configs/const.config';
import { Link } from 'react-router-dom';
import { stringToColor } from '@tools/string.tool';

function ProjectCard({ project, linkPath = "/" }) {
    return (
        <Card
            variant="outlined"
            sx={{
                p: 0,
                borderRadius: 3,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                height: "100%",
                boxShadow: "none",
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: stringToColor(project.id, 0.5),
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {project.name || EMPTY_VALUES.STRING}
                    </Typography>
                </Box>

                <Typography color="text.secondary" fontSize="small">
                    {project.description || EMPTY_VALUES.STRING}
                </Typography>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "space-between", borderTop: 1, borderColor: "divider", }}>
                <Typography variant="caption" color="textDisabled">
                    {`${formatDateForUI(project.startDate) || EMPTY_VALUES.DATE} - ${formatDateForUI(project.endDate) || EMPTY_VALUES.DATE}`}
                </Typography>
                <Button
                    size="small"
                    variant="text"
                    component={Link}
                    to={linkPath}
                    sx={{ fontWeight: "bold" }}
                >
                    CHI TIẾT
                </Button>
            </CardActions>
        </Card >
    );
}

export default ProjectCard;
