import { toast } from "react-hot-toast";

const success = (message) => {
  toast.success(message, {
    style: {
      background: "#333",
      color: "#fff",
    },
  });
};

const error = (message) => {
  toast.error(message, {
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
