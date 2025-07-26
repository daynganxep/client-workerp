import axios, { service } from "@tools/axios.tool";

const ModuleService = {
    getAll() {
        return service(axios.get("/company-app/modules"));
    },
};

export default ModuleService;
