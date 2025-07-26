import { createSlice } from "@reduxjs/toolkit";
import { getLS } from "@tools/localStorage.tool";

const companySlice = createSlice({
    name: "company",
    initialState: getLS("company", {
        id: "",
        owner: "",
        name: "",
        domain: "",
        active: true,
        employee: {},
        modules: [
            {
                id: "67c1f51d27ab50405cd4ce7d",
                code: "COMPANY",
                name: "Công ty",
                description: "Module company",
                active: true,
                iconUrl: "http://company.logo",
            },
            {
                id: "67c1f5f5e0eebe14a5c1cc5a",
                code: "HR",
                name: "Nhân sự",
                description: "Module human resource",
                active: true,
                iconUrl: "http://hr.logo",
            },
        ],
        companyModuleRoles: [],
        companyModuleRolesMap: {},
        employees: [],
        employeesMap: {},
    }),
    reducers: {
        setCompanyCore: (state, { payload }) => {
            state.id = payload.id;
            state.owner = payload.owner;
            state.name = payload.name;
            state.domain = payload.domain;
            state.active = payload.active;
            state.modules = payload.modules;
        },
        setEmployees: (state, { payload }) => {
            state.employees = payload;
            state.employeesMap = {};
            for (let employee of payload) {
                state.employeesMap[employee.id] = employee;
                state.employeesMap[employee.userId] = employee;
            }
        },
        setCompanyModuleRoles: (state, { payload }) => {
            state.companyModuleRoles = payload;
            state.companyModuleRolesMap = {};
            for (let companyModuleRole of payload) {
                const { moduleCode, moduleRole } = companyModuleRole;
                state.companyModuleRolesMap[moduleCode] = moduleRole;
            }
        },
        setCompanyInfo: (state, { payload }) => {
            state.name = payload.name;
            state.domain = payload.domain;
            state.avatar = payload.avatar;
            state.coverImage = payload.coverImage;
            state.active = payload.active;
        },
        setEmployeeInfo: (state, { payload }) => {
            state.employee = payload;
        },
    },
});

export const companyActions = companySlice.actions;
export const companyReducer = companySlice.reducer;
