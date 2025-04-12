import { useEffect, useState } from "react";
import TaskService from "@services/project-module-service/task.service";
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Grid,
    Button,
} from "@mui/material";
import { Assignment } from "@mui/icons-material";
import { Link } from "react-router-dom";
import toast from "@hooks/toast";
import useEmployee from "@hooks/useEmployee";

function AllTasks({ projectId }) {
    const [allTasks, setAllTasks] = useState([]);
    const employee = useEmployee();

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        const [res, err] = await TaskService.getTasksByProjectId(projectId);
        if (err) return toast.error(err.code);
        setAllTasks(res.data);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date) ? "N/A" : date.toLocaleDateString();
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Tất cả Task
            </Typography>
            <Grid container spacing={2}>
                {allTasks?.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    <Assignment
                                        sx={{ verticalAlign: "middle", mr: 1 }}
                                    />
                                    {task.title}
                                </Typography>
                                <Typography>
                                    Trạng thái: {task.status}
                                </Typography>
                                <Typography>
                                    Ưu tiên: {task.priority}
                                </Typography>
                                <Typography>
                                    Hạn: {formatDateForInput(task.dueDate)}
                                </Typography>
                                <Typography>
                                    Người thực hiện:{" "}
                                    {task?.assignees
                                        ?.map((id) => employee(id)?.name || id)
                                        ?.join(", ") || "N/A"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default AllTasks;
