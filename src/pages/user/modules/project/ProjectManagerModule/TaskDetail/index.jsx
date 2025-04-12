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
    Select,
    MenuItem,
} from "@mui/material";
import {
    Assignment,
    Comment,
    Add,
    Edit,
    Delete,
    Link,
    LinkOff,
} from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import toast from "@hooks/toast";
import ".scss";

function TaskDetail() {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [openSubtask, setOpenSubtask] = useState(false);
    const [openEditComment, setOpenEditComment] = useState(null);

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
            <Card className="task-card">
                <CardContent>
                    <Typography variant="h5">
                        <Assignment sx={{ verticalAlign: "middle", mr: 1 }} />
                        {task.title}
                    </Typography>
                    <Typography>Mô tả: {task.description}</Typography>
                    <Typography>Trạng thái: {task.status}</Typography>
                    <Typography>Ưu tiên: {task.priority}</Typography>
                    <Typography>Hạn: {task.dueDate}</Typography>
                    <Typography>
                        Người thực hiện: {task?.assignees?.join(", ")}
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Subtasks
                <Button
                    startIcon={<Add />}
                    onClick={() => setOpenSubtask(true)}
                    sx={{ ml: 2 }}
                >
                    Add Subtask
                </Button>
            </Typography>
            <Grid container spacing={2}>
                {task?.subTasks?.map((subTask) => (
                    <Grid item xs={12} sm={6} md={4} key={subTask.id}>
                        <Card className="subtask-card">
                            <CardContent>
                                <Typography>{subTask.title}</Typography>
                                <Typography>
                                    Trạng thái: {subTask.status}
                                </Typography>
                                <Typography>Hạn: {subTask.dueDate}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Dependencies
                <Button
                    startIcon={<Link />}
                    onClick={() => handleAddDependency("someTaskId")} // Thay bằng logic chọn task
                    sx={{ ml: 2 }}
                >
                    Add Dependency
                </Button>
            </Typography>
            <Grid container spacing={2}>
                {task?.dependencies?.map((dep) => (
                    <Grid item xs={12} sm={6} md={4} key={dep.id}>
                        <Card className="dependency-card">
                            <CardContent>
                                <Typography>{dep.title}</Typography>
                                <Typography>
                                    Trạng thái: {dep.status}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<LinkOff />}
                                    onClick={() =>
                                        handleRemoveDependency(dep.id)
                                    }
                                >
                                    Remove
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Comments
            </Typography>
            <Grid container spacing={2}>
                {task?.comments?.map((cmt) => (
                    <Grid item xs={12} key={cmt.id}>
                        <Card className="comment-card">
                            <CardContent>
                                <Typography>
                                    <Comment
                                        sx={{ verticalAlign: "middle", mr: 1 }}
                                    />
                                    {cmt.content}
                                </Typography>
                                <Typography color="textSecondary">
                                    {cmt.createdBy} -{" "}
                                    {new Date(
                                        cmt.createdAt,
                                    ).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<Edit />}
                                    onClick={() => {
                                        handleCommentChange(
                                            "content",
                                            cmt.content,
                                        );
                                        setOpenEditComment(cmt);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    startIcon={<Delete />}
                                    onClick={() => handleDeleteComment(cmt.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <TextField
                value={commentData.content}
                onChange={(e) => handleCommentChange("content", e.target.value)}
                placeholder="Thêm bình luận"
                fullWidth
                sx={{ mt: 2 }}
            />
            <Button
                onClick={handleAddComment}
                variant="contained"
                sx={{ mt: 1 }}
            >
                Gửi
            </Button>

            {/* Subtask Dialog */}
            <Dialog open={openSubtask} onClose={() => setOpenSubtask(false)}>
                <DialogTitle>Thêm Subtask</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={subtaskData.title}
                        onChange={(e) =>
                            handleSubtaskChange("title", e.target.value)
                        }
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Hạn"
                        type="date"
                        value={subtaskData.dueDate}
                        onChange={(e) =>
                            handleSubtaskChange("dueDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSubtask(false)}>Hủy</Button>
                    <Button onClick={handleAddSubtask}>Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Comment Dialog */}
            <Dialog
                open={!!openEditComment}
                onClose={() => setOpenEditComment(null)}
            >
                <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={commentData.content}
                        onChange={(e) =>
                            handleCommentChange("content", e.target.value)
                        }
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditComment(null)}>
                        Hủy
                    </Button>
                    <Button onClick={handleEditComment}>Cập nhật</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TaskDetail;
