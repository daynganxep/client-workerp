import { useState, useEffect } from "react";
import { Typography, Grid, Box } from "@mui/material";
import ProjectService from "@services/project-module-service/project.service";
import ProjectCard from "@components/ProjectCard";
import toast from "@hooks/toast";

function UserProjectDashboard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = async () => {
        setIsLoading(true);
        const [res, err] = await ProjectService.getMyProjects();
        setIsLoading(false);
        if (err) return toast.error(err.code);
        setProjects(res.data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-project-dashboard">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Dự án đang tham gia ({projects.length})
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <ProjectCard
                            project={project}
                            linkPath={`/working/project/user/${project.id}`}
                        />
                    </Grid>
                ))}
            </Grid>

            {projects.length === 0 && (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                }}>
                    <Typography>
                        Bạn chưa tham gia dự án nào
                    </Typography>
                </Box>
            )}
        </div>
    );
}

export default UserProjectDashboard;