import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ErrorMessage from "@components/form/error-message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthService from "@services/auth-service/auth.service";
import { forgotPasswordStep1Schema, forgotPasswordStep2Schema } from "@validations/auth-schema";
import { authActions } from "@redux/slices/auth.slice";
import toast from "@hooks/toast";
import { joiResolver } from "@hookform/resolvers/joi";
import { AUTH_FORGOT_PASSWORD_STEP_1_DEFAULT_VALUES, AUTH_FORGOT_PASSWORD_STEP_2_DEFAULT_VALUES } from "@configs/form-default-values.config";

const steps = ['auth.forgot-password.step1', 'auth.forgot-password.step2'];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1, isValid: isValidStep1 },
  } = useForm({
    resolver: joiResolver(forgotPasswordStep1Schema),
    defaultValues: AUTH_FORGOT_PASSWORD_STEP_1_DEFAULT_VALUES,
  });

  const mutationStep1 = useMutation({
    mutationFn: async (data) => {
      const [result, error] = await AuthService.forgotPassword(data.email);
      if (error) throw new Error(error.code);
      return result;
    },
    onSuccess: (result) => {
      toast.success(result.code);
      setActiveStep(2);
    },
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2, isValid: isValidStep2 },
  } = useForm({
    resolver: joiResolver(forgotPasswordStep2Schema),
    defaultValues: AUTH_FORGOT_PASSWORD_STEP_2_DEFAULT_VALUES,
  });

  const mutationStep2 = useMutation({
    mutationFn: async (data) => {
      const [result, error] = await AuthService.forgotPasswordVerify(data);

      if (error) throw new Error(error.code);
      return result;
    },
    onSuccess: result => {
      dispatch(authActions.setStates({ field: "tokens", value: result.data }));
      toast.success(result.code);
      navigate("/");
    },
  });


  return (
    <Stack spacing={3}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{t(label)}</StepLabel>
          </Step>
        ))}
      </Stepper>


      {activeStep === 1 &&
        <form onSubmit={handleSubmitStep1(mutationStep1.mutate)}>
          <ErrorMessage mutation={mutationStep1} />

          <Stack spacing={3} mt={3}>
            <TextField
              fullWidth
              label={t("auth.forgot-password.email")}
              autoComplete="email"
              error={!!errorsStep1.email}
              helperText={errorsStep1.email?.message}
              required
              variant="outlined"
              {...registerStep1("email")}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              disabled={!isValidStep1}
              loading={mutationStep1.isPending}
            >
              {t("auth.forgot-password.step1-button")}
            </Button>
          </Stack>
        </form >
      }

      {activeStep === 2 &&
        <form onSubmit={handleSubmitStep2(mutationStep2.mutate)}>
          <ErrorMessage mutation={mutationStep2} />

          <Stack spacing={3} mt={3}>
            <TextField
              fullWidth
              label={t("auth.forgot-password.code")}
              error={!!errorsStep2.code}
              helperText={errorsStep2.code?.message}
              required
              variant="outlined"
              {...registerStep2("code")}
            />

            <TextField
              fullWidth
              label={t("auth.forgot-password.password")}
              type={showPassword ? "text" : "password"}
              error={!!errorsStep2.password}
              helperText={errorsStep2.password?.message}
              required
              {...registerStep2("password")}
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

            <TextField
              fullWidth
              label={t("auth.forgot-password.confirm-password")}
              type={showPassword ? "text" : "password"}
              error={!!errorsStep2.confirmNewPassword}
              helperText={errorsStep2.confirmNewPassword?.message}
              required
              {...registerStep2("confirmNewPassword")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              disabled={!isValidStep2}
              loading={mutationStep2.isPending}
            >
              {t("auth.forgot-password.step2-button")}
            </Button>
          </Stack>
        </form >}

      <Stack
        direction="row"
        justifyContent="end"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>
            {t("auth.register.login-prompt")}
          </Typography>
          <Link
            component={RouterLink}
            to="/auth/login"
          >
            {t("auth.login.login-button")}
          </Link>
        </Stack>
      </Stack>
    </Stack >
  );
};

export default ForgotPassword;