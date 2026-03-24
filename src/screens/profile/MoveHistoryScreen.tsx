/**
 * AI Moving — Move History Screen (Mover side)
 *
 * List of completed / cancelled moves.
 * Card style matches OrdersScreen design system.
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBarMock, Navbar, Button } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

export interface MoveRecord {
  id: string;
  status: 'completed' | 'cancelled';
  fromAddress: string;
  toAddress: string;
  date: string;
  moverName: string;
  moverRating: number;
  crewSize: number;
  totalPrice: number;
  duration: string;
  roomsCount: number;
  itemsCount: number;
  volume: string;
}

export interface MoveHistoryScreenProps {
  moves: MoveRecord[];
  onBack: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

type ViewType = 'list' | 'detail' | 'document';

interface DocumentItem {
  name: string;
  type: 'confirmation' | 'invoice' | 'insurance';
}

const DOCUMENTS: DocumentItem[] = [
  { name: 'Move Confirmation', type: 'confirmation' },
  { name: 'Invoice', type: 'invoice' },
  { name: 'Insurance Certificate', type: 'insurance' },
];

const CEO_DEMO_MOVES: MoveRecord[] = [
  {
    id: 'move-2401',
    status: 'completed',
    fromAddress: '1200 Sunset Blvd, Los Angeles, CA 90026',
    toAddress: '8500 Melrose Ave, West Hollywood, CA 90069',
    date: 'Mar 20, 2026',
    moverName: 'Dmitriy K.',
    moverRating: 5,
    crewSize: 3,
    totalPrice: 1250,
    duration: '4h 30m',
    roomsCount: 3,
    itemsCount: 45,
    volume: '1,200 cu ft',
  },
  {
    id: 'move-2402',
    status: 'completed',
    fromAddress: '2100 Century Park E, Century City, CA 90067',
    toAddress: '3600 Wilshire Blvd, Los Angeles, CA 90010',
    date: 'Mar 19, 2026',
    moverName: 'Alex M.',
    moverRating: 4,
    crewSize: 2,
    totalPrice: 850,
    duration: '3h 15m',
    roomsCount: 2,
    itemsCount: 32,
    volume: '850 cu ft',
  },
  {
    id: 'move-2403',
    status: 'completed',
    fromAddress: '450 N Roxbury Dr, Beverly Hills, CA 90210',
    toAddress: '9001 Wilshire Blvd, Beverly Hills, CA 90210',
    date: 'Mar 18, 2026',
    moverName: 'James L.',
    moverRating: 5,
    crewSize: 4,
    totalPrice: 1850,
    duration: '5h 45m',
    roomsCount: 5,
    itemsCount: 78,
    volume: '1,850 cu ft',
  },
  {
    id: 'move-2404',
    status: 'cancelled',
    fromAddress: '1875 Century Park E, Los Angeles, CA 90067',
    toAddress: '11000 Santa Monica Blvd, Los Angeles, CA 90025',
    date: 'Mar 17, 2026',
    moverName: 'Carlos R.',
    moverRating: 3,
    crewSize: 2,
    totalPrice: 650,
    duration: '2h 30m',
    roomsCount: 1,
    itemsCount: 20,
    volume: '650 cu ft',
  },
  {
    id: 'move-2405',
    status: 'completed',
    fromAddress: '6363 Wilshire Blvd, Los Angeles, CA 90048',
    toAddress: '5900 Wilshire Blvd, Los Angeles, CA 90036',
    date: 'Mar 16, 2026',
    moverName: 'Marcus T.',
    moverRating: 4,
    crewSize: 3,
    totalPrice: 1100,
    duration: '3h 45m',
    roomsCount: 3,
    itemsCount: 50,
    volume: '1,100 cu ft',
  },
  {
    id: 'move-2406',
    status: 'completed',
    fromAddress: '4000 Highland Ave, Los Angeles, CA 90028',
    toAddress: '7100 Hollywood Blvd, Los Angeles, CA 90028',
    date: 'Mar 15, 2026',
    moverName: 'Dmitriy K.',
    moverRating: 5,
    crewSize: 2,
    totalPrice: 950,
    duration: '3h 20m',
    roomsCount: 2,
    itemsCount: 38,
    volume: '950 cu ft',
  },
  {
    id: 'move-2407',
    status: 'completed',
    fromAddress: '1050 S Olive St, Los Angeles, CA 90015',
    toAddress: '2200 Park Ave, Los Angeles, CA 90026',
    date: 'Mar 14, 2026',
    moverName: 'James L.',
    moverRating: 5,
    crewSize: 3,
    totalPrice: 1400,
    duration: '4h 10m',
    roomsCount: 3,
    itemsCount: 55,
    volume: '1,350 cu ft',
  },
  {
    id: 'move-2408',
    status: 'cancelled',
    fromAddress: '8060 Melrose Ave, Los Angeles, CA 90046',
    toAddress: '8701 Santa Monica Blvd, West Hollywood, CA 90069',
    date: 'Mar 13, 2026',
    moverName: 'Alex M.',
    moverRating: 4,
    crewSize: 2,
    totalPrice: 780,
    duration: '2h 45m',
    roomsCount: 2,
    itemsCount: 28,
    volume: '780 cu ft',
  },
  {
    id: 'move-2409',
    status: 'completed',
    fromAddress: '5240 Lankershim Blvd, North Hollywood, CA 91601',
    toAddress: '4520 Cahuenga Blvd, Los Angeles, CA 90027',
    date: 'Mar 12, 2026',
    moverName: 'Marcus T.',
    moverRating: 4,
    crewSize: 3,
    totalPrice: 1180,
    duration: '4h 00m',
    roomsCount: 3,
    itemsCount: 48,
    volume: '1,150 cu ft',
  },
  {
    id: 'move-2410',
    status: 'completed',
    fromAddress: '1500 Cahuena Blvd, Los Angeles, CA 90028',
    toAddress: '6255 Wilshire Blvd, Los Angeles, CA 90048',
    date: 'Mar 11, 2026',
    moverName: 'Carlos R.',
    moverRating: 3,
    crewSize: 2,
    totalPrice: 920,
    duration: '3h 30m',
    roomsCount: 2,
    itemsCount: 40,
    volume: '920 cu ft',
  },
];

const F = 'Inter, system-ui, sans-serif';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: 'Completed', color: colors.gray[500], bg: colors.gray[100] },
  cancelled: { label: 'Cancelled', color: colors.error[600] || '#D92D20', bg: colors.error[50] || '#FEF3F2' },
};

/* ── SVG Icons (18×18, stroke style matching OrdersScreen) ── */

const IconTruck = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="13" height="9" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <path d="M15 10H18L21 13V16H15V10Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="7" cy="18" r="2" stroke={color} strokeWidth="1.8"/>
    <circle cx="18" cy="18" r="2" stroke={color} strokeWidth="1.8"/>
  </svg>
);

const IconCalendar = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" />
    <path d="M3 10H21" stroke={color} strokeWidth="1.8" />
    <path d="M8 2V6M16 2V6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconHome = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClock = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <path d="M12 7V12L15 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconUser = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconBox = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 8V21H3V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 3H1V8H23V3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12H14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const StarRow = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 2 } as any}>
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 1l2.47 5.01L18 6.87l-4 3.9.94 5.5L10 13.4l-4.94 2.87.94-5.5-4-3.9 5.53-.86L10 1Z"
          fill={i <= rating ? '#FACC15' : colors.gray[200]}
        />
      </svg>
    ))}
  </div>
);

const IconDoc = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 13H16M8 17H13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconDownload = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ── InfoRow — icon + text, matching OrdersScreen ── */
const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10, marginTop: 10 } as any}>
    {icon}
    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[600], letterSpacing: -0.32 } as any}>
      {text}
    </span>
  </div>
);

const shortAddr = (addr: string) => {
  const parts = addr.split(',');
  return parts[0].trim();
};

/* ═══════════════════════════════════════════
   LIST VIEW
   ═══════════════════════════════════════════ */

const ListView: React.FC<{
  moves: MoveRecord[];
  onBack: () => void;
  onSelectMove: (m: MoveRecord) => void;
  role?: 'mover' | 'sales' | 'ceo';
}> = ({ moves, onBack, onSelectMove, role = 'mover' }) => {
  if (Platform.OS !== 'web') return null;

  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [moverFilter, setMoverFilter] = useState<string>('all');

  const displayMoves = role === 'ceo' && moves.length === 0 ? CEO_DEMO_MOVES : moves;

  // Get unique mover names for CEO filter
  const moverNames = Array.from(new Set(displayMoves.map(m => m.moverName))).sort();

  // Filter moves based on selected filters (CEO only)
  let filteredMoves = displayMoves;
  if (role === 'ceo') {
    if (statusFilter !== 'all') {
      filteredMoves = filteredMoves.filter(m => m.status === statusFilter);
    }
    if (moverFilter !== 'all') {
      filteredMoves = filteredMoves.filter(m => m.moverName === moverFilter);
    }
  }

  // Calculate stats for CEO
  const totalMoves = filteredMoves.length;
  const totalRevenue = filteredMoves.reduce((sum, m) => sum + m.totalPrice, 0);
  const avgPrice = totalMoves > 0 ? Math.round(totalRevenue / totalMoves) : 0;

  const ChipButton = ({ label, value, isActive, onPress }: { label: string; value: string | number; isActive: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <div style={{
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 10,
        backgroundColor: isActive ? colors.primary[500] : colors.gray[50],
        cursor: 'pointer',
      } as any}>
        <span style={{
          fontFamily: F,
          fontSize: 13,
          fontWeight: 600,
          color: isActive ? 'white' : colors.gray[500],
          letterSpacing: -0.26,
        } as any}>
          {label}
        </span>
      </div>
    </Pressable>
  );

  const StatCard = ({ number, label, accent }: { number: string | number; label: string; accent?: boolean }) => (
    <div style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column' as const,
    } as any}>
      <span style={{
        fontFamily: F,
        fontSize: 12,
        fontWeight: 500,
        color: colors.gray[400],
        letterSpacing: -0.24,
        display: 'block',
        marginBottom: 8,
      } as any}>
        {label}
      </span>
      <span style={{
        fontFamily: F,
        fontSize: 26,
        fontWeight: 800,
        color: accent ? colors.primary[500] : colors.gray[900],
        letterSpacing: -0.8,
        display: 'block',
      } as any}>
        {number}
      </span>
    </div>
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBarMock />
      <Navbar title="Move History" onBack={onBack} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* CEO Stats Summary */}
        {role === 'ceo' && filteredMoves.length > 0 && (
          <>
            {/* Revenue hero */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 20,
              marginBottom: 10,
            } as any}>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[400], display: 'block', marginBottom: 8 } as any}>
                Total Revenue
              </span>
              <span style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -1 } as any}>
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            {/* Metrics row */}
            <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 10, marginBottom: 16 } as any}>
              <StatCard number={totalMoves} label="Total Moves" />
              <StatCard number={`$${avgPrice.toLocaleString()}`} label="Avg Price" accent />
            </div>
          </>
        )}

        {/* CEO Status Filter Chips */}
        {role === 'ceo' && (
          <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8, marginBottom: 12 } as any}>
            <ChipButton label="All" value="all" isActive={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
            <ChipButton label="Completed" value="completed" isActive={statusFilter === 'completed'} onPress={() => setStatusFilter('completed')} />
            <ChipButton label="Cancelled" value="cancelled" isActive={statusFilter === 'cancelled'} onPress={() => setStatusFilter('cancelled')} />
          </div>
        )}

        {/* CEO Mover Filter Chips */}
        {role === 'ceo' && (
          <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8, marginBottom: 16, flexWrap: 'wrap' as const } as any}>
            <ChipButton label="All Movers" value="all" isActive={moverFilter === 'all'} onPress={() => setMoverFilter('all')} />
            {moverNames.map(name => (
              <ChipButton
                key={name}
                label={name}
                value={name}
                isActive={moverFilter === name}
                onPress={() => setMoverFilter(name)}
              />
            ))}
          </div>
        )}

        {filteredMoves.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: colors.gray[100],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            } as any}>
              <IconClock color={colors.gray[300]} />
            </div>
            <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, letterSpacing: -0.32, color: colors.gray[900], textAlign: 'center' } as any}>
              No moves yet
            </span>
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: colors.gray[400], textAlign: 'center', marginTop: 6, lineHeight: '16px' } as any}>
              {role === 'ceo' ? 'No moves match your filters' : 'Your completed moves will appear here'}
            </span>
          </View>
        ) : (
          <View style={{ gap: 12 } as any}>
            {filteredMoves.map((move) => {
              const cfg = STATUS_CONFIG[move.status];
              const num = move.id.replace(/\D/g, '') || '0';
              return (
                <Pressable
                  key={move.id}
                  onPress={() => onSelectMove(move)}
                  style={({ pressed }) => [s.card as any, pressed && { opacity: 0.7 }]}
                >
                  {/* Title + status badge */}
                  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10 } as any}>
                    <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.4 } as any}>
                      Move #{num}
                    </span>
                    <div style={{
                      backgroundColor: cfg.bg,
                      paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 10,
                    } as any}>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: cfg.color } as any}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Info rows */}
                  <InfoRow icon={<IconTruck />} text={`${shortAddr(move.fromAddress)} → ${shortAddr(move.toAddress)}`} />
                  <InfoRow icon={<IconCalendar />} text={move.date} />
                  <InfoRow icon={<IconUser />} text={role === 'ceo' ? `Mover: ${move.moverName}` : move.moverName} />

                  {/* Separator + bottom */}
                  <div style={{
                    display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
                    marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.gray[100]}`,
                  } as any}>
                    <div>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: colors.gray[400], display: 'block' } as any}>
                        {role === 'ceo' ? 'Revenue' : 'Earned'}
                      </span>
                      <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.4 } as any}>
                        ${move.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <StarRow rating={move.moverRating} />
                  </div>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   DETAIL VIEW
   ═══════════════════════════════════════════ */

const DetailInfoRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
  <div style={{
    display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, paddingBottom: 12,
    borderBottom: last ? 'none' : `1px solid ${colors.gray[100]}`,
  } as any}>
    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[400], letterSpacing: -0.32 } as any}>{label}</span>
    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: colors.gray[900], letterSpacing: -0.32 } as any}>{value}</span>
  </div>
);

const SectionLabel = ({ text }: { text: string }) => (
  <span style={{
    fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[400],
    letterSpacing: 0.5, textTransform: 'uppercase',
    display: 'block', marginTop: 20, marginBottom: 10,
  } as any}>
    {text}
  </span>
);

const DetailView: React.FC<{
  move: MoveRecord;
  onBack: () => void;
  onSelectDocument: (d: DocumentItem) => void;
}> = ({ move, onBack, onSelectDocument }) => {
  if (Platform.OS !== 'web') return null;

  const cfg = STATUS_CONFIG[move.status];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBarMock />
      <Navbar title="Move Details" onBack={onBack} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* Status badge */}
        <div style={{
          backgroundColor: cfg.bg,
          paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 10,
          alignSelf: 'flex-start', marginBottom: 16,
          display: 'inline-block',
        } as any}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: cfg.color } as any}>
            {cfg.label}
          </span>
        </div>

        {/* Route card */}
        <SectionLabel text="Route" />
        <div style={s.card as any}>
          <InfoRow icon={<IconTruck />} text={move.fromAddress} />
          <div style={{ width: 1, height: 12, backgroundColor: colors.gray[200], marginLeft: 9, marginTop: 4, marginBottom: 4 } as any} />
          <InfoRow icon={<IconTruck />} text={move.toAddress} />
        </div>

        {/* Date & Time */}
        <SectionLabel text="Date & Time" />
        <div style={s.card as any}>
          <DetailInfoRow label="Date" value={move.date} />
          <DetailInfoRow label="Duration" value={move.duration} last />
        </div>

        {/* Client */}
        <SectionLabel text="Client" />
        <div style={s.card as any}>
          <DetailInfoRow label="Name" value={move.moverName} />
          <div style={{
            display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 12, paddingBottom: 12,
            borderBottom: `1px solid ${colors.gray[100]}`,
          } as any}>
            <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[400], letterSpacing: -0.32 } as any}>Rating</span>
            <StarRow rating={move.moverRating} />
          </div>
          <DetailInfoRow label="Crew" value={`${move.crewSize} people`} last />
        </div>

        {/* Items */}
        <SectionLabel text="Items" />
        <div style={s.card as any}>
          <DetailInfoRow label="Rooms" value={`${move.roomsCount}`} />
          <DetailInfoRow label="Items" value={`${move.itemsCount}`} />
          <DetailInfoRow label="Volume" value={move.volume} last />
        </div>

        {/* Earnings Breakdown */}
        <SectionLabel text="Earnings Breakdown" />
        <div style={s.card as any}>
          <DetailInfoRow label="Base Price" value={`$${(move.totalPrice * 0.6).toFixed(0)}`} />
          <DetailInfoRow label="Labor" value={`$${(move.totalPrice * 0.25).toFixed(0)}`} />
          <DetailInfoRow label="Fuel" value={`$${(move.totalPrice * 0.1).toFixed(0)}`} />
          <DetailInfoRow label="Platform Fee" value={`-$${(move.totalPrice * 0.05).toFixed(0)}`} />
          <div style={{
            display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center',
            paddingTop: 14, paddingBottom: 4, marginTop: 4,
          } as any}>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.36 } as any}>Total Earned</span>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: colors.primary[500], letterSpacing: -0.36 } as any}>${move.totalPrice}</span>
          </div>
        </div>

        {/* Documents */}
        <SectionLabel text="Documents" />
        <div style={{ ...s.card as any, padding: 0, overflow: 'hidden' } as any}>
          {DOCUMENTS.map((doc, i) => (
            <Pressable
              key={doc.type}
              onPress={() => onSelectDocument(doc)}
              style={({ pressed }) => [{
                flexDirection: 'row' as const,
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: i < DOCUMENTS.length - 1 ? 1 : 0,
                borderBottomColor: colors.gray[100],
                gap: 12,
              }, pressed && { opacity: 0.7 }]}
            >
              <IconDoc color={colors.primary[500]} />
              <span style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: colors.gray[900], flex: 1, letterSpacing: -0.32 } as any}>
                {doc.name}
              </span>
              <IconChevron />
            </Pressable>
          ))}
        </div>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   DOCUMENT VIEW
   ═══════════════════════════════════════════ */

const DocumentView: React.FC<{ document: DocumentItem; onBack: () => void }> = ({ document, onBack }) => (
  <SafeAreaView style={s.safe}>
    <StatusBarMock />
    <Navbar title={document.name} onBack={onBack} />
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <IconDownload />
        {Platform.OS === 'web' && (
          <>
            <span style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: colors.gray[900], marginTop: 16, marginBottom: 4, letterSpacing: -0.36 } as any}>
              {document.name}
            </span>
            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: colors.gray[400], letterSpacing: -0.28 } as any}>
              PDF Document
            </span>
          </>
        )}
      </View>
      <Button onPress={() => {}} title="Download" variant="primary" />
    </View>
  </SafeAreaView>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export const MoveHistoryScreen: React.FC<MoveHistoryScreenProps> = ({ moves, onBack, role = 'mover' }) => {
  const [view, setView] = useState<ViewType>('list');
  const [selected, setSelected] = useState<MoveRecord | null>(null);
  const [doc, setDoc] = useState<DocumentItem | null>(null);

  if (view === 'list') {
    return <ListView moves={moves} onBack={onBack} onSelectMove={(m) => { setSelected(m); setView('detail'); }} role={role} />;
  }

  if (view === 'detail' && selected) {
    return <DetailView move={selected} onBack={() => setView('list')} onSelectDocument={(d) => { setDoc(d); setView('document'); }} />;
  }

  if (view === 'document' && doc) {
    return <DocumentView document={doc} onBack={() => setView('detail')} />;
  }

  return null;
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  } as any,
});
