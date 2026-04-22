import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useCartStore } from "../store/cart.store";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="nav-header">
      <a href="/" className="nav-brand">SafeTech</a>
      
      <nav className="nav-actions">
        <div className="cart-icon-wrapper">
          Cart
          <span className="cart-badge">
            {totalItems}
          </span>
        </div>

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
    </header>
  );
}
