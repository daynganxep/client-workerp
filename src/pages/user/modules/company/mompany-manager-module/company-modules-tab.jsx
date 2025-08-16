import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Cancel, Save } from "@mui/icons-material";
import toast from "@hooks/toast";
import CompanyService from "@services/compay-module-service/company.service";
import ModuleService from "@services/compay-module-service/module.service";
import { MODULE_OPTIONS_MAP, REQUIRED_MODULES } from "@configs/const.config";
import { useTranslation } from "react-i18next";



function useCompanyModules(companyId) {
    const [selectedModules, setSelectedModules] = useState([]);

    const { data: modules, isLoading: isLoadingModules } = useQuery({
        queryKey: ["modules"],
        queryFn: async () => {
            const [res, err] = await ModuleService.getAll();
            if (err) throw new Error(err.code);
            return res.data;
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    const { isLoading: isLoadingCompanyModules, refetch: refetchCompanyModules } = useQuery({
        queryKey: ["company-modules", companyId],
        queryFn: async () => {
            const [res, err] = await CompanyService.getById(companyId);
            if (err) throw new Error(err.code);
            setSelectedModules(res.data.modules.map((module) => module.code));
            return res.data.modules;
        },
        onError: (code) => {
            toast.error(code);
        },
    });

    const { mutate, isPending: isSubmitting } = useMutation({
        mutationFn: async (moduleCodes) => {
            const [res, err] = await CompanyService.updateModules(companyId, { moduleCodes });
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            toast.success(res.code);
            refetchCompanyModules();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        modules,
        selectedModules,
        setSelectedModules,
        isLoading: isLoadingModules || isLoadingCompanyModules,
        isSubmitting,
        save: mutate,
        refetchCompanyModules
    };
}

function CompanyModulesTab() {
    const { t } = useTranslation();
    const companyId = useSelector((state) => state.company.id);
    const { modules, selectedModules, setSelectedModules, isLoading, isSubmitting, save, refetchCompanyModules } =
        useCompanyModules(companyId);

    const handleModuleToggle = (moduleCode) => {
        if (REQUIRED_MODULES.includes(moduleCode)) {
            return;
        }
        setSelectedModules((prev) =>
            prev.includes(moduleCode)
                ? prev.filter((code) => code !== moduleCode)
                : [...prev, moduleCode]
        );
    };

    const handleSave = () => {
        const modulesToUpdate = [...new Set([...REQUIRED_MODULES, ...selectedModules])];
        save(modulesToUpdate);
    };

    return (
        <Stack spacing={3}>
            <Alert severity="info">Những module Company, HR và PROJECT là bắt buộc và không thể bỏ chọn</Alert>

            <FormGroup>
                <Stack spacing={2}>
                    {isLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        modules.map((module) => (
                            <Card
                                key={module.id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    opacity: REQUIRED_MODULES.includes(module.code) ? 0.7 : 1,
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
                                                        <Chip label="Bắt buộc" size="small" color="primary" />
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </Card>
                        ))
                    )}
                </Stack>
            </FormGroup>

            <Stack direction="row" justifyContent="flex-end" gap={2}>
                <Button
                    onClick={refetchCompanyModules}
                    variant="outlined"
                    color="info"
                    startIcon={<Cancel />}
                >
                    {t("common.cancel")}
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    startIcon={<Save />}
                >
                    {t("working.company.save-changes")}
                </Button>
            </Stack>
        </Stack>
    );
}

export default CompanyModulesTab;