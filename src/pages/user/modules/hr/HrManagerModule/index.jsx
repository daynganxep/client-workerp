import EmployeeTab from "./EmployeeTab";
import DepartmentTab from "./DepartmentTab";
import PositionTab from "./PositionTab";
import ContractTab from "./ContractTab";
import "./.scss";
import TabNavigation from "@layouts/user/WorkingLayout/TabNavigation";

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
