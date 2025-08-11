import { useParams } from "react-router-dom";
import TabNavigation from "@layouts/user/working-layout/tab-navigation";
import ProjectTasks from "../../project-manager-module/project-detail/project-tasks";

function UserProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        { label: "Nhiệm vụ của tôi", value: "my-tasks", element: <ProjectTasks projectId={projectId} isMyTasks /> },
        {
            label: "Tất cả nhiệm vụ",
            value: "all-task",
            element: <ProjectTasks projectId={projectId} />,
        },
    ];

    return (
        <div className="project-detail">
            <TabNavigation tabs={tabs} basePath={`/working/project/user/${projectId}`}></TabNavigation>
        </div>
    );
}

export default UserProjectDetail;
