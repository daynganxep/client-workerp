import { useTheme } from "@emotion/react";
import useIsDark from "@hooks/use-is-dark";
import { Chip, Grid2, Stack, Typography } from "@mui/material";
import { TASK_STATUSES_MAP } from "@configs/const.config";
import KanbanTaskCard from "./kanban-task-card";

function KanbanTasks({ tasks, isManager, isMyTasks }) {
    const isDarkMode = useIsDark();
    const theme = useTheme();


    const getStatusColor = (status) => {
        const baseColor = TASK_STATUSES_MAP[status]?.color || 'default';
        return isDarkMode
            ? theme.palette[baseColor].dark
            : theme.palette[baseColor].light;
    };

    return (
        <Grid2 container spacing={3} sx={{
            display: "grid", gridTemplateColumns: {
                sm: "1fr",
                lg: "1fr 1fr 1fr"
            }
        }}>
            {Object.entries(TASK_STATUSES_MAP).map(([status, { label }]) => (
                <Stack
                    key={status}
                    sx={{
                        bgcolor: getStatusColor(status),
                        p: 2,
                        minHeight: 'calc(100vh - 250px)',
                    }}
                    gap={2}
                >
                    <Stack direction="row" alignItems="center" alignContent="center" justifyContent="space-between">
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'medium' }}
                        >
                            {label}
                        </Typography>
                        <Chip
                            label={tasks.filter(t => t.status === status).length}
                            size="small"
                        />
                    </Stack>

                    <Stack gap={3}>
                        {tasks.filter(task => task.status === status).map((task) => (
                            <KanbanTaskCard key={task.id} task={task} isManager={isManager} isMyTasks={isMyTasks} />
                        ))}
                    </Stack>
                </Stack>
            ))
            }
        </Grid2 >
    );
};

export default KanbanTasks;