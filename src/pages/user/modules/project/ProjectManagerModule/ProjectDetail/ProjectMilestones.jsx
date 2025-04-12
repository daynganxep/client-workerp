import { useState, useEffect } from "react";
import MilestoneService from "@services/project-module-service/milestone.service";
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
} from "@mui/material";
import { Add, Edit, Delete, Flag } from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import toast from "@hooks/toast";

function ProjectMilestones({ projectId }) {
    const [milestones, setMilestones] = useState([]);
    const [openMilestone, setOpenMilestone] = useState(false);
    const [editMilestone, setEditMilestone] = useState(null);

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
        setValues,
    } = useFormValidation(
        null, // Có thể tạo schema riêng cho milestone
        { title: "", dueDate: "" },
    );

    useEffect(() => {
        fetchMilestones();
    }, [projectId]);

    const fetchMilestones = async () => {
        const [res, err] = await MilestoneService.getMilestonesByProjectId(
            projectId,
        );
        if (err) return toast.error(err.code);
        setMilestones(res.data);
    };

    const handleCreateMilestone = async () => {
        if (!validate()) return; // Thêm schema nếu cần
        startSubmitting();
        const [res, err] = await MilestoneService.createMilestone(
            projectId,
            data,
        );
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Milestone created successfully");
        setOpenMilestone(false);
        fetchMilestones();
    };

    const handleEditMilestone = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = await MilestoneService.updateMilestone(
            editMilestone.id,
            data,
        );
        finishSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Milestone updated successfully");
        setEditMilestone(null);
        fetchMilestones();
    };

    const handleDeleteMilestone = async (milestoneId) => {
        const [res, err] = await MilestoneService.deleteMilestone(milestoneId);
        if (err) return toast.error(err.code);
        toast.success("Milestone deleted successfully");
        fetchMilestones();
    };

    return (
        <div>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenMilestone(true)}
                sx={{ mb: 2 }}
            >
                New Milestone
            </Button>
            <Grid container spacing={2}>
                {milestones.map((milestone) => (
                    <Grid item xs={12} sm={6} md={4} key={milestone.id}>
                        <Card className="milestone-card">
                            <CardContent>
                                <Typography variant="h6">
                                    <Flag
                                        sx={{ verticalAlign: "middle", mr: 1 }}
                                    />
                                    {milestone.title}
                                </Typography>
                                <Typography>
                                    Hạn: {milestone.dueDate || "N/A"}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<Edit />}
                                    onClick={() => {
                                        setValues({
                                            title: milestone.title,
                                            dueDate: milestone.dueDate || "",
                                        });
                                        setEditMilestone(milestone);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<Delete />}
                                    onClick={() =>
                                        handleDeleteMilestone(milestone.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create/Edit Milestone Dialog */}
            <Dialog
                open={openMilestone || !!editMilestone}
                onClose={() => {
                    setOpenMilestone(false);
                    setEditMilestone(null);
                }}
            >
                <DialogTitle>
                    {editMilestone ? "Sửa Milestone" : "Tạo Milestone mới"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={data.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Hạn"
                        type="date"
                        value={data.dueDate}
                        onChange={(e) =>
                            handleChange("dueDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenMilestone(false);
                            setEditMilestone(null);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={
                            editMilestone
                                ? handleEditMilestone
                                : handleCreateMilestone
                        }
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Đang xử lý..."
                            : editMilestone
                            ? "Cập nhật"
                            : "Tạo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default ProjectMilestones;
