import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function IconButtonEdit({ onClick, top, right }) {
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: top,
                right: right,
                bgcolor: (theme) => theme.palette.action.focus,
                color: (theme) => theme.palette.common.white,
                "&:hover": {
                    bgcolor: (theme) => theme.palette.action.selected,
                    color: (theme) => theme.palette.primary.contrastText,
                },
            }}
        >
            <Edit />
        </IconButton>
    );
}

export default IconButtonEdit;
