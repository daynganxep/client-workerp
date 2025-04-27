import axios, { service } from "@tools/axios.tool";

const CompanyService = {
    getAllMyCompanies() {
        return service(axios.get("/company-app/companies"));
    },
    getById(companyId) {
        return service(axios.get(`/company-app/companies/${companyId}`));
    },
    createCompany(data) {
        return service(axios.post("/company-app/companies", data));
    },
    updateCompanyInfo(data) {
        return service(axios.put(`/company-app/companies`, data));
    },
    updateModules(companyId, data) {
        return service(
            axios.post(
                `/company-app/companies/${companyId}/update-modules`,
                data,
            ),
        );
    },
};

export default CompanyService;
