import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Link,
    Stack,
    Alert,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { GitHub } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import toast from "@hooks/toast";
import AuthService from "@services/auth-service/auth.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import useFormValidation from "@hooks/useForm";
import { loginSchema } from "@validations/authSchema";
import { setTokens } from "@redux/slices/auth.slice";
import { SERVER_URL } from "@configs/const.config.jsx";
import ".scss";

const LogIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const getMessage = useMessageByApiCode();
    const dispatch = useDispatch();
    const redirect = useSelector((state) => state.auth.redirect);
    const navigate = useNavigate();

    const {
        data,
        errors,
        isSubmitting,
        handleChange,
        validate,
        startSubmitting,
        finishSubmitting,
    } = useFormValidation(loginSchema, {
        email: "",
        password: "",
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;
        startSubmitting();
        try {
            const [result, error] = await AuthService.login(data);

            if (error) {
                setErrorMessage(getMessage(error.code));
                toast.error(error.code);
                return;
            }

            toast.success(result.code);
            dispatch(setTokens(result.data));
            navigate(redirect);
        } catch (err) {
            toast.error("Đã xảy ra lỗi không mong muốn");
        } finally {
            finishSubmitting();
        }
    };

    return (
        <Stack spacing={3}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={data.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        autoComplete="email"
                    />

                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={data.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="current-password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Link
                            component={RouterLink}
                            to="/auth/forgot-password"
                            variant="body2"
                        >
                            Quên mật khẩu?
                        </Link>
                    </Stack>

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                    </Button>
                </Stack>
            </form>

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="body2">Chưa có tài khoản?</Typography>
                <Link
                    component={RouterLink}
                    to="/auth/register"
                    variant="subtitle2"
                >
                    Đăng ký
                </Link>
            </Stack>

            <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                href={SERVER_URL.OAUTH2_GOOGLE}
                startIcon={<FcGoogle />}
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
    );
};

export default LogIn;
