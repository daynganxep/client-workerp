import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "@services/auth-service/auth.service";
import { authActions } from "@redux/slices/auth.slice";
import env from "@configs/env.config";

const useInitialApp = () => {
  const dispatch = useDispatch();
  const { refreshToken, accessToken } = useSelector((state) => state.auth.tokens);


  const handleRefreshToken = useCallback(async () => {
    const [result, error] = await AuthService.refreshToken();
    if (error) {
      dispatch(authActions.setStates({ field: "tokens", reset: true }));
      dispatch(authActions.setStates({ field: "isLoging", value: false }));
      return false;
    }
    const { accessToken } = result.data;
    dispatch(authActions.setStates({ field: "tokens.accessToken", value: accessToken }));
    dispatch(authActions.setStates({ field: "isLoging", value: true }));
    return true;
  }, [dispatch]);

  const fetchUser = useCallback(async () => {
    const [res, err] = await AuthService.getUserInfo();
    if (err) {
      dispatch(authActions.setStates({ field: "user", reset: true }));
      return;
    }
    dispatch(authActions.setStates({ field: "user", value: res.data }));
  }, [dispatch]);

  useEffect(() => {
    let intervalId;

    const init = async () => {
      if (!refreshToken) {
        dispatch(authActions.setStates({ field: "isLoging", value: false }));
        return;
      }

      await handleRefreshToken();
      intervalId = setInterval(handleRefreshToken, env.interval_refresh_token);
    };

    init();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshToken, handleRefreshToken, fetchUser, dispatch]);

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    }
  }, [accessToken, fetchUser]);
};

export default useInitialApp;
