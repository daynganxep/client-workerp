import { toast } from "react-hot-toast";
import i18n from "i18next";

function getMessage(key) {
    const translated = i18n.t(key);
    return translated;
}

const success = (messageKey) => {
    toast.success(getMessage(messageKey));
};

const error = (messageKey) => {
    toast.error(getMessage(messageKey));
};

export default {
    success,
    error,
};
