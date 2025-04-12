import { useState, useEffect } from "react";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
} from "@mui/material";
import { Folder, Edit } from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { projectSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";

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
        const [res, err] = await ProjectService.updateProject(
            projectId,
            updatedData,
        );
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Project updated successfully");
        setOpenEdit(false);
        fetchProject(); // Làm mới dữ liệu sau khi cập nhật
    };

    if (!project) return <div>Loading...</div>;

    return (
        <div>
            <Typography variant="h6">
                <Folder sx={{ verticalAlign: "middle", mr: 1 }} />
                Tên: {project.name}
            </Typography>
            <Typography>Trạng thái: {project.status}</Typography>
            <Typography>Mô tả: {project.description || "N/A"}</Typography>
            <Typography>
                Ngày bắt đầu: {new Date(project.startDate).toLocaleDateString()}
            </Typography>
            <Typography>
                Ngày kết thúc: {new Date(project.endDate).toLocaleDateString()}
            </Typography>
            <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setOpenEdit(true)}
                sx={{ mt: 2 }}
            >
                Edit Project
            </Button>

            {/* Edit Project Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Chỉnh sửa dự án</DialogTitle>
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
                    <Select
                        fullWidth
                        value={data.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="OPEN">Open</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Ngày bắt đầu"
                        type="date"
                        value={data.startDate}
                        onChange={(e) =>
                            handleChange("startDate", e.target.value)
                        }
                        error={!!errors.startDate}
                        helperText={errors.startDate}
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
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
                    <Button onClick={handleEditProject} disabled={isSubmitting}>
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectOverview;
