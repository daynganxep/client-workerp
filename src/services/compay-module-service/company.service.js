import axios, { service } from "@tools/axios.tool";

const CompanyService = {
    getAllMyCompanies() {
        return service(axios.get("/company-app/companies"));
    },
    createCompany(data) {
        return service(axios.post("/company-app/companies", data));
    },
    updateCompanyInfo(data) {
        return service(axios.put(`/company-app/companies`, data));
    },
};

export default CompanyService;
