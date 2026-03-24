/**
 * AI Moving — Move Detail Screen (Mover side)
 *
 * Design: 1:1 copy of the client app DetailSheet (flat white cards on #FAFAFA),
 * but rendered as a standalone page instead of a bottom sheet.
 * Content adapted for the mover perspective.
 *
 * Sections:
 * 1. Status banner (step-based)
 * 2. Plan & Pricing
 * 3. Addresses
 * 4. Move Info
 * 5. AI Scan (stat cards)
 * 6. Scanned Inventory (expandable rooms with items)
 * 7. Important Info (mover-oriented)
 * 8. Client Notes
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
import { MoveStep, ActiveMove } from '../home/DashboardScreen';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface RoomItem {
  name: string;
  qty: number;
  tag?: 'Fragile' | 'Large';
}

export interface RoomInventory {
  name: string;
  icon?: string; // living | bedroom | kitchen | bathroom | office
  items: RoomItem[];
}

export interface SpecialItem {
  name: string;
  quantity: number;
  note?: string;
}

export interface AdditionalMoveItem {
  id: string;
  type: 'furniture' | 'service';
  name: string;
  price: number;
  room?: string;
  qty?: number;
  size?: string;
  description?: string;
}

export interface MoveDetailData extends Omit<ActiveMove, 'rooms'> {
  roomsCount: number;
  clientPhone: string;
  clientEmail: string;
  fromApt: string;
  fromFloor: string;
  fromElevator: boolean;
  toApt: string;
  toFloor: string;
  toElevator: boolean;
  distance: string;
  estimatedTime: string;
  totalVolume: string;
  totalItems: number;
  rooms: RoomInventory[];
  specialItems: SpecialItem[];
  notes: string;
  planName: string;
  depositPaid?: number;
}

interface MoveDetailScreenProps {
  move: MoveDetailData;
  onAdvanceStep: () => void;
  onCallClient?: () => void;
  onChatClient?: () => void;
  onBack: () => void;
  /** Additional items/services added by mover */
  additionalItems?: AdditionalMoveItem[];
  onAddItem?: (item: AdditionalMoveItem) => void;
  onRemoveItem?: (id: string) => void;
  /** User role — hides financial info for mover */
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Step config
   ═══════════════════════════════════════════ */

const STEP_ORDER: MoveStep[] = [
  'accepted', 'en_route_pickup', 'arrived_pickup', 'loading',
  'en_route_delivery', 'arrived_delivery', 'unloading', 'completed',
];

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

const STEP_STATUS: Record<MoveStep, { label: string; color: string; chipColor: string }> = {
  accepted:           { label: 'Order Accepted',       color: colors.primary[600], chipColor: colors.primary[500] },
  en_route_pickup:    { label: 'En Route to Pickup',   color: '#B54708',           chipColor: '#F79009' },
  arrived_pickup:     { label: 'Arrived at Pickup',    color: '#B54708',           chipColor: '#F79009' },
  loading:            { label: 'Loading in Progress',  color: '#B54708',           chipColor: '#F79009' },
  en_route_delivery:  { label: 'En Route to Delivery', color: '#B54708',           chipColor: '#F79009' },
  arrived_delivery:   { label: 'Arrived at Delivery',  color: '#B54708',           chipColor: '#F79009' },
  unloading:          { label: 'Unloading',            color: '#B54708',           chipColor: '#F79009' },
  completed:          { label: 'Move Completed',       color: colors.success[600], chipColor: colors.success[500] },
};

/* ═══════════════════════════════════════════
   Font shorthand
   ═══════════════════════════════════════════ */

const font = fontFamily.primary;

/* ═══════════════════════════════════════════
   Sub-components (same as client DetailSheet)
   ═══════════════════════════════════════════ */

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ paddingTop: 16, paddingBottom: 6, paddingLeft: 16, paddingRight: 16 } as any}>
    <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8 } as any}>{label}</span>
  </div>
);

const Row: React.FC<{
  icon: React.ReactNode; label: string; sub?: string;
  value?: string; chip?: string; chipColor?: string; last?: boolean; first?: boolean;
}> = ({ icon, label, sub, value, chip, chipColor, last, first }) => (
  <div style={{
    display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
    paddingTop: first ? 16 : 14, paddingBottom: last ? 16 : 14,
    paddingLeft: 16, paddingRight: 16,
    borderBottom: 'none',
    gap: 14, boxSizing: 'border-box' as const,
  } as any}>
    <div style={{
      width: 44, height: 44, minWidth: 44, borderRadius: 12,
      backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    } as any}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' } as any}>
      <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as any}>{label}</span>
      {sub && <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{sub}</span>}
    </div>
    {chip && (
      <div style={{ backgroundColor: chipColor || '#EFF2F7', borderRadius: 8, paddingTop: 5, paddingBottom: 5, paddingLeft: 12, paddingRight: 12, flexShrink: 0 } as any}>
        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: chipColor ? '#fff' : colors.gray[600], whiteSpace: 'nowrap' } as any}>{chip}</span>
      </div>
    )}
    {value && !chip && <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: colors.gray[500], flexShrink: 0, textAlign: 'right' as const, whiteSpace: 'nowrap' } as any}>{value}</span>}
  </div>
);

/* ── Dots ── */
const dotBlue = <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.primary[500], border: `2.5px solid ${colors.primary[200]}` } as any}/>;
const dotRed  = <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors.error[500], border: '2.5px solid #FECACA' } as any}/>;

/* ── Room icons (same as client app) ── */
const roomIcons: Record<string, React.ReactNode> = {
  living: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 10V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V10" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 10V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V10C22 10 20 10 20 13H4C4 10 2 10 2 10Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bedroom: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 17V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 17H22V19H2V17Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 10H10V13H7V10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 10H17V13H14V10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  kitchen: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2V10M12 10C12 12 8 12 8 10V2M12 10C12 12 16 12 16 10V2" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 10V22M9 22H15" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bathroom: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12H20V16C20 18.2 18.2 20 16 20H8C5.8 20 4 18.2 4 16V12Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 12V5C4 3.9 4.9 3 6 3H7C8.1 3 9 3.9 9 5V6" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 12H22" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  office: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M8 21H16M12 17V21" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
};

const getRoomIcon = (name: string) => {
  const l = name.toLowerCase();
  if (l.includes('living')) return roomIcons.living;
  if (l.includes('bed'))    return roomIcons.bedroom;
  if (l.includes('kitchen'))return roomIcons.kitchen;
  if (l.includes('bath'))   return roomIcons.bathroom;
  if (l.includes('office')) return roomIcons.office;
  // default — box icon
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 22V12M3 8L12 14L21 8" stroke={colors.primary[500]} strokeWidth="1.5"/></svg>;
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const MoveDetailScreen: React.FC<MoveDetailScreenProps> = ({
  move,
  onAdvanceStep,
  onCallClient,
  onChatClient,
  onBack,
  additionalItems = [],
  onAddItem,
  onRemoveItem,
  role,
}) => {
  const stepIdx = STEP_ORDER.indexOf(move.step);
  const isCompleted = move.step === 'completed';
  const statusCfg = STEP_STATUS[move.step];

  const [openRoomIndex, setOpenRoomIndex] = useState<number | null>(null);

  // ── Add item modal state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'furniture' | 'service'>('furniture');
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addRoom, setAddRoom] = useState('');
  const [addQty, setAddQty] = useState('1');
  const [addSize, setAddSize] = useState('');
  const [addDescription, setAddDescription] = useState('');

  const canEdit = !isCompleted && !!onAddItem;

  const resetAddForm = () => {
    setAddName(''); setAddPrice(''); setAddRoom(''); setAddQty('1');
    setAddSize(''); setAddDescription(''); setShowAddModal(false);
  };

  const handleAddItem = () => {
    if (!addName.trim() || !addPrice.trim()) return;
    const item: AdditionalMoveItem = {
      id: `add-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: addType,
      name: addName.trim(),
      price: parseFloat(addPrice) || 0,
      ...(addType === 'furniture' ? {
        room: addRoom.trim() || undefined,
        qty: parseInt(addQty) || 1,
        size: addSize.trim() || undefined,
      } : {
        description: addDescription.trim() || undefined,
      }),
    };
    onAddItem?.(item);
    resetAddForm();
  };

  if (Platform.OS !== 'web') return null;

  /* ── Step dots (same as before) ── */
  const renderSteps = () => (
    <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 4, paddingBottom: 12 } as any}>
      {STEP_ORDER.map((st, i) => {
        const done = i < stepIdx;
        const current = i === stepIdx;
        return (
          <React.Fragment key={st}>
            <div style={{
              width: 18, height: 18, borderRadius: 9,
              backgroundColor: done ? '#10B981' : current ? colors.primary[500] : '#E4E7EC',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: current ? `0 0 0 3px ${colors.primary[100] || 'rgba(46,144,250,0.2)'}` : 'none',
            } as any}>
              {done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FFF">
                  <path d="M5 12L10 17L19 7" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div style={{ flex: 1, height: 2, backgroundColor: done ? '#10B981' : '#E4E7EC', marginLeft: 2, marginRight: 2 } as any} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        {/* ── Navbar ── */}
        <div style={{
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 8, paddingRight: 16, paddingTop: 4, paddingBottom: 14,
          flexShrink: 0,
        } as any}>
          <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke={colors.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Pressable>
          <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
            Order details
          </span>
          <View style={{ width: 40 }} />
        </div>

        {/* ── Scrollable content ── */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '16px 16px 48px', backgroundColor: '#FAFAFA' } as any}>

            {/* ── STATUS + PROGRESS (combined) ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
              <div style={{
                display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                paddingTop: 16, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
                gap: 12,
              } as any}>
                <div style={{
                  width: 44, height: 44, minWidth: 44, borderRadius: 12,
                  backgroundColor: `${statusCfg.chipColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                } as any}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: statusCfg.chipColor } as any} />
                </div>
                <div style={{ flex: 1 } as any}>
                  <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{statusCfg.label}</span>
                  <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>Step {stepIdx + 1} of {STEP_ORDER.length}</span>
                </div>
                {!isCompleted && (
                  <div style={{ backgroundColor: statusCfg.chipColor, borderRadius: 8, paddingTop: 5, paddingBottom: 5, paddingLeft: 12, paddingRight: 12, flexShrink: 0 } as any}>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' } as any}>Active</span>
                  </div>
                )}
                {isCompleted && (
                  <div style={{ backgroundColor: colors.success[500], borderRadius: 8, paddingTop: 5, paddingBottom: 5, paddingLeft: 12, paddingRight: 12, flexShrink: 0 } as any}>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' } as any}>Done</span>
                  </div>
                )}
              </div>
              {renderSteps()}
            </div>

            {/* ── COMPLETION SUMMARY (completed moves only) ── */}
            {isCompleted && (move as any).earningsSummary && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10, padding: 16 } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 10 } as any}>
                  {[
                    { value: (move as any).actualDuration || '—', label: 'Duration' },
                    { value: `$${((move as any).earningsSummary.totalEarned || 0).toLocaleString()}`, label: 'Earned' },
                    { value: String((move as any).earningsSummary.itemsMoved || move.totalItems), label: 'Items' },
                    { value: (move as any).clientReview ? `${(move as any).clientReview.rating}/5` : '—', label: 'Review' },
                  ].map((st, i) => (
                    <div key={i} style={{
                      flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                      paddingTop: 14, paddingBottom: 12,
                      backgroundColor: i === 1 ? `${colors.success[500]}12` : '#EFF2F7', borderRadius: 12,
                    } as any}>
                      <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: i === 1 ? colors.success[600] : colors.gray[900] } as any}>{st.value}</span>
                      <span style={{ fontFamily: font, fontSize: 12, color: colors.gray[400], marginTop: 3 } as any}>{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CLIENT ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Client" />
              <div style={{
                display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, gap: 14,
              } as any}>
                <div style={{
                  width: 44, height: 44, minWidth: 44, borderRadius: '50%',
                  backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                } as any}>
                  <span style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: colors.primary[500] } as any}>
                    {move.client.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 } as any}>
                  <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{move.client}</span>
                  <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{move.clientPhone}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8 } as any}>
                  <Pressable onPress={onCallClient} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
                      <svg width="20" height="20" viewBox="0 0 482.6 482.6" fill="none"><path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 14.6 39.1 41 83.2 80.2 130.3zM25.739 104.2c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8-.2.2-.3.3-.5.5-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5C28.039 146.4 24.139 124.3 25.739 104.2z" fill={colors.primary[500]}/></svg>
                    </div>
                  </Pressable>
                  <Pressable onPress={onChatClient} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22.3a10.62 10.62 0 01-5.16-1.3.26.26 0 00-.2 0l-3.53 1a1.24 1.24 0 01-1.56-1.55l1.06-3.55a.27.27 0 000-.19 10.75 10.75 0 1111.69 5.35 11.47 11.47 0 01-2.3.24zm-5.29-2.87a1.85 1.85 0 01.85.22 9.25 9.25 0 102.9-17.23 9.23 9.23 0 00-6.56 13.58 1.77 1.77 0 01.15 1.35l-.93 3.09 3.09-.93a1.73 1.73 0 01.5-.08z" fill={colors.primary[500]}/><circle cx="8" cy="12" r="1.25" fill={colors.primary[500]}/><circle cx="12" cy="12" r="1.25" fill={colors.primary[500]}/><circle cx="16" cy="12" r="1.25" fill={colors.primary[500]}/></svg>
                    </div>
                  </Pressable>
                </div>
              </div>
            </div>



            {/* ── PLAN & PRICING (hidden for mover) ── */}
            {role !== 'mover' && <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Plan & Pricing" />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="6" width="14" height="10" rx="1.5" stroke={colors.primary[500]} strokeWidth="2"/><path d="M15 10h4l2 3v3h-6V10z" stroke={colors.primary[500]} strokeWidth="2" strokeLinejoin="round"/><circle cx="6.5" cy="18" r="1.8" fill={colors.primary[500]}/><circle cx="18.5" cy="18" r="1.8" fill={colors.primary[500]}/></svg>}
                label={move.planName}
                sub="Moving plan"
                value={`$${move.price.toLocaleString()}`}
                first
                last={!(move.depositPaid)}
              />
              {isCompleted ? (
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  label={`$${move.price.toLocaleString()} fully paid`}
                  sub="Deposit + remaining balance"
                  chip="Paid"
                  chipColor={colors.success[500]}
                  last
                />
              ) : (move.depositPaid ?? 0) > 0 ? (
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  label={`$${move.depositPaid} deposit paid`}
                  sub="20% upfront"
                  chip="Paid"
                  chipColor={colors.success[500]}
                  last
                />
              ) : null}
            </div>}

            {/* ── ADDRESSES ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Addresses" />
              <Row icon={dotBlue} label={move.from} sub={`Pickup · Apt ${move.fromApt} · Floor ${move.fromFloor} · ${move.fromElevator ? 'Elevator: Yes' : 'No elevator'}`} first />
              <Row icon={dotRed}  label={move.to}   sub={`Drop-off · Apt ${move.toApt} · Floor ${move.toFloor} · ${move.toElevator ? 'Elevator: Yes' : 'No elevator'}`} last />
            </div>

            {/* ── MOVE INFO ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Move info" />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke={colors.gray[500]} strokeWidth="2"/><path d="M16 2V6M8 2V6M3 10H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                label={`${move.date}, ${move.time}`} sub="Moving date & time"
                first
              />
              {isCompleted && (move as any).actualDuration ? (
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.gray[500]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                  label={(move as any).actualDuration} sub="Actual duration"
                />
              ) : (
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.gray[500]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                  label={move.estimatedTime} sub="Estimated drive time"
                />
              )}
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12H6L9 6L15 18L18 12H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label={move.distance} sub="Distance" last
              />
            </div>

            {/* ── AI SCAN (stat cards) ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10, padding: 16 } as any}>
              <div style={{ paddingBottom: 12 } as any}>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8 } as any}>AI Scan</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 10 } as any}>
                {[
                  { value: String(move.roomsCount), label: 'Rooms' },
                  { value: String(move.totalItems), label: 'Items' },
                  { value: move.totalVolume, label: 'Volume' },
                ].map((st, i) => (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                    paddingTop: 14, paddingBottom: 12,
                    backgroundColor: '#EFF2F7', borderRadius: 12,
                  } as any}>
                    <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>{st.value}</span>
                    <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], marginTop: 3 } as any}>{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SCANNED INVENTORY (expandable rooms) ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Scanned Inventory" />
              {move.rooms.map((room, ri) => {
                const totalItems = room.items.reduce((sum, it) => sum + it.qty, 0);
                const isOpen = openRoomIndex === ri;
                return (
                  <div key={ri} style={{} as any}>
                    {/* Room header — tap to toggle */}
                    <div
                      onClick={() => setOpenRoomIndex(isOpen ? null : ri)}
                      style={{
                        display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                        paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
                        gap: 14, cursor: 'pointer', boxSizing: 'border-box' as const,
                      } as any}
                    >
                      <div style={{
                        width: 44, height: 44, minWidth: 44, borderRadius: 12,
                        backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      } as any}>
                        {getRoomIcon(room.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 } as any}>
                        <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{room.name}</span>
                        <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{totalItems} items</span>
                      </div>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 } as any}>
                        <path d="M6 9L12 15L18 9" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {/* Items list */}
                    {isOpen && (
                      <div style={{ paddingLeft: 74, paddingRight: 16, paddingBottom: 14 } as any}>
                        {room.items.map((it, ii) => (
                          <div key={ii} style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
                            paddingTop: 8, paddingBottom: 8,
                          } as any}>
                            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, flex: 1, minWidth: 0 } as any}>
                              <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[700] } as any}>{it.name}</span>
                              {it.tag && (
                                <span style={{
                                  fontFamily: font, fontSize: 12, fontWeight: 600,
                                  color: it.tag === 'Fragile' ? colors.warning[600] : colors.primary[500],
                                  backgroundColor: it.tag === 'Fragile' ? colors.warning[50] : colors.primary[50],
                                  paddingLeft: 7, paddingRight: 7, paddingTop: 3, paddingBottom: 3, borderRadius: 6,
                                } as any}>{it.tag}</span>
                              )}
                            </div>
                            <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[400], flexShrink: 0, marginLeft: 8 } as any}>×{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── ADDITIONAL ITEMS & SERVICES ── */}
            {canEdit && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Additional Items & Services" />

                {/* List of added items */}
                {additionalItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                    paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
                    gap: 12, boxSizing: 'border-box' as const,
                  } as any}>
                    <div style={{
                      width: 40, height: 40, minWidth: 40, borderRadius: 10,
                      backgroundColor: item.type === 'furniture' ? colors.primary[50] : colors.success[50],
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    } as any}>
                      {item.type === 'furniture' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 10V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V10" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 10V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V10" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 } as any}>
                      <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>
                        {item.name}
                        {item.type === 'furniture' && item.qty && item.qty > 1 ? ` ×${item.qty}` : ''}
                      </span>
                      <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                        {item.type === 'furniture' ? 'Furniture' : 'Service'}
                        {item.room ? ` · ${item.room}` : ''}
                        {item.size ? ` · ${item.size}` : ''}
                        {item.description ? ` · ${item.description}` : ''}
                      </span>
                    </div>
                    <span style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: colors.gray[900], flexShrink: 0 } as any}>
                      ${item.price}
                    </span>
                    <div
                      onClick={() => onRemoveItem?.(item.id)}
                      style={{
                        width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: colors.error[50], flexShrink: 0,
                      } as any}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                ))}

                {additionalItems.length === 0 && !showAddModal && (
                  <div style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 8 } as any}>
                    <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], fontStyle: 'italic' } as any}>
                      No additional items or services added yet
                    </span>
                  </div>
                )}

                {/* Add button */}
                {!showAddModal && (
                  <div
                    onClick={() => setShowAddModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      margin: '4px 16px 16px', padding: '10px 0', borderRadius: 10,
                      border: `1.5px dashed ${colors.primary[300]}`, cursor: 'pointer',
                    } as any}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round"/></svg>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.primary[500] } as any}>Add Item or Service</span>
                  </div>
                )}

                {/* ── Inline Add Modal ── */}
                {showAddModal && (
                  <div style={{
                    margin: '4px 16px 16px', padding: 14, borderRadius: 12,
                    backgroundColor: colors.gray[50], border: `1px solid ${colors.gray[100]}`,
                  } as any}>
                    {/* Type toggle */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 } as any}>
                      {(['furniture', 'service'] as const).map(t => (
                        <div
                          key={t}
                          onClick={() => setAddType(t)}
                          style={{
                            flex: 1, padding: '8px 0', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
                            backgroundColor: addType === t ? colors.primary[500] : '#FFFFFF',
                            border: addType === t ? 'none' : `1px solid ${colors.gray[200]}`,
                          } as any}
                        >
                          <span style={{
                            fontFamily: font, fontSize: 13, fontWeight: 600,
                            color: addType === t ? '#FFFFFF' : colors.gray[600],
                          } as any}>
                            {t === 'furniture' ? 'Furniture' : 'Service'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Name */}
                    <input
                      placeholder={addType === 'furniture' ? 'Item name (e.g. Sofa)' : 'Service name (e.g. Packing)'}
                      value={addName}
                      onChange={(e: any) => setAddName(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                        fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                        backgroundColor: '#FFFFFF', marginBottom: 8,
                      } as any}
                    />

                    {/* Price */}
                    <input
                      placeholder="Price ($)"
                      value={addPrice}
                      onChange={(e: any) => setAddPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                        fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                        backgroundColor: '#FFFFFF', marginBottom: 8,
                      } as any}
                    />

                    {/* Furniture-specific fields */}
                    {addType === 'furniture' && (
                      <>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 } as any}>
                          <input
                            placeholder="Room (optional)"
                            value={addRoom}
                            onChange={(e: any) => setAddRoom(e.target.value)}
                            style={{
                              flex: 1, padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                              fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                              backgroundColor: '#FFFFFF',
                            } as any}
                          />
                          <input
                            placeholder="Qty"
                            value={addQty}
                            onChange={(e: any) => setAddQty(e.target.value.replace(/[^0-9]/g, ''))}
                            style={{
                              width: 60, padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                              fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                              backgroundColor: '#FFFFFF', textAlign: 'center',
                            } as any}
                          />
                        </div>
                        <input
                          placeholder="Size (optional)"
                          value={addSize}
                          onChange={(e: any) => setAddSize(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                            fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                            backgroundColor: '#FFFFFF', marginBottom: 8,
                          } as any}
                        />
                      </>
                    )}

                    {/* Service-specific fields */}
                    {addType === 'service' && (
                      <input
                        placeholder="Description (optional)"
                        value={addDescription}
                        onChange={(e: any) => setAddDescription(e.target.value)}
                        style={{
                          width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.gray[200]}`,
                          fontFamily: font, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                          backgroundColor: '#FFFFFF', marginBottom: 8,
                        } as any}
                      />
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 } as any}>
                      <div
                        onClick={resetAddForm}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                          backgroundColor: '#FFFFFF', border: `1px solid ${colors.gray[200]}`,
                        } as any}
                      >
                        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[600] } as any}>Cancel</span>
                      </div>
                      <div
                        onClick={handleAddItem}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                          backgroundColor: addName.trim() && addPrice.trim() ? colors.primary[500] : colors.gray[200],
                        } as any}
                      >
                        <span style={{
                          fontFamily: font, fontSize: 14, fontWeight: 600,
                          color: addName.trim() && addPrice.trim() ? '#FFFFFF' : colors.gray[400],
                        } as any}>Add</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── IMPORTANT INFO (mover-oriented) ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Important info" />
              {[
                'Liability coverage active for this move',
                'Client confirmed inventory via AI scan',
                'GPS tracking enabled — client can see your location',
                'Contact support for any issues during the move',
              ].map((tip, i, arr) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                  paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
                  gap: 14, boxSizing: 'border-box' as const,
                } as any}>
                  <div style={{
                    width: 44, height: 44, minWidth: 44, borderRadius: 12,
                    backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  } as any}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={colors.primary[500]}/><path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[700], lineHeight: '22px' } as any}>{tip}</span>
                </div>
              ))}
            </div>

            {/* ── ACTIVITY TIMELINE ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Activity" />
              <div style={{ padding: '8px 16px 16px 16px' } as any}>
                {([
                  { label: 'Client verified', sub: 'Identity and payment method confirmed', time: 'Mar 3, 16:05', color: colors.gray[300], active: false },
                  { label: 'Request created', sub: `${move.planName} plan selected by client`, time: 'Mar 4, 09:22', color: colors.warning[500], active: true },
                  { label: 'AI Scan completed', sub: `${move.totalItems} items identified across ${move.roomsCount} rooms`, time: 'Mar 5, 18:40', color: '#8B5CF6', active: true },
                  { label: 'Order accepted', sub: 'Mover accepted this move request', time: 'Mar 6, 10:15', color: colors.primary[500], active: true },
                  ...(move.depositPaid && role !== 'mover' ? [{ label: 'Deposit paid', sub: `$${move.depositPaid} via card ending 4821`, time: 'Mar 6, 10:18', color: colors.success[500], active: true }] : []),
                  ...(isCompleted ? (() => {
                    const sd = (move as any).stageDurations;
                    const loadDur = sd?.loading || '';
                    const driveDur = sd?.driving || '';
                    const unloadDur = sd?.unloading || '';
                    return [
                      { label: 'En route to pickup', sub: 'Mover heading to pickup location', time: 'Mar 8, 09:45', color: '#F79009', active: true },
                      { label: 'Arrived at pickup', sub: 'Arrived at pickup address · 27m drive', time: 'Mar 8, 10:12', color: '#F79009', active: true },
                      { label: 'Loading started', sub: 'Loading items into the truck', time: 'Mar 8, 10:18', color: '#F79009', active: true },
                      { label: 'Loading complete', sub: `All items loaded${loadDur ? ` · ${loadDur} loading` : ''}`, time: 'Mar 8, 11:45', color: '#F79009', active: true },
                      { label: 'En route to delivery', sub: 'Driving to drop-off location', time: 'Mar 8, 11:48', color: '#F79009', active: true },
                      { label: 'Arrived at delivery', sub: `Arrived at delivery address${driveDur ? ` · ${driveDur} drive` : ''}`, time: 'Mar 8, 12:20', color: '#F79009', active: true },
                      { label: 'Unloading started', sub: 'Unloading items at destination', time: 'Mar 8, 12:25', color: '#F79009', active: true },
                      { label: 'Move completed', sub: `All items delivered${unloadDur ? ` · ${unloadDur} unloading` : ''}`, time: 'Mar 8, 13:30', color: colors.success[500], active: true },
                      ...(role !== 'mover' ? [{ label: 'Remaining balance paid', sub: `$${Math.round(move.price * 0.8)} via card ending 4821`, time: 'Mar 8, 13:35', color: colors.success[500], active: true }] : []),
                    ];
                  })() : []),
                ] as const).map((act, ai, arr) => (
                  <div key={ai} style={{
                    display: 'flex', flexDirection: 'row' as const, gap: 14,
                    minHeight: 56,
                  } as any}>
                    {/* Timeline rail */}
                    <div style={{
                      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                      width: 20, flexShrink: 0,
                    } as any}>
                      <div style={{
                        width: 10, height: 10, borderRadius: 5,
                        backgroundColor: act.active ? act.color : colors.gray[200],
                        marginTop: 4, flexShrink: 0,
                        boxShadow: ai === arr.length - 1 ? `0 0 0 3px ${act.color}22` : 'none',
                      } as any} />
                      {ai < arr.length - 1 && (
                        <div style={{
                          width: 1.5, flex: 1,
                          backgroundColor: colors.gray[200],
                          marginTop: 4, marginBottom: 4,
                        } as any} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: ai < arr.length - 1 ? 16 : 0 } as any}>
                      <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block', lineHeight: '18px' } as any}>
                        {act.label}
                      </span>
                      <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], marginTop: 3, display: 'block', lineHeight: '18px' } as any}>
                        {act.sub}
                      </span>
                      <span style={{ fontFamily: font, fontSize: 12, color: colors.gray[300], marginTop: 4, display: 'block' } as any}>
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CLIENT REVIEW (for completed moves) ── */}
            {isCompleted && (move as any).clientReview && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Client Review" />
                <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 16 } as any}>
                  {/* Star rating */}
                  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6, marginBottom: 10 } as any}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} width="22" height="22" viewBox="0 0 24 24" fill={star <= Math.round((move as any).clientReview.rating) ? '#F59E0B' : '#E4E7EC'}>
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    ))}
                    <span style={{ fontFamily: font, fontSize: 16, fontWeight: 700, color: colors.gray[900], marginLeft: 6 } as any}>
                      {(move as any).clientReview.rating}
                    </span>
                  </div>
                  {/* Review text */}
                  {(move as any).clientReview.text && (
                    <div style={{
                      backgroundColor: '#F0F9FF', borderRadius: 12, padding: 14,
                    } as any}>
                      <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start', gap: 10 } as any}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 } as any}>
                          <path d="M3 21C3 21 5 19 5 16V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V13C19 14.1 18.1 15 17 15H8L3 21Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[700], lineHeight: '22px', fontStyle: 'italic' } as any}>
                          "{(move as any).clientReview.text}"
                        </span>
                      </div>
                      <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], display: 'block', marginTop: 8, textAlign: 'right' as const } as any}>
                        — {move.client}, {(move as any).clientReview.date}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CLIENT NOTES ── */}
            {move.notes ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Client notes" />
                <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 16 } as any}>
                  <div style={{
                    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14,
                    border: '1px solid #FEF3C7',
                  } as any}>
                    <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start', gap: 10 } as any}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 } as any}>
                        <path d="M12 9V13M12 17H12.01" stroke="#F79009" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10.29 3.86L1.82 18C1.64 18.33 1.55 18.69 1.56 19.06C1.56 19.44 1.67 19.79 1.86 20.11C2.04 20.43 2.3 20.69 2.63 20.87C2.95 21.05 3.31 21.15 3.68 21.14H20.32C20.69 21.15 21.05 21.05 21.37 20.87C21.7 20.69 21.96 20.43 22.14 20.11C22.33 19.79 22.44 19.44 22.44 19.06C22.45 18.69 22.36 18.33 22.18 18L13.71 3.86C13.53 3.56 13.27 3.31 12.97 3.15C12.66 2.98 12.33 2.89 12 2.89C11.67 2.89 11.34 2.98 11.03 3.15C10.73 3.31 10.47 3.56 10.29 3.86Z" stroke="#F79009" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: font, fontSize: 15, color: '#92400E', lineHeight: '22px' } as any}>{move.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
