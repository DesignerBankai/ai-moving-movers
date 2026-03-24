/**
 * AI Moving — Sales Dashboard Screen
 *
 * Dashboard for sales representatives to track deals, proposals, leads, and revenue.
 * Sections:
 * 1. Sales Revenue hero card (total + trend) with week/month toggle
 * 2. Key metrics cards (deals closed, conversion rate, proposals sent, avg deal size)
 * 3. Weekly/Monthly sales chart (bar chart)
 * 4. Recent deals list with status badges
 * 5. Monthly goal progress tracker
 */

import React, { useState, useEffect } from 'react';
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

/* Semantic accent colors */
const ACCENT_PURPLE = '#7C3AED';
const ACCENT_ORANGE = '#F59E0B';

/* ═══════════════════════════════════════════
   Icon components — Sales-specific
   ═══════════════════════════════════════════ */

const TrendingUpIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12L9 6L13 10L21 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 2H15V8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 11V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 17H23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 2V9H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DollarIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 1V23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 5H7C5.9 5 5 5.9 5 7V17C5 18.1 5.9 19 7 19H17C18.1 19 19 18.1 19 17V7C19 5.9 18.1 5 17 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PercentIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="2" stroke={color} strokeWidth="2"/>
    <circle cx="18" cy="18" r="2" stroke={color} strokeWidth="2"/>
    <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronRightIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Animations — CSS keyframes + helpers
   ═══════════════════════════════════════════ */

const ANIMATION_CSS = `
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

const injectAnimationCSS = () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    if (!document.getElementById('sales-anim-id')) {
      const st = document.createElement('style');
      st.id = 'sales-anim-id';
      st.textContent = ANIMATION_CSS;
      document.head.appendChild(st);
    }
  }
};

/* ═══════════════════════════════════════════
   AnimatedNumber & Animation helpers
   ═══════════════════════════════════════════ */

const AnimatedNumber = ({ value, style }: { value: string; style?: any }) => (
  <span style={{ ...style, animation: 'countPulse 0.6s ease-out' } as any}>
    {value}
  </span>
);

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
  { id: 1, client: 'Sarah Johnson', route: 'Hollywood → Pasadena', amount: 1850, status: 'closed', date: 'Mar 23', rooms: 3 },
  { id: 2, client: 'Mike Chen', route: 'Venice → Beverly Hills', amount: 2100, status: 'closed', date: 'Mar 22', rooms: 4 },
  { id: 3, client: 'Emma Wilson', route: 'Santa Monica → Westwood', amount: 980, status: 'proposal', date: 'Mar 22', rooms: 2 },
  { id: 4, client: 'David Brown', route: 'Downtown → Koreatown', amount: 1450, status: 'negotiation', date: 'Mar 21', rooms: 3 },
  { id: 5, client: 'Lisa Park', route: 'Burbank → Glendale', amount: 750, status: 'lost', date: 'Mar 20', rooms: 1 },
  { id: 6, client: 'James Taylor', route: 'WeHo → Silver Lake', amount: 1200, status: 'closed', date: 'Mar 19', rooms: 2 },
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

  useEffect(() => { injectAnimationCSS(); }, []);

  if (Platform.OS !== 'web') return null;

  const d = DATA[period];
  const maxRev = Math.max(...d.chart.map(c => c.value));
  const totalChart = d.chart.reduce((s, c) => s + c.value, 0);

  const MetricCard = ({ label, value, sub, color, icon }: {
    label: string; value: string; sub?: string; color: string; icon: React.ReactNode;
  }) => (
    <div
      className="sales-card-interactive"
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
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

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
                icon={<CheckCircleIcon color={colors.primary[500]} />}
              />
              <MetricCard
                label="Conversion Rate"
                value={d.conversionRate}
                sub={d.conversionSub}
                color={colors.success[500]}
                icon={<PercentIcon color={colors.success[500]} />}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.14s both' } as any}>
              <MetricCard
                label="Proposals Sent"
                value={String(d.proposalsSent)}
                sub={d.proposalsTrend}
                color={colors.primary[500]}
                icon={<FileIcon color={colors.primary[500]} />}
              />
              <MetricCard
                label="Avg Deal Size"
                value={d.avgDealSize}
                sub={d.avgDealSub}
                color={ACCENT_ORANGE}
                icon={<DollarIcon color={ACCENT_ORANGE} />}
              />
            </div>

            {/* ── Sales Chart ── */}
            <div
              className="sales-card-interactive"
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

            {/* ── Monthly Goal Progress ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12, animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.32s both' } as any}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as any}>
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>
                  Monthly Goal
                </span>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.primary[500] } as any}>
                  71%
                </span>
              </div>
              <div style={{ width: '100%', height: 8, backgroundColor: '#EFF2F7', borderRadius: 4, overflow: 'hidden', marginBottom: 10 } as any}>
                <div style={{
                  height: '100%', width: '71%',
                  backgroundColor: colors.primary[500],
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                } as any} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
                <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500] } as any}>
                  $42,800 earned
                </span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[700] } as any}>
                  $60,000 target
                </span>
              </div>
            </div>

          </div>
        </ScrollView>

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
