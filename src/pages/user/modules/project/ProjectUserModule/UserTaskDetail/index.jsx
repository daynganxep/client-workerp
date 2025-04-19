import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Stack,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Assignment,
    Send,
    People,
    Edit,
    CalendarToday,
    AccessTime,
} from "@mui/icons-material";
import TaskService from "@services/project-module-service/task.service";
import useEmployee from "@hooks/useEmployee";
import useFormValidation from "@hooks/useForm";
import { taskUpdateSchema } from "@validations/projectSchema";
import { TASK_STATUSES } from "@configs/const.config";
import toast from "@hooks/toast";

function UserTaskDetail() {
    const { taskId } = useParams();
    const employee = useEmployee();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {
        data: updateData,
        errors: updateErrors,
        handleChange: handleUpdateChange,
        validate: validateUpdate,
        resetForm: resetUpdateForm,
        isSubmitting,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(taskUpdateSchema, {
        status: "",
        dueDate: "",
        estimatedTime: "",
    });

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    // Initialize update form when dialog opens
    useEffect(() => {
        if (task && openUpdateDialog) {
            handleUpdateChange("status", task.status);
            handleUpdateChange("dueDate", new Date(task.dueDate).toISOString().split('T')[0]);
            handleUpdateChange("estimatedTime", task.estimatedTime || "");
        }
    }, [task, openUpdateDialog]);

    const fetchTask = async () => {
        setIsLoading(true);
        const [res, err] = await TaskService.getTaskById(taskId);
        setIsLoading(false);
        if (err) return toast.error(err.code);
        setTask(res.data);
        setComments(res.data.comments || []);
    };

    const handleTaskUpdate = async () => {
        if (!validateUpdate()) return;

        startSubmitting();
        const [res, err] = await TaskService.assignUpdateTask(taskId, updateData);
        console.log(err)
        finishSubmitting();

        if (err) return toast.error(err.code);
        toast.success("Cập nhật công việc thành công");
        setOpenUpdateDialog(false);
        resetUpdateForm();
        fetchTask();
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) {
            return toast.error("Vui lòng nhập nội dung bình luận");
        }

        startSubmitting();
        const [res, err] = await TaskService.addComment(taskId, {
            content: commentInput.trim(),
        });
        finishSubmitting();

        if (err) return toast.error(err.code);
        toast.success("Thêm bình luận thành công");
        setCommentInput("");
        fetchTask();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DONE': return 'success';
            case 'IN_PROGRESS': return 'warning';
            case 'TO_DO': return 'info';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    if (isLoading || !task) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="task-detail">
            {/* Main Task Information */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 3
                    }}>
                        {/* Title and Description */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                                {task.title}
                            </Typography>

                        </Box>


                        {/* Status and Priority */}
                        <Stack direction="row" spacing={1}>
                            <Chip
                                label={task.status}
                                color={getStatusColor(task.status)}
                            />
                            <Chip
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                            />
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography color="text.secondary">
                        {task.description || "Chưa có mô tả"}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Task Details */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>
                                        Hạn: {new Date(task.dueDate).toLocaleDateString()}
                                    </Typography>
                                </Box>

                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography>
                                    Thời gian ước tính: {task.estimatedTime || "Chưa có"} giờ
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => setOpenUpdateDialog(true)}
                            >
                                Cập nhật công việc
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Bình luận
                    </Typography>

                    {/* Add Comment */}
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Thêm bình luận..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={handleAddComment}
                            disabled={!commentInput.trim() || isSubmitting}
                        >
                            Gửi
                        </Button>
                    </Box>

                    {/* Comments List */}
                    <Stack spacing={2}>
                        {comments.map((comment) => (
                            <Card key={comment.createdAt} variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                            {employee(comment.createdBy)?.name?.[0] || '?'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {employee(comment.createdBy)?.name || 'Unknown User'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography sx={{ ml: 5 }}>
                                        {comment.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}

                        {comments.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                <Typography>Chưa có bình luận nào</Typography>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Update Task Dialog */}
            <Dialog
                open={openUpdateDialog}
                onClose={() => setOpenUpdateDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Cập nhật công việc</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Trạng thái
                            </Typography>
                            <Select
                                fullWidth
                                size="small"
                                value={updateData.status}
                                onChange={(e) => handleUpdateChange("status", e.target.value)}
                                error={!!updateErrors.status}
                            >
                                {Object.entries(TASK_STATUSES).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {updateErrors.status && (
                                <Typography color="error" variant="caption">
                                    {updateErrors.status}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Hạn công việc
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                value={updateData.dueDate}
                                onChange={(e) => handleUpdateChange("dueDate", e.target.value)}
                                error={!!updateErrors.dueDate}
                                helperText={updateErrors.dueDate}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Thời gian ước tính (giờ)
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={updateData.estimatedTime}
                                onChange={(e) => handleUpdateChange("estimatedTime", e.target.value)}
                                error={!!updateErrors.estimatedTime}
                                helperText={updateErrors.estimatedTime}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenUpdateDialog(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleTaskUpdate}
                        loading={isSubmitting}
                    >
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserTaskDetail;