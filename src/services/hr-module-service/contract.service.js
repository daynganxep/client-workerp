import axios, { service } from "@tools/axios.tool";

const ContractService = {
    createContract: (data) =>
        service(axios.post(`/hr-app/contracts/employee`, data)),
    updateContract: (contractId, data) =>
        service(axios.put(`/hr-app/contracts/${contractId}`, data)),
    deleteContract: (contractId) =>
        service(axios.delete(`/hr-app/contracts/${contractId}`)),
    getContractsByEmployeeId: (employeeId) =>
        service(axios.get(`/hr-app/contracts/employee/${employeeId}`)),
    getMyContracts: () => service(axios.get(`/hr-app/contracts/me`)),
};

export default ContractService;
