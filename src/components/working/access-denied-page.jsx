import { useEffect, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { authActions } from "@redux/slices/auth.slice";
import { useDispatch } from "react-redux";

const AccessDeniedPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const href = useHref();
  const dispatch = useDispatch();

  function handleRedirect() {
    dispatch(authActions.setStates({ field: "redirect", value: href }));
    navigate("/auth/login");
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-3xl font-bold">Không có quyền truy cập</h1>
      <p className="mb-4">Bạn cần đăng nhập để truy cập trang này.</p>
      <p className="mb-4">
        Đợi <span className="text-3xl font-bold">{countdown} </span> giây để
        chuyển đến trang đăng nhập.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleRedirect}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Đăng Nhập
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Về Trang Chính
        </button>
      </div>
    </div >
  );
};

export default AccessDeniedPage;
