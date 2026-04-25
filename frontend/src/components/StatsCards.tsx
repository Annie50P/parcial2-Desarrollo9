import { useEffect, useRef, useState } from 'react';
import type { Order } from '../types/order';
import type { IWarranty } from '../types/warranty';

interface StatsCardsProps {
  orders:     Order[]     | undefined;
  warranties: IWarranty[] | undefined;
}

function useCountUp(target: number, duration = 1000, trigger = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger || target === 0) { setValue(target); return; }
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return value;
}

interface BigMetricProps {
  label:      string;
  rawValue:   number;
  prefix?:    string;
  suffix?:    string;
  dark?:      boolean;
  accent?:    boolean;
  delay?:     number;
  trigger:    boolean;
  isRevenue?: boolean;
  span2?:     boolean;
}

function BigMetric({
  label, rawValue, prefix = '', suffix = '', dark, accent,
  delay = 0, trigger, isRevenue, span2,
}: BigMetricProps) {
  const counted = useCountUp(rawValue, 900 + delay * 80, trigger);

  const formatted = isRevenue
    ? `$${counted.toLocaleString('en-US')}`
    : `${prefix}${counted.toLocaleString()}${suffix}`;

  const bg = dark ? 'var(--ink)' : accent ? 'var(--accent)' : 'var(--white)';
  const textColor = (dark || accent) ? 'var(--white)' : 'var(--ink)';
  const labelColor = (dark || accent) ? 'rgba(255,255,255,0.45)' : 'var(--ink3)';

  return (
    <div
      className="stat-card"
      style={{
        background: bg,
        borderColor: dark ? 'var(--ink)' : accent ? 'var(--accent)' : 'var(--line)',
        animationDelay: `${delay * 0.08}s`,
        gridColumn: span2 ? 'span 2' : undefined,
        padding: '2.25rem 2.5rem',
        minHeight: 180,
      }}
    >
      <span style={{
        fontSize: '0.68rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: labelColor,
        display: 'block',
        marginBottom: '1.25rem',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
        fontWeight: 800,
        color: textColor,
        letterSpacing: '-0.05em',
        lineHeight: 1,
        display: 'block',
        fontFamily: 'var(--font-display)',
      }}>
        {formatted}
      </span>
    </div>
  );
}

export default function StatsCards({ orders, warranties }: StatsCardsProps) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const totalOrders   = orders?.length ?? 0;
  const paidOrders    = orders?.filter((o) => o.status === 'paid').length ?? 0;
  const totalRevenue  = orders?.reduce((s, o) => s + (o.total_amount || 0), 0) ?? 0;
  const openTickets   = warranties?.filter((w) => w.status === 'pending').length ?? 0;
  const totalWarranties = warranties?.length ?? 0;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.25rem',
        marginBottom: '3rem',
      }}
    >
      {/* Ingresos — full width, dark */}
      <BigMetric
        label="Ingresos Totales"
        rawValue={totalRevenue}
        dark
        delay={0}
        trigger={triggered}
        isRevenue
        span2
      />

      <BigMetric label="Total Órdenes"   rawValue={totalOrders}     delay={1} trigger={triggered} />
      <BigMetric label="Órdenes Pagadas" rawValue={paidOrders}      delay={2} trigger={triggered} accent />
      <BigMetric label="Tickets Abiertos" rawValue={openTickets}    delay={3} trigger={triggered} />
      <BigMetric label="Total Garantías"  rawValue={totalWarranties} delay={4} trigger={triggered} />
    </div>
  );
}
