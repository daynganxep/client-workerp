import { useState, useEffect } from "react";
import ProjectService from "@services/project-module-service/project.service";
import { Box, Card, CardContent, Grid, Chip, IconButton, Divider, DialogActions, TextField, MenuItem, Select, DialogContent, DialogTitle, Dialog, Typography, CircularProgress, Button } from '@mui/material';
import { Folder, Edit, CalendarToday, Description } from '@mui/icons-material';
import useFormValidation from "@hooks/useForm";
import { projectSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import { PROJECT_STATUSES_MAP } from "@configs/const.config";
import { formatDateForUI } from "@tools/date.tool";
import DateField from "@components/DateField";

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
        return isNaN(date) ? "" : date.toISOString().split("T")[0];
    };

    const handleEditProject = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = await ProjectService.updateProject(
            projectId,
            data,
        );
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success(res.code);
        setOpenEdit(false);
        fetchProject();
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
                                    label={PROJECT_STATUSES_MAP[project.status]?.label}
                                    color={PROJECT_STATUSES_MAP[project.status]?.color}
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
                                        {formatDateForUI(project.startDate)} - {formatDateForUI(project.endDate)}
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
                                {Object.entries(PROJECT_STATUSES_MAP).map(([key, { code, label }]) => (
                                    <MenuItem key={key} value={code}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DateField
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
                            <DateField
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
