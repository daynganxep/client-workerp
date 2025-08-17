import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import { positionSchema } from '@validations/hr-schema';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { Add } from '@mui/icons-material';
import PositionService from '@services/hr-module-service/position.service';

function CreatePositionDialog({ refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(positionSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const {
        register,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await PositionService.createPosition(data);
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
            title="working.hr.position.create-position"
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
                {t("working.hr.position.create-position")}
            </Button>}
        >
            <TextField
                fullWidth
                label={t("model.hr.position.name")}
                name="name"
                error={!!errors.name}
                helperText={errors?.name?.message}
                required
                {...register("name")}
            />
            <TextField
                fullWidth
                label={t("model.hr.position.description")}
                name="description"
                error={!!errors.description}
                helperText={errors?.description?.message}
                {...register("description")}
            />
        </ FormDialog>
    );
}

export default CreatePositionDialog;