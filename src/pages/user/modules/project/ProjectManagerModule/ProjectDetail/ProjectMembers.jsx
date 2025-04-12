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
} from "@mui/material";
import { Add, Delete, People } from "@mui/icons-material";
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
        const [res, err] = await ProjectService.addMember(projectId, data);
        finishSubmitting();
        console.log(err);
        if (err) return toast.error(err.code);
        toast.success("Member added successfully");
        setOpenMember(false);
        fetchMembers();
    };

    const handleRemoveMember = async (employeeId) => {
        const [res, err] = await ProjectService.removeMember(
            projectId,
            employeeId,
        );
        if (err) return toast.error(err.code);
        toast.success("Member removed successfully");
        fetchMembers();
    };

    return (
        <div>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenMember(true)}
                sx={{ mb: 2 }}
            >
                Add Member
            </Button>
            <Grid container spacing={2}>
                {members.map((member) => (
                    <Grid item xs={12} sm={6} md={4} key={member.employeeId}>
                        <Card className="member-card">
                            <CardContent>
                                <Typography variant="h6">
                                    <People
                                        sx={{ verticalAlign: "middle", mr: 1 }}
                                    />
                                    {employeeInfo(member.employeeId).name}
                                </Typography>
                                <Typography>Vai trò: {member.role}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    startIcon={<Delete />}
                                    onClick={() =>
                                        handleRemoveMember(member.employeeId)
                                    }
                                >
                                    Remove
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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
