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

function UpdateDepartmentDialog({ department, refetch }) {
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
            <TextField
                fullWidth
                label={t("model.hr.department.name")}
                name="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                required
                {...register("name")}
            />
            <TextField
                fullWidth
                label={t("model.hr.department.description")}
                name="description"
                error={!!errors.description}
                helperText={errors?.description?.message}
                {...register("description")}
            />
        </ FormDialog>
    );
}

export default UpdateDepartmentDialog;