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
    Box,
    Typography,
} from "@mui/material";
import DepartmentService from "@services/hr-module-service/department.service";
import useFormValidation from "@hooks/useForm";
import { departmentSchema } from "@validations/hrSchema";
import toast from "@hooks/toast";
import "./.scss";

function DepartmentTab() {
    const { id: companyId } = useSelector((state) => state.company);
    const [departments, setDepartments] = useState([]);
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
    } = useFormValidation(departmentSchema, { name: "", description: "" });

    const fetchDepartments = async () => {
        const [res, err] = await DepartmentService.getDepartmentsByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setDepartments(res.data);
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = editingId
            ? await DepartmentService.updateDepartment(editingId, data)
            : await DepartmentService.createDepartment(data);
        finishSubmitting();
        if (err)
            return toast.error(
                `Failed to ${editingId ? "update" : "create"} department`,
            );
        toast.success(
            `${editingId ? "Updated" : "Created"} department successfully`,
        );
        setOpenCreate(false);
        setEditingId(null);
        fetchDepartments();
    };

    const handleDelete = async (departmentId) => {
        const [res, err] = await DepartmentService.deleteDepartment(
            departmentId,
        );
        if (err) return toast.error(err.code);
        toast.success("Deleted department successfully");
        fetchDepartments();
    };

    return (
        <div className="department-tab">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography variant="h6">Danh sách phòng ban</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenCreate(true)}
                >
                    Thêm phòng ban
                </Button>
            </Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departments.map((dept) => (
                        <TableRow key={dept.id}>
                            <TableCell>{dept.name}</TableCell>
                            <TableCell>{dept.description || "N/A"}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => {
                                        setEditingId(dept.id);
                                        handleChange("name", dept.name);
                                        handleChange(
                                            "description",
                                            dept.description,
                                        );
                                        setOpenCreate(true);
                                    }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    color="error"
                                    onClick={() => handleDelete(dept.id)}
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
                    {editingId ? "Sửa phòng ban" : "Thêm phòng ban"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên phòng ban"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Mô tả"
                        value={data.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        error={!!errors.description}
                        helperText={errors.description}
                        sx={{ mt: 2 }}
                    />
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

export default DepartmentTab;
