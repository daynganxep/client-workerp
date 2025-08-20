import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import { Comment } from '@mui/icons-material';
import TaskService from '@services/project-module-service/task.service';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { commentSchema } from '@validations/project-schema';


function AddCommentDialog({ taskId, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(commentSchema),
        defaultValues: { content: "" }
    });

    const { formState: { errors }, register } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await TaskService.addComment(taskId, data);
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
            title={t("common.comment")}
            submitButtonText="common.comment"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={
                <Button
                    variant="contained"
                    color="primary"
                    onClick={dialog.open}
                    startIcon={<Comment />}
                >
                    {t("common.comment")}
                </Button>
            }
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

export default AddCommentDialog;