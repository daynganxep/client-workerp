import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
} from '@mui/material';
import LogoAndBrandName from '@components/LogoAndBrandName';
import ThemeToggleButton from '@components/ThemeToggleButton';
import UserMenu from './UserMenu';
import '.scss';

function MainLayout() {
    const { isLoging, user } = useSelector((state) => state.auth);

    return (
        <Box className="main-layout">
            {/* Header */}
            <AppBar position="static" className="main-layout__header" elevation={0}>
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
                                    Công ty
                                </Button>
                                <UserMenu user={user} />
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    component={Link}
                                    to="/auth/logout"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    Đăng xuất
                                </Button>
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
                                    Đăng nhập
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/auth/register"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                        <ThemeToggleButton />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Box className="main-layout__content">
                <Container maxWidth="xl" className="main-layout__container">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}

export default MainLayout;