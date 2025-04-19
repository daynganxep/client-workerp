import axios, { service } from "@tools/axios.tool";

const TaskService = {
    getTasksByProjectId: (
        projectId,
        { status, priority, sortBy = "dueDate", order = "asc" } = {},
    ) =>
        service(
            axios.get(`/project-app/tasks/project/${projectId}`, {
                params: { status, priority, sortBy, order },
            }),
        ),
    getTaskById: (taskId) => service(axios.get(`/project-app/tasks/${taskId}`)),
    createTask: (projectId, data) =>
        service(axios.post(`/project-app/tasks/project/${projectId}`, data)),
    updateTask: (taskId, data) =>
        service(axios.put(`/project-app/tasks/${taskId}`, data)),
    deleteTask: (taskId) =>
        service(axios.delete(`/project-app/tasks/${taskId}`)),
    getMyTasks: (projectId, { sortBy = "dueDate", order = "asc" } = {}) =>
        service(
            axios.get(`/project-app/tasks/project/${projectId}/me`, {
                params: { sortBy, order },
            }),
        ),
    updateTaskStatus: (taskId, status) =>
        service(axios.put(`/project-app/tasks/${taskId}/status`, { status })),
    createSubtask: (taskId, data) =>
        service(axios.post(`/project-app/tasks/${taskId}/subtasks`, data)),
    addDependency: (taskId, dependencyId) =>
        service(
            axios.post(
                `/project-app/tasks/${taskId}/dependencies/${dependencyId}`,
            ),
        ),
    removeDependency: (taskId, dependencyId) =>
        service(
            axios.delete(
                `/project-app/tasks/${taskId}/dependencies/${dependencyId}`,
            ),
        ),
    addComment: (taskId, data) =>
        service(axios.post(`/project-app/tasks/${taskId}/comments`, data)),
    updateComment: (taskId, commentId, data) =>
        service(
            axios.put(
                `/project-app/tasks/${taskId}/comments/${commentId}`,
                data,
            ),
        ),
    deleteComment: (taskId, commentId) =>
        service(
            axios.delete(`/project-app/tasks/${taskId}/comments/${commentId}`),
        ),
    assignUpdateTask: (taskId, data) =>
        service(axios.put(`/project-app/tasks/${taskId}/assignee`, data)),
};

export default TaskService;
