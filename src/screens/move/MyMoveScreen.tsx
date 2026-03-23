/**
 * AI Moving — My Move Screen (Tab: My Move)
 *
 * Full summary of the user's move:
 * - Status banner (phase-dependent)
 * - Move details (from/to, date, distance)
 * - AI Analysis summary (rooms, items, volume)
 * - Plan & pricing
 * - Assigned mover card
 * - Payment breakdown
 * - Important info / tips
 * - Documents section
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { TabBar, TabId } from '../home/TabBar';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type MoveStatus = 'searching' | 'booked' | 'inProgress' | 'completed';

interface MoverInfo {
  name: string;
  rating: number;
  reviews: number;
  truck: string;
  crewSize: number;
  phone: string;
}

interface MyMoveScreenProps {
  status: MoveStatus;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  distance: string;
  estimatedTime: string;
  planName: string;
  planPrice: number;
  depositPaid: number;
  roomsScanned: number;
  itemsDetected: number;
  totalVolume: string;
  mover?: MoverInfo;
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const ic = colors.gray[400];

const MapPinIcon = ({ color = ic }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 10C21 15.52 12 22 12 22C12 22 3 15.52 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M3 10H21" stroke={ic} strokeWidth="1.5" />
    <path d="M8 2V6M16 2V6" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DistanceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12H6L9 6L15 18L18 12H21" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={ic} strokeWidth="1.5" />
    <path d="M12 7V12L15 14" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 7V5C3 3.9 3.9 3 5 3H7" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 3H19C20.1 3 21 3.9 21 5V7" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 17V19C21 20.1 20.1 21 19 21H17" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 21H5C3.9 21 3 20.1 3 19V17" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="7" y="7" width="10" height="10" rx="1" stroke={colors.primary[500]} strokeWidth="1.5" />
  </svg>
);

const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22V12" stroke={ic} strokeWidth="1.5" />
    <path d="M3 8L12 14L21 8" stroke={ic} strokeWidth="1.5" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1" />
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="6" width="15" height="10" rx="1" stroke={ic} strokeWidth="1.5" />
    <path d="M16 10H19L22 13V16H16V10Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="6.5" cy="18" r="1.5" stroke={ic} strokeWidth="1.3" />
    <circle cx="19.5" cy="18" r="1.5" stroke={ic} strokeWidth="1.3" />
  </svg>
);

const CrewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke={ic} strokeWidth="1.5" />
    <path d="M15 8C16.66 8 18 9.12 18 10.5" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 20C3 17.24 5.69 15 9 15C12.31 15 15 17.24 15 20" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={colors.success[50]} stroke={colors.success[500]} strokeWidth="1.5" />
    <path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={ic} strokeWidth="1.5" />
    <path d="M12 7V17M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5C9 10.88 10.34 12 12 12C13.66 12 15 13.12 15 14.5C15 15.88 13.66 17 12 17C10.34 17 9 15.88 9 14.5" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7V12C3 16.97 7.03 22 12 22C16.97 22 21 16.97 21 12V7L12 2Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 12L11 15L16 9" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Status Banner
   ═══════════════════════════════════════════ */

const STATUS_CONFIG: Record<MoveStatus, { label: string; color: string; bgColor: string }> = {
  searching: { label: 'Finding Movers', color: colors.primary[600], bgColor: colors.primary[50] },
  booked: { label: 'Move Confirmed', color: colors.success[600], bgColor: colors.success[50] },
  inProgress: { label: 'Move in Progress', color: '#B54708', bgColor: '#FFFAEB' },
  completed: { label: 'Move Completed', color: colors.success[600], bgColor: colors.success[50] },
};

/* ═══════════════════════════════════════════
   Section Card
   ═══════════════════════════════════════════ */

const SectionCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <View style={s.sectionCard}>
    <View style={s.sectionHeader}>
      {Platform.OS === 'web' && icon}
      {Platform.OS === 'web' ? (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.gray[900], marginLeft: icon ? 8 : 0 } as any}>
          {title}
        </span>
      ) : null}
    </View>
    {children}
  </View>
);

/* ═══════════════════════════════════════════
   Detail Row
   ═══════════════════════════════════════════ */

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  hasDivider?: boolean;
}> = ({ icon, label, value, valueColor = colors.gray[900], hasDivider = true }) => (
  <>
    <View style={s.detailRow}>
      {Platform.OS === 'web' && icon}
      {Platform.OS === 'web' ? (
        <>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[500], flex: 1, marginLeft: 10 } as any}>
            {label}
          </span>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: valueColor } as any}>
            {value}
          </span>
        </>
      ) : null}
    </View>
    {hasDivider && <View style={s.divider} />}
  </>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const MyMoveScreen: React.FC<MyMoveScreenProps> = ({
  status,
  fromAddress,
  toAddress,
  moveDate,
  distance,
  estimatedTime,
  planName,
  planPrice,
  depositPaid,
  roomsScanned,
  itemsDetected,
  totalVolume,
  mover,
  onTabPress,
  onBack,
}) => {
  const remaining = planPrice - depositPaid;
  const statusCfg = STATUS_CONFIG[status];

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Header */}
        <View style={s.header}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 24, fontWeight: 700, color: colors.gray[900] } as any}>
              My Move
            </span>
          ) : null}
        </View>

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Status banner */}
          <View style={[s.statusBanner, { backgroundColor: statusCfg.bgColor }]}>
            {Platform.OS === 'web' ? (
              <>
                <View style={[s.statusDot, { backgroundColor: statusCfg.color }]} />
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: statusCfg.color, marginLeft: 8 } as any}>
                  {statusCfg.label}
                </span>
              </>
            ) : null}
          </View>

          {/* === Move Details === */}
          <SectionCard title="Move Details">
            <View style={{ height: 10 }} />
            <DetailRow icon={<MapPinIcon color={colors.primary[500]} />} label="From" value={fromAddress} />
            <DetailRow icon={<MapPinIcon color={colors.error[400]} />} label="To" value={toAddress} />
            <DetailRow icon={<CalendarIcon />} label="Date" value={moveDate} />
            <DetailRow icon={<DistanceIcon />} label="Distance" value={distance} />
            <DetailRow icon={<ClockIcon />} label="Est. Time" value={estimatedTime} hasDivider={false} />
          </SectionCard>

          {/* === AI Analysis === */}
          <SectionCard title="AI Analysis" icon={<ScanIcon />}>
            <View style={{ height: 10 }} />
            <View style={s.analysisRow}>
              {[
                { value: String(roomsScanned), label: 'Rooms' },
                { value: String(itemsDetected), label: 'Items' },
                { value: totalVolume, label: 'Volume' },
              ].map((item, i) => (
                <View key={i} style={s.analysisStat}>
                  {Platform.OS === 'web' ? (
                    <>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
                        {item.value}
                      </span>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>
                        {item.label}
                      </span>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          </SectionCard>

          {/* === Plan & Pricing === */}
          <SectionCard title="Plan & Pricing" icon={<DollarIcon />}>
            <View style={{ height: 10 }} />
            <DetailRow icon={<BoxIcon />} label="Plan" value={planName} />
            <DetailRow icon={<DollarIcon />} label="Total" value={`$${planPrice.toLocaleString()}`} valueColor={colors.gray[900]} />
            <DetailRow icon={<CheckIcon />} label="Deposit Paid" value={`$${depositPaid}`} valueColor={colors.success[600]} />
            <DetailRow icon={<ClockIcon />} label="Remaining" value={`$${remaining.toLocaleString()}`} valueColor={colors.gray[500]} hasDivider={false} />
          </SectionCard>

          {/* === Assigned Mover === */}
          {mover && (
            <SectionCard title="Your Mover">
              <View style={{ height: 10 }} />
              <View style={s.moverRow}>
                <View style={s.moverAvatar}>
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.primary[500] } as any}>
                      {mover.name[0]}
                    </span>
                  ) : null}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {Platform.OS === 'web' ? (
                    <>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>
                        {mover.name}
                      </span>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <StarIcon />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[900], marginLeft: 4 } as any}>
                          {mover.rating}
                        </span>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>
                          ({mover.reviews})
                        </span>
                      </View>
                    </>
                  ) : null}
                </View>
                {Platform.OS === 'web' && <ChevronIcon />}
              </View>
              <View style={{ height: 10 }} />
              <View style={s.moverChips}>
                {[
                  { icon: <TruckIcon />, text: mover.truck },
                  { icon: <CrewIcon />, text: `${mover.crewSize} crew` },
                ].map((ch, i) => (
                  <View key={i} style={s.moverChip}>
                    {Platform.OS === 'web' && ch.icon}
                    {Platform.OS === 'web' ? (
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: colors.gray[500], marginLeft: 6 } as any}>
                        {ch.text}
                      </span>
                    ) : null}
                  </View>
                ))}
              </View>
            </SectionCard>
          )}

          {/* === Important Info === */}
          <SectionCard title="Important Info" icon={<ShieldIcon />}>
            <View style={{ height: 10 }} />
            {[
              'Basic liability coverage included',
              'Free cancellation up to 48h before move',
              'Real-time GPS tracking on move day',
              'Direct chat with your mover',
            ].map((tip, i) => (
              <View key={i} style={s.tipRow}>
                {Platform.OS === 'web' && <CheckIcon />}
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[600], marginLeft: 10, lineHeight: '18px' } as any}>
                    {tip}
                  </span>
                ) : null}
              </View>
            ))}
          </SectionCard>

          {/* === Documents === */}
          <SectionCard title="Documents">
            <View style={{ height: 10 }} />
            {[
              { name: 'Move Confirmation', type: 'PDF' },
              { name: 'Inventory List', type: 'PDF' },
              { name: 'Insurance Policy', type: 'PDF' },
            ].map((doc, i) => (
              <Pressable key={i} style={({ pressed }) => [s.docRow, pressed && { opacity: 0.7 }]}>
                {Platform.OS === 'web' && <FileIcon />}
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[700], flex: 1, marginLeft: 10 } as any}>
                      {doc.name}
                    </span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[400] } as any}>
                      {doc.type}
                    </span>
                    <View style={{ marginLeft: 8 }}>{Platform.OS === 'web' && <ChevronIcon />}</View>
                  </>
                ) : null}
              </Pressable>
            ))}
          </SectionCard>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Tab bar */}
        <View style={s.tabBarWrap}>
          <TabBar active="myMoves" onTabPress={onTabPress} />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: { flex: 1, ...(Platform.OS === 'web' ? { background: DREAMY_BG } : { backgroundColor: '#EFF8FF' }) } as any,
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  header: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },

  statusBanner: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    marginTop: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },

  sectionCard: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 14, padding: 16, marginTop: 12,
  } as any,
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
  },

  detailRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
  },
  divider: { height: 1, backgroundColor: colors.gray[100] },

  analysisRow: { flexDirection: 'row', gap: 8 },
  analysisStat: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 12,
  } as any,

  moverRow: { flexDirection: 'row', alignItems: 'center' },
  moverAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },
  moverChips: { flexDirection: 'row', gap: 8 },
  moverChip: {
    flexDirection: 'row', alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: colors.gray[100] }),
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  } as any,

  tipRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 7,
  },

  docRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: colors.gray[100],
  },

  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
});
