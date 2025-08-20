import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { TextField, Button, Stack, InputAdornment } from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import SelectField from '@components/form/select-field';
import DateField2 from '@components/form/date-field-2';
import { Edit } from '@mui/icons-material';
import TaskService from '@services/project-module-service/task.service';
import { joiResolver } from '@hookform/resolvers/joi';
import { taskUpdateSchema } from '@validations/project-schema';
import toast from '@hooks/toast';
import _ from "lodash";
import { TASK_STATUSES_MAP } from '@configs/const.config';

function AssigneeUpdateTaskDialog({ task, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();
    const taskId = task.id;

    const form = useForm({
        resolver: joiResolver(taskUpdateSchema),
        defaultValues: _.pick(task, ["status", "dueDate", "estimatedTime"])
    });

    const {
        formState: { errors },
        control,
        register
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await TaskService.assignUpdateTask(taskId, data);
            console.log({ res })
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
            title={t("working.project.detail.task.update-task")}
            submitButtonText="common.update"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="contained"
                color="primary"
                onClick={dialog.open}
                startIcon={<Edit />}
            >
                {t("working.project.detail.task.update-task")}
            </Button>}
        >
            <Stack direction={"row"} gap={3}>
                <SelectField
                    name="status"
                    control={control}
                    label={t("model.project.task.status")}
                    options={Object.keys(TASK_STATUSES_MAP).map((type) => {
                        const { code, label } = TASK_STATUSES_MAP[type];
                        return {
                            value: code,
                            label: label,
                        }
                    })}
                />
                <DateField2
                    name="dueDate"
                    control={control}
                    label={t("model.project.task.due-date")}
                    error={!!errors.dueDate}
                    helperText={errors?.dueDate?.message}
                />
                <TextField
                    fullWidth
                    label={t("model.project.task.estimated-time")}
                    name="estimatedTime"
                    type="number"
                    error={!!errors.estimatedTime}
                    helperText={errors?.estimatedTime?.message}
                    required
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">giờ</InputAdornment>
                            ),
                        }
                    }}
                    inputProps={{ step: "any" }}
                    {...register("estimatedTime")}
                />

            </Stack>
        </ FormDialog >
    );
}

export default AssigneeUpdateTaskDialog;