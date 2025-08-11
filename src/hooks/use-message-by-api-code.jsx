import apiCode from "@configs/api-code.config";

export default function useMessageByApiCode() {
    return function (key) {
        if (!apiCode[key]) {
            console.log(`useMessageByApiCode :: key :: ${key} :: notfound`);
        }
        return apiCode[key] || key;
    };
}
