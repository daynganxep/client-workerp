import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Stack,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { Add } from '@mui/icons-material';
import ProjectService from '@services/project-module-service/project.service';
import { projectSchema } from '@validations/project-schema';
import { useSelector } from 'react-redux';
import { MANAGER_CREATE_PROJECT_DEFAULT_VALUES } from '@configs/default-values/project-default-values';
import DateField2 from '@components/form/date-field-2';

function CreateProjectDialog({ refetch }) {
    const { id: companyId } = useSelector((state) => state.company);
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(projectSchema),
        defaultValues: { ...MANAGER_CREATE_PROJECT_DEFAULT_VALUES, companyId }
    });

    const {
        register,
        control,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await ProjectService.createProject(data);
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
            title="working.project.dashboard.create-project"
            submitButtonText="common.create"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="contained"
                color="primary"
                onClick={dialog.open}
                startIcon={<Add />}
            >
                {t('working.project.dashboard.create-project')}
            </Button>}
        >
            <TextField
                fullWidth
                label={t("model.project.project.name")}
                name="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                required
                {...register("name")}
            />
            <TextField
                fullWidth
                label={t("model.project.project.description")}
                name="description"
                error={!!errors.description}
                helperText={errors?.description?.message}
                {...register("description")}
            />
            <Stack direction="row" gap={3}>
                <DateField2
                    name="startDate"
                    control={control}
                    label={t("model.project.project.start-date")}
                    error={!!errors.startDate}
                    helperText={errors?.startDate?.message}
                />
                <DateField2
                    name="endDate"
                    control={control}
                    label={t("model.project.project.start-date")}
                    error={!!errors.endDate}
                    helperText={errors?.endDate?.message}
                />
            </Stack>
        </ FormDialog>
    );
}

export default CreateProjectDialog;