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
  const { isAdmin, loading } = useAdminCheck();

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
        {!isAdmin && !loading && <CartIcon />}

        <SignedIn>
          {isAdmin && (
            <Link to="/admin" className="cart-icon-btn">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.814 2.567 2.567 1.066 1.066.166 2.409.256 1.766a4.971 4.971 0 01-2.415 2.483 4.922 4.922 0 01-1.766.23c.168.091.701.201 1.766.255a1.724 1.724 0 002.573-1.066c.94-1.543-.815-3.31-2.567-2.568a1.724 1.724 0 01-1.066-2.573c.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 00-1.066-2.573c-1.543.94-3.31-.814-2.567-2.567a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31.815-2.567 2.567a1.724 1.724 0 00-1.066 2.573c.426.756 2.924 1.756 3.35 0a1.724 1.724 0 001.066-2.573c-.94-1.543.814-3.31 2.567-2.567 1.066 1.066.165 2.409.256 1.766a4.971 4.971 0 012.415 2.483 4.922 4.922 0 011.766.23c-.168-.091-.701-.201-1.766-.256a1.724 1.724 0 00-2.573 1.066c-.94 1.543.815 3.31 2.567 2.568a1.724 1.724 0 001.066-2.573z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </Link>
          )}

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