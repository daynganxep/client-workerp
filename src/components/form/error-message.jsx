import useMessageByApiCode from "@hooks/use-message-by-api-code";
import { Alert } from "@mui/material";


function ErrorMessage({ mutation }) {
    const messageByApiCode = useMessageByApiCode()

    if (!mutation || !mutation?.isError) {
        return null;
    }

    return (<Alert severity="error" variant="standard">
        {mutation.error?.message ? messageByApiCode(mutation.error?.message) : "Đã xảy ra lỗi"}
    </Alert>);
}

export default ErrorMessage;