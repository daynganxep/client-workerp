import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskService from "@services/project-module-service/task.service";
import {
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CardActions,
    Box,
    Stack,
    Chip,
    Avatar,
} from "@mui/material";
import {
    Assignment,
    Add,
    Edit,
    Delete,
    CalendarToday,
    People,
    Send,
    AccessTime,
    Update,
} from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import toast from "@hooks/toast";
import ".scss";

function TaskDetail() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [openSubtask, setOpenSubtask] = useState(false);
    const [openEditComment, setOpenEditComment] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        data: commentData,
        handleChange: handleCommentChange,
        resetForm: resetCommentForm,
    } = useFormValidation(null, { content: "" });
    const {
        data: subtaskData,
        handleChange: handleSubtaskChange,
        resetForm: resetSubtaskForm,
    } = useFormValidation(null, { title: "", dueDate: "" });


    useEffect(() => {
        const fetchTask = async () => {
            const [res, err] = await TaskService.getTaskById(taskId);
            if (err) return toast.error(err.code);
            setTask(res.data);
        };
        fetchTask();
    }, [taskId]);

    const handleAddComment = async () => {
        const [res, err] = await TaskService.addComment(taskId, commentData);
        if (err) return toast.error(err.code);
        toast.success("Comment added successfully");
        resetCommentForm();
        fetchTask();
    };

    const handleAddSubtask = async () => {
        const [res, err] = await TaskService.createSubtask(taskId, subtaskData);
        if (err) return toast.error(err.code);
        toast.success("Subtask added successfully");
        setOpenSubtask(false);
        resetSubtaskForm();
        fetchTask();
    };

    const handleEditComment = async () => {
        const [res, err] = await TaskService.updateComment(
            taskId,
            openEditComment.id,
            commentData,
        );
        if (err) return toast.error(err.code);
        toast.success("Comment updated successfully");
        setOpenEditComment(null);
        resetCommentForm();
        fetchTask();
    };

    const handleDeleteComment = async (commentId) => {
        const [res, err] = await TaskService.deleteComment(taskId, commentId);
        if (err) return toast.error(err.code);
        toast.success("Comment deleted successfully");
        fetchTask();
    };

    const handleAddDependency = async (dependencyId) => {
        const [res, err] = await TaskService.addDependency(
            taskId,
            dependencyId,
        );
        if (err) return toast.error(err.code);
        toast.success("Dependency added successfully");
        fetchTask();
    };

    const handleRemoveDependency = async (dependencyId) => {
        const [res, err] = await TaskService.removeDependency(
            taskId,
            dependencyId,
        );
        if (err) return toast.error(err.code);
        toast.success("Dependency removed successfully");
        fetchTask();
    };

    const fetchTask = async () => {
        const [res, err] = await TaskService.getTaskById(taskId);
        if (err) return toast.error(err.code);
        setTask(res.data);
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div className="task-detail">
            {/* Header with Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    startIcon={<Edit />}
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => setOpenEdit(true)}
                >
                    Chỉnh sửa
                </Button>
                <Button
                    startIcon={<Delete />}
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenDelete(true)}
                >
                    Xóa
                </Button>
            </Box>

            {/* Main Task Card */}
            <Card elevation={2} sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Assignment sx={{ mr: 1, color: 'primary.main' }} />
                                {task.title}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {task.description || "Chưa có mô tả"}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Chip
                                label={task.status}
                                color={
                                    task.status === 'DONE' ? 'success' :
                                        task.status === 'IN_PROGRESS' ? 'warning' : 'info'
                                }
                            />
                            <Chip
                                label={task.priority}
                                color={
                                    task.priority === 'HIGH' ? 'error' :
                                        task.priority === 'MEDIUM' ? 'warning' : 'success'
                                }
                            />
                        </Stack>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>
                                        Hạn: {new Date(task.dueDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <People sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>Người thực hiện:</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 4 }}>
                                    {task.assignees?.map(assignee => (
                                        <Chip
                                            key={assignee}
                                            label={assignee}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography>
                                        Tạo lúc: {new Date(task.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                                {task.updatedAt && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Update sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography>
                                            Cập nhật: {new Date(task.updatedAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Subtasks Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1
                }}>
                    <Typography variant="h6">
                        Công việc con ({task?.subTasks?.length || 0})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenSubtask(true)}
                    >
                        Thêm công việc con
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {task?.subTasks?.map((subTask) => (
                        <Grid item xs={12} sm={6} md={4} key={subTask.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                        {subTask.title}
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Chip
                                            label={subTask.status}
                                            size="small"
                                            color={subTask.status === 'DONE' ? 'success' : 'default'}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Hạn: {new Date(subTask.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    <IconButton size="small" onClick={() => handleEditSubtask(subTask)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteSubtask(subTask.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    Bình luận
                </Typography>

                {/* Add Comment */}
                <Card sx={{ mb: 2, p: 2 }}>
                    <TextField
                        value={commentData.content}
                        onChange={(e) => handleCommentChange("content", e.target.value)}
                        placeholder="Thêm bình luận..."
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <Button
                        onClick={handleAddComment}
                        variant="contained"
                        startIcon={<Send />}
                        disabled={!commentData.content.trim()}
                    >
                        Gửi
                    </Button>
                </Card>

                {/* Comments List */}
                <Stack spacing={2}>
                    {task?.comments?.map((cmt) => (
                        <Card key={cmt.id} sx={{ bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                        {cmt.createdBy[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2">
                                            {cmt.createdBy}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(cmt.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ ml: 5 }}>
                                    {cmt.content}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        handleCommentChange("content", cmt.content);
                                        setOpenEditComment(cmt);
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteComment(cmt.id)}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            </Box>

            {/* Dialogs */}
            <Dialog open={openSubtask} onClose={() => setOpenSubtask(false)}>
                <DialogTitle>Thêm công việc con</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={subtaskData.title}
                        onChange={(e) => handleSubtaskChange("title", e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Hạn"
                        type="date"
                        value={subtaskData.dueDate}
                        onChange={(e) => handleSubtaskChange("dueDate", e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenSubtask(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddSubtask}
                        disabled={!subtaskData.title || !subtaskData.dueDate}
                    >
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!openEditComment} onClose={() => setOpenEditComment(null)}>
                <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={commentData.content}
                        onChange={(e) => handleCommentChange("content", e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenEditComment(null)}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditComment}
                        disabled={!commentData.content.trim()}
                    >
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TaskDetail;
