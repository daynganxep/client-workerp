import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
} from "@mui/material";
import { Folder, Add, AccessTime, CalendarToday } from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { projectSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import ".scss";
import { Link } from "react-router-dom";

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
        toast.success("Created project successfully");
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
                        <Card
                            className="project-card"
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
                                            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
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
                                                color: 'primary.main',
                                                fontWeight: 'medium',
                                                px: 1,
                                                py: 0.5,
                                                bgcolor: 'action.hover',
                                                borderRadius: 1
                                            }}
                                        >
                                            {project.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    component={Link}
                                    to={`/working/project/manager/${project.id}`}
                                    size="small"
                                    sx={{ ml: 'auto' }}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardActions>
                        </Card>
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
                    <TextField
                        fullWidth
                        label="Ngày bắt đầu"
                        type="date"
                        value={data.startDate}
                        onChange={(e) =>
                            handleChange("startDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <TextField
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
