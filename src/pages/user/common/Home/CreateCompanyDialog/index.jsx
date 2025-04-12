import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    TextField,
} from "@mui/material";
import useFormValidation from "@hooks/useForm";
import CompanyService from "@services/compay-module-service/company.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import {createCompanySchema} from "@validations/companySchema.js";
import toast from "@hooks/toast";
import {MODULE_OPTIONS} from "@configs/const.config.jsx";

const CreateCompanyDialog = ({open, onClose, onSuccess}) => {
    const getMessage = useMessageByApiCode();
    const {
        data, errors, isSubmitting, handleChange, validate, startSubmitting, finishSubmitting,
    } = useFormValidation(createCompanySchema, {
        name: "", domain: "", moduleCodes: [MODULE_OPTIONS[0].code, MODULE_OPTIONS[1].code],
    });

    const handleModuleChange = (moduleCode) => {
        const currentModules = data.moduleCodes || [];
        const newModules = currentModules.includes(moduleCode) ? currentModules.filter((code) => code !== moduleCode) : [...currentModules, moduleCode];
        handleChange("moduleCodes", newModules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        startSubmitting();
        try {
            const [result, error] = await CompanyService.createCompany(data);
            if (error) {
                toast.error(getMessage(error.code));
                return;
            }
            toast.success(getMessage(result.code));
            onSuccess();
            onClose();
        } finally {
            finishSubmitting();
        }
    };

    return (<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Tạo công ty mới</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Tên công ty"
                        name="name"
                        value={data.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Tên miền"
                        name="domain"
                        value={data.domain}
                        onChange={(e) => handleChange("domain", e.target.value)}
                        error={!!errors.domain}
                        helperText={errors.domain}
                        margin="normal"
                    />
                    <FormControl
                        component="fieldset"
                        margin="normal"
                        error={!!errors.moduleCodes}
                    >
                        <FormLabel component="legend">Các MODULE</FormLabel>
                        <FormGroup>
                            {MODULE_OPTIONS.map((module) => (<FormControlLabel
                                    key={module.code}
                                    control={<Checkbox
                                        checked={data.moduleCodes?.includes(module.code,)}
                                        onChange={() => handleModuleChange(module.code)}
                                        disabled={[MODULE_OPTIONS[0].code, MODULE_OPTIONS[1].code,].includes(module.code)}
                                    />}
                                    label={module.label}
                                />))}
                        </FormGroup>
                        {errors.moduleCodes && (<Alert severity="error" sx={{mt: 1}}>
                                {errors.moduleCodes}
                            </Alert>)}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Tạo công ty"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>);
};

export default CreateCompanyDialog;
