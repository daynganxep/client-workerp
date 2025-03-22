import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import "./.scss";
import CompanyModuleRolesTab from "./CompanyModuleRolesTab";
import CompanyInfoTab from "./CompanyInfoTab";

function CompanyManagerModule() {
    const tabs = [
        { label: "Quản lý quyền", content: <CompanyModuleRolesTab /> },
        { label: "Thông tin công ty", content: <CompanyInfoTab /> },
    ];

    return (
        <div className="company-manager-module">
            <ModuleTabLayout tabs={tabs} />
        </div>
    );
}

export default CompanyManagerModule;
