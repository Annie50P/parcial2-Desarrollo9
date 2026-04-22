import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { CartIcon } from "./CartIcon";
import { CartDrawer } from "./CartDrawer";

export default function Header() {
  return (
    <header className="nav-header">
      <a href="/" className="nav-brand">SafeTech</a>
      
      <nav className="nav-actions">
        <CartIcon />

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
