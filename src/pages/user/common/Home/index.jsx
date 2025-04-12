import { useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
    const theme = useTheme();
    const sectionsRef = useRef([]);

    // Animation khi scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            },
            { threshold: 0.2 }
        );

        sectionsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            sectionsRef.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.default,
                py: 6,
            }}
        >
            <Container maxWidth="lg">
                {/* Hero Section */}
                <Box
                    ref={(el) => (sectionsRef.current[0] = el)}
                    sx={{
                        textAlign: 'center',
                        mb: 8,
                        opacity: 0,
                        transform: 'translateY(50px)',
                        transition: 'all 0.6s ease-out',
                        '&.animate': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ color: theme.palette.text.primary }}
                    >
                        Chào mừng đến với Work-ERP
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ color: theme.palette.text.secondary, mb: 4 }}
                    >
                        Giải pháp quản lý doanh nghiệp toàn diện, tối ưu hóa quy trình làm việc.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/auth/register"
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        Bắt đầu ngay
                    </Button>
                </Box>

                {/* Features Section */}
                <Box ref={(el) => (sectionsRef.current[1] = el)} sx={{ mb: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ color: theme.palette.text.primary, textAlign: 'center' }}
                    >
                        Tính năng nổi bật
                    </Typography>
                    <Grid container spacing={3}>
                        {[
                            {
                                title: 'Quản lý công ty',
                                description:
                                    'Tổ chức và theo dõi thông tin công ty, vai trò, và quyền truy cập.',
                            },
                            {
                                title: 'Quản lý nhân sự',
                                description:
                                    'Tự động hóa quy trình nhân sự, từ tuyển dụng đến chấm công.',
                            },
                            {
                                title: 'Quản lý dự án',
                                description:
                                    'Theo dõi tiến độ dự án, phân công nhiệm vụ, và báo cáo hiệu suất.',
                            },
                        ].map((feature, index) => (
                            <Grid
                                item
                                xs={12}
                                md={4}
                                key={index}
                                sx={{
                                    opacity: 0,
                                    transform: 'translateY(30px)',
                                    transition: `all 0.6s ease-out ${0.2 * index}s`,
                                    '&.animate': {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                }}
                                ref={(el) => (sectionsRef.current[index + 2] = el)}
                            >
                                <Card
                                    sx={{
                                        bgcolor: theme.palette.background.paper,
                                        borderRadius: theme.shape.borderRadius,
                                        height: '100%',
                                        boxShadow: theme.shadows[2],
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography sx={{ color: theme.palette.text.secondary }}>
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                <Box
                    ref={(el) => (sectionsRef.current[5] = el)}
                    sx={{
                        textAlign: 'center',
                        opacity: 0,
                        transform: 'translateY(50px)',
                        transition: 'all 0.6s ease-out',
                        '&.animate': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{ color: theme.palette.text.primary }}
                    >
                        Sẵn sàng nâng cấp doanh nghiệp của bạn?
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/auth/register"
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        Tham gia ngay
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default Home;