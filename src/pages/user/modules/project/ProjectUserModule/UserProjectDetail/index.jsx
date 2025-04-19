import { useParams } from "react-router-dom";
import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import AllTasks from "./AllTasks";
import MyTasks from "./MyTasks";
import TabNavigation from "@layouts/user/WorkingLayout/TabNavigation";

function UserProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        { label: "Task của tôi", value: "my-tasks", element: <MyTasks projectId={projectId} /> },
        {
            label: "Tất cả Task",
            value: "all-task",
            element: <AllTasks projectId={projectId} />,
        },
    ];

    return (
        <div className="project-detail">
            <TabNavigation tabs={tabs} basePath={`/working/project/user/${projectId}`}></TabNavigation>
        </div>
    );
}

export default UserProjectDetail;
