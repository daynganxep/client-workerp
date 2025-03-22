import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import EmployeeTab from "./EmployeeTab";
import DepartmentTab from "./DepartmentTab";
import PositionTab from "./PositionTab";
import ContractTab from "./ContractTab";
import "./.scss";

function HRManagerModule() {
    const tabs = [
        { label: "Nhân viên", content: <EmployeeTab /> },
        { label: "Phòng ban", content: <DepartmentTab /> },
        { label: "Vị trí", content: <PositionTab /> },
        { label: "Hợp đồng", content: <ContractTab /> },
    ];

    return (
        <div className="hr-manager-module">
            <ModuleTabLayout tabs={tabs} />
        </div>
    );
}

export default HRManagerModule;
