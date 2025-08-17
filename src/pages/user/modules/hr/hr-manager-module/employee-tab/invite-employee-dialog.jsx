import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import FormDialog from '@components/dialog/form-dialog';
import { joiResolver } from '@hookform/resolvers/joi';
import { MANAGER_INVITE_EMPLOYEE_DEFAULT_VALUES } from '@configs/default-values/hr-default-values';
import toast from '@hooks/toast';
import { inviteEmployeeSchema } from '@validations/hr-schema';
import EmployeeService from '@services/hr-module-service/employee.service';

function InviteEmployeeDialog() {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(inviteEmployeeSchema),
        defaultValues: MANAGER_INVITE_EMPLOYEE_DEFAULT_VALUES,
    });

    const {
        register,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [result, error] = await EmployeeService.inviteToCompany(data);
            if (error) throw new Error(error.code);
            return result;
        },
        onSuccess: (result) => {
            dialog.close();
            toast.success(result.code);
        },
    });

    return (
        <FormDialog
            title={t("working.hr.employee.invite-employee-title")}
            submitButtonText="working.hr.employee.invite-employee-submit"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="contained"
                color="primary"
                onClick={dialog.open}
                startIcon={<Add />}
            >
                {t("working.hr.employee.invite-employee-button")}
            </Button>}
        >
            <TextField
                fullWidth
                label={t("working.hr.employee.user-id")}
                name="userId"
                error={!!errors.userId}
                helperText={errors.userId?.message}
                {...register("userId")}
            />
        </ FormDialog>
    );
}

export default InviteEmployeeDialog;