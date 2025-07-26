import { useState } from "react";
import {
    Typography,
    Button,
    TextField,
    Box,
    Card,
    CardContent,
    Stack,
    useTheme,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Send,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import toast from "@hooks/toast";
import TaskService from "@services/project-module-service/task.service";
import Employee from "@components/Employee";
import { formatDateForUI } from "@tools/date.tool";
import { useSelector } from "react-redux";

function Comments({ taskId, comments = [], startSubmitting, finishSubmitting, fetchTask, isSubmitting }) {
    const theme = useTheme();
    const employeeId = useSelector(state => state.company.employee.id);
    const [commentInput, setCommentInput] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    // Handle menu open/close
    const handleMenuOpen = (event, comment) => {
        setAnchorEl(event.currentTarget);
        setSelectedComment(comment);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedComment(null);
    };

    // Edit comment
    const handleEditClick = () => {
        setEditingComment({
            ...selectedComment,
            newContent: selectedComment.content
        });
        handleMenuClose();
    };

    const handleEditCancel = () => {
        setEditingComment(null);
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
        toast.success(res.code);
        setCommentInput("");
        fetchTask();
    };

    const handleEditSave = async () => {
        if (!editingComment.newContent.trim()) {
            return toast.error("Vui lòng nhập nội dung bình luận");
        }

        startSubmitting();
        const [res, err] = await TaskService.updateComment(
            taskId,
            editingComment.id,
            { content: editingComment.newContent.trim() }
        );
        finishSubmitting();

        if (err) return toast.error(err.code);
        toast.success(res.code);
        setEditingComment(null);
        fetchTask();
    };

    const handleDeleteClick = () => {
        setCommentToDelete(selectedComment);
        setOpenDeleteDialog(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!commentToDelete) return;

        startSubmitting();
        const [res, err] = await TaskService.deleteComment(taskId, commentToDelete.id);
        finishSubmitting();

        if (err) return toast.error(err.code);
        toast.success(res.code);
        setOpenDeleteDialog(false);
        setCommentToDelete(null);
        fetchTask();
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setCommentToDelete(null);
    };

    const getRowCount = (text) => {
        if (!text) return 2;
        const lineCount = text.split('\n').length;
        return Math.max(2, Math.min(lineCount, 10)); // Min 2 rows, max 10 rows
    };

    return (
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
                        minRows={2}
                        maxRows={10}
                        placeholder="Thêm bình luận..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        sx={{ mb: 2, '& .MuiInputBase-root': { resize: 'vertical' } }}
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

                <Stack spacing={1}>
                    {comments.map((comment) => {
                        const isMyComment = comment.createdBy === employeeId;
                        return (
                            <Card
                                key={comment.id}
                                variant="outlined"
                                sx={{
                                    backgroundColor: isMyComment
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.background.paper
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1,
                                            justifyContent: "space-between",
                                            gap: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Employee employeeId={comment.createdBy} showName />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDateForUI(comment.createdAt, "dd/MM/yyyy - HH:mm")}
                                            </Typography>
                                        </Box>

                                        {isMyComment && (
                                            <>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, comment)}
                                                >
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && selectedComment?.id === comment.id}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem onClick={handleEditClick}>
                                                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                                        Sửa
                                                    </MenuItem>
                                                    <MenuItem onClick={handleDeleteClick}>
                                                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                                        Xóa
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        )}
                                    </Box>

                                    {editingComment?.id === comment.id ? (
                                        <Box sx={{ mt: 2 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={getRowCount(editingComment.newContent)}
                                                maxRows={10}
                                                value={editingComment.newContent}
                                                onChange={(e) =>
                                                    setEditingComment((prev) => ({
                                                        ...prev,
                                                        newContent: e.target.value
                                                    }))
                                                }
                                                sx={{ mb: 1, '& .MuiInputBase-root': { resize: 'vertical' } }}
                                            />
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Button
                                                    size="small"
                                                    onClick={handleEditCancel}
                                                    disabled={isSubmitting}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={handleEditSave}
                                                    disabled={isSubmitting}
                                                >
                                                    Lưu
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ mt: 2 }}>
                                            {comment.content}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa bình luận này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

export default Comments;