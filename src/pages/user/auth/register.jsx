import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    TextField,
    Button,
    Link,
    Stack,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, GitHub, Google, Login as RegisterIcon } from "@mui/icons-material";
import AuthService from "@services/auth-service/auth.service";
import ErrorMessage from "@components/form/error-message";
import { loginSchema } from "@validations/auth-schema";
import { joiResolver } from "@hookform/resolvers/joi";
import { SERVER_URL } from "@configs/const.config.jsx";
import { AUTH_REGISTER_DEFAULT_VALUES } from "@configs/form-default-values.config";
import { useTranslation } from "react-i18next";
import toast from "@hooks/toast"


function Register() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(loginSchema),
        defaultValues: AUTH_REGISTER_DEFAULT_VALUES,
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [result, error] = await AuthService.register(data);
            if (error) throw new Error(error.code);
            return result;
        },
        onSuccess: (result) => {
            toast.success(t(`api-code.${result.code}`));
            navigate("/");
        },
    });


    return (
        <Stack spacing={5}>
            <form onSubmit={handleSubmit(mutation.mutate)}>
                <ErrorMessage mutation={mutation} />

                <Stack spacing={3} mt={3}>
                    <TextField
                        fullWidth
                        label={t("auth.register.email")}
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
                        variant="outlined"
                        {...register("email")}
                    />

                    <TextField
                        fullWidth
                        label={t("auth.register.password")}
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        required
                        {...register("password")}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={!isValid}
                        loading={mutation.isPending}
                        endIcon={<RegisterIcon />}
                    >
                        {t("auth.register.register-button")}
                    </Button>
                </Stack>
            </form >

            <Stack
                direction="row"
                justifyContent="end"
            >
                <Link
                    component={RouterLink}
                    to="/auth/login"
                >
                    {t("auth.register.login-prompt")}
                </Link>
            </Stack>

            <Stack
                spacing={3}
                direction="column"
            >
                <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                    href={SERVER_URL.OAUTH2_GOOGLE}
                    startIcon={<Google />}
                >
                    {t("auth.register.google-login")}
                </Button>

                <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                    href={SERVER_URL.OAUTH2_GITHUB}
                    startIcon={<GitHub />}
                >
                    {t("auth.register.github-login")}
                </Button>
            </Stack>
        </Stack >
    );
}

export default Register;