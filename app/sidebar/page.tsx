'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, LogOut, LayoutGrid, User, Brush, Home } from 'lucide-react';
import { useCart } from '@/constant/cart-context';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginCheck, setLoginCheck] = useState<string | null>(null);
  const [uname, setUname] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { cartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoginCheck(localStorage.getItem('token'));
      setUname(localStorage.getItem('email'));
      setRole(localStorage.getItem('role'));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setLoginCheck(null);
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-${isSidebarOpen ? '64' : '64'} transition-all duration-2000 p-4 flex flex-col items-start space-y-6`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="self-end text-gray-400 hover:text-white">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/" className="flex items-center space-x-3">
          <Home className="h-6 w-6" />
          {isSidebarOpen && <span className="text-lg font-semibold">Home</span>}
        </Link>
        <Link href="/cart" className="relative flex items-center space-x-3">
          <ShoppingCart className="h-6 w-6" />
          {isSidebarOpen && <span>Cart</span>}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        {loginCheck && (
          <>
            <Link href="/orders" className="flex items-center space-x-3">
              <LayoutGrid className="h-6 w-6" />
              {isSidebarOpen && <span>Your Orders</span>}
            </Link>
            {role === 'admin' && (
              <Link href="/Productadd" className="flex items-center space-x-3">
                <Brush className="h-6 w-6" />
                {isSidebarOpen && <span>Your Art</span>}
              </Link>
            )}
            <button onClick={logout} className="flex items-center space-x-3 text-red-400 hover:text-red-600">
              <LogOut className="h-6 w-6" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </>
        )}
        {!loginCheck && (
          <Link href="/login" className="flex items-center space-x-3 text-blue-400 hover:text-blue-600">
            <User className="h-6 w-6" />
            {isSidebarOpen && <span>Login</span>}
          </Link>
        )}
      </aside>
     
    
    </div>
  );
};

export default Sidebar;