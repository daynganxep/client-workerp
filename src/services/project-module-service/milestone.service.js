import axios, { service } from "@tools/axios.tool";

const MilestoneService = {
    createMilestone: (projectId, data) =>
        service(
            axios.post(`/project-app/milestones/project/${projectId}`, data),
        ),
    updateMilestone: (milestoneId, data) =>
        service(axios.put(`/project-app/milestones/${milestoneId}`, data)),
    deleteMilestone: (milestoneId) =>
        service(axios.delete(`/project-app/milestones/${milestoneId}`)),
    getMilestonesByProjectId: (projectId) =>
        service(axios.get(`/project-app/milestones/project/${projectId}`)),
};

export default MilestoneService;
