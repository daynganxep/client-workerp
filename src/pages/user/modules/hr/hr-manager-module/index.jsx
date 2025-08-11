import EmployeeTab from "./employee-tab";
import DepartmentTab from "./department-tab";
import PositionTab from "./position-tab";
import ContractTab from "./contract-tab";
import TabNavigation from "@layouts/user/working-layout/tab-navigation";
import "./.scss";

function HRManagerModule() {
    const tabs = [
        { label: "Nhân viên", value: 'employee', element: <EmployeeTab /> },
        { label: "Phòng ban", value: 'department', element: <DepartmentTab /> },
        { label: "Vị trí", value: 'position', element: <PositionTab /> },
        { label: "Hợp đồng", value: 'contract', element: <ContractTab /> },
    ];

    return (
        <TabNavigation tabs={tabs} basePath="/working/hr/manager" />
    );
}

export default HRManagerModule;
