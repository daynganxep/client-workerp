import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Stack,
    Alert,
    Switch,
    FormControlLabel,
} from "@mui/material";
import toast from "@hooks/toast";
import CompanyService from "@services/compay-module-service/company.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import useFormValidation from "@hooks/useForm";
import { updateCompanyInforSchema } from "@validations/companySchema";
import { companyActions } from "@redux/slices/company.slice";
import "./.scss";

function CompanyInfoTab() {
    const [errorMessage, setErrorMessage] = useState("");
    const getMessage = useMessageByApiCode();
    const dispatch = useDispatch();
    const { name, domain, avatar, active } = useSelector(
        (state) => state.company,
    );

    const {
        data,
        errors,
        isSubmitting,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(updateCompanyInforSchema, {
        name: name || "",
        domain: domain || "",
        avatar: avatar || "",
        active: active !== undefined ? active : true,
    });

    useEffect(() => {
        handleChange("name", name || "");
        handleChange("domain", domain || "");
        handleChange("avatar", avatar || "");
        handleChange("active", active !== undefined ? active : true);
    }, [name, domain, avatar, active, handleChange]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;
        startSubmitting();

        const [result, error] = await CompanyService.updateCompanyInfo(data);

        if (error) {
            setErrorMessage(error.code);
            toast.error(error.code);
            finishSubmitting();
            return;
        }

        toast.success(getMessage(result.code));
        dispatch(companyActions.setCompanyInfo(result.data));
        finishSubmitting();
    };

    return (
        <div className="company-info-tab">
            <Stack spacing={3}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Tên công ty"
                            name="name"
                            value={data.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        <TextField
                            fullWidth
                            label="Domain"
                            name="domain"
                            value={data.domain}
                            onChange={(e) =>
                                handleChange("domain", e.target.value)
                            }
                            error={!!errors.domain}
                            helperText={errors.domain}
                        />

                        <TextField
                            fullWidth
                            label="Avatar URL"
                            name="avatar"
                            value={data.avatar}
                            onChange={(e) =>
                                handleChange("avatar", e.target.value)
                            }
                            error={!!errors.avatar}
                            helperText={errors.avatar}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={data.active}
                                    onChange={(e) =>
                                        handleChange("active", e.target.checked)
                                    }
                                />
                            }
                            label="Trạng thái hoạt động"
                        />

                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Đang cập nhật..."
                                : "Cập nhật thông tin"}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </div>
    );
}

export default CompanyInfoTab;
