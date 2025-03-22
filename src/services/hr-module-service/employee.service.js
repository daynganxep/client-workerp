import axios, { service } from "@tools/axios.tool";

const EmployeeService = {
    getCompanyEmployees(companyId) {
        return service(axios.get("/hr-app/employees/company/" + companyId));
    },
    inviteToCompany: (data) =>
        service(axios.post(`/hr-app/employees/invite-to-company`, data)),
    getEmployeesByCompanyId: (companyId) =>
        service(axios.get(`/hr-app/employees/company/${companyId}`)),
    getMyEmployeeInfo: () => service(axios.get(`/hr-app/employees/me`)),
    addOwnerToCompany: (data) =>
        service(axios.post(`/hr-app/employees/add-owner-to-company`, data)),
    updateEmployee: (employeeId, data) =>
        service(axios.put(`/hr-app/employees/${employeeId}`, data)),
};

export default EmployeeService;
