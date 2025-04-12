import {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import {Add} from "@mui/icons-material";
import CompanyService from "@services/compay-module-service/company.service";
import CreateCompanyDialog from "./CreateCompanyDialog";
import {stringToColor} from "@tools/string.tool";
import {useDispatch, useSelector} from "react-redux";
import {companyActions} from "@redux/slices/company.slide";
import EmployeeService from "@services/hr-module-service/employee.service";
import {useNavigate} from "react-router-dom";
import CompanyModuleRolesService from "@services/compay-module-service/company-module-roles.service";
import ".scss";

const Home = () => {
    const {isLoging} = useSelector((state) => state.auth);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function fetchCompanies() {
        const [data, error] = await CompanyService.getAllMyCompanies();
        if (error) {
            return;
        }
        setCompanies(data.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleCreateCompany = () => {
        setOpenDialog(true);
    };

    const handleComeInCompany = async (company) => {
        dispatch(companyActions.setCompanyCore(company));

        const companyId = company.id;

        const [[res1, err1], [res2, err2]] = await Promise.all([EmployeeService.getCompanyEmployees(companyId), CompanyModuleRolesService.getByEmployee(companyId),]);

        if (err1 || err2) {
            return;
        }

        dispatch(companyActions.setEmployees(res1.data));
        dispatch(companyActions.setCompanyModuleRoles(res2.data));
        navigate("/working/project");
    };

    const stringAvatar = (name) => {
        return {
            sx: {
                bgcolor: stringToColor(name), width: 56, height: 56,
            }, children: name.charAt(0).toUpperCase(),
        };
    };

    return (<Container className="home-container">
        <Box
            className="header-box"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
        >
            <Typography variant="h4">Danh sách công ty</Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add/>}
                onClick={handleCreateCompany}
            >
                Tạo công ty mới
            </Button>
        </Box>

        {loading ? (<Box display="flex" justifyContent="center" my={4}>
            <CircularProgress/>
        </Box>) : (<Grid container spacing={3}>
            {companies.map((company) => (<Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={company.id}
            >
                <Card className="company-card" elevation={2}>
                    <CardHeader
                        avatar={company.logo ? (<Avatar
                            src={company.logo}
                            sx={{width: 56, height: 56}}
                        />) : (<Avatar
                            {...stringAvatar(company.name)}
                        />)}
                        title={<Typography
                            variant="h6"
                            component="div"
                        >
                            {company.name}
                        </Typography>}
                    />
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Domain:{" "}
                            {company.domain || "Chưa cài đặt"}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Trạng thái:{" "}
                            {company.active ? "Đang hoạt động" : "Không hoạt động"}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => handleComeInCompany(company)}
                        >
                            Vào công ty
                        </Button>
                    </CardActions>
                </Card>
            </Grid>))}
        </Grid>)}

        <CreateCompanyDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSuccess={fetchCompanies}
        />
    </Container>);
};

export default Home;
