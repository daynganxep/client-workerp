import { useState, useEffect } from "react";
import {
    Typography,
    Stack,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import EmployeeService from "@services/hr-module-service/employee.service";
import ContractService from "@services/hr-module-service/contract.service";
import toast from "@hooks/toast";
import "./.scss";

function HrUserModule() {
    const [employee, setEmployee] = useState(null);
    const [contracts, setContracts] = useState([]);

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

    useEffect(() => {
        fetchMyInfo();
        fetchContracts();
    }, []);

    if (!employee) return <div>Loading...</div>;

    return (
        <div className="hr-user-module">
            <Typography variant="h5" gutterBottom>
                Thông tin nhân sự
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Stack spacing={2}>
                    <Typography>
                        <strong>Tên:</strong> {employee.name}
                    </Typography>
                    <Typography>
                        <strong>Ngày sinh:</strong>{" "}
                        {employee.dob
                            ? new Date(employee.dob).toLocaleDateString()
                            : "N/A"}
                    </Typography>
                    <Typography>
                        <strong>Phòng ban:</strong>{" "}
                        {employee.department?.name || "Chưa có"}
                    </Typography>
                    <Typography>
                        <strong>Vị trí:</strong>{" "}
                        {employee.position?.name || "Chưa có"}
                    </Typography>
                    <Typography>
                        <strong>Công ty:</strong> {employee.companyId}
                    </Typography>
                    <Typography>
                        <strong>Ngày tạo:</strong>{" "}
                        {new Date(employee.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography>
                        <strong>Ngày cập nhật:</strong>{" "}
                        {new Date(employee.updatedAt).toLocaleDateString()}
                    </Typography>
                </Stack>
            </Paper>

            <Typography variant="h6" gutterBottom>
                Danh sách hợp đồng
            </Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
                {contracts.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Ngày bắt đầu</TableCell>
                                <TableCell>Ngày kết thúc</TableCell>
                                <TableCell>Loại hợp đồng</TableCell>
                                <TableCell>Lương</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell>
                                        {new Date(
                                            contract.startDate,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {contract.endDate
                                            ? new Date(
                                                  contract.endDate,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{contract.type}</TableCell>
                                    <TableCell>
                                        {contract.salary.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{contract.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>Chưa có hợp đồng nào</Typography>
                )}
            </Paper>
        </div>
    );
}

export default HrUserModule;
