import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Box,
    Card,
    Stack,
    Typography,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Alert,
    Chip,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import toast from "@hooks/toast";
import CompanyService from "@services/compay-module-service/company.service";
import ModuleService from "@services/compay-module-service/module.service";
import { MODULE_OPTIONS_MAP } from "@configs/const.config";

const REQUIRED_MODULES = ["COMPANY", "HR"];

function CompanyModulesTab() {
    const companyId = useSelector(state => state.company.id);
    const [modules, setModules] = useState([]);
    const [companyModules, setCompanyModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const fetchModules = async () => {
        const [res, err] = await ModuleService.getAll();
        if (err) {
            toast.error(err.code);
            return;
        }
        setModules(res.data);
    };

    const fetchCompanyModules = async () => {
        const [res, err] = await CompanyService.getById(companyId);
        if (err) {
            toast.error(err.code);
            return;
        }
        setCompanyModules(res.data.modules);
        setSelectedModules(res.data.modules.map(module => module.code));
    };

    useEffect(() => {
        fetchModules();
        fetchCompanyModules();
    }, []);

    const handleModuleToggle = (moduleCode) => {
        if (REQUIRED_MODULES.includes(moduleCode)) {
            return;
        }

        setSelectedModules(prev => {
            if (prev.includes(moduleCode)) {
                return prev.filter(code => code !== moduleCode);
            }
            return [...prev, moduleCode];
        });
    };

    const handleSave = async () => {
        // Ensure required modules are included
        const modulesToUpdate = [...new Set([...REQUIRED_MODULES, ...selectedModules])];

        setIsSubmitting(true);
        const [res, err] = await CompanyService.updateModules(companyId, {
            moduleCodes: modulesToUpdate
        });
        setIsSubmitting(false);

        if (err) {
            toast.error(err.code);
            return;
        }

        toast.success(res.code);
        fetchCompanyModules();
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h6">
                    Quản lý module công ty
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </Stack>

            <Alert severity="info">
                Module Company và HR là bắt buộc và không thể tắt
            </Alert>

            <FormGroup>
                <Stack spacing={2}>
                    {modules.map((module) => (
                        <Card
                            key={module.id}
                            variant="outlined"
                            sx={{
                                p: 2,
                                opacity: REQUIRED_MODULES.includes(module.code) ? 0.7 : 1
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedModules.includes(module.code)}
                                        onChange={() => handleModuleToggle(module.code)}
                                        disabled={REQUIRED_MODULES.includes(module.code)}
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="subtitle1">
                                                    {MODULE_OPTIONS_MAP[module.code].label}
                                                </Typography>
                                                {REQUIRED_MODULES.includes(module.code) && (
                                                    <Chip
                                                        label="Bắt buộc"
                                                        size="small"
                                                        color="primary"
                                                    />
                                                )}
                                            </Stack>
                                            {module.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {module.description}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                }
                            />
                        </Card>
                    ))}
                </Stack>
            </FormGroup>
        </Stack>
    );
}

export default CompanyModulesTab;