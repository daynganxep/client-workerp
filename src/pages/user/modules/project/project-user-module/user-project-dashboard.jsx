import { Typography, Stack, Grid2 } from "@mui/material";
import ProjectService from "@services/project-module-service/project.service";
import ProjectCard from "@components/working/project-card";
import toast from "@hooks/toast";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

function UserProjectDashboard() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);

    const { data: projects = [] } = useQuery({
        queryKey: ["project-me", companyId],
        queryFn: async () => {
            const [res, err] = await ProjectService.getMyProjects();
            if (err) return toast.error(err.code);
            return res.data
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">{t('working.project.dashboard.my-projects')}</Typography>
            </Stack>
            <Grid2
                container
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                        lg: "1fr 1fr 1fr"
                    },
                    gap: 3,
                }}
            >
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        linkPath={`/working/project/user/${project.id}`}
                    />
                ))}
            </Grid2>
        </Stack >
    );
}

export default UserProjectDashboard;