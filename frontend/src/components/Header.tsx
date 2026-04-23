import { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "../store/cart.store";
import { useAdminCheck } from "./AdminRoute";

const CART_USER_KEY = 'safetech-cart-user';

export default function Header() {
  const { userId } = useAuth();
  const clearCart = useCartStore(state => state.clearCart);
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    const storedUserId = localStorage.getItem(CART_USER_KEY);
    if (userId) {
      if (storedUserId && storedUserId !== userId) {
        clearCart();
      }
      localStorage.setItem(CART_USER_KEY, userId);
    }
  }, [userId, clearCart]);

  return (
    <header className="nav-header">
      <Link to="/" className="nav-brand">SafeTech</Link>

      <nav className="nav-actions">
        <CartIcon />

        <SignedIn>
          {!isAdmin && (
            <Link to="/orders" className="cart-icon-btn">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              Mis Pedidos
            </Link>
          )}
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-outline">
              Iniciar Sesión
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>

      <CartDrawer />
    </header>
  );
}