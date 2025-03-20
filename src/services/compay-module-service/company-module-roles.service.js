import axios, { service } from "@tools/axios.tool";

const CompanyModuleRolesService = {
  getByEmployee(companyId) {
    return service(
      axios.get(
        `/company-app/company-module-roles/company/${companyId}/employee`
      )
    );
  },
};

export default CompanyModuleRolesService;
