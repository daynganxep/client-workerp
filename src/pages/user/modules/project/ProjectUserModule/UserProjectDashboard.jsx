import { useState, useEffect } from "react";
import ProjectService from "@services/project-module-service/project.service";
import { Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { Link } from "react-router-dom";
import toast from "@hooks/toast";

function UserProjectDashboard() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const [res, err] = await ProjectService.getMyProjects();
        if (err) return toast.error(err.code);
        setProjects(res.data);
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Dự án đang tham gia
            </Typography>
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    <Folder
                                        sx={{ verticalAlign: "middle", mr: 1 }}
                                    />
                                    {project.name}
                                </Typography>
                                <Typography>
                                    Trạng thái: {project.status}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to={`/working/project/${project.id}`}
                                    sx={{ mt: 1 }}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default UserProjectDashboard;
