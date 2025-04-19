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
    Select,
    MenuItem,
    Typography,
    Box,
} from "@mui/material";
import EmployeeService from "@services/hr-module-service/employee.service";
import DepartmentService from "@services/hr-module-service/department.service";
import PositionService from "@services/hr-module-service/position.service";
import useFormValidation from "@hooks/useForm";
import { employeeSchema, inviteEmployeeSchema } from "@validations/hrSchema";
import toast from "@hooks/toast";

function EmployeeTab() {
    const { id: companyId } = useSelector((state) => state.company);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [openInvite, setOpenInvite] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const {
        data: inviteData,
        errors: inviteErrors,
        handleChange: handleInviteChange,
        validate: validateInvite,
        startSubmitting: startInviteSubmitting,
        finishSubmitting: finishInviteSubmitting,
        isSubmitting: isInviteSubmitting,
    } = useFormValidation(inviteEmployeeSchema, { userId: "" });

    const {
        data: editData,
        errors: editErrors,
        handleChange: handleEditChange,
        validate: validateEdit,
        startSubmitting: startEditSubmitting,
        finishSubmitting: finishEditSubmitting,
        isSubmitting: isEditSubmitting,
    } = useFormValidation(employeeSchema, {
        name: "",
        dob: "",
        department: null,
        position: null,
    });

    const fetchEmployees = async () => {
        const [res, err] = await EmployeeService.getEmployeesByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setEmployees(res.data);
    };

    const fetchDepartments = async () => {
        const [res, err] = await DepartmentService.getDepartmentsByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setDepartments(res.data);
    };

    const fetchPositions = async () => {
        const [res, err] = await PositionService.getPositionsByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setPositions(res.data);
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchPositions();
    }, []);

    const handleInvite = async () => {
        if (!validateInvite()) return;
        startInviteSubmitting();
        const [, err] = await EmployeeService.inviteToCompany(inviteData);
        finishInviteSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Invited employee successfully");
        setOpenInvite(false);
    };

    const handleEdit = async () => {
        if (!validateEdit()) return;
        startEditSubmitting();
        const requestData = {
            name: editData.name,
            dob: editData.dob,
            departmentId: editData.department || null,
            positionId: editData.position || null,
        };
        const [, err] = await EmployeeService.updateEmployee(
            editingEmployee.id,
            requestData,
        );
        finishEditSubmitting();
        if (err) return toast.error(err.code);
        toast.success("Updated employee successfully");
        setOpenEdit(false);
        fetchEmployees();
    };

    const openEditDialog = (employee) => {
        setEditingEmployee(employee);
        handleEditChange("name", employee.name);
        handleEditChange(
            "dob",
            employee.dob
                ? new Date(employee.dob).toISOString().split("T")[0]
                : "",
        );
        handleEditChange("department", employee.department?.id || null);
        handleEditChange("position", employee.position?.id || null);
        setOpenEdit(true);
    };

    return (
        <div className="employee-tab">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography variant="h6">Danh sách nhân viên</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenInvite(true)}
                >
                    Mời nhân viên mới
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Ngày sinh</TableCell>
                        <TableCell>Phòng ban</TableCell>
                        <TableCell>Vị trí</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>
                                {employee.dob
                                    ? new Date(
                                        employee.dob,
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </TableCell>
                            <TableCell>
                                {employee.department?.name || "N/A"}
                            </TableCell>
                            <TableCell>
                                {employee.position?.name || "N/A"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => openEditDialog(employee)}
                                >
                                    Sửa
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Invite Dialog */}
            <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
                <DialogTitle>Mời nhân viên</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="UserId nhân viên mới"
                        value={inviteData.userId}
                        onChange={(e) =>
                            handleInviteChange("userId", e.target.value)
                        }
                        error={!!inviteErrors.userId}
                        helperText={inviteErrors.userId}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInvite(false)}>Hủy</Button>
                    <Button
                        onClick={handleInvite}
                        disabled={isInviteSubmitting}
                    >
                        {isInviteSubmitting ? "Đang gửi..." : "Gửi"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên"
                        value={editData.name}
                        onChange={(e) =>
                            handleEditChange("name", e.target.value)
                        }
                        error={!!editErrors.name}
                        helperText={editErrors.name}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Ngày sinh"
                        type="date"
                        value={editData.dob}
                        onChange={(e) =>
                            handleEditChange("dob", e.target.value)
                        }
                        error={!!editErrors.dob}
                        helperText={editErrors.dob}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                    />
                    <Select
                        fullWidth
                        value={editData.department || ""}
                        onChange={(e) =>
                            handleEditChange("department", e.target.value)
                        }
                        displayEmpty
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="">Không chọn</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        fullWidth
                        value={editData.position || ""}
                        onChange={(e) =>
                            handleEditChange("position", e.target.value)
                        }
                        displayEmpty
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="">Không chọn</MenuItem>
                        {positions.map((pos) => (
                            <MenuItem key={pos.id} value={pos.id}>
                                {pos.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
                    <Button onClick={handleEdit} disabled={isEditSubmitting}>
                        {isEditSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EmployeeTab;
