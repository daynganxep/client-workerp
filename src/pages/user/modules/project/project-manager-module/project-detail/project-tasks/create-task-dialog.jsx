import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useEmployee from '@hooks/use-employee';
import {
    TextField,
    Button,
    Stack,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import SelectField from '@components/form/select-field';
import DateField2 from '@components/form/date-field-2';
import { Add } from '@mui/icons-material';
import ProjectService from '@services/project-module-service/project.service';
import TaskService from '@services/project-module-service/task.service';
import { PROJECT_MEMBER_ROLE, TASK_PRIORITY_MAP } from '@configs/const.config';
import { MANAGER_CREATE_TASK_DEFAULT_VALUES } from '@configs/default-values/project-default-values';
import { joiResolver } from '@hookform/resolvers/joi';
import { taskSchema } from '@validations/project-schema';
import toast from '@hooks/toast';
import QuillField from '@components/form/quill-field';

function CreateTaskDialog({ projectId, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();
    const getEmployee = useEmployee();

    const form = useForm({
        resolver: joiResolver(taskSchema),
        defaultValues: {
            ...MANAGER_CREATE_TASK_DEFAULT_VALUES,
            projectId,
        }
    });

    const {
        register,
        formState: { errors },
        control
    } = form;

    const { data: members = [] } = useQuery({
        queryKey: ["project-members", projectId],
        queryFn: async () => {
            const [res, err] = await ProjectService.getProjectById(projectId);
            if (err) throw new Error(err.code);
            return res?.data?.members || [];
        },
        onError: (code) => toast.error(code),
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await TaskService.createTask(projectId, data);
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
            title={t("working.project.detail.task.create-task")}
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
                {t("working.project.detail.task.create-task")}
            </Button>}
        >
            <TextField
                fullWidth
                label={t("model.project.task.title")}
                name="title"
                error={!!errors.title}
                helperText={errors?.title?.message}
                required
                {...register("title")}
            />
            <QuillField
                name="description"
                control={control}
                label={t("model.project.task.description")}
                rules={{ required: "Description is required" }}
                sx={{ marginBottom: "16px" }}
            />
            <SelectField
                name="assignees"
                control={control}
                label={t("model.project.task.assignees")}
                multiple={true}
                options={members.map((member) => ({
                    value: member.employeeId,
                    label: (`${PROJECT_MEMBER_ROLE[member?.role].label} - `) + (getEmployee(member?.employeeId)?.name || member?.employeeId)
                }))}
                renderValue={(selected) =>
                    Array.isArray(selected)
                        ? selected
                            .map((employeeId) => getEmployee(employeeId)?.name || employeeId)
                            .join(", ")
                        : getEmployee(selected)?.name || selected || ""
                }
            />
            <Stack gap={3} direction={"row"}>
                <SelectField
                    name="priority"
                    control={control}
                    label={t("model.project.task.priority")}
                    options={Object.entries(TASK_PRIORITY_MAP).map(([key, { label }]) => ({
                        value: key,
                        label: label
                    }))}
                />
                <DateField2
                    name="dueDate"
                    control={control}
                    label={t("model.project.task.due-date")}
                    error={!!errors.dueDate}
                    helperText={errors?.dueDate?.message}
                />
            </Stack>
        </ FormDialog >
    );
}

export default CreateTaskDialog;