import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import DateField2 from '@components/form/date-field-2';
import EmployeeService from '@services/hr-module-service/employee.service';
import SelectField from '@components/form/select-field';
import { employeeUpdateSchema } from '@validations/hr-schema';
import { joiResolver } from '@hookform/resolvers/joi';
import { formatDateForBackend } from '@tools/date.tool';
import toast from '@hooks/toast';

function UpdateEmployeeDialog({ employee, departments, positions, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(employeeUpdateSchema),
        defaultValues: {
            name: employee.name,
            dob: employee.dob,
            departmentId: employee?.department?.id,
            positionId: employee?.position?.id,
        }
    });

    const {
        register,
        control,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            data.dob = formatDateForBackend(data.dob);
            const [res, err] = await EmployeeService.updateEmployee(
                employee.id,
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
            title={t("working.hr.employee.update-employee-title")}
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
            <TextField
                fullWidth
                label={t("model.hr.employee.name")}
                name="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                required
                {...register("name")}
            />
            <DateField2
                name="dob"
                control={control}
                label={t("model.hr.employee.dob")}
                error={!!errors.dob}
                helperText={errors?.dob?.message}
            />

            <SelectField
                name="departmentId"
                control={control}
                label={t("model.hr.employee.department")}
                options={departments.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                }))}
            />

            <SelectField
                name="positionId"
                control={control}
                label={t("model.hr.employee.position")}
                options={positions.map((pos) => ({
                    value: pos.id,
                    label: pos.name,
                }))}
            />
        </ FormDialog>
    );
}

export default UpdateEmployeeDialog;