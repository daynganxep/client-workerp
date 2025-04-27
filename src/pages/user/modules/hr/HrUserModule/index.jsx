import { useState, useEffect } from "react";
import {
    Typography,
    Stack,
    Card,
    Box,
    Grid,
    Chip,
    Avatar,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    IconButton
} from "@mui/material";
import {
    Person,
    Cake,
    Business,
    Edit,
    Email,
    Phone
} from "@mui/icons-material";
import EditProfileDialog from './EditProfileDialog';
import EmployeeService from "@services/hr-module-service/employee.service";
import ContractService from "@services/hr-module-service/contract.service";
import toast from "@hooks/toast";
import { formatDateForUI } from "@tools/date.tool";
import { CONTRACT_STATUSES_MAP, CONTRACT_TYPES_MAP } from "@configs/const.config";
import { currencyFormat } from "@tools/string.tool";


const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon}
        <Box>
            <Typography color="text.secondary" variant="body2">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight="medium">
                {value}
            </Typography>
        </Box>
    </Box>
);

function HrUserModule() {
    const [employee, setEmployee] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const theme = useTheme();

    const fetchMyInfo = async () => {
        const [res, err] = await EmployeeService.getMyEmployeeInfo();
        if (err) return toast.error(err.code);
        setEmployee(res.data);
    };

    const fetchContracts = async () => {
        const [res, err] = await ContractService.getMyContracts();
        if (err) return toast.error(err.code);
        setContracts(res.data);
    };

    const handleUpdateProfile = async (formData) => {
        const [res, err] = await EmployeeService.updateMyEmployeeInfo(employee.id, formData);

        if (err) {
            toast.error(err.code);
            return;
        }

        toast.success(res.code);
        setEmployee(res.data);
        setOpenEditDialog(false);
    };

    useEffect(() => {
        fetchMyInfo();
        fetchContracts();
    }, []);

    if (!employee) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Thông tin nhân sự
                </Typography>
                <Typography color="text.secondary">
                    Xem thông tin cá nhân và hợp đồng của bạn
                </Typography>
            </Box>

            <Card elevation={0} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3} alignItems="center" sx={{ p: 3, position: 'relative' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={employee?.avatar}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: theme.palette.primary.main,
                                        fontSize: '3rem',
                                    }}
                                >
                                    {employee?.name?.charAt(0)}
                                </Avatar>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        right: -8,
                                        bottom: -8,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1,
                                    }}
                                    onClick={() => setOpenEditDialog(true)}
                                >
                                    <Edit />
                                </IconButton>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h5" gutterBottom>
                                    {employee.name}
                                </Typography>
                                <Chip
                                    label={employee.position?.name || "Chưa có"}
                                    color="primary"
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            <InfoItem
                                icon={<Business color="primary" />}
                                label="Mã nhân viên"
                                value={employee.id}
                            />
                            <InfoItem
                                icon={<Person color="primary" />}
                                label="Phòng ban"
                                value={employee.department?.name || "Chưa có"}
                            />
                            <InfoItem
                                icon={<Cake color="primary" />}
                                label="Ngày sinh"
                                value={formatDateForUI(employee.dob)}
                            />
                            <InfoItem
                                icon={<Email color="primary" />}
                                label="Email"
                                value={employee?.email || "Chưa có"}
                            />
                            <InfoItem
                                icon={<Phone color="primary" />}
                                label="Số điện thoại"
                                value={employee?.phone || "Chưa có"}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Card>

            {/* Add EditProfileDialog */}
            <EditProfileDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                employee={employee}
                onSave={handleUpdateProfile}
            />

            <Card elevation={0}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Hợp đồng làm việc
                    </Typography>
                </Box>

                <Divider />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Loại hợp đồng</TableCell>
                                <TableCell>Lương</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contracts.map((contract) => (
                                <TableRow key={contract.id} hover>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2">
                                                Từ: {formatDateForUI(contract.startDate)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Đến: {contract.endDate ? formatDateForUI(contract.endDate) : "Không xác định"}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={CONTRACT_TYPES_MAP[contract.type]?.label}
                                            color={CONTRACT_TYPES_MAP[contract.type]?.color}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {currencyFormat(contract.salary)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={CONTRACT_STATUSES_MAP[contract.status]?.label}
                                            color={CONTRACT_STATUSES_MAP[contract.status]?.color}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Stack>
    );
}

export default HrUserModule;