import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import DepartmentService from '@services/hr-module-service/department.service';
import { departmentSchema } from '@validations/hr-schema';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';

function EditTaskDialog({ department, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(departmentSchema),
        defaultValues: {
            name: department.name,
            description: department.description,
        }
    });

    const {
        register,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await DepartmentService.updateDepartment(
                department.id,
                data,
            );
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            refetch();
            dialog.close();
            toast.success(res.code);
        },
    });

    return (
        <FormDialog
            title={t("working.hr.department.update-department-title")}
            submitButtonText="common.update"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="text"
                color="primary"
                onClick={dialog.open}
            >
                {t("common.edit")}
            </Button>}
        >
            {/* <TextField
                fullWidth
                label="Tiêu đề"
                value={data.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                sx={{ mt: 1, mb: 2 }}
            /> */}
            {/* <ReactQuill
                palaceholder="Mô tả công việc..."
                value={data.description}
                onChange={(value) => handleChange("description", value)}
                theme="snow"
                modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                    ],
                }}
                style={{ backgroundColor: 'transparent' }}
            /> */}
            {/* <FormControl fullWidth
                sx={{ mt: 2 }}
                error={!!errors.assignees}
                helperText={errors.assignees}
            >
                <InputLabel id="demo-simple-select-label">Người thực hiện</InputLabel>
                <Select
                    fullWidth
                    multiple
                    value={data.assignees}
                    onChange={(e) =>
                        handleChange("assignees", e.target.value)
                    }
                    renderValue={(selected) =>
                        selected
                            .map((id) => employeeInfo(id)?.name || id)
                            .join(", ")
                    }
                    label="Người thực hiện"
                >
                    {members.map((member) => (
                        <MenuItem
                            key={member.employeeId}
                            value={member.employeeId}
                        >
                            {employeeInfo(member.employeeId)?.name ||
                                member.employeeId}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            {/* <FormControl fullWidth
                sx={{ mt: 2 }}
            >
                <InputLabel id="demo-simple-select-label">Độ ưu tiên</InputLabel>
                <Select
                    fullWidth
                    value={data.priority}
                    onChange={(e) =>
                        handleChange("priority", e.target.value)
                    }
                    label="Độ ưu tiên"
                >

                    {Object.entries(TASK_PRIORITY_MAP).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                            {label}
                        </MenuItem>
                    ))}

                </Select>
            </FormControl> */}
            {/* <DateField
                fullWidth
                label="Hạn"
                type="date"
                value={data.dueDate}
                onChange={(e) =>
                    handleChange("dueDate", e.target.value)
                }
                sx={{ mt: 2 }}
            /> */}
        </ FormDialog>
    );
}

export default EditTaskDialog;