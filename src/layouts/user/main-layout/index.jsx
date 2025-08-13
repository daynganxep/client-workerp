import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
} from '@mui/material';
import LogoAndBrandName from '@components/ui/logo-and-brand-name';
import ThemeToggleButton from '@components/ui/theme-toggle-button';
import UserMenu from './user-menu';

function MainLayout() {
    const { t } = useTranslation();
    const { isLoging, user } = useSelector((state) => state.auth);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: 1 }}>
            {/* Header */}
            <AppBar position="static" elevation={0} sx={{ borderRadius: 10 }}>
                <Toolbar>
                    {/* Logo */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <LogoAndBrandName size={0.7} />
                    </Box>

                    {/* Auth */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLoging ? (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/companies"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {t("layout.main.company-button")}
                                </Button>
                                <UserMenu user={user} />
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/auth/login"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {t("layout.main.login-button")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/auth/register"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {t("layout.main.register-button")}
                                </Button>
                            </>
                        )}
                        <ThemeToggleButton />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Box className="main-layout__content">
                <Container maxWidth="xl">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}

export default MainLayout;