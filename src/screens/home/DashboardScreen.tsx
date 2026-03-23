/**
 * AI Moving — Mover Dashboard Screen
 *
 * Layout:
 * 1. Header (greeting + bell)
 * 2. Active Move card with step progress + action button
 * 3. Stats row (rating, moves, earnings)
 * 4. Recent Activity feed
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
import { Text, StatusBarMock, SwipeButton } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import { TabBar, TabId } from './TabBar';

/* ═══════════════════════════════════════════
   Move Step Types
   ═══════════════════════════════════════════ */

export type MoveStep =
  | 'accepted'
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'loading'
  | 'en_route_delivery'
  | 'arrived_delivery'
  | 'unloading'
  | 'completed';

const STEP_ORDER: MoveStep[] = [
  'accepted',
  'en_route_pickup',
  'arrived_pickup',
  'loading',
  'en_route_delivery',
  'arrived_delivery',
  'unloading',
  'completed',
];

const STEP_LABELS: Record<MoveStep, string> = {
  accepted: 'Order accepted',
  en_route_pickup: 'En route to pickup',
  arrived_pickup: 'Arrived at pickup',
  loading: 'Loading',
  en_route_delivery: 'En route to delivery',
  arrived_delivery: 'Arrived at delivery',
  unloading: 'Unloading',
  completed: 'Completed',
};

/** CTA text for advancing to the next step */
const STEP_ACTION: Record<MoveStep, string> = {
  accepted: 'Start — Heading out',
  en_route_pickup: 'Arrived at pickup',
  arrived_pickup: 'Start loading',
  loading: 'Loading done — Heading out',
  en_route_delivery: 'Arrived at delivery',
  arrived_delivery: 'Start unloading',
  unloading: 'Finish move',
  completed: 'Completed',
};

/* ═══════════════════════════════════════════
   Props
   ═══════════════════════════════════════════ */

export interface ActiveMove {
  id: string;
  client: string;
  from: string;
  to: string;
  date: string;
  time: string;
  rooms: number;
  price: number;
  step: MoveStep;
}

interface Stats {
  rating: number;
  completedMoves: number;
  earnings: number;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: 'completed' | 'review' | 'payment' | 'new_order';
}

export interface DashboardScreenProps {
  userName: string;
  activeMove: ActiveMove | null;
  stats: Stats;
  activity: ActivityItem[];
  onTabPress: (tab: TabId) => void;
  onAdvanceStep: () => void;
  onViewMoveDetails?: () => void;
  onCallClient?: () => void;
  onChatClient?: () => void;
  onNotifications?: () => void;
  /** Show "Sign Contract" button instead of swipe at arrived_pickup */
  contractPending?: boolean;
  onSignContract?: () => void;
  /** User role for tab filtering */
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Card base
   ═══════════════════════════════════════════ */

const cleanCard: any = {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
};

/* ═══════════════════════════════════════════
   SVG Icons (web only, noop on native)
   ═══════════════════════════════════════════ */

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" fill={colors.gray[700]} stroke={colors.gray[700]} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = ({ size = 14, color = '#F59E0B' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const DollarIcon = ({ color = '#10B981' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
    <path d="M12 6V18M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5S10.34 12 12 12C13.66 12 15 13.12 15 14.5S13.66 17 12 17C10.34 17 9 15.88 9 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const CheckCircleIcon = ({ color = '#10B981' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 482.6 482.6" fill="none">
    <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 14.6 39.1 41 83.2 80.2 130.3zM25.739 104.2c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8-.2.2-.3.3-.5.5-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5C28.039 146.4 24.139 124.3 25.739 104.2z" fill={color}/>
  </svg>
);

const ChatBubbleIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 22.3a10.62 10.62 0 01-5.16-1.3.26.26 0 00-.2 0l-3.53 1a1.24 1.24 0 01-1.56-1.55l1.06-3.55a.27.27 0 000-.19 10.75 10.75 0 1111.69 5.35 11.47 11.47 0 01-2.3.24zm-5.29-2.87a1.85 1.85 0 01.85.22 9.25 9.25 0 102.9-17.23 9.23 9.23 0 00-6.56 13.58 1.77 1.77 0 01.15 1.35l-.93 3.09 3.09-.93a1.73 1.73 0 01.5-.08z" fill={color}/><circle cx="8" cy="12" r="1.25" fill={color}/><circle cx="12" cy="12" r="1.25" fill={color}/><circle cx="16" cy="12" r="1.25" fill={color}/>
  </svg>
);

const NavigationIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
    <path d="M3 11L22 2L13 21L11 13L3 11Z"/>
  </svg>
);

const ActivityDot = ({ type }: { type: string }) => {
  const c = type === 'completed' ? '#10B981' : type === 'review' ? '#F59E0B' : type === 'payment' ? colors.primary[500] : '#8B5CF6';
  return (
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c, marginTop: 6 }} />
  );
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const F = fontFamily.primary as string;

/* ═══════════════════════════════════════════
   Notifications Panel (bottom sheet)
   ═══════════════════════════════════════════ */

const SHEET_ANIM_ID = 'mover-notif-anim';

interface MoverNotif {
  id: string; title: string; body: string;
  time: string; read: boolean;
  icon: 'order' | 'accepted' | 'payment' | 'reminder' | 'star';
  group: 'today' | 'earlier';
}

const MOVER_NOTIFS: MoverNotif[] = [
  { id: 'mn1', title: 'New request nearby', body: '2-bedroom move in Park Slope, $890 estimated', time: '5m ago', read: false, icon: 'order', group: 'today' },
  { id: 'mn2', title: 'You were selected!', body: 'Emily Chen chose you for their move on Mar 12', time: '1h ago', read: false, icon: 'accepted', group: 'today' },
  { id: 'mn3', title: 'Payment received', body: '$1,120 deposited to your account', time: '3h ago', read: true, icon: 'payment', group: 'today' },
  { id: 'mn4', title: 'Upcoming move tomorrow', body: 'Sarah Johnson, 123 Main St — 9:00 AM', time: '6h ago', read: true, icon: 'reminder', group: 'earlier' },
  { id: 'mn5', title: 'New 5-star review', body: '"Great service, very careful with furniture"', time: 'Yesterday', read: true, icon: 'star', group: 'earlier' },
];

const MoverNotifIcon: React.FC<{ type: MoverNotif['icon'] }> = ({ type }) => {
  const c = colors.primary[500];
  switch (type) {
    case 'order':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="13" height="9" rx="1.5" stroke={c} strokeWidth="2"/><path d="M15 10H18L21 13V16H15V10Z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><circle cx="7" cy="18" r="2" stroke={c} strokeWidth="2"/><circle cx="18" cy="18" r="2" stroke={c} strokeWidth="2"/></svg>;
    case 'accepted':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={colors.success[500]} strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'payment':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.8"/><path d="M12 6V18M15 9.5C15 8.12 13.66 7 12 7S9 8.12 9 9.5 10.34 12 12 12 15 13.12 15 14.5 13.66 17 12 17 9 15.88 9 14.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    case 'reminder':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.warning[500]} strokeWidth="2"/><path d="M12 6V12L16 14" stroke={colors.warning[500]} strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'star':
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B"/></svg>;
  }
};

const NotificationsPanel: React.FC<{
  visible: boolean; onClose: () => void;
}> = ({ visible, onClose }) => {
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const sheetRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ startY: number } | null>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && !document.getElementById(SHEET_ANIM_ID)) {
      const st = document.createElement('style');
      st.id = SHEET_ANIM_ID;
      st.textContent = `
        @keyframes mSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes mSheetDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes mFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mFadeOut { from { opacity: 1; } to { opacity: 0; } }
      `;
      document.head.appendChild(st);
    }
  }, []);

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

  const today = MOVER_NOTIFS.filter(n => n.group === 'today');
  const earlier = MOVER_NOTIFS.filter(n => n.group === 'earlier');

  const renderGroup = (items: MoverNotif[], label: string) => (
    <div style={{ paddingTop: 16 } as any}>
      <span style={{
        fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[400],
        textTransform: 'uppercase' as const, letterSpacing: 0.8,
        paddingLeft: 20, paddingBottom: 10, display: 'block',
      } as any}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, paddingLeft: 16, paddingRight: 16 } as any}>
        {items.map(n => (
          <div key={n.id} style={{
            display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start',
            padding: 14, borderRadius: 16,
            backgroundColor: !n.read ? colors.primary[50] : colors.gray[50],
          } as any}>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: !n.read ? colors.primary[100] : colors.gray[100],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginRight: 12,
            } as any}>
              <MoverNotifIcon type={n.icon} />
            </div>
            <div style={{ flex: 1, minWidth: 0 } as any}>
              <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' } as any}>
                {!n.read && <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary[500], marginRight: 8, flexShrink: 0 } as any} />}
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: n.read ? 400 : 600, color: colors.gray[900] } as any}>{n.title}</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: colors.gray[500], marginTop: 3, display: 'block', lineHeight: '20px' } as any}>{n.body}</span>
            </div>
            <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], marginLeft: 10, whiteSpace: 'nowrap' as const, flexShrink: 0, marginTop: 2 } as any}>{n.time}</span>
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
          animation: closing ? 'mFadeOut 0.28s ease forwards' : 'mFadeIn 0.28s ease forwards',
        } as any} />
      </Pressable>
      <div
        ref={sheetRef as any}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          maxHeight: '65%', backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          display: 'flex', flexDirection: 'column' as const,
          animation: closing ? 'mSheetDown 0.28s ease forwards' : 'mSheetUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
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
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
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
   Component
   ═══════════════════════════════════════════ */

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  activeMove,
  stats,
  activity,
  onTabPress,
  onAdvanceStep,
  onViewMoveDetails,
  onCallClient,
  onChatClient,
  onNotifications,
  contractPending,
  onSignContract,
  role,
}) => {
  const firstName = userName.split(' ')[0] || 'Mover';
  const stepIdx = activeMove ? STEP_ORDER.indexOf(activeMove.step) : -1;
  const isCompleted = activeMove?.step === 'completed';
  const [activityFilter, setActivityFilter] = useState<'all' | 'completed' | 'review' | 'payment' | 'new_order'>('all');
  const [notifVisible, setNotifVisible] = useState(false);
  const earningsPeriods = ['This week', 'This month', 'All time'] as const;
  type EarningsPeriod = typeof earningsPeriods[number];
  const [earningsPeriod, setEarningsPeriod] = useState<EarningsPeriod>('This month');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  // Period-based stats
  const periodStats: Record<EarningsPeriod, { earnings: number; completed: number; inProgress: number; pending: number }> = {
    'This week': { earnings: Math.round(stats.earnings * 0.25), completed: Math.round(stats.completedMoves * 0.2), inProgress: activeMove && !isCompleted ? 1 : 0, pending: 0 },
    'This month': { earnings: stats.earnings, completed: stats.completedMoves, inProgress: activeMove && !isCompleted ? 1 : 0, pending: 0 },
    'All time': { earnings: Math.round(stats.earnings * 4.2), completed: Math.round(stats.completedMoves * 4.2), inProgress: activeMove && !isCompleted ? 1 : 0, pending: 0 },
  };
  const currentPeriodStats = periodStats[earningsPeriod];

  /* ── Step Progress Dots ── */
  const renderStepProgress = () => {
    // Show 8 step dots
    const totalSteps = STEP_ORDER.length;
    return (
      <View style={styles.stepsRow}>
        {STEP_ORDER.map((s, i) => {
          const done = i < stepIdx;
          const current = i === stepIdx;
          return (
            <React.Fragment key={s}>
              <View style={[
                styles.stepDot,
                done && styles.stepDotDone,
                current && styles.stepDotCurrent,
              ]}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFFFFF">
                    <path d="M5 12L10 17L19 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </View>
              {i < totalSteps - 1 && (
                <View style={[styles.stepLine, done && styles.stepLineDone]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Header ─── */}
          <View style={styles.header}>
            <View>
              <Text variant="h4" color="#212225">
                Hey, {firstName}
              </Text>
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[500], marginTop: 2, letterSpacing: -0.32 } as any}>
                  {activeMove && !isCompleted ? 'You have an active move' : "Here's your overview"}
                </span>
              ) : (
                <Text variant="bodySm" color={colors.gray[500]}>
                  {activeMove && !isCompleted ? 'You have an active move' : "Here's your overview"}
                </Text>
              )}
            </View>
            <Pressable onPress={() => setNotifVisible(true)} style={styles.bellBtn}>
              <BellIcon />
            </Pressable>
          </View>

          {/* ─── Earnings Summary Widget (hidden for mover role) ─── */}
          {role === 'mover' ? null : Platform.OS === 'web' ? (
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: 20,
              marginBottom: 14, overflow: 'hidden',
            } as any}>
              {/* Header row */}
              <div style={{
                display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px 0 20px',
              } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10 } as any}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  } as any}>
                    <DollarIcon color={colors.primary[500]} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.32 } as any}>
                    Earnings Summary
                  </span>
                </div>
                <div style={{ position: 'relative' } as any}>
                  <div
                    onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                    style={{
                      padding: '5px 10px 5px 12px', borderRadius: 8,
                      backgroundColor: colors.gray[50],
                      display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 4,
                      cursor: 'pointer', userSelect: 'none',
                    } as any}
                  >
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[500], letterSpacing: -0.24 } as any}>
                      {earningsPeriod}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: periodDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' } as any}>
                      <path d="M6 9L12 15L18 9" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {periodDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 4,
                      backgroundColor: '#FFFFFF', borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      padding: 4, zIndex: 100, minWidth: 120,
                    } as any}>
                      {earningsPeriods.map(p => (
                        <div
                          key={p}
                          onClick={() => { setEarningsPeriod(p); setPeriodDropdownOpen(false); }}
                          style={{
                            padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                            backgroundColor: earningsPeriod === p ? colors.primary[50] : 'transparent',
                            transition: 'background-color 150ms ease',
                          } as any}
                          onMouseEnter={(e: any) => { if (earningsPeriod !== p) e.currentTarget.style.backgroundColor = colors.gray[50]; }}
                          onMouseLeave={(e: any) => { if (earningsPeriod !== p) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <span style={{
                            fontFamily: F, fontSize: 13, fontWeight: earningsPeriod === p ? 600 : 400,
                            color: earningsPeriod === p ? colors.primary[500] : colors.gray[700],
                            letterSpacing: -0.26, whiteSpace: 'nowrap' as const,
                          } as any}>
                            {p}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Big number — left aligned */}
              <div style={{
                display: 'flex', flexDirection: 'column' as const,
                padding: '24px 20px 24px 20px',
              } as any}>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[400], letterSpacing: 1.2, textTransform: 'uppercase' as const } as any}>
                  EARNED
                </span>
                <span style={{ fontFamily: F, fontSize: 40, fontWeight: 700, color: colors.gray[900], letterSpacing: -1, marginTop: 4 } as any}>
                  ${(currentPeriodStats.earnings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: colors.gray[100], marginLeft: 20, marginRight: 20 } as any} />

              {/* Mini stats row */}
              <div style={{
                display: 'flex', flexDirection: 'row' as const,
                padding: '18px 10px 20px 10px',
              } as any}>
                {([
                  { num: currentPeriodStats.completed, label: 'Completed', bg: colors.primary[50], color: colors.primary[500], icon: 'check' },
                  { num: currentPeriodStats.inProgress, label: 'In Progress', bg: colors.warning[50], color: colors.warning[500], icon: 'clock' },
                  { num: currentPeriodStats.pending, label: 'Pending', bg: colors.gray[50], color: colors.gray[400], icon: 'pending' },
                ] as const).map((w, wi) => (
                  <React.Fragment key={wi}>
                  {wi > 0 && (
                    <div style={{ width: 1, backgroundColor: colors.gray[100], alignSelf: 'stretch', marginTop: 4, marginBottom: 4 } as any} />
                  )}
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8,
                  } as any}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 18, backgroundColor: w.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    } as any}>
                      {w.icon === 'check' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke={w.color} strokeWidth="2"/>
                          <path d="M8 12L11 15L16 9" stroke={w.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {w.icon === 'clock' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke={w.color} strokeWidth="2"/>
                          <path d="M12 6V12L16 14" stroke={w.color} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {w.icon === 'pending' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke={w.color} strokeWidth="2"/>
                          <circle cx="8" cy="12" r="1.2" fill={w.color}/>
                          <circle cx="12" cy="12" r="1.2" fill={w.color}/>
                          <circle cx="16" cy="12" r="1.2" fill={w.color}/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[400], letterSpacing: -0.26, whiteSpace: 'nowrap' as const } as any}>
                      {w.label}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.36 } as any}>
                      {w.num}
                    </span>
                  </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <View style={styles.statsRow}>
              <View style={[styles.statCard, cleanCard]}>
                <Text variant="bodyLgBold" color="#212225">${(stats.earnings).toLocaleString()}</Text>
                <Text variant="bullit" color={colors.gray[500]}>Earned</Text>
              </View>
            </View>
          )}

          {/* ─── Active Move Card ─── */}
          {activeMove && !isCompleted && (
            <View style={[styles.activeMoveCard, cleanCard]}>
              {/* Live badge */}
              <View style={styles.liveBadgeRow}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: '#FFFFFF', letterSpacing: 0.5, textTransform: 'uppercase' } as any}>
                      Live
                    </span>
                  ) : (
                    <Text variant="bullit" color="#FFFFFF">LIVE</Text>
                  )}
                </View>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: colors.primary[500], letterSpacing: -0.36 } as any}>
                    ${activeMove.price}
                  </span>
                ) : (
                  <Text variant="bodyMdSemibold" color={colors.primary[500]}>${activeMove.price}</Text>
                )}
              </View>

              {/* Client info */}
              <View style={styles.clientRow}>
                <View style={styles.avatarSm}>
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.primary[500], letterSpacing: -0.28 } as any}>
                      {activeMove.client.split(' ').map(n => n[0]).join('')}
                    </span>
                  ) : (
                    <Text variant="bullitLg" color={colors.primary[500]}>
                      {activeMove.client.split(' ').map(n => n[0]).join('')}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMd" color="#212225">{activeMove.client}</Text>
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[500], marginTop: 2, letterSpacing: -0.24 } as any}>
                      {activeMove.date} · {activeMove.time} · {activeMove.rooms} rooms
                    </span>
                  ) : (
                    <Text variant="bullit" color={colors.gray[500]}>
                      {activeMove.date} · {activeMove.time} · {activeMove.rooms} rooms
                    </Text>
                  )}
                </View>
                {/* Quick actions */}
                <Pressable onPress={onCallClient} style={styles.iconBtn}>
                  <PhoneIcon />
                </Pressable>
                <Pressable onPress={onChatClient} style={styles.iconBtn}>
                  <ChatBubbleIcon />
                </Pressable>
              </View>

              {/* Route */}
              <View style={styles.routeBlock}>
                <View style={styles.routeDots}>
                  <View style={[styles.routeDot, { backgroundColor: colors.primary[500] }]} />
                  <View style={styles.routeLine} />
                  <View style={[styles.routeDot, { backgroundColor: '#10B981' }]} />
                </View>
                <View style={{ flex: 1 }}>
                  {Platform.OS === 'web' ? (
                    <>
                      <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[700], lineHeight: '22px', letterSpacing: -0.32 } as any}>{activeMove.from}</span>
                      <View style={{ height: 10 }} />
                      <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[700], lineHeight: '22px', letterSpacing: -0.32 } as any}>{activeMove.to}</span>
                    </>
                  ) : (
                    <>
                      <Text variant="bodySm" color={colors.gray[700]}>{activeMove.from}</Text>
                      <View style={{ height: 10 }} />
                      <Text variant="bodySm" color={colors.gray[700]}>{activeMove.to}</Text>
                    </>
                  )}
                </View>
              </View>

              {/* Step progress */}
              <View style={styles.stepSection}>
                <View style={styles.stepLabelRow}>
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: 0.5 } as any}>
                      Step {stepIdx + 1} of {STEP_ORDER.length}: {STEP_LABELS[activeMove.step]}
                    </span>
                  ) : (
                    <Text variant="bullit" color={colors.gray[500]}>
                      Step {stepIdx + 1} of {STEP_ORDER.length}: {STEP_LABELS[activeMove.step]}
                    </Text>
                  )}
                  <Pressable onPress={onViewMoveDetails} hitSlop={8}>
                    {Platform.OS === 'web' ? (
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.primary[500], letterSpacing: -0.24 } as any}>
                        View details
                      </span>
                    ) : (
                      <Text variant="bullit" color={colors.primary[500]}>View details</Text>
                    )}
                  </Pressable>
                </View>
                <View style={{ height: 12 }} />
                {renderStepProgress()}
              </View>

              {/* Action — show Sign Contract button at arrived_pickup if contract not yet signed */}
              {contractPending && activeMove.step === 'arrived_pickup' ? (
                <Pressable
                  onPress={onSignContract}
                  style={({ pressed }) => ({
                    height: 58, borderRadius: 29,
                    backgroundColor: pressed ? colors.primary[600] : colors.primary[500],
                    alignItems: 'center', justifyContent: 'center',
                    width: '100%',
                  } as any)}
                >
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.3, userSelect: 'none' } as any}>
                      Sign Contract
                    </span>
                  ) : null}
                </Pressable>
              ) : (
                <SwipeButton
                  title={STEP_ACTION[activeMove.step]}
                  onSwipeComplete={onAdvanceStep}
                />
              )}
            </View>
          )}

          {/* ─── No Active Move ─── */}
          {(!activeMove || isCompleted) && (
            <View style={[styles.noMoveCard, cleanCard]}>
              <View style={styles.noMoveIcon}>
                <NavigationIcon color={colors.gray[300]} />
              </View>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: '#212225', marginTop: 12, letterSpacing: -0.36 } as any}>No active move</span>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[500], marginTop: 4, letterSpacing: -0.32 } as any}>You'll see your next move here once assigned</span>
                </>
              ) : (
                <>
                  <Text variant="bodyMdSemibold" color="#212225">No active move</Text>
                  <Text variant="bodySm" color={colors.gray[500]}>You'll see your next move here once assigned</Text>
                </>
              )}
            </View>
          )}

          {/* ─── Recent Activity (section block) ─── */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: 20,
            marginBottom: 20, overflow: 'hidden',
          } as any}>
            {/* Section header */}
            <div style={{
              padding: '18px 18px 0 18px',
            } as any}>
              <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.4 } as any}>
                Recent Activity
              </span>
            </div>

            {/* Filter tabs */}
            <div style={{
              display: 'flex', flexDirection: 'row' as const, gap: 6,
              padding: '20px 18px 2px 18px',
              overflowX: 'auto' as const,
            } as any}>
              {([
                { key: 'all', label: 'All' },
                ...(role !== 'mover' ? [{ key: 'payment' as const, label: 'Transactions' }] : []),
                { key: 'review', label: 'Reviews' },
                { key: 'new_order', label: 'Orders' },
                { key: 'completed', label: 'Completed' },
              ] as { key: typeof activityFilter; label: string }[]).map(tab => {
                const isActive = activityFilter === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setActivityFilter(tab.key)}
                    style={({ pressed }) => [{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 10,
                      backgroundColor: isActive ? colors.primary[500] : colors.gray[50],
                    }, pressed && { opacity: 0.7 }]}
                  >
                    <span style={{
                      fontFamily: F, fontSize: 13, fontWeight: 600, letterSpacing: -0.26,
                      color: isActive ? '#FFFFFF' : colors.gray[500],
                    } as any}>{tab.label}</span>
                  </Pressable>
                );
              })}
            </div>

            {/* Activity items */}
            <div style={{ paddingTop: 6, paddingBottom: 8 } as any}>
              {(() => {
                const roleFiltered = role === 'mover' ? activity.filter(a => a.type !== 'payment') : activity;
                const filtered = activityFilter === 'all' ? roleFiltered : roleFiltered.filter(a => a.type === activityFilter);
                if (filtered.length === 0) return (
                  <div style={{ padding: '28px 18px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' } as any}>
                    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: colors.gray[400], letterSpacing: -0.32 } as any}>
                      No activity yet
                    </span>
                  </div>
                );
                return filtered.map((item, i) => {
                  const dotColor = item.type === 'completed' ? colors.success[500] : item.type === 'review' ? '#F59E0B' : item.type === 'payment' ? colors.primary[500] : '#8B5CF6';
                  const dotBg = item.type === 'completed' ? colors.success[50] : item.type === 'review' ? '#FEF3C7' : item.type === 'payment' ? colors.primary[50] : '#F5F3FF';
                  const typeLabel = item.type === 'completed' ? 'Move' : item.type === 'review' ? 'Review' : item.type === 'payment' ? 'Transaction' : 'Order';
                  return (
                    <div key={item.id} style={{
                      display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 14,
                      padding: '14px 18px',
                    } as any}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, backgroundColor: dotBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      } as any}>
                        {item.type === 'completed' && <CheckCircleIcon color={dotColor} />}
                        {item.type === 'review' && <StarIcon size={20} color={dotColor} />}
                        {item.type === 'payment' && <DollarIcon color={dotColor} />}
                        {item.type === 'new_order' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="7" width="13" height="9" rx="1.5" stroke={dotColor} strokeWidth="1.8"/>
                            <path d="M15 10H18L21 13V16H15V10Z" stroke={dotColor} strokeWidth="1.8" strokeLinejoin="round"/>
                            <circle cx="7" cy="18" r="2" stroke={dotColor} strokeWidth="1.8"/>
                            <circle cx="18" cy="18" r="2" stroke={dotColor} strokeWidth="1.8"/>
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.32, display: 'block' } as any}>
                          {item.text}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, marginTop: 5 } as any}>
                          <span style={{
                            fontFamily: F, fontSize: 12, fontWeight: 500, color: dotColor, letterSpacing: -0.24,
                            backgroundColor: dotBg, paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2,
                            borderRadius: 6,
                          } as any}>
                            {typeLabel}
                          </span>
                          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: colors.gray[400], letterSpacing: -0.26 } as any}>
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <View style={{ height: 80 }} />
        </ScrollView>

        <TabBar active="dashboard" onTabPress={onTabPress} variant="default" role={role} />

        {/* Notifications panel */}
        <NotificationsPanel visible={notifVisible} onClose={() => setNotifVisible(false)} />
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { flex: 1 },
  scrollInner: { paddingHorizontal: 16, paddingTop: 16 },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Active Move Card */
  activeMoveCard: {
    padding: 20,
    marginBottom: 24,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50] || '#EFF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[50] || '#EFF8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    marginBottom: 16,
  },
  routeDots: {
    width: 12,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    marginRight: 10,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E4E7EC',
    marginVertical: 2,
  },

  /* Step Progress */
  stepSection: {
    marginBottom: 20,
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E4E7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#10B981',
  },
  stepDotCurrent: {
    backgroundColor: colors.primary[500],
    ...Platform.select({
      web: { boxShadow: `0 0 0 3px ${colors.primary[100] || 'rgba(46,144,250,0.2)'}` } as any,
      default: {},
    }),
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E4E7EC',
    marginHorizontal: 2,
  },
  stepLineDone: {
    backgroundColor: '#10B981',
  },

  /* No Active Move */
  noMoveCard: {
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  noMoveIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[50] || '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stats */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statIconRow: {
    marginBottom: 4,
  },

  /* Activity */
  activityCard: {
    padding: 0,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  activityBorder: {
  },
});
