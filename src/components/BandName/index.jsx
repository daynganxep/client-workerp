import { Typography } from "@mui/material";
import ".scss";

function BrandName() {
  return (
    <Typography
      variant="h4"
      component="h1"
      align="center"
      sx={{
        fontWeight: 600,
      }}
      className="xxx-brand"
    >
      <span className="work">Work</span>
      <span className="erp">ERP</span>
    </Typography>
  );
}

export default BrandName;
