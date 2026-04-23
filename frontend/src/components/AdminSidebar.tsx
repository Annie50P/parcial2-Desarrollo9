import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const WarrantyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const ProductsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

const navItems: NavItem[] = [
  { id: 'orders', label: 'Órdenes', icon: <OrdersIcon /> },
  { id: 'warranties', label: 'Garantías', icon: <WarrantyIcon /> },
  { id: 'products', label: 'Productos', icon: <ProductsIcon /> },
];

export default function AdminSidebar({ onNavigate, activeSection = 'orders' }: AdminSidebarProps) {
  const location = useLocation();

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to="/" className="admin-sidebar-brand">SafeTech</Link>
        <span className="admin-sidebar-badge">Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <Link
              to="/admin"
              className={`admin-sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => onNavigate && handleNavClick('orders')}
            >
              <span className="admin-sidebar-icon"><DashboardIcon /></span>
              <span>Dashboard</span>
            </Link>
          </li>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`admin-sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="admin-sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </span>
          <span>Volver al sitio</span>
        </Link>
      </div>
    </aside>
  );
}