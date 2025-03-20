import axios, { service } from "@tools/axios.tool";

const EmployeeService = {
  getCompanyEmployees(companyId) {
    return service(axios.get("/hr-app/employees/company/" + companyId));
  },
};

export default EmployeeService;
