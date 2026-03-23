/**
 * AI Moving — Request Detail Screen (Mover side)
 *
 * Shows full info about an available move request before applying.
 * Design: 1:1 with MoveDetailScreen (flat white cards on #FAFAFA).
 *
 * Sections:
 * 1. Earnings banner
 * 2. Client info
 * 3. Addresses (from / to with apartment details)
 * 4. Move Info (date, drive time, distance)
 * 5. AI Scan (rooms, items, volume)
 * 6. Scanned Inventory (expandable rooms)
 * 7. Plan details
 * 8. Client notes
 * 9. Apply button (sticky bottom)
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
import { StatusBarMock, Button } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface RequestRoomItem {
  name: string;
  qty: number;
  tag?: 'Fragile' | 'Large';
}

export interface RequestRoom {
  name: string;
  items: RequestRoomItem[];
}

export interface RequestDetailData {
  id: string;
  client: string;
  from: string;
  to: string;
  fromApt: string;
  fromFloor: string;
  fromElevator: boolean;
  toApt: string;
  toFloor: string;
  toElevator: boolean;
  date: string;
  time: string;
  rooms: number;
  estimatedPrice: number;
  distance: string;
  estimatedTime: string;
  postedAgo: string;
  totalItems: number;
  totalVolume: string;
  planName: string;
  inventory: RequestRoom[];
  notes: string;
}

interface RequestDetailScreenProps {
  request: RequestDetailData;
  onApply: (id: string) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Font shorthand
   ═══════════════════════════════════════════ */

const font = fontFamily.primary;

/* ═══════════════════════════════════════════
   Sub-components (same as MoveDetailScreen / client DetailSheet)
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

/* Dots */
const dotBlue = <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.primary[500], border: `2.5px solid ${colors.primary[200]}` } as any}/>;
const dotRed  = <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors.error[500], border: '2.5px solid #FECACA' } as any}/>;

/* Room icons */
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
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 22V12M3 8L12 14L21 8" stroke={colors.primary[500]} strokeWidth="1.5"/></svg>;
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  request: r,
  onApply,
  onBack,
}) => {
  const [openRoomIndex, setOpenRoomIndex] = useState<number | null>(null);

  if (Platform.OS !== 'web') return null;

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
            Confirmation Offer
          </span>
          <View style={{ width: 40 }} />
        </div>

        {/* ── Scrollable ── */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '16px 16px 140px', backgroundColor: '#FAFAFA' } as any}>

            {/* ── EARNINGS BANNER ── */}
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
              padding: 20,
              display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
            } as any}>
              <div>
                <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], display: 'block' } as any}>Estimated earnings</span>
                <span style={{ fontFamily: font, fontSize: 28, fontWeight: 700, color: colors.gray[900], display: 'block', marginTop: 4, letterSpacing: -0.5 } as any}>
                  ${r.estimatedPrice.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 6,
              } as any}>
                <div style={{ backgroundColor: colors.primary[50], borderRadius: 8, paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10 } as any}>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: colors.primary[600] } as any}>{r.planName}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 4 } as any}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={colors.gray[400]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400] } as any}>{r.postedAgo}</span>
                </div>
              </div>
            </div>

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
                    {r.client.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div style={{ flex: 1 } as any}>
                  <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{r.client}</span>
                  <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{r.rooms} rooms · {r.distance}</span>
                </div>
              </div>
            </div>

            {/* ── ADDRESSES ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Addresses" />
              <Row icon={dotBlue} label={r.from} sub={`Pickup · Apt ${r.fromApt} · Floor ${r.fromFloor} · ${r.fromElevator ? 'Elevator: Yes' : 'No elevator'}`} first />
              <Row icon={dotRed}  label={r.to}   sub={`Drop-off · Apt ${r.toApt} · Floor ${r.toFloor} · ${r.toElevator ? 'Elevator: Yes' : 'No elevator'}`} last />
            </div>

            {/* ── MOVE INFO ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Move info" />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke={colors.gray[500]} strokeWidth="2"/><path d="M16 2V6M8 2V6M3 10H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                label={`${r.date}, ${r.time}`} sub="Moving date & time"
                first
              />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.gray[500]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                label={r.estimatedTime} sub="Estimated drive time"
              />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12H6L9 6L15 18L18 12H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                label={r.distance} sub="Distance" last
              />
            </div>

            {/* ── AI SCAN ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10, padding: 16 } as any}>
              <div style={{ paddingBottom: 12 } as any}>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8 } as any}>AI Scan</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 10 } as any}>
                {[
                  { value: String(r.rooms), label: 'Rooms' },
                  { value: String(r.totalItems), label: 'Items' },
                  { value: r.totalVolume, label: 'Volume' },
                ].map((st, i) => (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                    paddingTop: 14, paddingBottom: 12, backgroundColor: '#EFF2F7', borderRadius: 12,
                  } as any}>
                    <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>{st.value}</span>
                    <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], marginTop: 3 } as any}>{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SCANNED INVENTORY ── */}
            {r.inventory.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Scanned Inventory" />
                {r.inventory.map((room, ri) => {
                  const totalItems = room.items.reduce((sum, it) => sum + it.qty, 0);
                  const isOpen = openRoomIndex === ri;
                  return (
                    <div key={ri} style={{} as any}>
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
            )}

            {/* ── PLAN ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Plan" />
              <Row
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="6" width="14" height="10" rx="1.5" stroke={colors.primary[500]} strokeWidth="2"/><path d="M15 10h4l2 3v3h-6V10z" stroke={colors.primary[500]} strokeWidth="2" strokeLinejoin="round"/><circle cx="6.5" cy="18" r="1.8" fill={colors.primary[500]}/><circle cx="18.5" cy="18" r="1.8" fill={colors.primary[500]}/></svg>}
                label={r.planName}
                sub="Moving plan"
                value={`$${r.estimatedPrice.toLocaleString()}`}
                first last
              />
            </div>

            {/* ── ACTIVITY TIMELINE ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
              <SectionHeader label="Activity" />
              <div style={{ padding: '8px 16px 16px 16px' } as any}>
                {([
                  { label: 'Client verified', sub: 'Identity and payment method confirmed', time: 'Yesterday, 16:05', color: colors.gray[300], active: false },
                  { label: 'AI Scan completed', sub: `${r.totalItems} items identified across ${r.rooms} rooms`, time: 'Today, 11:45', color: '#8B5CF6', active: true },
                  { label: 'Request published', sub: `${r.rooms} rooms, ${r.planName} plan`, time: 'Today, 12:10', color: colors.primary[500], active: true },
                  { label: 'Deposit paid', sub: `$${Math.round(r.estimatedPrice * 0.2)} via card ending 4821`, time: 'Today, 14:32', color: colors.success[500], active: true },
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

            {/* ── CLIENT NOTES ── */}
            {r.notes ? (
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
                      <span style={{ fontFamily: font, fontSize: 15, color: '#92400E', lineHeight: '22px' } as any}>{r.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </ScrollView>

        {/* ── Sticky Apply Button ── */}
        <div style={{
          position: 'absolute' as const, bottom: 0, left: 0, right: 0,
          padding: '12px 16px 28px',
          backgroundColor: '#FAFAFA',
        } as any}>
          <Button title={`Apply — $${r.estimatedPrice.toLocaleString()}`} onPress={() => onApply(r.id)} size="lg" />
        </div>
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
