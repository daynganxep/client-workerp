import { Fragment } from "react";
import MainLayout from "@layouts/user/MainLayout";
import AuthLayout from "@layouts/user/AuthLayout";

import NotFound from "@pages/user/NotFound";
import Home from "@pages/user/Home";
import Login from "@pages/user/auth/Login";
import Register from "@pages/user/auth/Register";
import ReceiveTokens from "@pages/user/auth/ReceiveTokens";
import ForgotPassword from "@pages/user/auth/ForgotPassword";
import Logout from "@pages/user/auth/Logout";

import { USER_ROUTE_TYPES } from "../routeTypes/routeTypes";

export default [
  {
    path: "/",
    Page: Home,
    Layout: MainLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Trang chủ",
  },
  {
    path: "/home",
    Page: Home,
    Layout: MainLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Trang chủ",
  },
  {
    path: "/auth/login",
    Page: Login,
    Layout: AuthLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Đăng nhập",
  },
  {
    path: "/auth/register",
    Page: Register,
    Layout: AuthLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Đăng ký",
  },
  {
    path: "/auth/logout",
    Page: Logout,
    Layout: Fragment,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Đăng xuất",
  },
  {
    path: "/auth/receive-refresh-token",
    Page: ReceiveTokens,
    Layout: Fragment,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Nhận tokens",
  },
  {
    path: "/auth/forgot-password",
    Page: ForgotPassword,
    Layout: AuthLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Lấy lại mật khẩu",
  },
  {
    path: "/404",
    Page: NotFound,
    Layout: MainLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Không tìm thấy trang",
  },
  {
    path: "*",
    Page: NotFound,
    Layout: MainLayout,
    type: USER_ROUTE_TYPES.PUBLIC,
    title: "Không tìm thấy trang",
  },
];
