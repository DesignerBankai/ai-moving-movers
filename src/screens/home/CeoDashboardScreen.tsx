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

import React, { useState } from 'react';
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

const F = fontFamily.primary;

/* Semantic accent colors (not in core palette but used consistently) */
const ACCENT_PURPLE = '#7C3AED';   // avgCheck accent
const ACCENT_GREEN_LIGHT = '#86EFAC'; // hero trend text on dark bg

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

const TEAM_STATS = {
  totalMovers: 12,
  activeNow: 7,
  onBreak: 2,
  available: 3,
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
  orders: {
    title: 'Orders',
    color: colors.primary[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M9 7H15M9 11H15M9 15H12" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  rating: {
    title: 'Avg Rating',
    color: colors.warning[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={colors.warning[500]} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  },
  conversion: {
    title: 'Conversion Rate',
    color: colors.success[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12A10 10 0 1112.93 2C17 2 20.54 4.59 22 8.22" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01L9 11.01" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  avgCheck: {
    title: 'Avg Check',
    color: ACCENT_PURPLE,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke={ACCENT_PURPLE} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  revenue: {
    title: 'Revenue',
    color: colors.primary[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  onTime: {
    title: 'On-time Rate',
    color: colors.success[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="1.8"/><path d="M12 6V12L16 14" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  cancellation: {
    title: 'Cancellation Rate',
    color: colors.error[500],
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.error[500]} strokeWidth="1.8"/><path d="M15 9L9 15M9 9L15 15" stroke={colors.error[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  avgTime: {
    title: 'Avg Move Time',
    color: colors.primary[500],
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
      ['Mar 23', 'Sarah J.', 'Dmitriy K.', '⭐ 5.0', 'Amazing service!'],
      ['Mar 22', 'Lisa K.', 'Alex M.', '⭐ 4.8', 'Very professional'],
      ['Mar 22', 'Tom W.', 'James L.', '⭐ 5.0', 'Fast and careful'],
      ['Mar 21', 'Anna P.', 'Carlos R.', '⭐ 4.5', 'Good job overall'],
      ['Mar 21', 'David C.', 'Dmitriy K.', '⭐ 5.0', 'Highly recommend'],
      ['Mar 20', 'Jason M.', 'Alex M.', '⭐ 4.9', 'Smooth move'],
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
      {showCustomPicker && (
        <div style={{
          margin: '0 16px 12px', padding: 16, backgroundColor: '#FFFFFF',
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
      )}

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' } as any}>
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
        {data.rows.map((row, i) => renderRow(row, i))}
      </div>
    </div>
  );
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

  if (Platform.OS !== 'web') return null;

  const d = DATA[period];
  const maxRev = Math.max(...d.chart.map(c => c.value));
  const totalChart = d.chart.reduce((s, c) => s + c.value, 0);

  /* ── Metric Card ── */
  const MetricCard = ({ label, value, sub, color, icon, metric }: {
    label: string; value: string; sub?: string; color: string; icon: React.ReactNode; metric: MetricKey;
  }) => (
    <div
      onClick={() => setDrillDown(metric)}
      style={{
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
        padding: '16px 14px', minWidth: 0, cursor: 'pointer',
        transition: 'transform 0.15s ease',
      } as any}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        } as any}>
          {icon}
        </div>
        <ChevronRightIcon color={colors.gray[200]} />
      </div>
      <span style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -0.5, marginTop: 10 } as any}>
        {value}
      </span>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
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
    <SafeAreaView style={[s.safeArea, drillDown && { backgroundColor: '#F5F5F7' }]}>
      <View style={[s.container, drillDown && { backgroundColor: '#F5F5F7' }]}>
        <StatusBarMock onTimeTap={onBack} />

        {drillDown ? (
          <DetailScreen metric={drillDown} onBack={() => setDrillDown(null)} />
        ) : (
          <>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <div style={{ padding: '12px 16px 120px' } as any}>

                {/* ── Header ── */}
                <div style={{ marginBottom: 20 } as any}>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[400], display: 'block' } as any}>
                    Good morning
                  </span>
                  <span style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: colors.gray[900], display: 'block', marginTop: 2, letterSpacing: -0.5 } as any}>
                    Company Overview
                  </span>
                </div>

                {/* ── Revenue Hero Card ── */}
                <div
                  onClick={() => setDrillDown('revenue')}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[700] || '#1570CD'})`,
                    borderRadius: 16, padding: '24px 20px', marginBottom: 12, cursor: 'pointer',
                  } as any}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}>
                    <div>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block' } as any}>
                        Total Revenue
                      </span>
                      <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: '#FFFFFF', display: 'block', marginTop: 4, letterSpacing: -1 } as any}>
                        ${d.revenue.toLocaleString()}
                      </span>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: ACCENT_GREEN_LIGHT, display: 'block', marginTop: 6 } as any}>
                        {d.revenueTrend}
                      </span>
                    </div>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    } as any}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Period toggle */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 } as any}>
                    {(['week', 'month'] as const).map(p => (
                      <div
                        key={p}
                        onClick={(e: any) => { e.stopPropagation(); setPeriod(p); }}
                        style={{
                          padding: '6px 16px', borderRadius: 12, cursor: 'pointer',
                          backgroundColor: period === p ? 'rgba(255,255,255,0.25)' : 'transparent',
                        } as any}
                      >
                        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: '#FFFFFF' } as any}>
                          {p === 'week' ? 'This Week' : 'This Month'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Key Metrics Grid (2x2) ── */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10 } as any}>
                  <MetricCard
                    label="Total Orders"
                    value={String(d.orders)}
                    sub={d.ordersSub}
                    color={colors.primary[500]}
                    metric="orders"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M9 7H15M9 11H15M9 15H12" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  />
                  <MetricCard
                    label="Avg Rating"
                    value={d.rating}
                    sub={d.ratingSub}
                    color={colors.warning[500]}
                    metric="rating"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={colors.warning[500]} strokeWidth="1.8" strokeLinejoin="round"/></svg>}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12 } as any}>
                  <MetricCard
                    label="Conversion Rate"
                    value={d.conversion}
                    sub={d.conversionSub}
                    color={colors.success[500]}
                    metric="conversion"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12A10 10 0 1112.93 2C17 2 20.54 4.59 22 8.22" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01L9 11.01" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <MetricCard
                    label="Avg Check"
                    value={d.avgCheck}
                    sub={d.avgCheckSub}
                    color={ACCENT_PURPLE}
                    metric="avgCheck"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke={ACCENT_PURPLE} strokeWidth="1.8" strokeLinecap="round"/></svg>}
                  />
                </div>

                {/* ── Revenue Chart ── */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 } as any}>
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>{d.chartLabel}</span>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.primary[500] } as any}>${totalChart.toLocaleString()}</span>
                  </div>
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

                {/* ── Team Utilization ── */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
                  <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 16 } as any}>
                    Team Utilization
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 8 } as any}>
                    {[
                      { label: 'Active', value: TEAM_STATS.activeNow, color: colors.success[500], bg: colors.success[50] },
                      { label: 'On Break', value: TEAM_STATS.onBreak, color: colors.warning[500], bg: colors.warning[50] },
                      { label: 'Available', value: TEAM_STATS.available, color: colors.primary[500], bg: colors.primary[25] },
                    ].map((st, i) => (
                      <div key={i} style={{
                        flex: 1, padding: '12px 10px', borderRadius: 12, textAlign: 'center',
                        backgroundColor: st.bg,
                      } as any}>
                        <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: st.color, display: 'block' } as any}>
                          {st.value}
                        </span>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: st.color, display: 'block', marginTop: 2, opacity: 0.8 } as any}>
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Utilization bar */}
                  <div style={{ marginTop: 12, display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' } as any}>
                    <div style={{ width: `${(TEAM_STATS.activeNow / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.success[500] } as any} />
                    <div style={{ width: `${(TEAM_STATS.onBreak / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.warning[400] } as any} />
                    <div style={{ width: `${(TEAM_STATS.available / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.primary[300] } as any} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 8, textAlign: 'center' } as any}>
                    {TEAM_STATS.totalMovers} movers total · {Math.round((TEAM_STATS.activeNow / TEAM_STATS.totalMovers) * 100)}% utilization
                  </span>
                </div>

                {/* ── Top Movers Leaderboard ── */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
                  <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 14 } as any}>
                    Top Movers
                  </span>
                  {TOP_MOVERS.map((mover, i) => (
                    <div key={i} style={{
                      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
                      padding: '10px 0',
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
                          {mover.moves} moves · ⭐ {mover.rating}
                        </span>
                      </div>

                      {/* Revenue */}
                      <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[900], flexShrink: 0 } as any}>
                        ${mover.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── On-time & Cancellation ── */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12 } as any}>
                  {[
                    { key: 'onTime' as MetricKey, value: d.onTime, label: 'On-time Rate', color: colors.success[500] },
                    { key: 'cancellation' as MetricKey, value: d.cancellation, label: 'Cancellation', color: colors.error[500] },
                    { key: 'avgTime' as MetricKey, value: d.avgMoveTime, label: 'Avg Move Time', color: colors.primary[500] },
                  ].map(stat => (
                    <div key={stat.key} onClick={() => setDrillDown(stat.key)} style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px', cursor: 'pointer' } as any}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                        <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: stat.color, display: 'block' } as any}>{stat.value}</span>
                        <ChevronRightIcon color={colors.gray[200]} />
                      </div>
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>{stat.label}</span>
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
