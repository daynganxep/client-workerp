import EmployeeTab from "./employee-tab";
import DepartmentTab from "./department-tab";
import PositionTab from "./position-tab";
import ContractTab from "./contract-tab";
import TabNavigation from "@layouts/user/working-layout/tab-navigation";

function HRManagerModule() {
    const tabs = [
        { label: "working.hr.employee.index", value: 'employee', element: <EmployeeTab /> },
        { label: "working.hr.department.index", value: 'department', element: <DepartmentTab /> },
        { label: "working.hr.position.index", value: 'position', element: <PositionTab /> },
        { label: "working.hr.contract.index", value: 'contract', element: <ContractTab /> },
    ];

    return (
        <TabNavigation tabs={tabs} basePath="/working/hr/manager" />
    );
}

export default HRManagerModule;
