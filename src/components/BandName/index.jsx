import { Box, Typography, useTheme } from "@mui/material";

function BrandName() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Typography
        variant="h4"
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '24px', sm: '32px', md: '40px' },
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(to right, #64B5F6, #81C784)'
            : 'linear-gradient(to right, #1976D2, #388E3C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}
      >
        work.erp
      </Typography>
      <Typography
        component="span"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          fontSize: { xs: '24px', sm: '32px', md: '40px' }
        }}
      >
      </Typography>
    </Box>
  );
}

export default BrandName;