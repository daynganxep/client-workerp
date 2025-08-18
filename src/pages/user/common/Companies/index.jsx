import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Grid2,
    Stack,
    useTheme,
} from '@mui/material';
import CompanyService from '@services/compay-module-service/company.service';
import CreateCompany from './create-company';
import CompanyCard from './company-card';

function Companies() {
    const { t } = useTranslation();
    const theme = useTheme();

    const { data: companies = [], refetch } = useQuery({
        queryKey: ["my-companies"],
        queryFn: async () => {
            const [res, error] = await CompanyService.getAllMyCompanies();
            if (error) throw new Error(error.code);
            return res.data;
        },
    });

    return (
        <Stack sx={{ gap: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    p: 2,
                }}
            >
                <Typography
                    variant="h5"
                >
                    {t("common.company.list-company")}
                </Typography>
                <CreateCompany refetchCompanies={refetch} />
            </Box>

            <Grid2 container sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                    lg: "1fr 1fr 1fr"
                },
                gap: 3,
            }}>
                {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </Grid2>
        </Stack >
    );
}

export default Companies;