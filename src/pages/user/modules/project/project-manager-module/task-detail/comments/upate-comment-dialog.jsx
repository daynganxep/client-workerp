import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import TaskService from '@services/project-module-service/task.service';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { commentSchema } from '@validations/project-schema';


function UpdateCommentDialog({ taskId, comment, refetch, handleMenuClose }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(commentSchema),
        defaultValues: { content: comment.content }
    });

    const { formState: { errors }, register } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await TaskService.updateComment(taskId, comment.id, data);
            if (err) throw new Error(err.code);

            return res;
        },
        onSuccess: (res) => {
            refetch();
            dialog.close();
            toast.success(res.code);
            handleMenuClose();
        },
    });

    return (
        <FormDialog
            title={t("common.comment")}
            submitButtonText="common.edit"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<MenuItem onClick={dialog.open}>{t("common.edit")}</MenuItem>}
        >
            <TextField
                fullWidth
                name="content"
                label={t("common.content")}
                error={!!errors.content}
                helperText={errors?.content?.message}
                required
                multiline
                minRows={3}
                maxRows={6}
                {...register("content")}
            />
        </ FormDialog >
    );
}

export default UpdateCommentDialog;