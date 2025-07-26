import axios, { service } from "@tools/axios.tool";

const PositionService = {
    createPosition: (data) =>
        service(axios.post(`/hr-app/positions/company`, data)),
    updatePosition: (positionId, data) =>
        service(axios.put(`/hr-app/positions/${positionId}`, data)),
    deletePosition: (positionId) =>
        service(axios.delete(`/hr-app/positions/${positionId}`)),
    getPositionsByCompanyId: (companyId) =>
        service(axios.get(`/hr-app/positions/company/${companyId}`)),
};

export default PositionService;
