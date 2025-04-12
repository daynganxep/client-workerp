import { useParams } from "react-router-dom";
import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import ".scss";

import ProjectOverview from "./ProjectOverview";
import ProjectMembers from "./ProjectMembers";
import ProjectMilestones from "./ProjectMilestones";
import ProjectTasks from "./ProjectTasks";

function ProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        {
            label: "Overview",
            content: <ProjectOverview projectId={projectId} />,
        },
        { label: "Tasks", content: <ProjectTasks projectId={projectId} /> },
        { label: "Members", content: <ProjectMembers projectId={projectId} /> },
        {
            label: "Milestones",
            content: <ProjectMilestones projectId={projectId} />,
        },
    ];

    return (
        <div className="project-detail">
            <ModuleTabLayout tabs={tabs} />
        </div>
    );
}

export default ProjectDetail;
