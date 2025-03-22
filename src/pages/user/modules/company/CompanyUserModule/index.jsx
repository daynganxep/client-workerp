import ModuleTabLayout from "@layouts/user/ModuleTabLayout";
import "./.scss";

function CompanyOverviewTab() {
    return (
        <div className="company-overview-tab">
            <h3>Tổng quan công ty</h3>
            <p>Thông tin tổng quan cho người dùng...</p>
        </div>
    );
}

function CompanyUserModule() {
    const tabs = [{ label: "Tổng quan", content: <CompanyOverviewTab /> }];

    return (
        <div className="company-user-module">
            <ModuleTabLayout tabs={tabs} />
        </div>
    );
}

export default CompanyUserModule;
