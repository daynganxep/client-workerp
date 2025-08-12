import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "@redux/slices/auth.slice";

const LogOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.setStates({ field: "tokens", reset: true }));
    navigate("/");
  }, [navigate, dispatch]);

  return null;
};

export default LogOut;
