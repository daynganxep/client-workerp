import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "@redux/slices/auth.slice";

const ReceiveTokens = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const redirect = useSelector((state) => state.auth.redirect);
    const dispatch = useDispatch();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const refreshToken = queryParams.get("refreshToken");
        if (refreshToken) {
            dispatch(authActions.setStates({ field: "tokens.refreshToken", value: refreshToken }));
            navigate(redirect);
        } else {
            navigate("/login");
        }
    }, [location, navigate, dispatch, redirect]);

    return null;
};

export default ReceiveTokens;
