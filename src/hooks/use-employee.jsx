import { useSelector } from "react-redux";

function useEmployee() {
    const employeesMap = useSelector((state) => state.company.employeesMap);

    return function (id) {
        return employeesMap[id];
    };
}

export default useEmployee;
