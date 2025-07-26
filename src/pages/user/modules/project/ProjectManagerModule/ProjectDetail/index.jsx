import { useParams } from "react-router-dom";
import ".scss";

import TabNavigation from "@layouts/user/WorkingLayout/TabNavigation";
import ProjectOverview from "./ProjectOverview";
import ProjectMembers from "./ProjectMembers";
// import ProjectMilestones from "./ProjectMilestones";
import ProjectTasks from "./ProjectTasks";

function ProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        { label: "Nhiệm vụ", value: "tasks", element: <ProjectTasks projectId={projectId} isManager /> },
        { label: "Thành viên", value: "members", element: <ProjectMembers projectId={projectId} /> },
        {
            label: "Tổng quan",
            value: "overview",
            element: <ProjectOverview projectId={projectId} />,
        },
    ];

    return (
        <TabNavigation tabs={tabs} basePath={`/working/project/manager/${projectId}`}></TabNavigation>
    );
}

export default ProjectDetail;
