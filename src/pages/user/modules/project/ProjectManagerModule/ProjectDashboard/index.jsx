import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from "@mui/material";
import DateField from "@components/DateField";
import { Add, } from "@mui/icons-material";
import ProjectCard from "@components/ProjectCard";
import useFormValidation from "@hooks/useForm";
import { projectSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import ".scss";

function ProjectDashboard() {
    const [projects, setProjects] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const { id: companyId } = useSelector((state) => state.company);

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
    } = useFormValidation(projectSchema, {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        companyId,
    });

    const fetchProjects = async () => {
        const [res, err] = await ProjectService.getProjectsByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setProjects(res.data);
    };

    const handleCreate = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = await ProjectService.createProject(data);
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success(res.code);
        setOpenCreate(false);
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
        handleChange("companyId", companyId);
    }, [companyId]);

    return (
        <div className="project-dashboard">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography variant="h6">Tất cả dự án của công ty</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenCreate(true)}
                    sx={{ mb: 2 }}
                >
                    Tạo dự án mới
                </Button>
            </Box>
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <ProjectCard
                            project={project}
                            linkPath={`/working/project/manager/${project.id}`}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Create Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
                <DialogTitle>Tạo dự án mới</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên dự án"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Mô tả"
                        value={data.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        sx={{ mt: 2 }}
                    />
                    <DateField
                        fullWidth
                        label="Ngày bắt đầu"
                        value={data.startDate}
                        onChange={(e) =>
                            handleChange("startDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <DateField
                        fullWidth
                        label="Ngày kết thúc"
                        type="date"
                        value={data.endDate}
                        onChange={(e) =>
                            handleChange("endDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
                    <Button onClick={handleCreate} disabled={isSubmitting}>
                        {isSubmitting ? "Đang tạo..." : "Tạo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default ProjectDashboard;
