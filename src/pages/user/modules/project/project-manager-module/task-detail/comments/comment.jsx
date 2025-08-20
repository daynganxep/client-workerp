import React from "react";
import Employee from "@components/working/employee";
import { Box, Typography, IconButton, Menu, MenuItem, Avatar, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDateForUI } from "@tools/date.tool";
import { EMPTY_VALUES } from "@configs/const.config";
import UpdateCommentDialog from "./upate-comment-dialog";
import ConfirmDialog from "@components/dialog/confirm-dialog";
import TaskService from "@services/project-module-service/task.service";
import toast from "@hooks/toast";
import { useSelector } from "react-redux";

function Comment({ comment, taskId, refetch }) {
    const myEmployeeId = useSelector(state => state.company.employee.id);
    const isMyComment = comment.createdBy === myEmployeeId;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    async function handleDeleteTask() {
        const [res, err] = await TaskService.deleteComment(taskId, comment.id);
        if (err) return toast.error(err.code);
        refetch();
        toast.success(res.code);
        handleMenuClose();
    }

    return (
        <Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"row"} gap={2}>
                    <Employee employeeId={comment.createdBy} size={0.7} showName />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {formatDateForUI(comment.createdAt, "dd/MM/yyyy - HH:mm")}
                        </Typography>
                    </Box>
                </Stack>
                <Box>
                    {isMyComment &&
                        <IconButton size="small" onClick={handleMenuOpen}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    }
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                        <UpdateCommentDialog taskId={taskId} comment={comment} refetch={refetch} handleMenuClose={handleMenuClose} />
                        <ConfirmDialog
                            action={handleDeleteTask}
                            title={"working.project.detail.task.delete-comment"}
                            confirmTitle="common.delete"
                            triggerButton={<MenuItem onClick={handleMenuClose}>Xóa</MenuItem>}
                            type="delete"
                        />
                    </Menu>
                </Box>
            </Stack>
            <Box
                sx={{
                    mt: 1,
                    p: 1.5,
                    bgcolor: (theme) => theme.palette.background.default,
                    borderRadius: 2,
                    fontSize: 15,
                    wordBreak: "break-word",
                    whiteSpace: "pre-line"
                }}
            >
                {comment.content || EMPTY_VALUES.STRING}
            </Box>
        </Stack >
    );
}

export default Comment;