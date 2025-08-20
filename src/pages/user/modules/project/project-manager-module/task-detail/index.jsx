import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import TaskService from "@services/project-module-service/task.service";
import Comments from "./comments";
import TaskInfor from "./task-infor";


function TaskDetail({ isManager = false }) {
    const { taskId } = useParams();
    const [comments, setComments] = useState([]);

    const { data: task = null, refetch } = useQuery({
        queryKey: ["task", taskId],
        queryFn: async () => {
            const [res, err] = await TaskService.getTaskById(taskId);
            if (err) throw new Error(err.code);
            const _comments = (res.data.comments || []);
            _comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComments(_comments);
            return res.data;
        }
    });

    if (!task) return;

    return (
        <Stack gap={4}>
            <TaskInfor task={task} isManager={isManager} refetch={refetch} />
            <Comments taskId={taskId} comments={comments} refetch={refetch} />
        </Stack >
    );
}

export default TaskDetail;