import { useState, useEffect } from "react";
import ProjectService from "@services/project-module-service/project.service";
import {
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Box,
    Chip,
} from "@mui/material";
import { Add, Delete, People, Edit } from "@mui/icons-material";
import useFormValidation from "@hooks/useForm";
import { projectMemberSchema } from "@validations/projectSchema";
import toast from "@hooks/toast";
import { useSelector } from "react-redux";
import useEmployee from "@hooks/useEmployee";

function ProjectMembers({ projectId }) {
    const employees = useSelector((state) => state.company.employees) || [];
    const [members, setMembers] = useState([]);
    const [openMember, setOpenMember] = useState(false);
    const employeeInfo = useEmployee();
    const [editMember, setEditMember] = useState(null);


    const {
        data,
        errors,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
        isSubmitting,
    } = useFormValidation(projectMemberSchema, {
        employeeId: "",
        role: "MEMBER",
    });



    useEffect(() => {
        fetchMembers();
    }, [projectId]);

    const fetchMembers = async () => {
        const [res, err] = await ProjectService.getProjectById(projectId);
        if (err) return toast.error(err.code);
        setMembers(res.data.members || []);
    };

    const handleAddMember = async () => {
        if (!validate()) return;
        startSubmitting();
        const [, err] = await ProjectService.addMember(projectId, data);
        finishSubmitting();
        console.log(err);
        if (err) return toast.error(err.code);
        toast.success("Member added successfully");
        setOpenMember(false);
        fetchMembers();
    };

    const handleRemoveMember = async (employeeId) => {
        const [, err] = await ProjectService.removeMember(
            projectId,
            employeeId,
        );
        if (err) return toast.error(err.code);
        toast.success("Member removed successfully");
        fetchMembers();
    };

    const handleEditRole = async () => {
        if (!validate()) return;
        startSubmitting();
        const [res, err] = await ProjectService.updateMemberRole(
            projectId,
            editMember.employeeId,
            data.role
        );
        finishSubmitting();
        console.log({ err })
        if (err) return toast.error(err.code);
        toast.success(res.code);
        setEditMember(null);
        fetchMembers();
    };


    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                    Thành viên dự án ({members.length})
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenMember(true)}
                >
                    Thêm thành viên
                </Button>
            </Box>

            <Grid container spacing={3}>
                {members.map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.employeeId}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: (theme) => theme.shadows[4],
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <People sx={{ color: 'primary.main', fontSize: 32, mr: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                        {employeeInfo(member.employeeId).name}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={member.role}
                                    color={member.role === 'LEADER' ? 'primary' : 'default'}
                                    size="small"
                                />
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    startIcon={<Edit />}
                                    size="small"
                                    onClick={() => {
                                        setEditMember(member);
                                        handleChange("employeeId", member.employeeId);
                                        handleChange("role", member.role);
                                    }}
                                >
                                    Sửa vai trò
                                </Button>
                                <Button
                                    startIcon={<Delete />}
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveMember(member.employeeId)}
                                >
                                    Xóa
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Edit Role Dialog */}
            <Dialog
                open={!!editMember}
                onClose={() => setEditMember(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Edit sx={{ mr: 1 }} />
                        Sửa vai trò thành viên
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {editMember?.employeeId && employeeInfo(editMember.employeeId).name}
                    </Typography>
                    <Select
                        fullWidth
                        value={data.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        error={!!errors.role}
                    >
                        <MenuItem value="LEADER">Leader</MenuItem>
                        <MenuItem value="MEMBER">Member</MenuItem>
                    </Select>
                    {errors.role && (
                        <Typography color="error" variant="caption">
                            {errors.role}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setEditMember(null)}
                        variant="outlined"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleEditRole}
                        disabled={isSubmitting}
                        variant="contained"
                    >
                        {isSubmitting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} color="inherit" />
                                <span>Đang cập nhật...</span>
                            </Box>
                        ) : (
                            'Cập nhật'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Member Dialog */}
            <Dialog open={openMember} onClose={() => setOpenMember(false)}>
                <DialogTitle>Thêm thành viên</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={data.employeeId}
                        onChange={(e) =>
                            handleChange("employeeId", e.target.value)
                        }
                        displayEmpty
                        sx={{ mt: 2 }}
                        error={!!errors.employeeId}
                    >
                        <MenuItem value="" disabled>
                            Chọn nhân viên
                        </MenuItem>
                        {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.name || employee.id}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.employeeId && (
                        <Typography color="error" variant="caption">
                            {errors.employeeId}
                        </Typography>
                    )}
                    <Select
                        fullWidth
                        value={data.role}
                        onChange={(e) => handleChange("role", e.target.value)}
                        sx={{ mt: 2 }}
                        error={!!errors.role}
                    >
                        <MenuItem value="LEADER">Leader</MenuItem>
                        <MenuItem value="MEMBER">Member</MenuItem>
                    </Select>
                    {errors.role && (
                        <Typography color="error" variant="caption">
                            {errors.role}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMember(false)}>Hủy</Button>
                    <Button onClick={handleAddMember} disabled={isSubmitting}>
                        {isSubmitting ? "Đang thêm..." : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default ProjectMembers;
