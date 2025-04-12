import { useParams } from "react-router-dom";
import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import AllTasks from "./AllTasks";
import MyTasks from "./MyTasks";

function UserProjectDetail() {
    const { projectId } = useParams();

    const tabs = [
        {
            label: "All Tasks",
            content: <AllTasks projectId={projectId} />,
        },
        { label: "My Tasks", content: <MyTasks projectId={projectId} /> },
    ];

    return (
        <div className="project-detail">
            <ModuleTabLayout tabs={tabs} />
        </div>
    );
}

export default UserProjectDetail;
