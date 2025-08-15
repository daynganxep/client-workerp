import { createSlice } from "@reduxjs/toolkit";
import { getLS } from "@tools/local-storage.tool";
import { setStates } from "@tools/store.tool";

const initialState = getLS("company", {
    id: "",
    owner: "",
    name: "",
    domain: "",
    active: true,
    employee: {},
    modules: [],
    companyModuleRoles: [],
    companyModuleRolesMap: {},
    employees: [],
    employeesMap: {},
})

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        setStates: setStates(initialState),
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
