import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextField, Button, Stack, Box, IconButton, Avatar, useTheme } from "@mui/material";
import { Cancel, Edit, Save } from "@mui/icons-material";
import ErrorMessage from "@components/form/error-message";
import UploadsService from "@services/util-service/uploads.service";
import { joiResolver } from "@hookform/resolvers/joi";
import toast from "@hooks/toast";
import ImageField from "@components/form/image-field";
import EmployeeService from "@services/hr-module-service/employee.service";
import { employeeUpdateMyInfoSchema } from "@validations/hr-schema";
import _ from "lodash";
import DateField2 from "@components/form/date-field-2";

function EmployeeTab() {
    const { t } = useTranslation();
    const theme = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, },
        reset,
        control
    } = useForm({ resolver: joiResolver(employeeUpdateMyInfoSchema) });

    const { refetch, data } = useQuery({
        queryKey: ["hr-employee-me"],
        queryFn: async () => {
            const [res, err] = await EmployeeService.getMyEmployeeInfo();
            if (err) throw new Error(err.code);
            reset(_.pick(res.data, ["name", "avatar", "dob", "email", "phone"]));
            return res.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const mutation = useMutation({
        mutationFn: async (formData) => {
            if (formData.avatar instanceof File) {
                const [res, err] = await UploadsService.image(formData.avatar);
                if (err) throw new Error(err.code);
                formData.avatar = res.data;
            }

            const [res, err] = await EmployeeService.updateMyEmployeeInfo(data.id, formData);
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

                <Stack spacing={14}>
                    <Box
                        sx={{
                            position: "relative",
                            height: 200,
                            mb: 10,
                        }}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 4,
                                overflow: "hidden",
                                position: "relative",
                                backgroundColor: theme.palette.background.default,
                            }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                }}
                            />
                        </Box>

                        <ImageField
                            name="avatar"
                            control={control}
                            render={(avatarValue, avatarOpen) => (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: -80,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: 160,
                                        height: 160,
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <Avatar
                                        src={
                                            avatarValue instanceof File
                                                ? URL.createObjectURL(avatarValue)
                                                : avatarValue
                                        }
                                        sx={{
                                            width: 160,
                                            height: 160,
                                            fontSize: 64,
                                        }}
                                    />
                                    <IconButton
                                        onClick={avatarOpen}
                                        sx={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                        }}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    </Box>

                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label={t('model.hr.employee.name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                            {...register("name")}
                        />
                        <DateField2
                            name="dob"
                            control={control}
                            label={t("model.hr.employee.dob")}
                            error={!!errors.dob}
                            helperText={errors?.dob?.message}
                        />
                        <TextField
                            fullWidth
                            label={t('model.hr.employee.email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="email"
                            {...register("email")}
                        />
                        <TextField
                            fullWidth
                            label={t('model.hr.employee.phone')}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="phone"
                            {...register("phone")}
                        />
                        <TextField
                            fullWidth
                            label={t('model.hr.employee.department')}
                            slotProps={{ inputLabel: { shrink: true } }}
                            defaultValue={data?.department?.name}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label={t('model.hr.employee.position')}
                            slotProps={{ inputLabel: { shrink: true } }}
                            defaultValue={data?.position?.name}
                            disabled
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

export default EmployeeTab;