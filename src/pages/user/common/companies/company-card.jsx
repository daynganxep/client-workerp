import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Card,
    CardActions,
    CardContent,
    useTheme,
} from '@mui/material';
import EmployeeService from '@services/hr-module-service/employee.service';
import CompanyModuleRolesService from '@services/compay-module-service/company-module-roles.service';
import { companyActions } from '@redux/slices/company.slice';
import { stringToColor } from '@tools/string.tool';
import { useTranslation } from 'react-i18next';

function CompanyCard({ company }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const stringAvatar = (name) => ({
        sx: {
            bgcolor: stringToColor(name),
            width: 64,
            height: 64,
        },
        children: name.charAt(0).toUpperCase(),
    });

    async function handleComeInCompany() {
        dispatch(companyActions.setCompanyCore(company));
        dispatch(companyActions.setCompanyInfo(company));
        const companyId = company.id;

        const [[res1, err1], [res2, err2]] = await Promise.all([
            EmployeeService.getCompanyEmployees(companyId),
            CompanyModuleRolesService.getByEmployee(companyId),
        ]);

        if (!err1 && !err2) {
            dispatch(companyActions.setEmployees(res1.data));
            dispatch(companyActions.setCompanyModuleRoles(res2.data));
            navigate('/working/hr/user');
        }
    };

    return (<Card
        key={company.id}
        sx={{
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[2],
            transition: 'all 0.3s ease',
            flexDirection: 'column',
            overflow: 'hidden',
            '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-4px)',
            },
        }}
    >
        <Box
            sx={{
                position: 'relative',
                paddingTop: '40%',
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'grey.800'
                    : 'grey.100',
                backgroundImage: company.coverImage
                    ? `url(${company.coverImage})`
                    : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Avatar overlapping the cover */}
            <Avatar
                src={company.avatar}
                {...(!company.avatar && stringAvatar(company.name))}
                sx={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 0,
                    transform: 'translate(-50%, 50%)',
                    width: 80,
                    height: 80,
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[2],
                }}
            />
        </Box>

        <CardContent sx={{
            flexGrow: 1,
            textAlign: 'center',
            mt: 5 // Space for avatar overflow
        }}>
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.text.primary,
                    mb: 1,
                    fontWeight: 600
                }}
            >
                {company.name}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.secondary,
                    mb: 1
                }}
            >
                {company.domain || 'Chưa cài đặt domain'}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: company.active
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    fontWeight: 500
                }}
            >
                {company.active ? 'Đang hoạt động' : 'Không hoạt động'}
            </Typography>
        </CardContent>

        <CardActions sx={{
            justifyContent: 'center',
            pb: 2,
            px: 2
        }}>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleComeInCompany}
            >
                {t("common.company.go-to-dashboard")}
            </Button>
        </CardActions>
    </Card >);
}

export default CompanyCard;