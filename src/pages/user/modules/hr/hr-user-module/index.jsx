import EmployeeTab from "./employee-tab";
import ContractTab from "./contract-tab";
import TabNavigation from "@layouts/user/working-layout/tab-navigation";

function HRUserModule() {
    const tabs = [
        { label: "working.hr.employee.index", value: 'employee', element: <EmployeeTab /> },
        { label: "working.hr.contract.index", value: 'contract', element: <ContractTab /> },
    ];

    return (
        <TabNavigation tabs={tabs} basePath="/working/hr/user" />
    );
}

export default HRUserModule;
