import { useParams } from "react-router-dom";

import TabNavigation from "@layouts/user/working-layout/tab-navigation";
import ProjectOverview from "./project-overview";
import ProjectMembers from "./project-members";
import ProjectTasks from "./project-tasks";

function ProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        { label: "working.project.detail.tabs.task", value: "tasks", element: <ProjectTasks projectId={projectId} isManager /> },
        { label: "working.project.detail.tabs.member", value: "members", element: <ProjectMembers projectId={projectId} /> },
        {
            label: "working.project.detail.tabs.overview",
            value: "overview",
            element: <ProjectOverview projectId={projectId} />,
        },
    ];

    return (
        <TabNavigation tabs={tabs} basePath={`/working/project/manager/${projectId}`}></TabNavigation>
    );
}

export default ProjectDetail;
