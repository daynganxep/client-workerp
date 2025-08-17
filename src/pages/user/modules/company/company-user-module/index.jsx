import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextField, Stack, Box, Avatar, useTheme } from "@mui/material";
import CompanyService from "@services/compay-module-service/company.service";
import { updateCompanyInforSchema } from "@validations/company-schema";
import { companyActions } from "@redux/slices/company.slice";
import { joiResolver } from "@hookform/resolvers/joi";
import toast from "@hooks/toast";
import ImageField from "@components/form/image-field";
import UploadsService from "@services/util-service/uploads.service";
import _ from "lodash";

function CompanyInfoTab() {
    const { t } = useTranslation();
    const companyId = useSelector((state) => state.company.id);
    const dispatch = useDispatch();
    const theme = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors, },
        reset,
        control
    } = useForm({ resolver: joiResolver(updateCompanyInforSchema) });

    const { refetch } = useQuery({
        queryKey: ["company-info", companyId],
        queryFn: async () => {
            const [res, err] = await CompanyService.getById(companyId);
            if (err) throw new Error(err.code);
            dispatch(companyActions.setCompanyInfo(res.data));
            reset(_.pick(res.data, ["name", "domain", "avatar", "coverImage"]));
            return res.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
        enabled: !!companyId,
    });

    const mutation = useMutation({
        mutationFn: async (formData) => {
            if (formData.avatar instanceof File) {
                const [res, err] = await UploadsService.image(formData.avatar);
                if (err) throw new Error(err.code);
                formData.avatar = res.data;
            }
            if (formData.coverImage instanceof File) {
                const [res, err] = await UploadsService.image(formData.coverImage);
                if (err) throw new Error(err.code);
                formData.coverImage = res.data;
            }

            const [res, err] = await CompanyService.updateCompanyInfo(formData);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            dispatch(companyActions.setCompanyInfo(res.data));
            toast.success(res.code);
            refetch();
        },
    });


    return (
        <form form onSubmit={handleSubmit(mutation.mutate)} >
            <Stack spacing={14}>
                <ImageField
                    name="coverImage"
                    control={control}
                    render={(value) => (
                        <Box
                            sx={{
                                position: "relative",
                                height: 320,
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
                                    backgroundColor: !value ? theme.palette.background.default : undefined,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={value instanceof File ? URL.createObjectURL(value) : value}
                                    sx={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: 4,
                                        opacity: !value ? 0 : 1,
                                        transition: "opacity 0.2s",
                                    }}
                                />
                            </Box>

                            <ImageField
                                name="avatar"
                                control={control}
                                render={(avatarValue) => (
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
                                    </Box>
                                )}
                            />
                        </Box>
                    )}
                />

                <Stack spacing={3} mt={3}>
                    <TextField
                        fullWidth
                        label={t('working.company.name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                        disabled
                        {...register("name")}
                    />
                    <TextField
                        fullWidth
                        label={t('working.company.domain')}
                        error={!!errors.domain}
                        helperText={errors.domain?.message}
                        slotProps={{ inputLabel: { shrink: true } }}
                        disabled
                        {...register("domain")}
                    />
                </Stack>
            </Stack>
        </form >
    );
}

export default CompanyInfoTab;