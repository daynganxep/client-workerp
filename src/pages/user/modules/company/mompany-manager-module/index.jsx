import CompanyInfoTab from './company-info-tab';
import CompanyModuleRolesTab from './company-module-roles-tab';
import CompanyModulesTab from './company-modules-tab';
import TabNavigation from '@layouts/user/working-layout/tab-navigation';

const CompanyManagerModule = () => {
    const tabs = [
        { label: 'working.company.roles', value: 'roles', element: <CompanyModuleRolesTab /> },
        { label: 'working.company.modules', value: 'modules', element: <CompanyModulesTab /> },
        { label: 'working.company.info', value: 'info', element: <CompanyInfoTab /> },
    ];
    const basePath = `/working/company/manager`;

    return <TabNavigation tabs={tabs} basePath={basePath} />;
};
export default CompanyManagerModule;