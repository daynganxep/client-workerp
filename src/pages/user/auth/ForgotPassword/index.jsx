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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import AuthService from "@services/auth-service/auth.service";
import useMessageByApiCode from "@hooks/useMessageByApiCode";
import useFormValidation from "@hooks/useForm";
import { forgotPasswordStep1Schema, forgotPasswordStep2Schema } from "@validations/authSchema";
import { setTokens } from "@redux/slices/auth.slice";
import toast from "@hooks/toast";

const steps = ['Xác nhận email', 'Đặt lại mật khẩu'];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const getMessage = useMessageByApiCode();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const step1Validation = useFormValidation(forgotPasswordStep1Schema, {
    email: "",
  });

  const step2Validation = useFormValidation(forgotPasswordStep2Schema, {
    code: "",
    password: "",
    confirmNewPassword: "",
  });

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleStep1Submit = async (event) => {
    event.preventDefault();
    if (!step1Validation.validate()) return;

    step1Validation.startSubmitting();
    try {
      const [result, error] = await AuthService.forgotPassword(step1Validation.data.email);

      if (error) {
        setErrorMessage(getMessage(error.code));
        toast.error(error.code);
        return;
      }

      toast.success(result.code);
      setActiveStep(1);
    } catch (err) {
      toast.error("Đã xảy ra lỗi không mong muốn");
    } finally {
      step1Validation.finishSubmitting();
    }
  };

  const handleStep2Submit = async (event) => {
    event.preventDefault();
    if (!step2Validation.validate()) return;

    step2Validation.startSubmitting();
    try {
      const [result, error] = await AuthService.forgotPasswordVerify({
        code: step2Validation.data.code,
        password: step2Validation.data.password,
      });

      if (error) {
        setErrorMessage(getMessage(error.code));
        toast.error(error.code);
        return;
      }

      dispatch(setTokens(result.data));
      toast.success(result.code);
      navigate("/");
    } catch (err) {
      toast.error("Đã xảy ra lỗi không mong muốn");
    } finally {
      step2Validation.finishSubmitting();
    }
  };

  return (
    <Stack spacing={3}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {activeStep === 0 ? (
        <form onSubmit={handleStep1Submit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={step1Validation.data.email}
              onChange={(e) => step1Validation.handleChange("email", e.target.value)}
              error={!!step1Validation.errors.email}
              helperText={step1Validation.errors.email}
              autoComplete="email"
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={step1Validation.isSubmitting}
            >
              {step1Validation.isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Mã xác nhận"
              name="code"
              value={step2Validation.data.code}
              onChange={(e) => step2Validation.handleChange("code", e.target.value)}
              error={!!step2Validation.errors.code}
              helperText={step2Validation.errors.code}
            />

            <TextField
              fullWidth
              label="Mật khẩu mới"
              name="password"
              type={showPassword ? "text" : "password"}
              value={step2Validation.data.password}
              onChange={(e) => step2Validation.handleChange("password", e.target.value)}
              error={!!step2Validation.errors.password}
              helperText={step2Validation.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('password')}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={step2Validation.data.confirmNewPassword}
              onChange={(e) => step2Validation.handleChange("confirmNewPassword", e.target.value)}
              error={!!step2Validation.errors.confirmNewPassword}
              helperText={step2Validation.errors.confirmNewPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={step2Validation.isSubmitting}
            >
              {step2Validation.isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </Stack>
        </form>
      )}

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="body2">Đã có tài khoản?</Typography>
        <Link
          component={RouterLink}
          to="/auth/login"
          variant="subtitle2"
        >
          Đăng nhập
        </Link>
      </Stack>
    </Stack>
  );
};

export default ForgotPassword;