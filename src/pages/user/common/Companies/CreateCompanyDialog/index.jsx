import {
    Dialog,
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Alert,
    useTheme,
} from '@mui/material';
import useFormValidation from '@hooks/useForm';
import useMessageByApiCode from '@hooks/useMessageByApiCode';
import toast from '@hooks/toast';
import CompanyService from '@services/compay-module-service/company.service';
import { createCompanySchema } from '@validations/companySchema';
import { MODULE_OPTIONS } from '@configs/const.config';

function CreateCompanyDialog({ open, onClose, onSuccess }) {
    const theme = useTheme();
    const getMessage = useMessageByApiCode();
    const {
        data,
        errors,
        isSubmitting,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(createCompanySchema, {
        name: '',
        domain: '',
        moduleCodes: [MODULE_OPTIONS[0].code, MODULE_OPTIONS[1].code],
    });

    // Xử lý chọn module
    const handleModuleChange = (moduleCode) => {
        const currentModules = data.moduleCodes || [];
        const newModules = currentModules.includes(moduleCode)
            ? currentModules.filter((code) => code !== moduleCode)
            : [...currentModules, moduleCode];
        handleChange('moduleCodes', newModules);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        startSubmitting();
        try {
            const [result, error] = await CompanyService.createCompany(data);
            if (error) {
                toast.error(error.code);
                return;
            }
            toast.success(result.code);
            onSuccess();
            onClose();
        } finally {
            finishSubmitting();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                },
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.primary }}
                >
                    Tạo công ty mới
                </Typography>

                {/* Content */}
                <TextField
                    fullWidth
                    label="Tên công ty"
                    name="name"
                    value={data.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: theme.shape.borderRadius,
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Tên miền"
                    name="domain"
                    value={data.domain}
                    onChange={(e) => handleChange('domain', e.target.value)}
                    error={!!errors.domain}
                    helperText={errors.domain}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: theme.shape.borderRadius,
                        },
                    }}
                />
                <Box
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 2,
                        boxShadow: theme.shadows[1],
                    }}
                >
                    <FormLabel
                        component="legend"
                        sx={{ color: theme.palette.text.primary, mb: 1 }}
                    >
                        Các module
                    </FormLabel>
                    <FormGroup
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 1,
                        }}
                    >
                        {MODULE_OPTIONS.map((module) => (
                            <FormControlLabel
                                key={module.code}
                                control={
                                    <Checkbox
                                        checked={data.moduleCodes?.includes(module.code)}
                                        onChange={() => handleModuleChange(module.code)}
                                        disabled={[MODULE_OPTIONS[0].code, MODULE_OPTIONS[1].code].includes(
                                            module.code
                                        )}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&.Mui-checked': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: theme.palette.text.primary }}>
                                        {module.label}
                                    </Typography>
                                }
                            />
                        ))}
                    </FormGroup>
                    {errors.moduleCodes && (
                        <Alert
                            severity="error"
                            sx={{
                                mt: 1,
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: theme.palette.error.main,
                                color: theme.palette.error.contrastText,
                            }}
                        >
                            {errors.moduleCodes}
                        </Alert>
                    )}
                </Box>

                {/* Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                        mt: 2,
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Tạo công ty'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

export default CreateCompanyDialog;