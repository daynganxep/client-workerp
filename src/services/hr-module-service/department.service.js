import axios, { service } from "@tools/axios.tool";

const DepartmentService = {
    createDepartment: (data) =>
        service(axios.post(`/hr-app/departments/company`, data)),
    updateDepartment: (departmentId, data) =>
        service(axios.put(`/hr-app/departments/${departmentId}`, data)),
    deleteDepartment: (departmentId) =>
        service(axios.delete(`/hr-app/departments/${departmentId}`)),
    getDepartmentsByCompanyId: (companyId) =>
        service(axios.get(`/hr-app/departments/company/${companyId}`)),
};

export default DepartmentService;
