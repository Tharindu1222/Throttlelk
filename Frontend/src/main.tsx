
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Navigate, Route, Routes } from "react-router";
  import { CartProvider } from "./app/components/CartContext";
  import { Toaster } from "./app/components/ui/sonner";
  import App from "./app/App.tsx";
  import { AdminAuthProvider } from "./app/admin/AdminAuthContext";
  import AdminLoginPage from "./app/admin/AdminLoginPage";
  import AdminLayout from "./app/admin/AdminLayout";
  import AdminProductsPage from "./app/admin/AdminProductsPage";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <CartProvider>
                <App />
              </CartProvider>
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster theme="dark" />
      </AdminAuthProvider>
    </BrowserRouter>,
  );
