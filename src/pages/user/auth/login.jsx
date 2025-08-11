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
import { Visibility, VisibilityOff, GitHub, Google, Login as LoginIcon } from "@mui/icons-material";
import AuthService from "@services/auth-service/auth.service";
import ErrorMessage from "@components/form/error-message";
import { loginSchema } from "@validations/auth-schema";
import { joiResolver } from "@hookform/resolvers/joi";
import { SERVER_URL } from "@configs/const.config.jsx";
import { AUTH_LOGIN_DEFAULT_VALUES } from "@configs/form-default-values";


function LogIn() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(loginSchema),
        defaultValues: AUTH_LOGIN_DEFAULT_VALUES,
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [result, error] = await AuthService.login(data);
            if (error) throw new Error(error.code);
            return result;
        },
        onSuccess: (result) => {
            console.log("Login successful:", result);
            navigate("/home");
        },
    });


    return (
        <Stack spacing={5}>
            <form onSubmit={handleSubmit(mutation.mutate)}>
                <ErrorMessage mutation={mutation} />

                <Stack spacing={3} mt={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
                        variant="outlined"
                        {...register("email")}
                    />

                    <TextField
                        fullWidth
                        label="Mật khẩu"
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
                        endIcon={<LoginIcon />}
                    >
                        Đăng nhập
                    </Button>
                </Stack>
            </form >

            <Stack
                direction="row"
                justifyContent="space-between"
            >
                <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                >
                    Quên mật khẩu?
                </Link>
                <Link
                    component={RouterLink}
                    to="/auth/register"
                >
                    Đăng ký tài khoản
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
                    Đăng nhập với Google
                </Button>

                <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    variant="outlined"
                    href={SERVER_URL.OAUTH2_GITHUB}
                    startIcon={<GitHub />}
                >
                    Đăng nhập với Github
                </Button>
            </Stack>
        </Stack >
    );
}

export default LogIn