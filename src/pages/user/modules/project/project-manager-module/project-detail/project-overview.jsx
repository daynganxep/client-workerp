import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextField, Button, Stack, } from "@mui/material";
import ErrorMessage from "@components/form/error-message";
import { joiResolver } from "@hookform/resolvers/joi";
import toast from "@hooks/toast";
import { Cancel, Save } from "@mui/icons-material";
import ProjectService from "@services/project-module-service/project.service";
import _ from "lodash";
import { projectSchema } from "@validations/project-schema";
import DateField2 from "@components/form/date-field-2";

function ProjectOverView({ projectId }) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        control,
    } = useForm({ resolver: joiResolver(projectSchema) });

    const { refetch } = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const [res, err] = await ProjectService.getProjectById(projectId);
            if (err) throw new Error(err.code);
            reset(_.pick(res.data, ["name", "description", "companyId", "startDate", "endDate", "status"]));
            return res.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
        enabled: !!projectId,
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await ProjectService.updateProject(projectId, data);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            refetch();
            toast.success(res.code);
        },
    });


    return (
        <form form onSubmit={handleSubmit(mutation.mutate)} >
            <Stack spacing={3}>
                <ErrorMessage mutation={mutation} />

                <Stack spacing={3} mt={3}>
                    <TextField
                        fullWidth
                        label={t('model.project.project.name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                        {...register("name")}
                    />
                    <TextField
                        fullWidth
                        label={t('model.project.project.description')}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        slotProps={{ inputLabel: { shrink: true } }}
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
                            label={t("model.project.project.end-date")}
                            error={!!errors.endDate}
                            helperText={errors?.endDate?.message}
                        />
                    </Stack>
                </Stack>

                <Stack spacing={3} mt={3} direction="row" justifyContent="flex-end">
                    <Button
                        onClick={refetch}
                        variant="outlined"
                        color="info"
                        startIcon={<Cancel />}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid}
                        loading={mutation.isPending}
                        startIcon={<Save />}
                    >
                        {t('common.update')}
                    </Button>
                </Stack>
            </Stack >
        </form >
    );
}

export default ProjectOverView;