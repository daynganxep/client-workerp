import axios, { service } from "@tools/axios.tool";

const ProjectService = {
    getProjectsByCompanyId: (companyId) =>
        service(axios.get(`/project-app/projects/company/${companyId}`)),
    createProject: (data) => service(axios.post(`/project-app/projects`, data)),
    updateProject: (projectId, data) =>
        service(axios.put(`/project-app/projects/${projectId}`, data)),
    deleteProject: (projectId) =>
        service(axios.delete(`/project-app/projects/${projectId}`)),
    addMember: (projectId, data) =>
        service(axios.post(`/project-app/projects/${projectId}/members`, data)),
    removeMember: (projectId, employeeId) =>
        service(
            axios.delete(
                `/project-app/projects/${projectId}/members/${employeeId}`,
            ),
        ),
    getMyProjects: () => service(axios.get(`/project-app/projects/me`)),
    getProjectById: (projectId) =>
        service(axios.get(`/project-app/projects/${projectId}`)),
};

export default ProjectService;
