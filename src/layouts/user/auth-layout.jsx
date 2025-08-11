import { Box, Card, CardContent, Container } from "@mui/material";
import LogoAndBrandName from "@components/ui/logo-and-brand-name";
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
          sx={{
            p: 3,
          }}
        >
          <LogoAndBrandName />
          <CardContent sx={{ mt: 3 }}>
            <Outlet />
          </CardContent>
        </Card>
      </Container>
    </Box >
  );
}

export default AuthLayout;