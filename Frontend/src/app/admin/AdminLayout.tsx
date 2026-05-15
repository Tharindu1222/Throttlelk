import { Link, Navigate, Outlet, useLocation } from 'react-router';
import { LogOut, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminLayout() {
  const { token, logout } = useAdminAuth();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0A0A0A] text-[#F0EDE8]"
      style={{ fontFamily: "'DM Sans', sans-serif", cursor: 'auto' }}
    >
      <header className="border-b border-[#C0392B]/30 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#C0392B]" />
            <div>
              <p
                className="text-xl tracking-wider leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Admin
              </p>
              <p className="text-xs text-[#F0EDE8]/60">Products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              asChild
              className="border-[#2C2C2C] text-[#F0EDE8] hover:bg-[#C0392B]/10"
            >
              <Link to="/">View storefront</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-[#F0EDE8] hover:bg-[#C0392B]/20"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
