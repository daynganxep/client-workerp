import apiCode from "@configs/apiCode.config";
import { toast } from "react-hot-toast";

function getMessage(key) {
    if (!apiCode[key]) {
        console.log(`toast :: ${key} :: not found`);
    }
    return apiCode[key] || key;
}

const success = (message) => {
    toast.success(getMessage(message));
};

const error = (message) => {
    toast.error(getMessage(message));
};

export default {
    success,
    error,
};
