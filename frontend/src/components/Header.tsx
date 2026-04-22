import { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { CartIcon } from "./CartIcon";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "../store/cart.store";

const CART_USER_KEY = 'safetech-cart-user';

export default function Header() {
  const { userId } = useAuth();
  const clearCart = useCartStore(state => state.clearCart);

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
      <a href="/" className="nav-brand">SafeTech</a>

      <nav className="nav-actions">
        <CartIcon />

        <SignedIn>
          <Link to="/orders" className="btn-outline" style={{ marginRight: '10px' }}>
            Mis Pedidos
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn-outline">
              Sign In
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
