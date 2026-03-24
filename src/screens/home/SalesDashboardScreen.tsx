/**
 * AI Moving — Sales Dashboard Screen
 *
 * Dashboard for sales representatives to track deals, proposals, leads, and revenue.
 * Sections:
 * 1. Sales Revenue hero card (total + trend) with week/month toggle
 * 2. Key metrics cards (deals closed, conversion rate, proposals sent, avg deal size)
 * 3. Weekly/Monthly sales chart (bar chart)
 * 4. Recent deals list with status badges
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import { TabBar, TabId } from './TabBar';
import { MoveDetailScreen as MoveDetailScreenBase, MoveDetailData } from '../move/MoveDetailScreen';

const F = fontFamily.primary;

/* Semantic accent colors */
const ACCENT_PURPLE = '#7C3AED';
const ACCENT_ORANGE = '#F59E0B';

interface SalesDealData {
  client: string; route: string; amount: number; rooms: number;
  date: string; status: string;
  distance: string; duration: string; crew: number;
  clientPhone: string; notes: string;
}

const generateSalesRooms = (roomCount: number): import('../move/MoveDetailScreen').RoomInventory[] => {
  const templates: import('../move/MoveDetailScreen').RoomInventory[] = [
    { name: 'Living Room', icon: 'living', items: [
      { name: 'Sofa', qty: 1, tag: 'Large' }, { name: 'Coffee Table', qty: 1 },
      { name: 'TV Stand', qty: 1 }, { name: 'Bookshelf', qty: 1, tag: 'Large' },
      { name: 'Boxes', qty: 8 }, { name: 'Lamp', qty: 2 },
    ]},
    { name: 'Master Bedroom', icon: 'bedroom', items: [
      { name: 'Queen Bed Frame', qty: 1, tag: 'Large' }, { name: 'Mattress', qty: 1, tag: 'Large' },
      { name: 'Dresser', qty: 1 }, { name: 'Nightstand', qty: 2 },
      { name: 'Boxes', qty: 6 }, { name: 'Mirror', qty: 1, tag: 'Fragile' },
    ]},
    { name: 'Kitchen', icon: 'kitchen', items: [
      { name: 'Boxes (dishes)', qty: 5, tag: 'Fragile' }, { name: 'Boxes (cookware)', qty: 3 },
      { name: 'Microwave', qty: 1 }, { name: 'Small Appliances', qty: 4 },
    ]},
    { name: 'Bedroom 2', icon: 'bedroom', items: [
      { name: 'Twin Bed', qty: 1, tag: 'Large' }, { name: 'Desk', qty: 1 },
      { name: 'Chair', qty: 1 }, { name: 'Boxes', qty: 4 },
    ]},
    { name: 'Office', icon: 'office', items: [
      { name: 'Desk', qty: 1, tag: 'Large' }, { name: 'Office Chair', qty: 1 },
      { name: 'Monitor', qty: 2, tag: 'Fragile' }, { name: 'Boxes', qty: 5 },
    ]},
  ];
  return templates.slice(0, Math.min(roomCount, templates.length));
};

const dealToMoveDetail = (deal: SalesDealData): MoveDetailData => {
  const fromTo = deal.route.split(' → ');
  const rooms = generateSalesRooms(deal.rooms);
  const totalItems = rooms.reduce((sum, r) => sum + r.items.reduce((s, it) => s + it.qty, 0), 0);
  return {
    id: `deal-${deal.date}-${deal.client}`,
    client: deal.client,
    from: fromTo[0] || '',
    to: fromTo[1] || '',
    date: deal.date,
    time: '10:00 AM',
    price: deal.amount,
    step: deal.status === 'closed' ? 'completed' : 'accepted',
    roomsCount: deal.rooms,
    clientPhone: deal.clientPhone,
    clientEmail: `${deal.client.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    fromApt: '',
    fromFloor: '1',
    fromElevator: true,
    toApt: '',
    toFloor: '1',
    toElevator: true,
    distance: deal.distance,
    estimatedTime: `~${Math.round(parseFloat(deal.distance) * 2.5)} min`,
    totalVolume: `${Math.round(deal.rooms * 120)} cu ft`,
    totalItems,
    rooms,
    specialItems: [],
    notes: deal.notes,
    planName: deal.amount > 1200 ? 'Premium' : 'Standard',
    depositPaid: Math.round(deal.amount * 0.2),
    ...(deal.status === 'closed' ? {
      moverInfo: { name: 'Alex M.', crewSize: deal.crew, rating: 4.8 },
      actualDuration: deal.duration,
      stageDurations: {
        loading: `${Math.round(parseFloat(deal.duration) * 0.35 * 60)}m`,
        driving: `${Math.round(parseFloat(deal.distance) * 2.5)}m`,
        unloading: `${Math.round(parseFloat(deal.duration) * 0.30 * 60)}m`,
      },
      earningsSummary: { totalEarned: deal.amount, itemsMoved: totalItems },
    } : {}),
  } as MoveDetailData;
};

type SalesMetricKey = 'dealsClosed' | 'conversionRate' | 'proposalsSent' | 'avgDealSize' | 'salesRevenue';

/* ═══════════════════════════════════════════
   Icon components — from user's Icons folder
   (Star, Sync, Money-bag, Add-Product, Cards-with-dollar)
   ═══════════════════════════════════════════ */

/* Star — for Proposals Sent (from star.svg) */
const StarIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="-15 -12 100 100" fill={color}>
    <g transform="matrix(.957 0 0 .957 15.652 11.478)"><path clipRule="evenodd" d="m34.669548-8.4613094c.1628304-.5473452.6672783-.9250927 1.2395058-.9250927s1.0766754.3777475 1.2395058.9250927c0 0 2.2686234 7.6043649 4.7001495 15.7606297 3.8745232 12.9943981 14.0393524 23.1591949 27.0337143 27.0337181 8.1562347 2.4315262 15.7605972 4.7001457 15.7605972 4.7001457.5473785.1628342.9250946.6672783.9250946 1.2395096 0 .5722275-.3777161 1.0766716-.9250946 1.2395058 0 0-7.6043625 2.2686234-15.7605972 4.7001495-12.9943619 3.8745193-23.1591911 14.0393524-27.0337143 27.0337143-2.4315262 8.1562347-4.7001495 15.7605972-4.7001495 15.7605972-.1628304.5473785-.6672783.9250946-1.2395058.9250946s-1.0766754-.3777161-1.2395058-.9250946c0 0-2.2686234-7.6043625-4.7001495-15.7605972-3.8745213-12.9943619-14.0393543-23.159195-27.033716-27.0337144-8.1562309-2.4315262-15.7605953-4.7001495-15.7605953-4.7001495-.5473795-.1628342-.9250927-.6672783-.9250927-1.2395058 0-.5722313.3777132-1.0766754.9250927-1.2395096 0 0 7.6043644-2.2686195 15.7605953-4.7001457 12.9943619-3.8745232 23.1591969-14.03932 27.0337162-27.0337181 2.431526-8.1562649 4.7001493-15.7606296 4.7001493-15.7606296z" fillRule="evenodd"/></g>
  </svg>
);

/* Sync / Arrows — for Conversion Rate (from sync.svg) */
const SyncIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 491.5 491.5" fill={color}>
    <path d="m437 94.3-22.7 21.4c-3.5 3.3-8.8 3.4-11.5-.5-59.6-83.6-174.2-109.8-264.9-57.4-51.3 29.6-84.6 78.4-96.2 132-.7 3.4 0 6.7 2.3 9.4 2.2 2.7 5.2 4.1 8.8 4.1l33.4-.3c5.1 0 9.4-3.4 10.7-8.3 9.7-36.5 33.3-69.2 68.5-89.6 63.7-36.8 143.6-20.4 188.1 35.5 3.5 4.3.9 10.1-4.4 11.8l-27.3 8.5c-8.7 2.7-11.2 14.3-2.9 18.2l109.9 50.9c6.7 3.1 13.8-1.1 14.5-8.4l10.9-120.6c.8-9.2-10.6-12.9-17.2-6.7z"/>
    <path d="m438.8 288.2-33.4.3c-5.1 0-9.4 3.4-10.7 8.3-9.7 36.5-33.3 69.2-68.5 89.6-63.7 36.8-143.6 20.4-188.1-35.5-3.5-4.3-.9-10.1 4.4-11.8l27.3-8.5c8.7-2.7 11.2-14.3 2.9-18.2l-110-50.8c-6.7-3.1-13.8 1.1-14.5 8.4l-10.9 120.6c-.8 9.1 10.5 12.9 17.2 6.6l22.7-21.4c3.5-3.3 8.8-3.4 11.5.5 59.6 83.6 174.1 109.8 264.8 57.4 51.3-29.6 84.6-78.4 96.2-132 .7-3.4 0-6.7-2.3-9.4-2-2.7-5.1-4.1-8.6-4.1z"/>
  </svg>
);

/* Money bag — for Avg Deal Size (from money-bag.svg) */
const MoneyBagIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
    <path d="m10.533 7.397c1.115-.342 2.276-.536 3.475-.536s2.36.194 3.475.536c1.232-.901 2.042-2.347 2.042-3.991v-.624c-.001-.432-.351-.782-.783-.782h-9.469c-.432 0-.782.35-.782.782v.625c0 1.643.81 3.089 2.042 3.99z"/>
    <path d="m23.01 4.796c-.497 0-.9.403-.9.9 0 .974-.792 1.765-1.766 1.765h-.778c-.158.194-.327.378-.507.554.69.328 1.356.715 1.987 1.176 1.631-.327 2.864-1.769 2.864-3.494 0-.498-.403-.901-.9-.901z"/>
    <path d="m29.538 20.959c0 .738-1 1.385-2.506 1.741-.819.201-1.791.317-2.832.317-1.034 0-2.006-.116-2.825-.317-1.506-.356-2.506-1.003-2.506-1.741 0-1.139 2.388-2.065 5.332-2.065 2.949 0 5.337.926 5.337 2.065z"/>
    <path d="m27.398 27.646c-.95.238-2.06.365-3.199.365-1.143 0-2.251-.128-3.207-.369-.92-.223-1.606-.515-2.124-.837v1.13c0 .738.993 1.379 2.492 1.747.819.201 1.798.318 2.839.318 1.048 0 2.02-.117 2.846-.317 1.5-.369 2.492-1.01 2.492-1.747v-1.132c-.52.324-1.211.618-2.139.842z"/>
    <path d="m27.376 24.159c-.948.232-2.051.357-3.177.357-1.122 0-2.223-.125-3.183-.36-.936-.221-1.628-.519-2.148-.847v1.137c0 .738.993 1.379 2.492 1.741.819.207 1.798.324 2.839.324 1.048 0 2.02-.116 2.846-.324 1.5-.362 2.492-1.003 2.492-1.741v-1.14c-.522.331-1.218.631-2.161.853z"/>
    <path d="m17.368 27.936v-3.488-.34-3.516c.311-2.216 3.597-3.197 6.832-3.197.255 0 .509.008.762.021-1.425-4.782-5.37-9.054-10.954-9.054-8.013 0-12.668 8.796-11.312 15.276 1.094 5.226 5.8 6.362 11.312 6.362 1.447 0 2.831-.088 4.115-.3-.615-.637-.755-1.301-.755-1.764z"/>
  </svg>
);

/* Add Product — for Deals Closed (from add-product.svg) */
const ClipboardIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill={color}>
    <path d="m22.7242928 2.0350215h-5.7215595v5.3175611c0 .5241585-.5896702.8407869-1.026392.5459514l-1.408597-.9390202c-.34935-.2293239-.7970676-.2293239-1.1355553 0l-1.4194603.9390202c-.4367876.2948346-1.015461-.0217929-1.015461-.5459514v-5.3175611h-5.7215595c-1.8125958 0-3.2757082 1.4741087-3.2757082 3.2757085v17.37854c0 1.8125954 1.4631124 3.2757092 3.2757082 3.2757092h17.4485855c1.8015986 0 3.2757063-1.4631138 3.2757063-3.2757092v-17.37854c0-1.8015998-1.4741077-3.2757085-3.2757072-3.2757085zm-6.169344 16.8337224c-.0005341 0-.0010662 0-.0010662 0l-1.4661121-.001667-.0016661 1.4662457c-.0005331.6029987-.4894361 1.0908356-1.0919027 1.0908356-.0005331 0-.0010662 0-.0010662 0-.6029987-.0005322-1.0913696-.4899693-1.0908365-1.092968l.0016661-1.4666443-1.4657106-.001667c-.6029997-.0005322-1.0913696-.4899693-1.0908365-1.092968.0005331-.6030006.4894361-1.0908375 1.0919027-1.0908375h.0010662l1.4661112.001667.0016661-1.4657116c.0005331-.6029997.4894371-1.0908365 1.0919027-1.0908365h.0010662c.6029987.0005331 1.0913696.4899693 1.0908365 1.0929689l-.0016661 1.4661102 1.4657116.001667c.6029987.0005322 1.0913696.4899693 1.0908356 1.092968-.0005323.6030007-.4894372 1.0908375-1.0919019 1.0908375z"/>
  </svg>
);

/* Cards with dollar sign — for Revenue hero (from cards-with-dollar-sign.svg) */
const CardDollarIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 467.6 467.6" fill={color}>
    <path d="M209.3,219.916c4.3-3.7,10.4-6.1,18.4-6.7v45.899c-9.8-3.1-16.5-6.699-20.2-9.8c-3.7-3.7-5.5-8-5.5-14.1 C202.6,229.116,205,224.216,209.3,219.916z M388.6,72.416c-8-29.4-31.199-40.4-58.1-33L93,103.016h303.6L388.6,72.416z M467.6,178.916v204.4c0,26.3-20.8,47.101-47.1,47.101H47.1c-26.3,0-47.1-20.801-47.1-47.101v-204.4c0-26.3,20.8-47.1,47.1-47.1 h373.3C446.2,131.815,467.6,153.216,467.6,178.916z M304.8,318.415c0-15.301-4.899-26.899-14.7-35.5 c-9.8-8.601-24.5-14.699-44.699-19H244.8v-49.601c13.5,1.8,26.3,7.3,37.9,15.3l17.1-24.5c-17.1-11.6-35.5-18.4-55.1-19.6v-13.5 h-17.1l0,0v12.9c-17.1,0.6-30.6,6.1-41.6,15.9c-10.4,9.8-15.9,22-15.9,37.3s4.9,26.9,14.1,34.3c9.2,8,23.9,14.102,43.5,19v51.4 c-15.9-2.4-30.6-10.4-45.9-23.3l-19.6,23.3c19,16.5,41,26.3,64.9,28.8v19.602h17.1v-19c17.699-.602,32.398-6.102,43.5-15.9 C299.3,346.016,304.8,333.716,304.8,318.415z M244.8,295.815v47.7c8.601-.601,15.3-3.101,20.2-7.3 c4.899-4.301,7.3-9.2,7.3-15.301s-1.8-11-5.5-14.699C262.6,302.516,255.8,298.915,244.8,295.815z"/>
  </svg>
);

const ChevronRightIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={colors.primary[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Animations — CSS keyframes + helpers
   ═══════════════════════════════════════════ */

const ANIMATION_CSS = `
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes countPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes cSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes cSheetDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
@keyframes cFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes cFadeOut { from { opacity: 1; } to { opacity: 0; } }

.sales-card-interactive {
  transition: transform 0.18s ease, background-color 0.2s ease;
}
.sales-card-interactive:hover {
  transform: scale(1.015);
}
.sales-card-interactive:active {
  transform: scale(0.975);
}
.sales-chip {
  transition: background-color 0.2s ease, transform 0.15s ease;
}
.sales-chip:hover {
  transform: scale(1.04);
}
.sales-chip:active {
  transform: scale(0.95);
}
.sales-deal-row {
  transition: background-color 0.18s ease, transform 0.15s ease;
  border-radius: 12px;
}
.sales-deal-row:hover {
  background-color: #F9FAFB;
}
.sales-deal-row:active {
  transform: scale(0.98);
}
`;

let cssInjected = false;
const injectAnimationCSS = () => {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = ANIMATION_CSS;
  document.head.appendChild(style);
  cssInjected = true;
};

/* ═══════════════════════════════════════════
   AnimatedNumber & Animation helpers
   ═══════════════════════════════════════════ */

const AnimatedNumber: React.FC<{ value: string; style: React.CSSProperties }> = ({ value, style }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    const numMatch = value.match(/([$%]?)([0-9,.]+)(.*)/);
    if (!numMatch) { setDisplay(value); return; }
    const prefix = numMatch[1] || '';
    const target = parseFloat(numMatch[2].replace(/,/g, ''));
    const suffix = numMatch[3] || '';
    const isDecimal = numMatch[2].includes('.');
    const hasComma = numMatch[2].includes(',');
    const startMatch = display.match(/([$%]?)([0-9,.]+)(.*)/);
    const start = startMatch ? parseFloat(startMatch[2].replace(/,/g, '')) : 0;
    let frame = 0;
    const totalFrames = 20;
    const step = () => {
      frame++;
      const t = frame / totalFrames;
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (target - start) * eased;
      const formatted = isDecimal ? current.toFixed(numMatch[2].split('.')[1]?.length || 1) :
                        hasComma ? Math.round(current).toLocaleString() :
                        String(Math.round(current));
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (frame < totalFrames) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  useEffect(() => { setDisplay(value); }, []);

  return <span style={style as any}>{display}</span>;
};

const StaggerItem = ({ children, index = 0 }: { children: React.ReactNode; index?: number }) => (
  <div style={{ animation: `fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both` } as any}>
    {children}
  </div>
);

const AnimatedPage = ({ children, direction = 'right', duration = 0.3 }: { children: React.ReactNode; direction?: 'left' | 'right'; duration?: number }) => (
  <div style={{ animation: direction === 'right' ? `slideInRight ${duration}s ease both` : `slideInLeft ${duration}s ease both` } as any}>
    {children}
  </div>
);

/* ═══════════════════════════════════════════
   Mock Data — Sales-specific
   ═══════════════════════════════════════════ */

const DATA = {
  week: {
    dealsClosed: 8,
    dealsClosedTrend: '↑ 2 vs last week',
    salesRevenue: 12400,
    revenueTrend: '↑ 15% vs last week',
    proposalsSent: 18,
    proposalsTrend: '↑ 3 vs last week',
    conversionRate: '44%',
    conversionSub: 'Proposals → Closed',
    avgDealSize: '$1,550',
    avgDealSub: '↑ $120 vs last week',
    newLeads: 24,
    newLeadsSub: 'from website + referrals',
    chart: [
      { day: 'Mon', value: 1800 },
      { day: 'Tue', value: 2100 },
      { day: 'Wed', value: 1600 },
      { day: 'Thu', value: 2400 },
      { day: 'Fri', value: 2200 },
      { day: 'Sat', value: 1200 },
      { day: 'Sun', value: 1100 },
    ],
    chartLabel: 'Weekly Sales',
  },
  month: {
    dealsClosed: 32,
    dealsClosedTrend: '↑ 8 vs last month',
    salesRevenue: 52800,
    revenueTrend: '↑ 22% vs last month',
    proposalsSent: 78,
    proposalsTrend: '↑ 18 vs last month',
    conversionRate: '41%',
    conversionSub: 'Proposals → Closed',
    avgDealSize: '$1,650',
    avgDealSub: '↑ $250 vs last month',
    newLeads: 108,
    newLeadsSub: 'from website + referrals',
    chart: [
      { day: 'Week 1', value: 12400 },
      { day: 'Week 2', value: 13200 },
      { day: 'Week 3', value: 14100 },
      { day: 'Week 4', value: 13100 },
    ],
    chartLabel: 'Monthly Sales',
  },
};

const RECENT_DEALS = [
  { id: 1, client: 'Sarah Johnson', route: 'Hollywood → Pasadena', amount: 1850, status: 'closed', date: 'Mar 23', rooms: 3, distance: '12 mi', duration: '3.5h', crew: 2, clientPhone: '(310) 555-0142', notes: 'Fragile items in bedroom' },
  { id: 2, client: 'Mike Chen', route: 'Venice → Beverly Hills', amount: 2100, status: 'closed', date: 'Mar 22', rooms: 4, distance: '8 mi', duration: '4.2h', crew: 3, clientPhone: '(310) 555-0198', notes: 'Large dining table' },
  { id: 3, client: 'Emma Wilson', route: 'Santa Monica → Westwood', amount: 980, status: 'proposal', date: 'Mar 22', rooms: 2, distance: '5 mi', duration: '2.0h', crew: 2, clientPhone: '(424) 555-0267', notes: '' },
  { id: 4, client: 'David Brown', route: 'Downtown → Koreatown', amount: 1450, status: 'negotiation', date: 'Mar 21', rooms: 3, distance: '6 mi', duration: '3.0h', crew: 2, clientPhone: '(213) 555-0334', notes: 'No elevator, 3rd floor' },
  { id: 5, client: 'Lisa Park', route: 'Burbank → Glendale', amount: 750, status: 'lost', date: 'Mar 20', rooms: 1, distance: '4 mi', duration: '1.5h', crew: 2, clientPhone: '(818) 555-0523', notes: '' },
  { id: 6, client: 'James Taylor', route: 'WeHo → Silver Lake', amount: 1200, status: 'closed', date: 'Mar 19', rooms: 2, distance: '7 mi', duration: '2.8h', crew: 2, clientPhone: '(424) 555-0789', notes: 'Parking tricky' },
];

const SALES_NOTIFS = [
  { id: 'sn1', title: 'Proposal accepted', body: 'Sarah Johnson accepted your proposal for $1,850', time: '2m ago', type: 'success', group: 'today' as const },
  { id: 'sn2', title: 'New lead assigned', body: 'Mike Chen needs a 4-room move in Venice area', time: '25m ago', type: 'lead', group: 'today' as const },
  { id: 'sn3', title: 'Follow-up reminder', body: 'Emma Wilson — proposal sent 2 days ago, no response', time: '1h ago', type: 'reminder', group: 'today' as const },
  { id: 'sn4', title: 'Proposal viewed', body: 'David Brown opened your proposal ($1,450)', time: '3h ago', type: 'info', group: 'earlier' as const },
  { id: 'sn5', title: 'Deal lost', body: 'Lisa Park chose another provider', time: 'Yesterday', type: 'warning', group: 'earlier' as const },
  { id: 'sn6', title: 'New lead assigned', body: 'James Taylor needs help with studio move', time: 'Yesterday', type: 'lead', group: 'earlier' as const },
];

/* ═══════════════════════════════════════════
   Drill-down Detail Screen — Sales Metrics
   ═══════════════════════════════════════════ */

interface SalesDetailConfig {
  title: string;
  color: string;
  icon: React.ReactNode;
}

const SALES_METRIC_CONFIG: Record<SalesMetricKey, SalesDetailConfig> = {
  dealsClosed: { title: 'Deals Closed', color: colors.primary[500], icon: <ClipboardIcon color={colors.primary[500]} size={20} /> },
  conversionRate: { title: 'Conversion Rate', color: colors.success[500], icon: <SyncIcon color={colors.success[500]} size={20} /> },
  proposalsSent: { title: 'Proposals Sent', color: colors.warning[500], icon: <StarIcon color={colors.warning[500]} size={20} /> },
  avgDealSize: { title: 'Avg Deal Size', color: ACCENT_PURPLE, icon: <MoneyBagIcon color={ACCENT_PURPLE} size={20} /> },
  salesRevenue: { title: 'Sales Revenue', color: colors.primary[500], icon: <CardDollarIcon color={colors.primary[500]} size={20} /> },
};

const SALES_DRILL_DOWN: Record<SalesMetricKey, { rows: any[] }> = {
  dealsClosed: {
    rows: [
      { date: 'Mar 23', client: 'Sarah Johnson', route: 'Hollywood → Pasadena', amount: '$1,850', status: 'Closed', rooms: 3 },
      { date: 'Mar 22', client: 'Mike Chen', route: 'Venice → Beverly Hills', amount: '$2,100', status: 'Closed', rooms: 4 },
      { date: 'Mar 21', client: 'David Brown', route: 'Downtown → Koreatown', amount: '$1,450', status: 'Closed', rooms: 3 },
      { date: 'Mar 19', client: 'James Taylor', route: 'WeHo → Silver Lake', amount: '$1,200', status: 'Closed', rooms: 2 },
      { date: 'Mar 18', client: 'Olivia Martinez', route: 'Burbank → Pasadena', amount: '$980', status: 'Closed', rooms: 2 },
      { date: 'Mar 17', client: 'Ryan Cooper', route: 'Santa Monica → Malibu', amount: '$2,400', status: 'Closed', rooms: 5 },
      { date: 'Mar 16', client: 'Nicole Adams', route: 'Echo Park → Los Feliz', amount: '$750', status: 'Closed', rooms: 1 },
      { date: 'Mar 15', client: 'Mark Wilson', route: 'Culver City → Marina', amount: '$1,100', status: 'Closed', rooms: 2 },
    ],
  },
  conversionRate: {
    rows: [
      { date: 'Mar 23', proposals: 4, closed: 3, rate: '75%', source: 'Referral' },
      { date: 'Mar 22', proposals: 6, closed: 2, rate: '33%', source: 'App' },
      { date: 'Mar 21', proposals: 3, closed: 2, rate: '67%', source: 'App + Web' },
      { date: 'Mar 20', proposals: 5, closed: 1, rate: '20%', source: 'Web' },
      { date: 'Mar 19', proposals: 4, closed: 3, rate: '75%', source: 'Referral' },
      { date: 'Mar 18', proposals: 2, closed: 1, rate: '50%', source: 'App' },
    ],
  },
  proposalsSent: {
    rows: [
      { date: 'Mar 23', client: 'Emma Wilson', route: 'Santa Monica → Westwood', amount: '$980', status: 'Pending', rooms: 2 },
      { date: 'Mar 22', client: 'Chris Lee', route: 'DTLA → Koreatown', amount: '$1,350', status: 'Viewed', rooms: 3 },
      { date: 'Mar 22', client: 'Amy Zhang', route: 'Pasadena → Arcadia', amount: '$620', status: 'Accepted', rooms: 1 },
      { date: 'Mar 21', client: 'David Brown', route: 'Downtown → Koreatown', amount: '$1,450', status: 'Accepted', rooms: 3 },
      { date: 'Mar 20', client: 'Lisa Park', route: 'Burbank → Glendale', amount: '$750', status: 'Declined', rooms: 1 },
      { date: 'Mar 19', client: 'Tom Harris', route: 'Venice → Culver City', amount: '$890', status: 'Pending', rooms: 2 },
      { date: 'Mar 18', client: 'Sarah Johnson', route: 'Hollywood → Pasadena', amount: '$1,850', status: 'Accepted', rooms: 3 },
      { date: 'Mar 17', client: 'Kevin White', route: 'Silver Lake → Echo Park', amount: '$540', status: 'Viewed', rooms: 1 },
    ],
  },
  avgDealSize: {
    rows: [
      { date: 'Mar 23', deals: 3, totalRevenue: '$5,050', avg: '$1,683', trend: '↑' },
      { date: 'Mar 22', deals: 2, totalRevenue: '$3,100', avg: '$1,550', trend: '→' },
      { date: 'Mar 21', deals: 1, totalRevenue: '$1,450', avg: '$1,450', trend: '↓' },
      { date: 'Mar 20', deals: 0, totalRevenue: '$0', avg: '—', trend: '—' },
      { date: 'Mar 19', deals: 1, totalRevenue: '$1,200', avg: '$1,200', trend: '↓' },
      { date: 'Mar 18', deals: 2, totalRevenue: '$3,380', avg: '$1,690', trend: '↑' },
    ],
  },
  salesRevenue: {
    rows: [
      { date: 'Mar 23', deals: 3, revenue: '$5,050', avg: '$1,683', vs: '↑ 18%' },
      { date: 'Mar 22', deals: 2, revenue: '$3,100', avg: '$1,550', vs: '↓ 5%' },
      { date: 'Mar 21', deals: 1, revenue: '$1,450', avg: '$1,450', vs: '↑ 8%' },
      { date: 'Mar 20', deals: 0, revenue: '$0', avg: '—', vs: '↓ 100%' },
      { date: 'Mar 19', deals: 1, revenue: '$1,200', avg: '$1,200', vs: '→ 0%' },
      { date: 'Mar 18', deals: 2, revenue: '$3,380', avg: '$1,690', vs: '↑ 22%' },
    ],
  },
};

/* Proposal status badge helper */
const ProposalStatusBadge = ({ status }: { status: string }) => {
  const isAccepted = status === 'Accepted';
  const isPending = status === 'Pending';
  const isViewed = status === 'Viewed';
  const isDeclined = status === 'Declined';
  const bg = isAccepted ? colors.success[50] : isPending ? colors.primary[50] : isViewed ? ACCENT_ORANGE + '15' : '#FEF3F2';
  const fg = isAccepted ? colors.success[500] : isPending ? colors.primary[500] : isViewed ? ACCENT_ORANGE : colors.error[500];
  return (
    <span style={{
      fontFamily: F, fontSize: 11, fontWeight: 700, color: fg,
      backgroundColor: bg, padding: '4px 10px', borderRadius: 8,
    } as any}>{status}</span>
  );
};

/* Sales Detail Screen */
const SalesDetailScreen: React.FC<{
  metric: SalesMetricKey;
  onBack: () => void;
  onDealPress?: (deal: SalesDealData) => void;
}> = ({ metric, onBack, onDealPress }) => {
  const config = SALES_METRIC_CONFIG[metric];
  const data = SALES_DRILL_DOWN[metric];
  const [filterPeriod, setFilterPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const summaryValue =
    metric === 'dealsClosed' ? (filterPeriod === '7d' ? '8' : filterPeriod === '30d' ? '32' : '89') :
    metric === 'conversionRate' ? (filterPeriod === '7d' ? '44%' : filterPeriod === '30d' ? '41%' : '38%') :
    metric === 'proposalsSent' ? (filterPeriod === '7d' ? '18' : filterPeriod === '30d' ? '78' : '215') :
    metric === 'avgDealSize' ? (filterPeriod === '7d' ? '$1,550' : filterPeriod === '30d' ? '$1,650' : '$1,580') :
    (filterPeriod === '7d' ? '$12,400' : filterPeriod === '30d' ? '$52,800' : '$140,500');

  const periodLabel = filterPeriod === '7d' ? 'Last 7 Days' : filterPeriod === '30d' ? 'Last 30 Days' : 'Last 90 Days';

  const renderRow = (row: any, i: number) => {
    if (metric === 'dealsClosed') return (
      <div key={i} className="sales-card-interactive" onClick={() => onDealPress?.({ client: row.client, route: row.route, amount: parseInt(row.amount.replace(/[$,]/g, '')), rooms: row.rooms, date: row.date, status: 'closed', distance: '10 mi', duration: '3.5h', crew: 2, clientPhone: '(310) 555-0100', notes: '' })} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8, cursor: 'pointer' } as any}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row.client}</span>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{row.amount}</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block' } as any}>{row.route} · {row.rooms} rooms</span>
        <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>{row.date}</span>
      </div>
    );
    if (metric === 'conversionRate') return (
      <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row.date}</span>
          <span style={{
            fontFamily: F, fontSize: 14, fontWeight: 700,
            color: parseInt(row.rate) >= 50 ? colors.success[500] : colors.gray[700],
          } as any}>{row.rate}</span>
        </div>
        <div style={{ display: 'flex', gap: 16 } as any}>
          <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500] } as any}>{row.proposals} proposals</span>
          <span style={{ fontFamily: F, fontSize: 13, color: colors.success[500] } as any}>{row.closed} closed</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>Source: {row.source}</span>
      </div>
    );
    if (metric === 'proposalsSent') {
      const isClickable = row.status === 'Accepted' && onDealPress;
      return (
      <div key={i} className={isClickable ? 'sales-card-interactive' : undefined} onClick={isClickable ? () => onDealPress({ client: row.client, route: row.route, amount: parseInt(row.amount.replace(/[$,]/g, '')), rooms: row.rooms, date: row.date, status: 'closed', distance: '8 mi', duration: '3.0h', crew: 2, clientPhone: '(310) 555-0100', notes: '' }) : undefined} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8, ...(isClickable ? { cursor: 'pointer' } : {}) } as any}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row.client}</span>
          <ProposalStatusBadge status={row.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
          <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500] } as any}>{row.route}</span>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{row.amount}</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>{row.date} · {row.rooms} rooms</span>
      </div>
    );}

    if (metric === 'avgDealSize') return (
      <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row.date}</span>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{row.avg}</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block' } as any}>{row.deals} deals · {row.totalRevenue} total revenue · {row.trend}</span>
      </div>
    );
    /* salesRevenue */
    return (
      <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row.date}</span>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.primary[500] } as any}>{row.revenue}</span>
        </div>
        <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block' } as any}>{row.deals} deals · Avg {row.avg} · {row.vs}</span>
      </div>
    );
  };

  return (
    <AnimatedPage direction="right" duration={0.3}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F5F5F7' } as any}>
      {/* Nav bar — iOS HIG */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 16px',
        backgroundColor: '#F5F5F7', position: 'relative', minHeight: 44,
      } as any}>
        <div onClick={onBack} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', zIndex: 1 } as any}>
          <BackIcon />
        </div>
        <span style={{
          fontFamily: F, fontSize: 17, fontWeight: 600, color: colors.gray[900],
          position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
        } as any}>
          {config.title}
        </span>
      </div>

      {/* Filter Chips */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '4px 16px 12px', gap: 8,
        overflowX: 'auto', scrollbarWidth: 'none',
      } as any}>
        {(['7d', '30d', '90d'] as const).map(p => (
          <div
            className="sales-chip"
            key={p}
            onClick={() => setFilterPeriod(p)}
            style={{
              height: 36, borderRadius: 12, cursor: 'pointer',
              backgroundColor: filterPeriod === p ? colors.primary[500] : '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 16px', whiteSpace: 'nowrap', flexShrink: 0,
            } as any}
          >
            <span style={{
              fontFamily: F, fontSize: 13, fontWeight: 600,
              color: filterPeriod === p ? '#FFFFFF' : colors.gray[600],
            } as any}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </span>
          </div>
        ))}
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 0' } as any}>
        {/* Summary Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px', marginBottom: 16 } as any}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 } as any}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              backgroundColor: `${config.color}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            } as any}>
              {config.icon}
            </div>
            <div style={{ flex: 1 } as any}>
              <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], display: 'block' } as any}>
                {periodLabel}
              </span>
              <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -0.5, marginTop: 2 } as any}>
                {summaryValue}
              </span>
            </div>
            <span style={{
              fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.success[500],
              backgroundColor: colors.success[50], padding: '6px 12px', borderRadius: 12,
            } as any}>
              ↑ Trending
            </span>
          </div>
        </div>

        {/* Row List */}
        {data.rows.map((row, i) => (
          <StaggerItem key={i} index={i}>{renderRow(row, i)}</StaggerItem>
        ))}

        <div style={{ height: 48 } as any} />
      </div>
    </div>
    </AnimatedPage>
  );
};

/* ═══════════════════════════════════════════
   Status Badge Helper
   ═══════════════════════════════════════════ */

const StatusBadge = ({ status }: { status: string }) => {
  const isClosed = status === 'closed';
  const isProposal = status === 'proposal';
  const isNegotiation = status === 'negotiation';
  const isLost = status === 'lost';

  const bg = isClosed ? colors.success[50] : isProposal ? colors.primary[50] : isNegotiation ? ACCENT_ORANGE + '15' : '#FEF3F2';
  const fg = isClosed ? colors.success[500] : isProposal ? colors.primary[500] : isNegotiation ? ACCENT_ORANGE : colors.error[500];
  const label = isClosed ? 'Closed' : isProposal ? 'Proposal' : isNegotiation ? 'Negotiating' : 'Lost';

  return (
    <span style={{
      fontFamily: F, fontSize: 11, fontWeight: 700, color: fg,
      backgroundColor: bg, padding: '4px 10px', borderRadius: 8,
    } as any}>{label}</span>
  );
};

/* ═══════════════════════════════════════════
   Notification Icon Helper
   ═══════════════════════════════════════════ */

const SalesNotifIcon = ({ type }: { type: string }) => {
  const c = colors.primary[500];
  switch (type) {
    case 'success':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={colors.success[500]} strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'lead':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'reminder':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.warning[500]} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={colors.warning[500]} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'info':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="2"/><path d="M12 16V12M12 8H12.01" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'warning':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 20H22L12 2Z" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9V13M12 17H12.01" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round"/></svg>;
    default:
      return null;
  }
};

/* ═══════════════════════════════════════════
   Notifications Bottom Sheet
   ═══════════════════════════════════════════ */

const SalesNotificationsPanel = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const sheetRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ startY: number } | null>(null);

  React.useEffect(() => {
    if (visible) { setMounted(true); setClosing(false); }
  }, [visible]);

  const handleClose = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => { setMounted(false); setClosing(false); onClose(); }, 280);
  }, [onClose]);

  const onDown = (e: any) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY };
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };
  const onMove = (e: any) => {
    if (!dragRef.current) return;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onUp = (e: any) => {
    if (!dragRef.current) return;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current = null;
    if (dy > 80) { handleClose(); }
    else if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 0.28s cubic-bezier(0.16,1,0.3,1)';
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  if ((!visible && !mounted) || Platform.OS !== 'web') return null;

  const today = SALES_NOTIFS.filter(n => n.group === 'today');
  const earlier = SALES_NOTIFS.filter(n => n.group === 'earlier');

  const renderGroup = (items: any[], label: string) => (
    <div style={{ paddingTop: 16 } as any}>
      <span style={{
        fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[400],
        textTransform: 'uppercase', letterSpacing: 0.8,
        paddingLeft: 20, paddingBottom: 10, display: 'block',
      } as any}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16, paddingRight: 16 } as any}>
        {items.map(n => (
          <div key={n.id} style={{
            display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
            padding: 14, borderRadius: 16,
            backgroundColor: colors.gray[50],
          } as any}>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: colors.gray[100],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginRight: 12,
            } as any}>
              <SalesNotifIcon type={n.type} />
            </div>
            <div style={{ flex: 1, minWidth: 0 } as any}>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{n.title}</span>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: colors.gray[500], marginTop: 3, display: 'block', lineHeight: '20px' } as any}>{n.body}</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], marginLeft: 10, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 } as any}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <View style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 300 } as any}>
      <Pressable onPress={handleClose} style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 } as any}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          animation: closing ? 'cFadeOut 0.28s ease forwards' : 'cFadeIn 0.28s ease forwards',
        } as any} />
      </Pressable>
      <div
        ref={sheetRef as any}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          maxHeight: '65%', backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          display: 'flex', flexDirection: 'column',
          animation: closing ? 'cSheetDown 0.28s ease forwards' : 'cSheetUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
        } as any}
      >
        {/* Drag handle */}
        <div
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8, cursor: 'grab', touchAction: 'none' } as any}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] } as any} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 20, paddingRight: 20, paddingBottom: 12,
        } as any}>
          <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
            Notifications
          </span>
          <Pressable onPress={handleClose} hitSlop={8}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Pressable>
        </div>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {today.length > 0 && renderGroup(today, 'Today')}
          {earlier.length > 0 && renderGroup(earlier, 'Earlier')}
          <View style={{ height: 24 }} />
        </ScrollView>
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

export interface SalesDashboardScreenProps {
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
}

export const SalesDashboardScreen: React.FC<SalesDashboardScreenProps> = ({
  onTabPress,
  onBack,
}) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [notifVisible, setNotifVisible] = useState(false);
  const [selectedChartBar, setSelectedChartBar] = useState<number | null>(null);
  const [drillDown, setDrillDown] = useState<SalesMetricKey | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<SalesDealData | null>(null);

  useEffect(() => { injectAnimationCSS(); }, []);

  if (Platform.OS !== 'web') return null;

  const d = DATA[period];
  const maxRev = Math.max(...d.chart.map(c => c.value));
  const totalChart = d.chart.reduce((s, c) => s + c.value, 0);

  const MetricCard = ({ label, value, sub, color, icon, metric }: {
    label: string; value: string; sub?: string; color: string; icon: React.ReactNode; metric: SalesMetricKey;
  }) => (
    <div
      className="sales-card-interactive"
      onClick={() => setDrillDown(metric)}
      style={{
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
        padding: '16px 14px', minWidth: 0, cursor: 'pointer',
      } as any}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 } as any}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        } as any}>
          {icon}
        </div>
        <AnimatedNumber value={value} style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: colors.gray[900], flex: 1, letterSpacing: -0.5 }} />
        <ChevronRightIcon color={colors.gray[200]} />
      </div>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block' } as any}>
        {label}
      </span>
      {sub && (
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color, display: 'block', marginTop: 4 } as any}>
          {sub}
        </span>
      )}
    </div>
  );

  return (
    <SafeAreaView style={[s.safeArea, (drillDown || selectedDeal) && { backgroundColor: '#F5F5F7' }]}>
      <View style={[s.container, (drillDown || selectedDeal) && { backgroundColor: '#F5F5F7' }]}>
        <StatusBarMock onTimeTap={onBack} />

        {selectedDeal ? (
          <MoveDetailScreenBase
            move={dealToMoveDetail(selectedDeal)}
            role="sales"
            onBack={() => setSelectedDeal(null)}
          />
        ) : drillDown ? (
          <SalesDetailScreen metric={drillDown} onBack={() => setDrillDown(null)} onDealPress={(deal) => setSelectedDeal(deal)} />
        ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '12px 16px 120px' } as any}>

            {/* ── Header with greeting & bell ── */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, animation: 'fadeIn 0.4s ease both' } as any}>
              <div>
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[400], display: 'block' } as any}>
                  Hey, Alex 👋
                </span>
                <span style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: colors.gray[900], display: 'block', marginTop: 2, letterSpacing: -0.5 } as any}>
                  Sales Dashboard
                </span>
              </div>
              <div
                onClick={() => setNotifVisible(true)}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative',
                } as any}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" fill={colors.gray[700]} stroke={colors.gray[700]} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[500], border: '2px solid #FFFFFF' } as any} />
              </div>
            </div>

            {/* ── Total Sales Revenue Hero Card ── */}
            <div
              className="sales-card-interactive"
              onClick={() => setDrillDown('salesRevenue')}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: 16,
                padding: '20px', marginBottom: 12, cursor: 'pointer',
                animation: 'fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
              } as any}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as any}>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[400] } as any}>
                  Total Sales
                </span>
                <ChevronRightIcon color={colors.gray[200]} />
              </div>
              <AnimatedNumber value={`$${d.salesRevenue.toLocaleString()}`} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -1 }} />
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.success[500], display: 'block', marginTop: 6 } as any}>
                {d.revenueTrend}
              </span>

              {/* Period toggle */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 } as any}>
                {(['week', 'month'] as const).map(p => (
                  <div
                    className="sales-chip"
                    key={p}
                    onClick={(e: any) => { e.stopPropagation(); setPeriod(p); }}
                    style={{
                      padding: '6px 16px', borderRadius: 12, cursor: 'pointer',
                      backgroundColor: period === p ? colors.primary[500] : '#EFF2F7',
                    } as any}
                  >
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: period === p ? '#FFFFFF' : colors.gray[600] } as any}>
                      {p === 'week' ? 'This Week' : 'This Month'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Key Metrics Grid (2x2) ── */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.08s both' } as any}>
              <MetricCard
                label="Deals Closed"
                value={String(d.dealsClosed)}
                sub={d.dealsClosedTrend}
                color={colors.primary[500]}
                icon={<ClipboardIcon color={colors.primary[500]} />}
                metric="dealsClosed"
              />
              <MetricCard
                label="Conversion Rate"
                value={d.conversionRate}
                sub={d.conversionSub}
                color={colors.success[500]}
                icon={<SyncIcon color={colors.success[500]} />}
                metric="conversionRate"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.14s both' } as any}>
              <MetricCard
                label="Proposals Sent"
                value={String(d.proposalsSent)}
                sub={d.proposalsTrend}
                color={colors.warning[500]}
                icon={<StarIcon color={colors.warning[500]} />}
                metric="proposalsSent"
              />
              <MetricCard
                label="Avg Deal Size"
                value={d.avgDealSize}
                sub={d.avgDealSub}
                color={ACCENT_PURPLE}
                icon={<MoneyBagIcon color={ACCENT_PURPLE} />}
                metric="avgDealSize"
              />
            </div>

            {/* ── Sales Chart ── */}
            <div
              className="sales-card-interactive"
              onClick={() => setDrillDown('salesRevenue')}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12, cursor: 'pointer', animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s both' } as any}
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } as any}>
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{d.chartLabel}</span>
                <ChevronRightIcon color={colors.gray[200]} />
              </div>
              <AnimatedNumber value={`$${totalChart.toLocaleString()}`} style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: colors.gray[900], display: 'block', marginBottom: 16, letterSpacing: -0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120 } as any}>
                {d.chart.map((c, i) => {
                  const h = Math.max((c.value / maxRev) * 100, 8);
                  const isSelected = selectedChartBar === i;
                  const isMax = c.value === maxRev;
                  return (
                    <div
                      key={i}
                      onClick={(e: any) => { e.stopPropagation(); setSelectedChartBar(isSelected ? null : i); }}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' } as any}
                    >
                      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: isSelected ? colors.primary[500] : colors.gray[400] } as any}>
                        ${c.value >= 1000 ? (c.value / 1000).toFixed(1) + 'k' : c.value}
                      </span>
                      <div style={{
                        width: '100%', height: h, borderRadius: 8,
                        backgroundColor: isSelected ? colors.primary[600] : isMax ? colors.primary[500] : colors.primary[100],
                        transition: 'height 0.3s ease, background-color 0.2s ease',
                        transform: isSelected ? 'scaleX(1.1)' : 'scaleX(1)',
                      } as any} />
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: isSelected ? 700 : 500, color: isSelected ? colors.primary[500] : colors.gray[400] } as any}>
                        {c.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              {selectedChartBar !== null && (
                <div style={{
                  marginTop: 12, padding: '12px 14px', backgroundColor: '#EFF2F7', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                } as any}>
                  <div>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[900], display: 'block' } as any}>
                      {d.chart[selectedChartBar].day}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500], marginTop: 2, display: 'block' } as any}>
                      ${d.chart[selectedChartBar].value.toLocaleString()} revenue
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Recent Deals List ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.26s both' } as any}>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 14 } as any}>
                Recent Deals
              </span>
              {RECENT_DEALS.map((deal, i) => (
                <StaggerItem key={deal.id} index={i}>
                <div
                  className="sales-deal-row"
                  onClick={() => setSelectedDeal({ client: deal.client, route: deal.route, amount: deal.amount, rooms: deal.rooms, date: deal.date, status: deal.status, distance: (deal as any).distance || '8 mi', duration: (deal as any).duration || '3h', crew: (deal as any).crew || 2, clientPhone: (deal as any).clientPhone || '(310) 555-0100', notes: (deal as any).notes || '' })}
                  style={{
                    padding: '12px 4px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
                  } as any}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 12,
                    backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  } as any}>
                    <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: colors.primary[500] } as any}>
                      {deal.client.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 } as any}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 } as any}>
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: colors.gray[900] } as any}>
                        {deal.client}
                      </span>
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[900], flexShrink: 0 } as any}>
                        ${deal.amount}
                      </span>
                    </div>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500], display: 'block' } as any}>
                      {deal.route} · {deal.rooms} rooms
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 } as any}>
                      <StatusBadge status={deal.status} />
                      <span style={{ fontFamily: F, fontSize: 11, color: colors.gray[400] } as any}>
                        {deal.date}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon color={colors.gray[200]} />
                </div>
                </StaggerItem>
              ))}
            </div>

          </div>
        </ScrollView>
        )}

        <TabBar active="dashboard" onTabPress={onTabPress} role="sales" />

        {/* Notifications bottom sheet */}
        <SalesNotificationsPanel visible={notifVisible} onClose={() => setNotifVisible(false)} />
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
