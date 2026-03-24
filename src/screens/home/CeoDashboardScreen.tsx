/**
 * AI Moving — CEO Dashboard Screen
 *
 * Enhanced analytics dashboard for company leadership.
 * Sections:
 * 1. Revenue overview (total + trend) with week/month toggle
 * 2. Key metrics cards (orders, rating, conversion, avg check) — tappable
 * 3. Weekly/Monthly revenue chart (bar chart)
 * 4. Team utilization
 * 5. Top movers leaderboard
 * 6. Bottom stats row
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

/* Semantic accent colors (not in core palette but used consistently) */
const ACCENT_PURPLE = '#7C3AED';   // avgCheck accent

/* ═══════════════════════════════════════════
   Icon components — from user's Icons folder
   (Star, Sync, Money-bag, Add-Product, Cards-with-dollar)
   ═══════════════════════════════════════════ */

/* Star — for Rating (from star.svg) */
const StarIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="-15 -12 100 100" fill={color}>
    <g transform="matrix(.957 0 0 .957 15.652 11.478)"><path clipRule="evenodd" d="m34.669548-8.4613094c.1628304-.5473452.6672783-.9250927 1.2395058-.9250927s1.0766754.3777475 1.2395058.9250927c0 0 2.2686234 7.6043649 4.7001495 15.7606297 3.8745232 12.9943981 14.0393524 23.1591949 27.0337143 27.0337181 8.1562347 2.4315262 15.7605972 4.7001457 15.7605972 4.7001457.5473785.1628342.9250946.6672783.9250946 1.2395096 0 .5722275-.3777161 1.0766716-.9250946 1.2395058 0 0-7.6043625 2.2686234-15.7605972 4.7001495-12.9943619 3.8745193-23.1591911 14.0393524-27.0337143 27.0337143-2.4315262 8.1562347-4.7001495 15.7605972-4.7001495 15.7605972-.1628304.5473785-.6672783.9250946-1.2395058.9250946s-1.0766754-.3777161-1.2395058-.9250946c0 0-2.2686234-7.6043625-4.7001495-15.7605972-3.8745213-12.9943619-14.0393543-23.159195-27.033716-27.0337144-8.1562309-2.4315262-15.7605953-4.7001495-15.7605953-4.7001495-.5473795-.1628342-.9250927-.6672783-.9250927-1.2395058 0-.5722313.3777132-1.0766754.9250927-1.2395096 0 0 7.6043644-2.2686195 15.7605953-4.7001457 12.9943619-3.8745232 23.1591969-14.03932 27.0337162-27.0337181 2.431526-8.1562649 4.7001493-15.7606296 4.7001493-15.7606296z" fillRule="evenodd"/></g>
  </svg>
);

/* Sync / Arrows — for Conversion (from sync.svg) */
const SyncIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 491.5 491.5" fill={color}>
    <path d="m437 94.3-22.7 21.4c-3.5 3.3-8.8 3.4-11.5-.5-59.6-83.6-174.2-109.8-264.9-57.4-51.3 29.6-84.6 78.4-96.2 132-.7 3.4 0 6.7 2.3 9.4 2.2 2.7 5.2 4.1 8.8 4.1l33.4-.3c5.1 0 9.4-3.4 10.7-8.3 9.7-36.5 33.3-69.2 68.5-89.6 63.7-36.8 143.6-20.4 188.1 35.5 3.5 4.3.9 10.1-4.4 11.8l-27.3 8.5c-8.7 2.7-11.2 14.3-2.9 18.2l109.9 50.9c6.7 3.1 13.8-1.1 14.5-8.4l10.9-120.6c.8-9.2-10.6-12.9-17.2-6.7z"/>
    <path d="m438.8 288.2-33.4.3c-5.1 0-9.4 3.4-10.7 8.3-9.7 36.5-33.3 69.2-68.5 89.6-63.7 36.8-143.6 20.4-188.1-35.5-3.5-4.3-.9-10.1 4.4-11.8l27.3-8.5c8.7-2.7 11.2-14.3 2.9-18.2l-110-50.8c-6.7-3.1-13.8 1.1-14.5 8.4l-10.9 120.6c-.8 9.1 10.5 12.9 17.2 6.6l22.7-21.4c3.5-3.3 8.8-3.4 11.5.5 59.6 83.6 174.1 109.8 264.8 57.4 51.3-29.6 84.6-78.4 96.2-132 .7-3.4 0-6.7-2.3-9.4-2-2.7-5.1-4.1-8.6-4.1z"/>
  </svg>
);

/* Money bag — for Avg Check (from money-bag.svg) */
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

/* Add Product — for Orders (from add-product.svg) */
const ClipboardIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill={color}>
    <path d="m22.7242928 2.0350215h-5.7215595v5.3175611c0 .5241585-.5896702.8407869-1.026392.5459514l-1.408597-.9390202c-.34935-.2293239-.7970676-.2293239-1.1355553 0l-1.4194603.9390202c-.4367876.2948346-1.015461-.0217929-1.015461-.5459514v-5.3175611h-5.7215595c-1.8125958 0-3.2757082 1.4741087-3.2757082 3.2757085v17.37854c0 1.8125954 1.4631124 3.2757092 3.2757082 3.2757092h17.4485855c1.8015986 0 3.2757063-1.4631138 3.2757063-3.2757092v-17.37854c0-1.8015998-1.4741077-3.2757085-3.2757072-3.2757085zm-6.169344 16.8337224c-.0005341 0-.0010662 0-.0010662 0l-1.4661121-.001667-.0016661 1.4662457c-.0005331.6029987-.4894361 1.0908356-1.0919027 1.0908356-.0005331 0-.0010662 0-.0010662 0-.6029987-.0005322-1.0913696-.4899693-1.0908365-1.092968l.0016661-1.4666443-1.4657106-.001667c-.6029997-.0005322-1.0913696-.4899693-1.0908365-1.092968.0005331-.6030006.4894361-1.0908375 1.0919027-1.0908375h.0010662l1.4661112.001667.0016661-1.4657116c.0005331-.6029997.4894371-1.0908365 1.0919027-1.0908365h.0010662c.6029987.0005331 1.0913696.4899693 1.0908365 1.0929689l-.0016661 1.4661102 1.4657116.001667c.6029987.0005322 1.0913696.4899693 1.0908356 1.092968-.0005323.6030007-.4894372 1.0908375-1.0919019 1.0908375z"/>
  </svg>
);

/* Cards with dollar sign — for Revenue (from cards-with-dollar-sign.svg) */
const CardDollarIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 467.6 467.6" fill={color}>
    <path d="M209.3,219.916c4.3-3.7,10.4-6.1,18.4-6.7v45.899c-9.8-3.1-16.5-6.699-20.2-9.8c-3.7-3.7-5.5-8-5.5-14.1 C202.6,229.116,205,224.216,209.3,219.916z M388.6,72.416c-8-29.4-31.199-40.4-58.1-33L93,103.016h303.6L388.6,72.416z M467.6,178.916v204.4c0,26.3-20.8,47.101-47.1,47.101H47.1c-26.3,0-47.1-20.801-47.1-47.101v-204.4c0-26.3,20.8-47.1,47.1-47.1 h373.3C446.2,131.815,467.6,153.216,467.6,178.916z M304.8,318.415c0-15.301-4.899-26.899-14.7-35.5 c-9.8-8.601-24.5-14.699-44.699-19H244.8v-49.601c13.5,1.8,26.3,7.3,37.9,15.3l17.1-24.5c-17.1-11.6-35.5-18.4-55.1-19.6v-13.5 h-17.1l0,0v12.9c-17.1,0.6-30.6,6.1-41.6,15.9c-10.4,9.8-15.9,22-15.9,37.3s4.9,26.9,14.1,34.3c9.2,8,23.9,14.102,43.5,19v51.4 c-15.9-2.4-30.6-10.4-45.9-23.3l-19.6,23.3c19,16.5,41,26.3,64.9,28.8v19.602h17.1v-19c17.699-.602,32.398-6.102,43.5-15.9 C299.3,346.016,304.8,333.716,304.8,318.415z M244.8,295.815v47.7c8.601-.601,15.3-3.101,20.2-7.3 c4.899-4.301,7.3-9.2,7.3-15.301s-1.8-11-5.5-14.699C262.6,302.516,255.8,298.915,244.8,295.815z"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Animations — global CSS keyframes + helpers
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

/* Interactive hover / press effects */
.ceo-card-interactive {
  transition: transform 0.18s ease, background-color 0.2s ease;
}
.ceo-card-interactive:hover {
  transform: scale(1.015);
}
.ceo-card-interactive:active {
  transform: scale(0.975);
}
.ceo-mover-row {
  transition: background-color 0.18s ease, transform 0.15s ease;
  border-radius: 12px;
}
.ceo-mover-row:hover {
  background-color: #F9FAFB;
}
.ceo-mover-row:active {
  transform: scale(0.98);
}
.ceo-chip {
  transition: background-color 0.2s ease, transform 0.15s ease;
}
.ceo-chip:hover {
  transform: scale(1.04);
}
.ceo-chip:active {
  transform: scale(0.95);
}
.ceo-btn-primary {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.ceo-btn-primary:hover {
  opacity: 0.92;
}
.ceo-btn-primary:active {
  transform: scale(0.97);
}
`;

/* Inject animation CSS once */
let cssInjected = false;
const injectAnimationCSS = () => {
  if (cssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = ANIMATION_CSS;
  document.head.appendChild(style);
  cssInjected = true;
};

/* Animated page wrapper — slides in from right by default */
const AnimatedPage: React.FC<{
  direction?: 'right' | 'left' | 'up' | 'fade';
  duration?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ direction = 'right', duration = 0.32, children, style }) => {
  const anim = direction === 'right' ? 'slideInRight' :
               direction === 'left' ? 'slideInLeft' :
               direction === 'up' ? 'fadeInUp' : 'fadeIn';
  return (
    <div style={{
      animation: `${anim} ${duration}s cubic-bezier(0.22, 1, 0.36, 1) both`,
      height: '100%', display: 'flex', flexDirection: 'column',
      ...style,
    } as any}>
      {children}
    </div>
  );
};

/* Staggered fade-in for list items */
const StaggerItem: React.FC<{
  index: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ index, children, style }) => (
  <div style={{
    animation: `fadeInUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both`,
    animationDelay: `${index * 0.05}s`,
    ...style,
  } as any}>
    {children}
  </div>
);

/* Animated number — smoothly counts up on mount / value change */
const AnimatedNumber: React.FC<{
  value: string;
  style: React.CSSProperties;
}> = ({ value, style }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;

    // Parse numeric part for counting animation
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
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      const formatted = isDecimal ? current.toFixed(numMatch[2].split('.')[1]?.length || 1) :
                        hasComma ? Math.round(current).toLocaleString() :
                        String(Math.round(current));
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (frame < totalFrames) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  // Initial mount — just set directly
  useEffect(() => { setDisplay(value); }, []);

  return <span style={style as any}>{display}</span>;
};

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type MetricKey = 'orders' | 'rating' | 'conversion' | 'avgCheck' | 'revenue' | 'onTime' | 'cancellation' | 'avgTime';

interface CeoDashboardScreenProps {
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Mock data — week vs month
   ═══════════════════════════════════════════ */

const DATA = {
  week: {
    revenue: 23100,
    revenueTrend: '↑ 8.2% vs last week',
    orders: 42,
    ordersSub: '↑ 8 vs last week',
    rating: '4.87',
    ratingSub: 'Top 5% in LA',
    conversion: '68%',
    conversionSub: 'Requests → Orders',
    avgCheck: '$550',
    avgCheckSub: '↑ $18 vs last week',
    onTime: '96%',
    cancellation: '2.1%',
    avgMoveTime: '3.8h',
    chart: [
      { day: 'Mon', value: 2400 },
      { day: 'Tue', value: 3100 },
      { day: 'Wed', value: 2800 },
      { day: 'Thu', value: 4200 },
      { day: 'Fri', value: 3600 },
      { day: 'Sat', value: 5100 },
      { day: 'Sun', value: 1900 },
    ],
    chartLabel: 'Weekly Revenue',
  },
  month: {
    revenue: 124800,
    revenueTrend: '↑ 12.5% vs last month',
    orders: 186,
    ordersSub: '↑ 23 vs last month',
    rating: '4.82',
    ratingSub: 'Top 8% in LA',
    conversion: '64%',
    conversionSub: 'Requests → Orders',
    avgCheck: '$670',
    avgCheckSub: '↑ $32 vs last month',
    onTime: '94%',
    cancellation: '3.2%',
    avgMoveTime: '4.2h',
    chart: [
      { day: 'W1', value: 28400 },
      { day: 'W2', value: 31200 },
      { day: 'W3', value: 34700 },
      { day: 'W4', value: 30500 },
    ],
    chartLabel: 'Monthly Revenue',
  },
};

const TOP_MOVERS = [
  { name: 'Dmitriy K.', moves: 34, rating: 4.9, revenue: 18200 },
  { name: 'Alex M.', moves: 28, rating: 4.8, revenue: 15600 },
  { name: 'James L.', moves: 22, rating: 4.7, revenue: 12400 },
  { name: 'Carlos R.', moves: 19, rating: 4.9, revenue: 10800 },
];

/* Mock employee detail data */
interface JobData {
  date: string; client: string; route: string; amount: string; rating: string;
  status: 'Completed' | 'In Progress';
  rooms: number; distance: string; duration: string;
  crew: number; items: string;
  clientPhone: string; notes: string;
}

const MOVER_DETAILS: Record<string, {
  onTime: string; cancellation: string; avgTime: string;
  rating: string; totalRevenue: number; completedMoves: number;
  recentJobs: JobData[];
}> = {
  'Dmitriy K.': {
    onTime: '98%', cancellation: '0.8%', avgTime: '3.4h',
    rating: '4.9', totalRevenue: 18200, completedMoves: 34,
    recentJobs: [
      { date: 'Mar 23', client: 'Sarah J.', route: 'Hollywood → Pasadena', amount: '$780', rating: '5.0', status: 'Completed', rooms: 3, distance: '12 mi', duration: '3.5h', crew: 2, items: '42 boxes, 6 furniture', clientPhone: '(310) 555-0142', notes: 'Fragile items in bedroom' },
      { date: 'Mar 22', client: 'Tom W.', route: 'Venice → Beverly Hills', amount: '$920', rating: '5.0', status: 'Completed', rooms: 3, distance: '8 mi', duration: '4.0h', crew: 3, items: '55 boxes, 8 furniture', clientPhone: '(310) 555-0198', notes: 'Piano on 2nd floor' },
      { date: 'Mar 21', client: 'David C.', route: 'Westwood → Culver City', amount: '$670', rating: '4.8', status: 'Completed', rooms: 2, distance: '5 mi', duration: '2.8h', crew: 2, items: '30 boxes, 4 furniture', clientPhone: '(424) 555-0267', notes: 'No elevator, 3rd floor' },
      { date: 'Mar 20', client: 'Jason M.', route: 'Brentwood → Marina', amount: '$1,100', rating: '4.9', status: 'Completed', rooms: 4, distance: '6 mi', duration: '5.1h', crew: 3, items: '68 boxes, 12 furniture', clientPhone: '(310) 555-0334', notes: 'Large dining table, needs wrapping' },
    ],
  },
  'Alex M.': {
    onTime: '95%', cancellation: '1.2%', avgTime: '3.8h',
    rating: '4.8', totalRevenue: 15600, completedMoves: 28,
    recentJobs: [
      { date: 'Mar 23', client: 'Mike R.', route: 'DTLA → Santa Monica', amount: '$1,250', rating: '4.7', status: 'In Progress', rooms: 4, distance: '18 mi', duration: '5.2h', crew: 3, items: '72 boxes, 10 furniture', clientPhone: '(213) 555-0411', notes: 'Office move, fragile electronics' },
      { date: 'Mar 22', client: 'Lisa K.', route: 'Burbank → Glendale', amount: '$540', rating: '4.8', status: 'Completed', rooms: 2, distance: '4 mi', duration: '2.1h', crew: 2, items: '24 boxes, 3 furniture', clientPhone: '(818) 555-0523', notes: '' },
      { date: 'Mar 20', client: 'Jason M.', route: 'Brentwood → Marina', amount: '$1,100', rating: '4.9', status: 'Completed', rooms: 4, distance: '6 mi', duration: '4.8h', crew: 3, items: '68 boxes, 12 furniture', clientPhone: '(310) 555-0334', notes: 'Large dining table' },
    ],
  },
  'James L.': {
    onTime: '92%', cancellation: '2.5%', avgTime: '4.1h',
    rating: '4.7', totalRevenue: 12400, completedMoves: 22,
    recentJobs: [
      { date: 'Mar 22', client: 'Tom W.', route: 'Venice → Beverly Hills', amount: '$920', rating: '4.6', status: 'Completed', rooms: 3, distance: '8 mi', duration: '4.0h', crew: 2, items: '50 boxes, 7 furniture', clientPhone: '(310) 555-0198', notes: '' },
      { date: 'Mar 21', client: 'Anna P.', route: 'Silver Lake → Echo Park', amount: '$380', rating: '4.8', status: 'Completed', rooms: 1, distance: '3 mi', duration: '1.5h', crew: 2, items: '15 boxes, 2 furniture', clientPhone: '(323) 555-0617', notes: 'Studio apartment' },
    ],
  },
  'Carlos R.': {
    onTime: '97%', cancellation: '0.5%', avgTime: '3.6h',
    rating: '4.9', totalRevenue: 10800, completedMoves: 19,
    recentJobs: [
      { date: 'Mar 21', client: 'Anna P.', route: 'Silver Lake → Echo Park', amount: '$380', rating: '5.0', status: 'Completed', rooms: 1, distance: '3 mi', duration: '1.5h', crew: 2, items: '15 boxes, 2 furniture', clientPhone: '(323) 555-0617', notes: 'Studio apartment' },
      { date: 'Mar 19', client: 'Grace L.', route: 'WeHo → Culver City', amount: '$720', rating: '4.9', status: 'Completed', rooms: 2, distance: '7 mi', duration: '3.2h', crew: 2, items: '35 boxes, 5 furniture', clientPhone: '(424) 555-0789', notes: 'Parking tricky on destination street' },
    ],
  },
};

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={colors.primary[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = ({ color = colors.gray[300] }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M16 2V6M8 2V6M3 10H21" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Drill-down detail screen
   ═══════════════════════════════════════════ */

interface DetailConfig {
  title: string;
  color: string;
  icon: React.ReactNode;
}

const METRIC_CONFIG: Record<MetricKey, DetailConfig> = {
  orders: { title: 'Orders', color: colors.primary[500], icon: <ClipboardIcon color={colors.primary[500]} size={20} /> },
  rating: { title: 'Avg Rating', color: colors.warning[500], icon: <StarIcon color={colors.warning[500]} size={20} /> },
  conversion: { title: 'Conversion Rate', color: colors.success[500], icon: <SyncIcon color={colors.success[500]} size={20} /> },
  avgCheck: { title: 'Avg Check', color: ACCENT_PURPLE, icon: <MoneyBagIcon color={ACCENT_PURPLE} size={20} /> },
  revenue: { title: 'Revenue', color: colors.primary[500], icon: <CardDollarIcon color={colors.primary[500]} size={20} /> },
  onTime: {
    title: 'On-time Rate', color: colors.success[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="1.8"/><path d="M12 6V12L16 14" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  cancellation: {
    title: 'Cancellation Rate', color: colors.error[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.error[500]} strokeWidth="1.8"/><path d="M15 9L9 15M9 9L15 15" stroke={colors.error[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  avgTime: {
    title: 'Avg Move Time', color: colors.primary[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M12 6V12L16 14" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
};

/* Mock drill-down table data */
const DRILL_DOWN_DATA: Record<MetricKey, { columns: string[]; rows: string[][] }> = {
  orders: {
    columns: ['Date', 'Client', 'From → To', 'Amount', 'Status'],
    rows: [
      ['Mar 23', 'Sarah J.', 'Hollywood → Pasadena', '$780', 'Completed'],
      ['Mar 23', 'Mike R.', 'DTLA → Santa Monica', '$1,250', 'In Progress'],
      ['Mar 22', 'Lisa K.', 'Burbank → Glendale', '$540', 'Completed'],
      ['Mar 22', 'Tom W.', 'Venice → Beverly Hills', '$920', 'Completed'],
      ['Mar 21', 'Anna P.', 'Silver Lake → Echo Park', '$380', 'Completed'],
      ['Mar 21', 'David C.', 'Westwood → Culver City', '$670', 'Completed'],
      ['Mar 20', 'Emily H.', 'Koreatown → Los Feliz', '$450', 'Cancelled'],
      ['Mar 20', 'Jason M.', 'Brentwood → Marina', '$1,100', 'Completed'],
    ],
  },
  rating: {
    columns: ['Date', 'Client', 'Mover', 'Rating', 'Comment'],
    rows: [
      ['Mar 23', 'Sarah J.', 'Dmitriy K.', '5.0', 'Amazing service!'],
      ['Mar 22', 'Lisa K.', 'Alex M.', '4.8', 'Very professional'],
      ['Mar 22', 'Tom W.', 'James L.', '5.0', 'Fast and careful'],
      ['Mar 21', 'Anna P.', 'Carlos R.', '4.5', 'Good job overall'],
      ['Mar 21', 'David C.', 'Dmitriy K.', '5.0', 'Highly recommend'],
      ['Mar 20', 'Jason M.', 'Alex M.', '4.9', 'Smooth move'],
    ],
  },
  conversion: {
    columns: ['Date', 'Requests', 'Converted', 'Rate', 'Source'],
    rows: [
      ['Mar 23', '8', '6', '75%', 'App'],
      ['Mar 22', '12', '7', '58%', 'App + Web'],
      ['Mar 21', '6', '5', '83%', 'Referral'],
      ['Mar 20', '15', '9', '60%', 'App'],
      ['Mar 19', '10', '7', '70%', 'App + Web'],
      ['Mar 18', '9', '6', '67%', 'Web'],
    ],
  },
  avgCheck: {
    columns: ['Date', 'Orders', 'Total Revenue', 'Avg Check', 'Trend'],
    rows: [
      ['Mar 23', '6', '$4,680', '$780', '↑'],
      ['Mar 22', '8', '$5,120', '$640', '↓'],
      ['Mar 21', '5', '$3,750', '$750', '↑'],
      ['Mar 20', '7', '$4,410', '$630', '→'],
      ['Mar 19', '9', '$5,670', '$630', '→'],
      ['Mar 18', '6', '$3,960', '$660', '↑'],
    ],
  },
  revenue: {
    columns: ['Date', 'Orders', 'Revenue', 'Avg Check', 'vs Prev'],
    rows: [
      ['Mar 23', '6', '$4,680', '$780', '↑ 12%'],
      ['Mar 22', '8', '$5,120', '$640', '↓ 3%'],
      ['Mar 21', '5', '$3,750', '$750', '↑ 8%'],
      ['Mar 20', '7', '$4,410', '$630', '→ 0%'],
      ['Mar 19', '9', '$5,670', '$630', '↑ 15%'],
      ['Mar 18', '6', '$3,960', '$660', '↓ 5%'],
    ],
  },
  onTime: {
    columns: ['Date', 'Total', 'On-time', 'Late', 'Rate'],
    rows: [
      ['Mar 23', '6', '6', '0', '100%'],
      ['Mar 22', '8', '7', '1', '88%'],
      ['Mar 21', '5', '5', '0', '100%'],
      ['Mar 20', '7', '7', '0', '100%'],
      ['Mar 19', '9', '8', '1', '89%'],
      ['Mar 18', '6', '6', '0', '100%'],
    ],
  },
  cancellation: {
    columns: ['Date', 'Client', 'Reason', 'Refund', 'Mover'],
    rows: [
      ['Mar 20', 'Emily H.', 'Schedule change', '$450', 'N/A'],
      ['Mar 17', 'Grace L.', 'Found cheaper', '$0', 'N/A'],
      ['Mar 14', 'Kevin B.', 'Move postponed', '$320', 'N/A'],
      ['Mar 11', 'Rachel S.', 'No show', '$0', 'James L.'],
    ],
  },
  avgTime: {
    columns: ['Date', 'Client', 'Rooms', 'Distance', 'Duration'],
    rows: [
      ['Mar 23', 'Sarah J.', '3', '12 mi', '3.5h'],
      ['Mar 23', 'Mike R.', '4', '18 mi', '5.2h'],
      ['Mar 22', 'Lisa K.', '2', '6 mi', '2.1h'],
      ['Mar 22', 'Tom W.', '3', '15 mi', '4.0h'],
      ['Mar 21', 'Anna P.', '1', '3 mi', '1.5h'],
      ['Mar 21', 'David C.', '2', '8 mi', '3.0h'],
    ],
  },
};

/* ═══════════════════════════════════════════
   Detail Screen Component — HIG card-based
   ═══════════════════════════════════════════ */

/* Status badge helper */
const StatusBadge = ({ status }: { status: string }) => {
  const isCompleted = status === 'Completed';
  const isProgress = status === 'In Progress';
  const isCancelled = status === 'Cancelled';
  const bg = isCompleted ? colors.success[50] : isProgress ? colors.primary[50] : isCancelled ? '#FEF3F2' : '#EFF2F7';
  const fg = isCompleted ? colors.success[500] : isProgress ? colors.primary[500] : isCancelled ? colors.error[500] : colors.gray[500];
  return (
    <span style={{
      fontFamily: F, fontSize: 12, fontWeight: 600, color: fg,
      backgroundColor: bg, padding: '4px 10px', borderRadius: 12,
    } as any}>{status}</span>
  );
};

/* Row renderers per metric type */
const OrderRow = ({ row }: { row: string[] }) => (
  <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 } as any}>
      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row[1]}</span>
      <StatusBadge status={row[4]} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
      <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500] } as any}>{row[2]}</span>
      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{row[3]}</span>
    </div>
    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>{row[0]}</span>
  </div>
);

const RatingRow = ({ row }: { row: string[] }) => (
  <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } as any}>
      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row[1]}</span>
      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.warning[600] } as any}>{row[3]}</span>
    </div>
    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block', marginBottom: 4 } as any}>Mover: {row[2]}</span>
    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[600], fontStyle: 'italic', display: 'block' } as any}>"{row[4]}"</span>
    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>{row[0]}</span>
  </div>
);

const ConversionRow = ({ row }: { row: string[] }) => (
  <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } as any}>
      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row[0]}</span>
      <span style={{
        fontFamily: F, fontSize: 14, fontWeight: 700,
        color: parseInt(row[3]) >= 70 ? colors.success[500] : colors.gray[700],
      } as any}>{row[3]}</span>
    </div>
    <div style={{ display: 'flex', gap: 16 } as any}>
      <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500] } as any}>{row[1]} requests</span>
      <span style={{ fontFamily: F, fontSize: 13, color: colors.success[500] } as any}>{row[2]} converted</span>
    </div>
    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 6 } as any}>Source: {row[4]}</span>
  </div>
);

const GenericTwoLineRow = ({ row, valueFn }: { row: string[]; valueFn?: (r: string[]) => { main: string; mainColor?: string; sub: string } }) => {
  const v = valueFn ? valueFn(row) : { main: row[row.length - 1], sub: row.slice(1, -1).join(' · ') };
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8 } as any}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } as any}>
        <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{row[0]}</span>
        <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: v.mainColor || colors.gray[900] } as any}>{v.main}</span>
      </div>
      <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block' } as any}>{v.sub}</span>
    </div>
  );
};

const DetailScreen: React.FC<{
  metric: MetricKey;
  onBack: () => void;
}> = ({ metric, onBack }) => {
  const config = METRIC_CONFIG[metric];
  const data = DRILL_DOWN_DATA[metric];
  const [filterPeriod, setFilterPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('7d');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customFrom, setCustomFrom] = useState('2026-03-01');
  const [customTo, setCustomTo] = useState('2026-03-23');

  const fp = filterPeriod === 'custom' ? '30d' : filterPeriod; // custom falls back to 30d data
  const summaryValue =
    metric === 'orders' ? (fp === '7d' ? '42' : fp === '30d' ? '186' : '524') :
    metric === 'revenue' ? (fp === '7d' ? '$23,100' : fp === '30d' ? '$124,800' : '$348,600') :
    metric === 'rating' ? (fp === '7d' ? '4.87' : fp === '30d' ? '4.82' : '4.79') :
    metric === 'conversion' ? (fp === '7d' ? '68%' : fp === '30d' ? '64%' : '61%') :
    metric === 'avgCheck' ? (fp === '7d' ? '$550' : fp === '30d' ? '$670' : '$665') :
    metric === 'onTime' ? (fp === '7d' ? '96%' : fp === '30d' ? '94%' : '93%') :
    metric === 'cancellation' ? (fp === '7d' ? '2.1%' : fp === '30d' ? '3.2%' : '3.5%') :
    (fp === '7d' ? '3.8h' : fp === '30d' ? '4.2h' : '4.0h');

  const periodLabel = filterPeriod === 'custom' ? `${customFrom.slice(5)} — ${customTo.slice(5)}` :
    filterPeriod === '7d' ? 'Last 7 Days' : filterPeriod === '30d' ? 'Last 30 Days' : 'Last 90 Days';

  /* Render a single row based on metric type */
  const renderRow = (row: string[], i: number) => {
    if (metric === 'orders') return <OrderRow key={i} row={row} />;
    if (metric === 'rating') return <RatingRow key={i} row={row} />;
    if (metric === 'conversion') return <ConversionRow key={i} row={row} />;
    if (metric === 'revenue') return (
      <GenericTwoLineRow key={i} row={row} valueFn={r => ({
        main: r[2], mainColor: colors.primary[500],
        sub: `${r[1]} orders · Avg ${r[3]} · ${r[4]}`,
      })} />
    );
    if (metric === 'avgCheck') return (
      <GenericTwoLineRow key={i} row={row} valueFn={r => ({
        main: r[3],
        sub: `${r[1]} orders · ${r[2]} total revenue · ${r[4]}`,
      })} />
    );
    if (metric === 'onTime') return (
      <GenericTwoLineRow key={i} row={row} valueFn={r => ({
        main: r[4], mainColor: parseInt(r[4]) >= 95 ? colors.success[500] : colors.warning[500],
        sub: `${r[2]} on-time · ${r[3]} late · ${r[1]} total`,
      })} />
    );
    if (metric === 'cancellation') return (
      <GenericTwoLineRow key={i} row={row} valueFn={r => ({
        main: r[3], mainColor: colors.error[500],
        sub: `${r[1]} · ${r[2]} · Mover: ${r[4]}`,
      })} />
    );
    if (metric === 'avgTime') return (
      <GenericTwoLineRow key={i} row={row} valueFn={r => ({
        main: r[4], mainColor: colors.primary[500],
        sub: `${r[1]} · ${r[2]} rooms · ${r[3]}`,
      })} />
    );
    return null;
  };

  return (
    <AnimatedPage direction="right" duration={0.3}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F5F5F7' } as any}>
      {/* ── Navigation Bar (iOS HIG style) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 16px',
        backgroundColor: '#F5F5F7', position: 'relative', minHeight: 44,
      } as any}>
        <div onClick={onBack} style={{
          display: 'flex', alignItems: 'center', cursor: 'pointer',
          zIndex: 1,
        } as any}>
          <BackIcon />
        </div>
        <span style={{
          fontFamily: F, fontSize: 17, fontWeight: 600, color: colors.gray[900],
          position: 'absolute', left: 0, right: 0, textAlign: 'center',
          pointerEvents: 'none',
        } as any}>
          {config.title}
        </span>
      </div>

      {/* ── Filter Chips (horizontal scroll) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '4px 16px 12px', gap: 8,
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      } as any}>
        <style dangerouslySetInnerHTML={{ __html: `.filter-chips-row::-webkit-scrollbar{display:none}` }} />
        {(['7d', '30d', '90d', 'custom'] as const).map(p => {
          const active = filterPeriod === p;
          const isCustom = p === 'custom';
          return (
            <div
              className="ceo-chip"
              key={p}
              onClick={() => {
                if (isCustom) { setFilterPeriod('custom'); setShowCustomPicker(!showCustomPicker); }
                else { setFilterPeriod(p); setShowCustomPicker(false); }
              }}
              style={{
                height: 36, borderRadius: 12, cursor: 'pointer',
                backgroundColor: active ? colors.primary[500] : '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 16px', gap: isCustom ? 6 : 0,
                whiteSpace: 'nowrap', flexShrink: 0,
              } as any}
            >
              {isCustom && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 } as any}>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? '#FFFFFF' : colors.gray[500]} strokeWidth="1.5"/>
                  <path d="M16 2V6M8 2V6M3 10H21" stroke={active ? '#FFFFFF' : colors.gray[500]} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              <span style={{
                fontFamily: F, fontSize: 13, fontWeight: 600,
                color: active ? '#FFFFFF' : colors.gray[600],
                whiteSpace: 'nowrap',
              } as any}>
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'Custom'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Custom Date Picker ── */}
      <div style={{
        display: 'grid',
        gridTemplateRows: showCustomPicker ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        margin: '0 16px',
        marginBottom: showCustomPicker ? 12 : 0,
      } as any}>
        <div style={{ overflow: 'hidden' } as any}>
        <div style={{
          padding: 16, backgroundColor: '#FFFFFF',
          borderRadius: 16,
        } as any}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 } as any}>
            <div style={{ flex: 1 } as any}>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[400], display: 'block', marginBottom: 6 } as any}>From</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e: any) => setCustomFrom(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 12,
                  backgroundColor: '#EFF2F7', fontFamily: F, fontSize: 14,
                  color: colors.gray[900], border: 'none', outline: 'none',
                  boxSizing: 'border-box',
                } as any}
              />
            </div>
            <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], marginTop: 20 } as any}>—</span>
            <div style={{ flex: 1 } as any}>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[400], display: 'block', marginBottom: 6 } as any}>To</span>
              <input
                type="date"
                value={customTo}
                onChange={(e: any) => setCustomTo(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 12,
                  backgroundColor: '#EFF2F7', fontFamily: F, fontSize: 14,
                  color: colors.gray[900], border: 'none', outline: 'none',
                  boxSizing: 'border-box',
                } as any}
              />
            </div>
          </div>
          <div
            className="ceo-btn-primary"
            onClick={() => setShowCustomPicker(false)}
            style={{
              width: '100%', height: 50, borderRadius: 12,
              backgroundColor: colors.primary[500], cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxSizing: 'border-box',
            } as any}
          >
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: '#FFFFFF' } as any}>Apply</span>
          </div>
        </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 0' } as any}>
        {/* Summary Card */}
        <div style={{
          backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px', marginBottom: 16,
        } as any}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 } as any}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              backgroundColor: `${config.color}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
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

        {/* Bottom spacer so last card is fully visible when scrolled */}
        <div style={{ height: 48 } as any} />
      </div>
    </div>
    </AnimatedPage>
  );
};

/* ═══════════════════════════════════════════
   Mover Detail Screen (employee stats)
   ═══════════════════════════════════════════ */

const MoverDetailScreen: React.FC<{
  mover: typeof TOP_MOVERS[0];
  rank: number;
  onBack: () => void;
  onJobPress?: (job: JobData, moverName: string) => void;
}> = ({ mover, rank, onBack, onJobPress }) => {
  const detail = MOVER_DETAILS[mover.name];
  if (!detail) return null;

  return (
    <AnimatedPage direction="right" duration={0.3}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F5F5F7' } as any}>
      {/* Nav bar */}
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
          {mover.name}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 0' } as any}>
        {/* Profile header */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 12, animation: 'scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) both' } as any}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 } as any}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primary[50],
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            } as any}>
              <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.primary[500] } as any}>
                {mover.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div style={{ flex: 1 } as any}>
              <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: colors.gray[900], display: 'block' } as any}>
                {mover.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 } as any}>
                <StarIcon color={colors.warning[500]} size={14} />
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: colors.warning[600] } as any}>{detail.rating}</span>
                <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], marginLeft: 4 } as any}>· Rank #{rank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.08s both' } as any}>
          {[
            { label: 'Revenue', value: `$${detail.totalRevenue.toLocaleString()}`, color: colors.primary[500] },
            { label: 'Moves', value: String(detail.completedMoves), color: colors.gray[900] },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px' } as any}>
              <span style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: s.color, display: 'block', letterSpacing: -0.5 } as any}>{s.value}</span>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.14s both' } as any}>
          {[
            { label: 'On-time', value: detail.onTime, color: colors.success[500] },
            { label: 'Cancellation', value: detail.cancellation, color: colors.error[500] },
            { label: 'Avg Time', value: detail.avgTime, color: colors.primary[500] },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px' } as any}>
              <span style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: s.color, display: 'block' } as any}>{s.value}</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Recent jobs */}
        <div style={{ marginBottom: 12 } as any}>
          <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 10 } as any}>
            Recent Jobs
          </span>
          {detail.recentJobs.map((job, i) => (
            <StaggerItem key={i} index={i}>
            <div
              className="ceo-card-interactive"
              onClick={() => onJobPress?.(job, mover.name)}
              style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '14px 16px', marginBottom: 8, cursor: 'pointer' } as any}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 } as any}>
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{job.client}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                  <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{job.amount}</span>
                  <ChevronRightIcon color={colors.gray[200]} />
                </div>
              </div>
              <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block', marginBottom: 4 } as any}>{job.route}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400] } as any}>{job.date}</span>
                <StarIcon color={colors.warning[500]} size={11} />
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.warning[600] } as any}>{job.rating}</span>
              </div>
            </div>
            </StaggerItem>
          ))}
        </div>

        <div style={{ height: 48 } as any} />
      </div>
    </div>
    </AnimatedPage>
  );
};

/* ═══════════════════════════════════════════
   Job Detail — reuses actual MoveDetailScreen
   ═══════════════════════════════════════════ */

/** Generate realistic room inventory based on room count */
const generateRooms = (roomCount: number): import('../move/MoveDetailScreen').RoomInventory[] => {
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

/** Convert CEO dashboard job data → MoveDetailData for the real screen */
const jobToMoveDetail = (job: JobData, moverName: string): MoveDetailData => {
  const fromTo = job.route.split(' → ');
  const boxCount = parseInt(job.items.match(/(\d+)\s*box/)?.[1] || '0');
  const furnitureCount = parseInt(job.items.match(/(\d+)\s*furniture/)?.[1] || '0');
  const rooms = generateRooms(job.rooms);
  const totalItems = rooms.reduce((sum, r) => sum + r.items.reduce((s, it) => s + it.qty, 0), 0);

  return {
    id: `job-${job.date}-${job.client}`,
    client: job.client,
    from: fromTo[0] || '',
    to: fromTo[1] || '',
    date: job.date,
    time: '10:00 AM',
    price: parseInt(job.amount.replace(/[$,]/g, '')) || 0,
    step: job.status === 'Completed' ? 'completed' : 'accepted',
    roomsCount: job.rooms,
    clientPhone: job.clientPhone,
    clientEmail: `${job.client.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    fromApt: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
    fromFloor: String(Math.floor(Math.random() * 8) + 1),
    fromElevator: Math.random() > 0.3,
    toApt: `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
    toFloor: String(Math.floor(Math.random() * 15) + 1),
    toElevator: Math.random() > 0.2,
    distance: job.distance,
    estimatedTime: `~${Math.round(parseFloat(job.distance) * 2.5)} min`,
    totalVolume: `${Math.round(job.rooms * 120 + boxCount * 3)} cu ft`,
    totalItems,
    rooms,
    specialItems: furnitureCount > 5
      ? [{ name: 'Piano', quantity: 1, note: 'Upright, needs padding' }]
      : [],
    notes: job.notes,
    planName: `${job.crew}-Mover Team`,
    depositPaid: Math.round((parseInt(job.amount.replace(/[$,]/g, '')) || 0) * 0.2),
  };
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

export const CeoDashboardScreen: React.FC<CeoDashboardScreenProps> = ({
  onTabPress,
  onBack,
}) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [drillDown, setDrillDown] = useState<MetricKey | null>(null);
  const [selectedMover, setSelectedMover] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<{ job: JobData; moverName: string } | null>(null);

  /* Inject animation CSS on mount */
  useEffect(() => { injectAnimationCSS(); }, []);

  if (Platform.OS !== 'web') return null;

  const d = DATA[period];
  const maxRev = Math.max(...d.chart.map(c => c.value));
  const totalChart = d.chart.reduce((s, c) => s + c.value, 0);

  /* ── Metric Card ── */
  const MetricCard = ({ label, value, sub, color, icon, metric }: {
    label: string; value: string; sub?: string; color: string; icon: React.ReactNode; metric: MetricKey;
  }) => (
    <div
      className="ceo-card-interactive"
      onClick={() => setDrillDown(metric)}
      style={{
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
        padding: '16px 14px', minWidth: 0, cursor: 'pointer',
      } as any}
    >
      {/* Icon + Value + Chevron — one row */}
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

  /* When a job is selected, render the full MoveDetailScreen directly (it has its own SafeAreaView + StatusBarMock) */
  if (selectedJob) {
    return (
      <MoveDetailScreenBase
        move={jobToMoveDetail(selectedJob.job, selectedJob.moverName)}
        onAdvanceStep={() => {}}
        onBack={() => setSelectedJob(null)}
        role="ceo"
      />
    );
  }

  return (
    <SafeAreaView style={[s.safeArea, (drillDown || selectedMover !== null) && { backgroundColor: '#F5F5F7' }]}>
      <View style={[s.container, (drillDown || selectedMover !== null) && { backgroundColor: '#F5F5F7' }]}>
        <StatusBarMock onTimeTap={onBack} />

        {selectedMover !== null ? (
          <MoverDetailScreen
            mover={TOP_MOVERS[selectedMover]}
            rank={selectedMover + 1}
            onBack={() => setSelectedMover(null)}
            onJobPress={(job: JobData, moverName: string) => setSelectedJob({ job, moverName })}
          />
        ) : drillDown ? (
          <DetailScreen metric={drillDown} onBack={() => setDrillDown(null)} />
        ) : (
          <>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <div style={{ padding: '12px 16px 120px' } as any}>

                {/* ── Header ── */}
                <div style={{ marginBottom: 20, animation: 'fadeIn 0.4s ease both' } as any}>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[400], display: 'block' } as any}>
                    Good morning
                  </span>
                  <span style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: colors.gray[900], display: 'block', marginTop: 2, letterSpacing: -0.5 } as any}>
                    Company Overview
                  </span>
                </div>

                {/* ── Revenue Hero Card (white, no gradient) ── */}
                <div
                  className="ceo-card-interactive"
                  onClick={() => setDrillDown('revenue')}
                  style={{
                    backgroundColor: '#FFFFFF', borderRadius: 16,
                    padding: '20px', marginBottom: 12, cursor: 'pointer',
                    animation: 'fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
                  } as any}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as any}>
                    <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[400] } as any}>
                      Total Revenue
                    </span>
                    <ChevronRightIcon color={colors.gray[200]} />
                  </div>
                  <AnimatedNumber value={`$${d.revenue.toLocaleString()}`} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -1 }} />
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.success[500], display: 'block', marginTop: 6 } as any}>
                    {d.revenueTrend}
                  </span>

                  {/* Period toggle */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 } as any}>
                    {(['week', 'month'] as const).map(p => (
                      <div
                        className="ceo-chip"
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
                    label="Total Orders"
                    value={String(d.orders)}
                    sub={d.ordersSub}
                    color={colors.primary[500]}
                    metric="orders"
                    icon={<ClipboardIcon color={colors.primary[500]} />}
                  />
                  <MetricCard
                    label="Avg Rating"
                    value={d.rating}
                    sub={d.ratingSub}
                    color={colors.warning[500]}
                    metric="rating"
                    icon={<StarIcon color={colors.warning[500]} />}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.14s both' } as any}>
                  <MetricCard
                    label="Conversion Rate"
                    value={d.conversion}
                    sub={d.conversionSub}
                    color={colors.success[500]}
                    metric="conversion"
                    icon={<SyncIcon color={colors.success[500]} />}
                  />
                  <MetricCard
                    label="Avg Check"
                    value={d.avgCheck}
                    sub={d.avgCheckSub}
                    color={ACCENT_PURPLE}
                    metric="avgCheck"
                    icon={<MoneyBagIcon color={ACCENT_PURPLE} />}
                  />
                </div>

                {/* ── Revenue Chart (tappable) ── */}
                <div
                  className="ceo-card-interactive"
                  onClick={() => setDrillDown('revenue')}
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
                      const isMax = c.value === maxRev;
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 } as any}>
                          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: colors.gray[400] } as any}>
                            ${c.value >= 1000 ? (c.value / 1000).toFixed(1) + 'k' : c.value}
                          </span>
                          <div style={{
                            width: '100%', height: h, borderRadius: 8,
                            backgroundColor: isMax ? colors.primary[500] : colors.primary[100],
                            transition: 'height 0.3s ease',
                          } as any} />
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400] } as any}>
                            {c.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Top Movers Leaderboard ── */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.26s both' } as any}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } as any}>
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>
                      Top Movers
                    </span>
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400] } as any}>
                      {period === 'week' ? 'This Week' : 'This Month'}
                    </span>
                  </div>
                  {TOP_MOVERS.map((mover, i) => (
                    <div key={i} className="ceo-mover-row" onClick={() => setSelectedMover(i)} style={{
                      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
                      padding: '10px 4px', cursor: 'pointer',
                    } as any}>
                      {/* Rank */}
                      <div style={{
                        width: 28, height: 28, borderRadius: 12,
                        backgroundColor: i === 0 ? colors.warning[50] : colors.gray[50],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      } as any}>
                        <span style={{
                          fontFamily: F, fontSize: 13, fontWeight: 700,
                          color: i === 0 ? colors.warning[600] : colors.gray[500],
                        } as any}>
                          {i + 1}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 12,
                        backgroundColor: colors.primary[50],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      } as any}>
                        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.primary[500] } as any}>
                          {mover.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 } as any}>
                        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>
                          {mover.name}
                        </span>
                        <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                          {mover.moves} moves · <StarIcon color={colors.warning[500]} size={11} /> {mover.rating}
                        </span>
                      </div>

                      {/* Revenue + Chevron */}
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[900], flexShrink: 0 } as any}>
                        ${mover.revenue.toLocaleString()}
                      </span>
                      <ChevronRightIcon color={colors.gray[200]} />
                    </div>
                  ))}
                </div>

                {/* ── Operational KPIs ── */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.32s both' } as any}>
                  {[
                    { key: 'onTime' as MetricKey, value: d.onTime, label: 'On-time Rate', sub: period === 'week' ? '↑ vs last week' : '↓ 1% vs last month', color: colors.success[500] },
                    { key: 'cancellation' as MetricKey, value: d.cancellation, label: 'Cancellation', sub: period === 'week' ? '↓ 0.4% improved' : '↑ 0.3% vs last month', color: colors.error[500] },
                    { key: 'avgTime' as MetricKey, value: d.avgMoveTime, label: 'Avg Move Time', sub: period === 'week' ? '↓ 12 min faster' : '↑ 18 min slower', color: colors.primary[500] },
                  ].map(stat => (
                    <div key={stat.key} className="ceo-card-interactive" onClick={() => setDrillDown(stat.key)} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px', cursor: 'pointer' } as any}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                        <span style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: stat.color, display: 'block' } as any}>{stat.value}</span>
                        <ChevronRightIcon color={colors.gray[200]} />
                      </div>
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>{stat.label}</span>
                      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: colors.gray[300], display: 'block', marginTop: 4 } as any}>{stat.sub}</span>
                    </div>
                  ))}
                </div>

              </div>
            </ScrollView>

            <TabBar active="dashboard" onTabPress={onTabPress} role="ceo" />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
