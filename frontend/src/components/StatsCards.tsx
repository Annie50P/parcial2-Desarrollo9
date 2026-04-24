import type { Order } from '../types/order';
import type { IWarranty } from '../types/warranty';

interface StatsCardsProps {
  orders: Order[] | undefined;
  warranties: IWarranty[] | undefined;
}

interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const TotalOrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const PaidOrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
  </svg>
);

const OpenTicketsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

const TotalWarrantiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

export default function StatsCards({ orders, warranties }: StatsCardsProps) {
  const pendingCount = warranties?.filter(w => w.status === 'pending').length || 0;
  const paidCount = orders?.filter(o => o.status === 'paid').length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

  const stats: StatCard[] = [
    {
      id: 'total-orders',
      label: 'Total Órdenes',
      value: orders?.length || 0,
      icon: <TotalOrdersIcon />,
      color: 'accent'
    },
    {
      id: 'paid-orders',
      label: 'Órdenes Pagadas',
      value: paidCount,
      icon: <PaidOrdersIcon />,
      color: 'success'
    },
    {
      id: 'revenue',
      label: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: <PaidOrdersIcon />,
      color: 'success'
    },
    {
      id: 'open-tickets',
      label: 'Tickets Abiertos',
      value: pendingCount,
      icon: <OpenTicketsIcon />,
      color: 'warning'
    },
    {
      id: 'total-warranties',
      label: 'Total Garantías',
      value: warranties?.length || 0,
      icon: <TotalWarrantiesIcon />,
      color: 'error'
    }
  ];

  return (
    <div className="stats-cards-grid">
      {stats.map((stat, index) => (
        <div key={stat.id} className={`stat-card stat-card-${stat.color}`} style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-card-icon">{stat.icon}</div>
          <div className="stat-card-content">
            <span className="stat-card-label">{stat.label}</span>
            <span className="stat-card-value">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}