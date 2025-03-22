import apiCode from "@configs/apiCode.config";
import { toast } from "react-hot-toast";

function getMessage(key) {
    if (!apiCode[key]) {
        console.log(`toast getMessage :: key :: ${key} :: notfound`);
    }
    return apiCode[key] || key;
}

const success = (message) => {
    toast.success(getMessage(message), {
        style: {
            background: "#333",
            color: "#fff",
        },
    });
};

const error = (message) => {
    toast.error(getMessage(message), {
        style: {
            background: "#333",
            color: "#fff",
        },
    });
};

export default {
    success,
    error,
};
