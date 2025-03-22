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
} from "@mui/material";
import PositionService from "@services/hr-module-service/position.service";
import useFormValidation from "@hooks/useForm";
import { positionSchema } from "@validations/hrSchema";
import toast from "@hooks/toast";
import "./.scss";

function PositionTab() {
    const { id: companyId } = useSelector((state) => state.company);
    const [positions, setPositions] = useState([]);
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
    } = useFormValidation(positionSchema, { name: "", description: "" });

    const fetchPositions = async () => {
        const [res, err] = await PositionService.getPositionsByCompanyId(
            companyId,
        );
        if (err) return toast.error(err.code);
        setPositions(res.data);
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = editingId
            ? await PositionService.updatePosition(editingId, data)
            : await PositionService.createPosition(data);
        finishSubmitting();
        if (err)
            return toast.error(
                `Failed to ${editingId ? "update" : "create"} position`,
            );
        toast.success(
            `${editingId ? "Updated" : "Created"} position successfully`,
        );
        setOpenCreate(false);
        setEditingId(null);
        fetchPositions();
    };

    const handleDelete = async (positionId) => {
        const [res, err] = await PositionService.deletePosition(positionId);
        if (err) return toast.error(err.code);
        toast.success("Deleted position successfully");
        fetchPositions();
    };

    return (
        <div className="position-tab">
            <h3>Quản lý vị trí</h3>
            <Button
                variant="contained"
                onClick={() => setOpenCreate(true)}
                sx={{ mb: 2 }}
            >
                Thêm vị trí
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {positions.map((pos) => (
                        <TableRow key={pos.id}>
                            <TableCell>{pos.name}</TableCell>
                            <TableCell>{pos.description || "N/A"}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => {
                                        setEditingId(pos.id);
                                        handleChange("name", pos.name);
                                        handleChange(
                                            "description",
                                            pos.description,
                                        );
                                        setOpenCreate(true);
                                    }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    color="error"
                                    onClick={() => handleDelete(pos.id)}
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
                    {editingId ? "Sửa vị trí" : "Thêm vị trí"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên vị trí"
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

export default PositionTab;
