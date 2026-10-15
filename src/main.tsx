import "material-icons/iconfont/filled.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/auth";
import { router } from "@/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </AuthProvider>
  </StrictMode>
);
