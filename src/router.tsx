import { createBrowserRouter, Navigate } from "react-router";

import { AppFrame } from "@/layouts/AppFrame";
import { GuestOnly, RequireAuth } from "@/layouts/AuthGuards";
import { GuestLayout } from "@/layouts/GuestLayout";
import { WebLayout } from "@/layouts/WebLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyOtpPage from "@/pages/auth/VerifyOtpPage";
import FriendsPage from "@/pages/FriendsPage";
import ProfilePage from "@/pages/ProfilePage";
import WebChatPage from "@/pages/WebChatPage";

export const router = createBrowserRouter([
  {
    element: <AppFrame />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          {
            element: <GuestLayout />,
            children: [
              { path: "/welcome", element: <Navigate to="/login" replace /> },
              { path: "/login", element: <LoginPage /> },
              { path: "/register", element: <RegisterPage /> },
              { path: "/forgot-password", element: <ForgotPasswordPage /> },
              { path: "/verify-otp", element: <VerifyOtpPage /> },
              { path: "/reset-password", element: <ResetPasswordPage /> },
            ],
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <WebLayout />,
            children: [
              { path: "/", element: <WebChatPage /> },
              { path: "/chat/:id", element: <WebChatPage /> },
              { path: "/friends", element: <FriendsPage /> },
              { path: "/search", element: <FriendsPage /> },
              { path: "/profile", element: <ProfilePage /> },
              { path: "/user/:id", element: <ProfilePage /> },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
