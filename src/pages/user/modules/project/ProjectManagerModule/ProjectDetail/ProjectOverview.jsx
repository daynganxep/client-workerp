import { useState, useEffect } from "react";
import ProjectService from "@services/project-module-service/project.service";
import { Box, Card, CardContent, Grid, Chip, IconButton, Divider, DialogActions, TextField, MenuItem, Select, DialogContent, DialogTitle, Dialog, Typography, CircularProgress } from '@mui/material';
import { Folder, Edit, CalendarToday, Description } from '@mui/icons-material';
import useFormValidation from "@hooks/useForm";
import { projectSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import { Button } from "react-scroll";

function ProjectOverview({ projectId }) {
    const [project, setProject] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
        setValues,
    } = useFormValidation(projectSchema, {
        name: "",
        description: "",
        companyId: "",
        startDate: "",
        endDate: "",
        status: "OPEN",
    });

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        const [res, err] = await ProjectService.getProjectById(projectId);
        if (err) return toast.error(err.code);
        setProject(res.data);
        // Đồng bộ dữ liệu ban đầu vào form
        setValues({
            name: res.data.name,
            description: res.data.description || "",
            companyId: res.data.companyId,
            startDate: formatDateForInput(res.data.startDate),
            endDate: formatDateForInput(res.data.endDate),
            status: res.data.status,
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date) ? "" : date.toISOString().split("T")[0]; // Trả về YYYY-MM-DD
    };

    const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date) ? null : date.toISOString(); // Trả về ISO 8601 đầy đủ
    };

    const handleEditProject = async () => {
        if (!validate()) return;
        startSubmitting();
        const updatedData = {
            ...data,
            startDate: formatDateForBackend(data.startDate),
            endDate: formatDateForBackend(data.endDate),
        };
        const [, err] = await ProjectService.updateProject(
            projectId,
            updatedData,
        );
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Project updated successfully");
        setOpenEdit(false);
        fetchProject(); // Làm mới dữ liệu sau khi cập nhật
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN':
                return 'info';
            case 'IN_PROGRESS':
                return 'warning';
            case 'COMPLETED':
                return 'success';
            default:
                return 'default';
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <Box sx={{ p: 3 }}>
            <Card elevation={2}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Folder sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                                    {project.name}
                                </Typography>
                                <Chip
                                    label={project.status}
                                    color={getStatusColor(project.status)}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        </Box>
                        <IconButton
                            onClick={() => setOpenEdit(true)}
                            sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.focus' }
                            }}
                        >
                            <Edit />
                        </IconButton>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <Description sx={{ color: 'text.secondary', mr: 2 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Mô tả
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        {project.description || "Chưa có mô tả"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <CalendarToday sx={{ color: 'text.secondary', mr: 2 }} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Thời gian
                                    </Typography>
                                    <Typography sx={{ mt: 1 }}>
                                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Edit sx={{ mr: 1 }} />
                        Chỉnh sửa dự án
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên dự án"
                                value={data.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Mô tả"
                                value={data.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                fullWidth
                                value={data.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                label="Trạng thái"
                            >
                                <MenuItem value="OPEN">Open</MenuItem>
                                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày bắt đầu"
                                type="date"
                                value={data.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày kết thúc"
                                type="date"
                                value={data.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setOpenEdit(false)}
                        variant="outlined"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleEditProject}
                        disabled={isSubmitting}
                        variant="contained"
                    >
                        {isSubmitting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} color="inherit" />
                                <span>Đang cập nhật...</span>
                            </Box>
                        ) : (
                            'Cập nhật'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ProjectOverview;
