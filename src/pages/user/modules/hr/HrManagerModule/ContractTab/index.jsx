import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    Box,
    Typography,
} from "@mui/material";
import ContractService from "@services/hr-module-service/contract.service";
import EmployeeService from "@services/hr-module-service/employee.service";
import useFormValidation from "@hooks/useForm";
import { contractSchema } from "@validations/hrSchema";
import toast from "@hooks/toast";
import "./.scss";

function ContractTab() {
    const { id: companyId } = useSelector((state) => state.company);
    const [contracts, setContracts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
    } = useFormValidation(contractSchema, {
        employeeId: "",
        startDate: "",
        endDate: "",
        type: "FULL_TIME",
        salary: 0,
        status: "ACTIVE",
        companyId,
    });

    const fetchContracts = async (employeeId) => {
        if (!employeeId) return;
        const [res, err] = await ContractService.getContractsByEmployeeId(
            employeeId,
        );
        if (err) return toast.error(err.code);
        setContracts(res.data);
    };

    const fetchEmployees = async () => {
        const [res, err] = await EmployeeService.getEmployeesByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setEmployees(res.data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchContracts(selectedEmployeeId);
    }, [selectedEmployeeId]);

    const handleCreateOrUpdate = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = editingId
            ? await ContractService.updateContract(editingId, data)
            : await ContractService.createContract(data);
        finishSubmitting();
        if (err)
            return toast.error(
                `Failed to ${editingId ? "update" : "create"} contract`,
            );
        toast.success(
            `${editingId ? "Updated" : "Created"} contract successfully`,
        );
        setOpenCreate(false);
        setEditingId(null);
        fetchContracts(data.employeeId);
    };

    const handleDelete = async (contractId) => {
        const [res, err] = await ContractService.deleteContract(contractId);
        if (err) return toast.error(err.code);
        toast.success("Deleted contract successfully");
        fetchContracts(selectedEmployeeId);
    };

    return (
        <div className="contract-tab">
            <Box
                sx={{

                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 2
                }}
            >
                <Typography variant="h6">Quản lý hợp đồng</Typography>
                <Select
                    fullWidth
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    displayEmpty
                    sx={{ maxWidth: 300 }}
                >
                    <MenuItem value="">Chọn nhân viên</MenuItem>
                    {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.name}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    variant="contained"
                    onClick={() => setOpenCreate(true)}
                >
                    Thêm hợp đồng
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nhân viên</TableCell>
                        <TableCell>Ngày bắt đầu</TableCell>
                        <TableCell>Ngày kết thúc</TableCell>
                        <TableCell>Loại</TableCell>
                        <TableCell>Lương</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                            <TableCell>
                                {employees.find(
                                    (e) => e.id === contract.employeeId,
                                )?.name || "N/A"}
                            </TableCell>
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
                            <TableCell>{contract.salary}</TableCell>
                            <TableCell>{contract.status}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => {
                                        setEditingId(contract.id);
                                        Object.keys(data).forEach((key) =>
                                            handleChange(key, contract[key]),
                                        );
                                        setOpenCreate(true);
                                    }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    color="error"
                                    onClick={() => handleDelete(contract.id)}
                                >
                                    Xóa
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    setEditingId(null);
                }}
            >
                <DialogTitle>
                    {editingId ? "Sửa hợp đồng" : "Thêm hợp đồng"}
                </DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        label="Nhân viên"
                        value={data.employeeId}
                        onChange={(e) =>
                            handleChange("employeeId", e.target.value)
                        }
                        error={!!errors.employeeId}
                        sx={{ mt: 1 }}
                    >
                        {employees.map((emp) => (
                            <MenuItem key={emp.id} value={emp.id}>
                                {emp.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        fullWidth
                        label="Ngày bắt đầu"
                        type="date"
                        value={data.startDate}
                        onChange={(e) =>
                            handleChange("startDate", e.target.value)
                        }
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Ngày kết thúc"
                        type="date"
                        value={data.endDate}
                        onChange={(e) =>
                            handleChange("endDate", e.target.value)
                        }
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <Select
                        fullWidth
                        value={data.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        error={!!errors.type}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="FULL_TIME">Full Time</MenuItem>
                        <MenuItem value="PART_TIME">Part Time</MenuItem>
                        <MenuItem value="FREELANCE">Freelance</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        label="Lương"
                        type="number"
                        value={data.salary}
                        onChange={(e) => handleChange("salary", e.target.value)}
                        error={!!errors.salary}
                        helperText={errors.salary}
                        sx={{ mt: 2 }}
                    />
                    <Select
                        fullWidth
                        value={data.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        error={!!errors.status}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenCreate(false);
                            setEditingId(null);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleCreateOrUpdate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Đang xử lý..."
                            : editingId
                                ? "Cập nhật"
                                : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ContractTab;
