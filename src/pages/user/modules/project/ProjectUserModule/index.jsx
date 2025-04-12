import { Routes, Route, NavLink } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";
import UserProjectDashboard from "./UserProjectDashboard";
import UserProjectDetail from "./UserProjectDetail";
import UserTaskDetail from "./UserTaskDetail";
import ".scss";

function ProjectUserModule() {
    const NotFound = () => (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h4">404 - Page Not Found</Typography>
            <Typography>Đường dẫn bạn truy cập không tồn tại.</Typography>
            <Button
                variant="contained"
                component={NavLink}
                to="/working/project"
                sx={{ mt: 2 }}
            >
                Quay lại Dashboard
            </Button>
        </Box>
    );

    return (
        <div className="project-user-module">
            <Routes>
                <Route path="/" element={<UserProjectDashboard />} />
                <Route path="/:projectId" element={<UserProjectDetail />} />
                <Route path="/task/:taskId" element={<UserTaskDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default ProjectUserModule;
