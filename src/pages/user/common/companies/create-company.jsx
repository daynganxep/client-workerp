import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    useTheme,
    Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import CompanyService from '@services/compay-module-service/company.service';
import FormDialog from '@components/dialog/form-dialog';
import { createCompanySchema } from '@validations/company-schema';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import { MODULE_OPTIONS } from '@configs/const.config';
import { COMMON_CREATE_COMPANY_DEFAULT_VALUES } from '@configs/form-default-values.config';

function CreateCompanyDialog() {
    const { t } = useTranslation();
    const dialog = useDialog();
    const theme = useTheme();

    const form = useForm({
        resolver: joiResolver(createCompanySchema),
        defaultValues: COMMON_CREATE_COMPANY_DEFAULT_VALUES,
    });

    const {
        register,
        formState: { errors },
    } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [result, error] = await CompanyService.createCompany(data);
            if (error) throw new Error(error.code);
            return result;
        },
        onSuccess: (result) => {
            toast.success(result.code);
            dialog.close();
        },
    });

    const handleModuleChange = (moduleCode) => {
        const currentModules = form.getValues("moduleCodes") || [];
        let newModules;
        if (currentModules.includes(moduleCode)) {
            newModules = currentModules.filter((code) => code !== moduleCode);
        } else {
            newModules = [...currentModules, moduleCode];
        }
        form.setValue("moduleCodes", newModules, { shouldValidate: true });
    };

    return (
        <FormDialog
            title={t("common.company.create-company")}
            submitButtonText='common.company.create'
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="contained"
                color="primary"
                onClick={dialog.open}
                startIcon={<Add />}
            >
                {t("common.company.create-company")}
            </Button>}
        >
            <TextField
                fullWidth
                label={t("common.company.company-name")}
                name="name"
                error={!!errors.name}
                helperText={errors.name}
                {...register("name")}
            />
            <TextField
                fullWidth
                label={t("common.company.domain")}
                name="domain"
                error={!!errors.domain}
                helperText={errors.domain}
                {...register("domain")}
            />
            <Box
                sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius,
                    p: 3
                }}
            >
                <FormLabel
                    component="legend"
                    sx={{ color: theme.palette.text.primary, mb: 2, fontWeight: 600, fontSize: 18 }}
                >
                    {t("common.company.modules")}
                </FormLabel>
                <FormGroup
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: "1fr 1fr 1fr" },
                        gap: 2,
                    }}
                >
                    {MODULE_OPTIONS.map((module) => (
                        <FormControlLabel
                            key={module.code}
                            control={
                                <Checkbox
                                    onChange={() => handleModuleChange(module.code)}
                                    disabled={COMMON_CREATE_COMPANY_DEFAULT_VALUES.moduleCodes.includes(module.code)}
                                    checked={form.getValues("moduleCodes")?.includes(module.code)}
                                    sx={{
                                        '&:disabled': {
                                            bgcolor: theme.palette.action.disabled,
                                        },
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover,
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography color='textPrimary' variant='body1'>
                                    {module.label}
                                </Typography>
                            }
                        />
                    ))}
                </FormGroup>
            </Box>
        </ FormDialog>
    );
}

export default CreateCompanyDialog;