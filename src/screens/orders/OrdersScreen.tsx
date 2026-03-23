/**
 * AI Moving — Orders Screen (Mover side)
 *
 * Two top tabs (underlined, equal halves):
 *   Requests — available move requests the mover can apply to
 *   Orders   — accepted jobs with sub-filter (All / Accepted / In Progress / Completed)
 *
 * Card design: wireframe style — Order #ID + status, icon rows, price + action.
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
import { TabBar, TabId } from '../home/TabBar';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type OrderTab = 'requests' | 'orders';
type OrderFilter = 'all' | 'accepted' | 'inProgress' | 'completed';

export interface MoveRequest {
  id: string;
  client: string;
  from: string;
  to: string;
  date: string;
  rooms: number;
  estimatedPrice: number;
  distance: string;
  volume: string;
  postedAgo: string;
}

export type MoverOrderStatus = 'accepted' | 'inProgress' | 'completed';

export interface MoverOrder {
  id: string;
  client: string;
  from: string;
  to: string;
  date: string;
  status: MoverOrderStatus;
  earnings: number;
  planName: string;
  distance: string;
  volume: string;
}

export interface OrdersScreenProps {
  requests: MoveRequest[];
  orders: MoverOrder[];
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
  onApplyRequest?: (id: string) => void;
  onViewRequest?: (id: string) => void;
  onSelectOrder?: (id: string) => void;
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Status config
   ═══════════════════════════════════════════ */

const ORDER_STATUS: Record<MoverOrderStatus, { label: string; color: string; bg: string }> = {
  accepted:   { label: 'Accepted',    color: colors.success[600], bg: colors.success[50] },
  inProgress: { label: 'In Progress', color: colors.primary[600], bg: colors.primary[50] },
  completed:  { label: 'Completed',   color: colors.gray[500],    bg: colors.gray[100] },
};

const FILTER_LABELS: Record<OrderFilter, string> = {
  all: 'All',
  accepted: 'Accepted',
  inProgress: 'In Progress',
  completed: 'Completed',
};

const F = 'Inter, system-ui, sans-serif';

/* ═══════════════════════════════════════════
   Icons (18×18 inline, for info rows)
   ═══════════════════════════════════════════ */

const IconHome = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 21V9L12 3L21 9V21H15V14H9V21H3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const IconRoute = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.8"/>
  </svg>
);

const IconBox = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 8V21H3V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 3H1V8H23V3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12H14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const shortCity = (addr: string) => {
  const parts = addr.split(',');
  return parts.length >= 2 ? parts[1].trim() : parts[0].trim();
};

const shortAddr = (addr: string) => addr.split(',')[0].trim();

/* ═══════════════════════════════════════════
   InfoRow — icon + text, reusable
   ═══════════════════════════════════════════ */

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10, marginTop: 10 } as any}>
    {icon}
    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: colors.gray[600], letterSpacing: -0.32 } as any}>
      {text}
    </span>
  </div>
);

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  requests,
  orders,
  onTabPress,
  onBack,
  onApplyRequest,
  onViewRequest,
  onSelectOrder,
  role,
}) => {
  const [activeTab, setActiveTab] = useState<OrderTab>('requests');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter);

  if (Platform.OS !== 'web') return null;

  return (
    <SafeAreaView style={s.safe}>
      <View style={{ flex: 1 }}>
        <StatusBarMock variant="dark" onTimeTap={onBack} />

        {/* ── Header ── */}
        <View style={s.header}>
          <span style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: colors.gray[900] } as any}>
            Orders
          </span>
        </View>

        {/* ── Top tabs (underlined, equal halves) ── */}
        <div style={{
          display: 'flex', flexDirection: 'row' as const,
          borderBottom: `1.5px solid ${colors.gray[100]}`,
        } as any}>
          {(['requests', 'orders'] as OrderTab[]).map(tab => {
            const isActive = activeTab === tab;
            const label = tab === 'requests' ? 'Requests' : 'Orders';
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={({ pressed }) => [{
                  flex: 1,
                  position: 'relative' as const,
                  flexDirection: 'row' as const,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  paddingBottom: 14,
                  gap: 8,
                }, pressed && { opacity: 0.7 }]}
              >
                {tab === 'requests' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2" strokeLinecap="round"/>
                    <rect x="9" y="3" width="6" height="4" rx="1" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2"/>
                    <path d="M9 12H15M9 16H13" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="13" height="9" rx="1.5" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2"/>
                    <path d="M15 10H18L21 13V16H15V10Z" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="7" cy="18" r="2" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2"/>
                    <circle cx="18" cy="18" r="2" stroke={isActive ? colors.primary[500] : colors.gray[300]} strokeWidth="2"/>
                  </svg>
                )}
                <span style={{
                  fontFamily: F, fontSize: 16, fontWeight: 400, letterSpacing: -0.32,
                  color: isActive ? colors.gray[900] : colors.gray[400],
                } as any}>{label}</span>
                {isActive && (
                  <div style={{
                    position: 'absolute' as const, bottom: -1, left: 0, right: 0,
                    height: 2.5, backgroundColor: colors.primary[500],
                  } as any} />
                )}
              </Pressable>
            );
          })}
        </div>

        {/* ── Content ── */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* ══ REQUESTS TAB ══ */}
          {activeTab === 'requests' && (
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              {requests.length === 0 ? (
                <View style={{ alignItems: 'center', paddingTop: 60 }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 32,
                    backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                  } as any}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={colors.primary[400]} strokeWidth="1.8" strokeLinecap="round"/>
                      <rect x="9" y="3" width="6" height="4" rx="1" stroke={colors.primary[400]} strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, letterSpacing: -0.32, color: colors.gray[900], textAlign: 'center' } as any}>
                    No requests available
                  </span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: colors.gray[400], textAlign: 'center', marginTop: 6, lineHeight: '16px' } as any}>
                    New move requests will appear here
                  </span>
                </View>
              ) : (
                <View style={{ gap: 12 } as any}>
                  {requests.map(req => {
                    const num = req.id.replace(/\D/g, '') || '0';
                    return (
                      <Pressable key={req.id} onPress={() => onViewRequest?.(req.id)} style={({ pressed }) => [s.card as any, pressed && { opacity: 0.7 }]}>

                        {/* ── Row 1: Title + New badge + posted time ── */}
                        <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between' } as any}>
                          <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10 } as any}>
                            <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
                              Request #{num}
                            </span>
                            <div style={{
                              backgroundColor: colors.primary[50],
                              paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 10,
                            } as any}>
                              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, letterSpacing: -0.24, color: colors.primary[500] } as any}>
                                New
                              </span>
                            </div>
                          </div>
                          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 400, color: colors.gray[400] } as any}>
                            {req.postedAgo}
                          </span>
                        </div>

                        {/* ── Row 2: Apartment type chip ── */}
                        <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, marginTop: 14 } as any}>
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                            backgroundColor: colors.gray[50], borderRadius: 10,
                            paddingLeft: 10, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
                          } as any}>
                            <IconHome color={colors.gray[500]} />
                            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[700], letterSpacing: -0.28 } as any}>
                              {req.rooms} Bedroom Apartment
                            </span>
                          </div>
                        </div>

                        {/* ── Row 3: Route block (vertical dots + line) ── */}
                        <div style={{
                          display: 'flex', flexDirection: 'row' as const,
                          gap: 12, marginTop: 14,
                          backgroundColor: colors.primary[25], borderRadius: 14,
                          padding: '14px 16px',
                        } as any}>
                          {/* Dots + line */}
                          <div style={{
                            display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                            paddingTop: 3, paddingBottom: 3,
                          } as any}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[500] } as any} />
                            <div style={{ width: 1.5, flex: 1, backgroundColor: colors.primary[200], marginTop: 3, marginBottom: 3 } as any} />
                            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success[500] } as any} />
                          </div>
                          {/* Addresses */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', gap: 10 } as any}>
                            <div>
                              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], letterSpacing: 0.3, textTransform: 'uppercase' as const, display: 'block' } as any}>
                                From
                              </span>
                              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.3, marginTop: 2, display: 'block' } as any}>
                                {shortCity(req.from)}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], letterSpacing: 0.3, textTransform: 'uppercase' as const, display: 'block' } as any}>
                                To
                              </span>
                              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.3, marginTop: 2, display: 'block' } as any}>
                                {shortCity(req.to)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ── Row 4: Meta chips row ── */}
                        <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8, marginTop: 12, flexWrap: 'wrap' as const } as any}>
                          {/* Date chip */}
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                            backgroundColor: colors.gray[50], borderRadius: 10,
                            paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                          } as any}>
                            <IconCalendar color={colors.gray[400]} />
                            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                              {req.date}
                            </span>
                          </div>
                          {/* Distance chip */}
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                            backgroundColor: colors.gray[50], borderRadius: 10,
                            paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                          } as any}>
                            <IconRoute color={colors.gray[400]} />
                            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                              {req.distance}
                            </span>
                          </div>
                          {/* Volume chip */}
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                            backgroundColor: colors.gray[50], borderRadius: 10,
                            paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                          } as any}>
                            <IconBox color={colors.gray[400]} />
                            <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                              {req.volume}
                            </span>
                          </div>
                        </div>

                        {/* ── Row 5: Price + Apply ── */}
                        <div style={{
                          display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
                          marginTop: 16, paddingTop: 16,
                        } as any}>
                          <div>
                            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, color: colors.gray[400], textTransform: 'uppercase' as const, display: 'block' } as any}>
                              Estimated
                            </span>
                            <span style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.44 } as any}>
                              ${req.estimatedPrice.toLocaleString()}
                            </span>
                          </div>
                          <Pressable
                            onPress={(e) => { e.stopPropagation?.(); onApplyRequest?.(req.id); }}
                            style={({ pressed }) => [{
                              backgroundColor: colors.primary[500],
                              paddingHorizontal: 24, paddingVertical: 13, borderRadius: 14,
                            }, pressed && { opacity: 0.85 }]}
                          >
                            <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, letterSpacing: -0.3, color: '#FFFFFF' } as any}>
                              Apply
                            </span>
                          </Pressable>
                        </div>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ══ ORDERS TAB ══ */}
          {activeTab === 'orders' && (
            <View style={{ paddingTop: 8 }}>
              {/* Sub-filter chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 16 }} contentContainerStyle={{ paddingRight: 16, gap: 8 } as any}>
                {(Object.keys(FILTER_LABELS) as OrderFilter[]).map(filter => {
                  const isActive = orderFilter === filter;
                  return (
                    <Pressable
                      key={filter}
                      onPress={() => setOrderFilter(filter)}
                      style={({ pressed }) => [{
                        paddingHorizontal: 16,
                        paddingVertical: 9,
                        borderRadius: 20,
                        backgroundColor: isActive ? colors.primary[500] : colors.gray[200],
                      }, pressed && { opacity: 0.7 }]}
                    >
                      <span style={{
                        fontFamily: F, fontSize: 14, fontWeight: 700, letterSpacing: -0.28,
                        color: isActive ? '#FFFFFF' : colors.gray[500],
                      } as any}>{FILTER_LABELS[filter]}</span>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Order cards */}
              <View style={{ paddingHorizontal: 16 }}>
                {filteredOrders.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingTop: 60 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 32,
                      backgroundColor: colors.gray[50],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 20,
                    } as any}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="7" width="13" height="9" rx="1.5" stroke={colors.gray[300]} strokeWidth="1.8"/>
                        <path d="M15 10H18L21 13V16H15V10Z" stroke={colors.gray[300]} strokeWidth="1.8" strokeLinejoin="round"/>
                        <circle cx="7" cy="18" r="2" stroke={colors.gray[300]} strokeWidth="1.8"/>
                        <circle cx="18" cy="18" r="2" stroke={colors.gray[300]} strokeWidth="1.8"/>
                      </svg>
                    </div>
                    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 400, letterSpacing: -0.32, color: colors.gray[900], textAlign: 'center' } as any}>
                      No orders yet
                    </span>
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, letterSpacing: -0.24, color: colors.gray[400], textAlign: 'center', marginTop: 6, lineHeight: '16px' } as any}>
                      Apply for requests to get your first order
                    </span>
                  </View>
                ) : (
                  <View style={{ gap: 12 } as any}>
                    {filteredOrders.map(order => {
                      const cfg = ORDER_STATUS[order.status];
                      const num = order.id.replace(/\D/g, '') || '0';
                      return (
                        <Pressable
                          key={order.id}
                          onPress={() => onSelectOrder?.(order.id)}
                          style={({ pressed }) => [s.card as any, pressed && { opacity: 0.7 }]}
                        >
                          {/* ── Row 1: Title + status badge ── */}
                          <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 10 } as any}>
                            <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
                              Order #{num}
                            </span>
                            <div style={{
                              backgroundColor: cfg.bg,
                              paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4, borderRadius: 10,
                            } as any}>
                              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, letterSpacing: -0.24, color: cfg.color } as any}>
                                {cfg.label}
                              </span>
                            </div>
                          </div>

                          {/* ── Row 2: Plan type chip ── */}
                          <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, marginTop: 14 } as any}>
                            <div style={{
                              display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                              backgroundColor: colors.gray[50], borderRadius: 10,
                              paddingLeft: 10, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
                            } as any}>
                              <IconHome color={colors.gray[500]} />
                              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[700], letterSpacing: -0.28 } as any}>
                                {order.planName} Move
                              </span>
                            </div>
                          </div>

                          {/* ── Row 3: Route block (vertical dots + line) ── */}
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const,
                            gap: 12, marginTop: 14,
                            backgroundColor: colors.primary[25], borderRadius: 14,
                            padding: '14px 16px',
                          } as any}>
                            <div style={{
                              display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
                              paddingTop: 3, paddingBottom: 3,
                            } as any}>
                              <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary[500] } as any} />
                              <div style={{ width: 1.5, flex: 1, backgroundColor: colors.primary[200], marginTop: 3, marginBottom: 3 } as any} />
                              <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success[500] } as any} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', gap: 10 } as any}>
                              <div>
                                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], letterSpacing: 0.3, textTransform: 'uppercase' as const, display: 'block' } as any}>From</span>
                                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.3, marginTop: 2, display: 'block' } as any}>{shortCity(order.from)}</span>
                              </div>
                              <div>
                                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400], letterSpacing: 0.3, textTransform: 'uppercase' as const, display: 'block' } as any}>To</span>
                                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900], letterSpacing: -0.3, marginTop: 2, display: 'block' } as any}>{shortCity(order.to)}</span>
                              </div>
                            </div>
                          </div>

                          {/* ── Row 4: Meta chips ── */}
                          <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8, marginTop: 12, flexWrap: 'wrap' as const } as any}>
                            <div style={{
                              display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                              backgroundColor: colors.gray[50], borderRadius: 10,
                              paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                            } as any}>
                              <IconCalendar color={colors.gray[400]} />
                              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                                {order.date}
                              </span>
                            </div>
                            <div style={{
                              display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                              backgroundColor: colors.gray[50], borderRadius: 10,
                              paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                            } as any}>
                              <IconRoute color={colors.gray[400]} />
                              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                                {order.distance}
                              </span>
                            </div>
                            <div style={{
                              display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 6,
                              backgroundColor: colors.gray[50], borderRadius: 10,
                              paddingLeft: 10, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                            } as any}>
                              <IconBox color={colors.gray[400]} />
                              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: colors.gray[600], letterSpacing: -0.26 } as any}>
                                {order.volume}
                              </span>
                            </div>
                          </div>

                          {/* ── Row 5: Earnings + View Details ── */}
                          <div style={{
                            display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
                            marginTop: 16, paddingTop: 16,
                          } as any}>
                            <div>
                              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, color: colors.gray[400], textTransform: 'uppercase' as const, display: 'block' } as any}>
                                Earnings
                              </span>
                              <span style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.44 } as any}>
                                ${order.earnings.toLocaleString()}
                              </span>
                            </div>
                            <Pressable
                              onPress={(e) => { e.stopPropagation?.(); onSelectOrder?.(order.id); }}
                              style={({ pressed }) => [{
                                backgroundColor: colors.gray[100],
                                paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14,
                              }, pressed && { opacity: 0.85 }]}
                            >
                              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, letterSpacing: -0.28, color: colors.gray[700] } as any}>
                                View Details
                              </span>
                            </Pressable>
                          </div>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* TabBar */}
        <View style={s.tabBarWrap}>
          <TabBar active="myMoves" onTabPress={onTabPress} variant="default" role={role} />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  } as any,

  header: {
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },

  /* ── Cards ── */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  } as any,

  /* ── TabBar ── */
  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
});
