import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompanyService from '@services/compay-module-service/company.service';
import EmployeeService from '@services/hr-module-service/employee.service';
import CompanyModuleRolesService from '@services/compay-module-service/company-module-roles.service';
import { companyActions } from '@redux/slices/company.slide';
import CreateCompanyDialog from './CreateCompanyDialog';
import { stringToColor } from '@tools/string.tool';
import './.scss';

function Companies() {
    const { isLoging } = useSelector((state) => state.auth);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    // Fetch danh sách công ty
    async function fetchCompanies() {
        setLoading(true);
        const [data, error] = await CompanyService.getAllMyCompanies();
        if (!error) {
            setCompanies(data.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (isLoging) {
            fetchCompanies();
        }
    }, [isLoging]);

    // Mở dialog tạo công ty
    const handleCreateCompany = () => {
        setOpenDialog(true);
    };

    // Xử lý vào công ty
    const handleComeInCompany = async (company) => {
        dispatch(companyActions.setCompanyCore(company));
        const companyId = company.id;

        const [[res1, err1], [res2, err2]] = await Promise.all([
            EmployeeService.getCompanyEmployees(companyId),
            CompanyModuleRolesService.getByEmployee(companyId),
        ]);

        if (!err1 && !err2) {
            dispatch(companyActions.setEmployees(res1.data));
            dispatch(companyActions.setCompanyModuleRoles(res2.data));
            navigate('/working/project');
        }
    };

    // Tạo avatar từ tên
    const stringAvatar = (name) => ({
        sx: {
            bgcolor: stringToColor(name),
            width: 64,
            height: 64,
        },
        children: name.charAt(0).toUpperCase(),
    });

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.default,
                minHeight: '100%',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 2,
                        boxShadow: theme.shadows[1],
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ color: theme.palette.text.primary }}
                    >
                        Danh sách công ty
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleCreateCompany}
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                        }}
                    >
                        Tạo công ty mới
                    </Button>
                </Box>

                {/* Loading */}
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '50vh',
                            bgcolor: theme.palette.background.paper,
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {companies.map((company) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={company.id}
                            >
                                <Card
                                    sx={{
                                        bgcolor: theme.palette.background.paper,
                                        borderRadius: theme.shape.borderRadius,
                                        boxShadow: theme.shadows[2],
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: theme.shadows[4],
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                    className="company-card"
                                >
                                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                        <Avatar
                                            src={company.logo}
                                            {...(company.logo ? { sx: { width: 64, height: 64 } } : stringAvatar(company.name))}
                                            sx={{ mx: 'auto', mb: 2 }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{ color: theme.palette.text.primary, mb: 1 }}
                                        >
                                            {company.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            Domain: {company.domain || 'Chưa cài đặt'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            Trạng thái: {company.active ? 'Đang hoạt động' : 'Không hoạt động'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleComeInCompany(company)}
                                            sx={{
                                                borderRadius: theme.shape.borderRadius,
                                                textTransform: 'none',
                                            }}
                                        >
                                            Vào công ty
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Dialog tạo công ty */}
                <CreateCompanyDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSuccess={fetchCompanies}
                />
            </Container>
        </Box>
    );
}

export default Companies;