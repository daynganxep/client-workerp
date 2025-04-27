import { Box, Card, CardContent, Container, alpha } from "@mui/material";
import { Link } from "react-router-dom";
import LogoAndBrandName from "@components/LogoAndBrandName";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="sm" sx={{ px: 2 }}>
        <Card
          elevation={3}
          sx={(theme) => ({
            p: 3,
            backdropFilter: 'blur(8px)',
            background: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          })}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              textDecoration: 'none'
            }}
          >
            <LogoAndBrandName />
          </Box>

          <CardContent sx={{ p: 0 }}>
            <Outlet />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AuthLayout;