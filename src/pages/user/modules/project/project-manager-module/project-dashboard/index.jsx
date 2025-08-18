import { useSelector } from "react-redux";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Stack,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import toast from "@hooks/toast";
import { useTranslation } from "react-i18next";
import CreateProjectDialog from "./create-project-dialog";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@components/working/project-card";

function ProjectDashboard() {
    const { t } = useTranslation();
    const { id: companyId } = useSelector((state) => state.company);

    const { data: projects = [], refetch } = useQuery({
        queryKey: ["project-all-projects", companyId],
        queryFn: async () => {
            const [res, err] = await ProjectService.getProjectsByCompanyId(companyId);
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
                <Typography variant="h6">{t('working.project.dashboard.all-projects')}</Typography>
                <CreateProjectDialog refetch={refetch} />
            </Stack>
            <Grid2
                container
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr"
                    },
                    gap: 3,
                }}
            >
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        linkPath={`/working/project/manager/${project.id}`}
                    />
                ))}
            </Grid2>
        </Stack >
    );
}

export default ProjectDashboard;
