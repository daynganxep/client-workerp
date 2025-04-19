import axios, { service } from "@tools/axios.tool";

const CompanyModuleRolesService = {
    getByEmployee(companyId) {
        return service(
            axios.get(
                `/company-app/company-module-roles/company/${companyId}/employee`,
            ),
        );
    },
    getAllByManager() {
        return service(axios.get(`/company-app/company-module-roles/company`));
    },
    modifyMany(requests) {
        return service(
            axios.post(`/company-app/company-module-roles/company`, requests),
        );
    },
};

export default CompanyModuleRolesService;
