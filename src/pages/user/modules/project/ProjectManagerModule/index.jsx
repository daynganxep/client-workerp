import { Routes, Route } from "react-router-dom";
import ProjectDashboard from "./ProjectDashboard";
import ProjectDetail from "./ProjectDetail";
import TaskDetail from "./TaskDetail";
import ".scss";

function ProjectManagerModule() {
    return (
        <div className="project-manager-module">
            <Routes>
                <Route path="/" element={<ProjectDashboard />} />
                <Route path="/:projectId" element={<ProjectDetail />} />
                <Route path="/task/:taskId" element={<TaskDetail />} />
            </Routes>
        </div>
    );
}

export default ProjectManagerModule;
