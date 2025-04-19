import CompanyInfoTab from './CompanyInfoTab';
import CompanyModuleRolesTab from './CompanyModuleRolesTab';
import TabNavigation from '@layouts/user/WorkingLayout/TabNavigation';

const CompanyManagerModule = () => {
    const tabs = [
        { label: 'Phân quyền', value: 'roles', element: <CompanyModuleRolesTab /> },
        { label: 'Thông tin', value: 'info', element: <CompanyInfoTab /> },
    ];
    const basePath = `/working/company/manager`;

    return <TabNavigation tabs={tabs} basePath={basePath} />;
};
export default CompanyManagerModule;