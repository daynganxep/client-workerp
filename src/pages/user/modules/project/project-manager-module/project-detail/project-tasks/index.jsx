import { useState } from "react";
import {
    Button,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
} from "@mui/material";
import {
    ViewList,
    ViewKanban,
} from "@mui/icons-material";
import toast from "@hooks/toast";
import TaskService from "@services/project-module-service/task.service";
import { useQuery } from "@tanstack/react-query";
import CreateTaskDialog from "./create-task-dialog";
import KanbanTasks from "@components/working/kanban-tasks";
import ListTasks from "@components/working/list-tasks";

function ProjectTasks({ projectId, isManager = false, isMyTasks = false }) {
    const [sortBy, setSortBy] = useState("dueDate");
    const [order, setOrder] = useState("asc");
    const [viewMode, setViewMode] = useState("kanban");

    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["task", projectId, sortBy, order],
        queryFn: async () => {
            const [res, err] = await TaskService.getTasksByProjectId(projectId, { sortBy, order });
            if (err) return toast.error(err.code);
            return res.data
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode) setViewMode(newViewMode);
    };

    return (
        <Stack gap={3}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" gap={3} alignItems={"start"}>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{ mr: 2 }}
                    >
                        <MenuItem value="dueDate">Hạn chót</MenuItem>
                        <MenuItem value="priority">Độ ưu tiên</MenuItem>
                        <MenuItem value="status">Trạng thái</MenuItem>
                    </Select>
                    <Button
                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                    >
                        {order === "asc" ? "↑" : "↓"}
                    </Button>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        sx={{ ml: 2 }}
                    >
                        <ToggleButton value="kanban">
                            <ViewKanban />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewList />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                {isManager && <CreateTaskDialog projectId={projectId} refetch={refetch} />}
            </Stack>
            {viewMode === "kanban" ?
                <KanbanTasks tasks={tasks} isManager={isManager} isMyTasks={isMyTasks} /> :
                <ListTasks tasks={tasks} isManager={isManager} isMyTasks={isMyTasks} />
            }
        </Stack >
    );
}

export default ProjectTasks;
