/**
 * AI Moving — Mover Schedule Screen (Main screen for movers)
 *
 * Timeline-style layout inspired by delivery/logistics apps:
 * - Scrollable 2-week calendar strip
 * - Timeline with time slots and task cards
 * - Active task highlighted with border + badge
 * - SwipeButton at bottom for advancing the active step
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock, SwipeButton } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import { TabBar, TabId } from '../home/TabBar';
import { MoveStep } from '../home/DashboardScreen';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export type MoveStatus = 'in_progress' | 'upcoming' | 'completed';

export interface ScheduleMove {
  id: string;
  client: string;
  from: string;
  to: string;
  time: string;       // display time e.g. "10:00 AM"
  timeEnd?: string;    // e.g. "12:00 PM"
  rooms: number;
  estimatedHours: number;
  status: MoveStatus;
  phone?: string;
  /** If this is the active move, its current step */
  step?: MoveStep;
}

interface ScheduleScreenProps {
  movesByDate: Record<string, ScheduleMove[]>;
  onTabPress: (tab: TabId) => void;
  onMovePress: (moveId: string) => void;
  /** Advance the active move step */
  onAdvanceStep?: () => void;
  onCallClient?: (phone: string) => void;
  onChatClient?: (moveId: string) => void;
  /** Current swipe action label */
  swipeActionLabel?: string;
  /** Show "Sign Contract" button instead of swipe at arrived_pickup */
  contractPending?: boolean;
  onSignContract?: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Step labels for inline display
   ═══════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════
   Date helpers
   ═══════════════════════════════════════════ */

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getTwoWeekDays(baseDate: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(baseDate);
  // Go back 3 days from today for context
  start.setDate(start.getDate() - 3);
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const LocationPinIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.5" />
  </svg>
);

const PhoneIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C20.63 21 20.27 21.01 19.91 21C12.33 20.32 5.68 16.53 3.01 10.09C2.46 8.77 2.04 7.38 1.78 5.95C1.72 5.39 2.17 4.92 2.73 4.92H5.73C6.22 4.92 6.64 5.28 6.72 5.76C6.87 6.69 7.13 7.6 7.48 8.47L5.81 10.14C7.7 13.67 10.33 16.3 13.86 18.19L15.53 16.52C16.4 16.87 17.31 17.13 18.24 17.28C18.72 17.36 19.08 17.78 19.08 18.27L19.08 16.92" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatBubbleIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 12C21 16.97 16.97 21 12 21C10.36 21 8.81 20.59 7.46 19.86L3 21L4.14 16.54C3.41 15.19 3 13.64 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  movesByDate,
  onTabPress,
  onMovePress,
  onAdvanceStep,
  onCallClient,
  onChatClient,
  swipeActionLabel,
  contractPending,
  onSignContract,
  role,
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const calendarRef = useRef<ScrollView>(null);

  const allDays = getTwoWeekDays(today);
  const selectedKey = formatDateKey(selectedDate);
  const dayMoves = movesByDate[selectedKey] || [];
  const activeMove = dayMoves.find(m => m.status === 'in_progress');

  const selectedMonth = MONTH_NAMES[selectedDate.getMonth()];
  const selectedYear = selectedDate.getFullYear();

  // Scroll calendar to show today centered on mount
  useEffect(() => {
    // Today is at index 3 in our 14-day array, scroll a bit
    setTimeout(() => {
      calendarRef.current?.scrollTo?.({ x: 0, animated: false });
    }, 100);
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBarMock />
          <View style={styles.tabBarWrap}>
            <TabBar active="schedule" onTabPress={onTabPress} role={role} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Count moves per day for indicator
  const moveCounts: Record<string, number> = {};
  for (const d of allDays) {
    const key = formatDateKey(d);
    moveCounts[key] = (movesByDate[key] || []).length;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />

        {/* ── Header ── */}
        <div style={{
          padding: '16px 20px 0',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        } as any}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 } as any}>
            <span style={{
              fontFamily: F, fontSize: 22, fontWeight: 700,
              color: colors.gray[900],
            } as any}>Schedule</span>
            <span style={{
              fontFamily: F, fontSize: 14, fontWeight: 500,
              color: colors.gray[400],
            } as any}>— {selectedMonth}</span>
          </div>
        </div>

        {/* ── Calendar strip (scrollable) ── */}
        <div style={{
          padding: '12px 0 6px',
          overflowX: 'auto',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          paddingLeft: 12,
          paddingRight: 12,
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as any}>
          {allDays.map((d) => {
            const key = formatDateKey(d);
            const isSelected = isSameDay(d, selectedDate);
            const isTodayDay = isToday(d);
            const moveCount = moveCounts[key] || 0;
            const hasMoves = moveCount > 0;

            return (
              <Pressable
                key={key}
                onPress={() => setSelectedDate(d)}
                style={{ alignItems: 'center' }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '6px 6px 8px',
                  borderRadius: 14,
                  backgroundColor: isSelected ? colors.primary[500] : 'transparent',
                  border: isTodayDay && !isSelected ? `1.5px solid ${colors.primary[200]}` : '1.5px solid transparent',
                  minWidth: 44,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                } as any}>
                  <span style={{
                    fontFamily: F, fontSize: 10, fontWeight: 600,
                    color: isSelected ? 'rgba(255,255,255,0.6)' : colors.gray[400],
                    marginBottom: 3,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  } as any}>{DAY_NAMES_SHORT[d.getDay()]}</span>
                  <span style={{
                    fontFamily: F, fontSize: 17, fontWeight: 700,
                    color: isSelected ? '#FFFFFF' : isTodayDay ? colors.primary[500] : colors.gray[800],
                    lineHeight: '22px',
                  } as any}>{d.getDate()}</span>
                  {/* Move count dot */}
                  <div style={{
                    width: 5, height: 5, borderRadius: 999, marginTop: 3,
                    backgroundColor: hasMoves
                      ? (isSelected ? 'rgba(255,255,255,0.6)' : colors.primary[400])
                      : 'transparent',
                  }} />
                </div>
              </Pressable>
            );
          })}
        </div>

        {/* ── Day title ── */}
        <div style={{
          padding: '8px 20px 2px',
        } as any}>
          <span style={{
            fontFamily: F, fontSize: 15, fontWeight: 600,
            color: colors.gray[800],
          } as any}>
            {isToday(selectedDate)
              ? `Tasks for Today`
              : `Tasks for ${DAY_NAMES_SHORT[selectedDate.getDay()]}, ${MONTH_SHORT[selectedDate.getMonth()]} ${selectedDate.getDate()}`
            }
          </span>
        </div>

        {/* ── Timeline ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: activeMove ? 160 : 100, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {dayMoves.length === 0 ? (
            /* Empty state */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '60px 20px',
            } as any}>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: colors.gray[50],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                border: `1px solid ${colors.gray[100]}`,
              } as any}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.gray[300]} strokeWidth="1.5" />
                  <path d="M16 2V6M8 2V6M3 10H21" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontFamily: F, fontSize: 17, fontWeight: 600, color: colors.gray[700],
                marginBottom: 4,
              } as any}>No moves scheduled</span>
              <span style={{
                fontFamily: F, fontSize: 14, fontWeight: 400, color: colors.gray[400],
              } as any}>You're free this day</span>
            </div>
          ) : (
            /* Timeline cards — reference style */
            dayMoves.map((move, idx) => {
              const isActive = move.status === 'in_progress';
              const isCompleted = move.status === 'completed';
              const stepIdx = move.step ? STEP_ORDER.indexOf(move.step) : -1;

              // Compute end time from start + estimated hours
              const endTime = move.timeEnd || (() => {
                const [timePart, ampm] = move.time.split(' ');
                const [h, m] = timePart.split(':').map(Number);
                let hours24 = ampm === 'PM' && h !== 12 ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
                const endH = hours24 + Math.floor(move.estimatedHours);
                const endM = m + Math.round((move.estimatedHours % 1) * 60);
                const finalH = endH + Math.floor(endM / 60);
                const finalM = endM % 60;
                const displayH = finalH > 12 ? finalH - 12 : finalH;
                const displayAmPm = finalH >= 12 ? 'PM' : 'AM';
                return `${displayH}:${String(finalM).padStart(2, '0')} ${displayAmPm}`;
              })();

              return (
                <div key={move.id} style={{
                  paddingLeft: 16, paddingRight: 16,
                  marginBottom: 6,
                } as any}>

                  {/* ── Time range row with dotted line ── */}
                  <div style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    marginBottom: 8, gap: 8,
                  } as any}>
                    <span style={{
                      fontFamily: F, fontSize: 13, fontWeight: 600,
                      color: isActive ? colors.primary[500] : colors.gray[400],
                      whiteSpace: 'nowrap',
                    } as any}>{move.time.replace(' AM', '').replace(' PM', '')} - {endTime.replace(' AM', '').replace(' PM', '')}</span>
                    <div style={{
                      flex: 1, height: 1,
                      borderBottom: `1.5px dotted ${isActive ? colors.primary[300] : colors.gray[200]}`,
                    }} />
                  </div>

                  {/* ── Card ── */}
                  <Pressable
                    onPress={() => onMovePress(move.id)}
                    style={({ pressed }) => [pressed && { opacity: 0.9 }]}
                  >
                    <div style={{
                      backgroundColor: isActive ? colors.primary[500] : '#F5F5F5',
                      borderRadius: 16,
                      padding: '14px 16px 16px',
                      opacity: isCompleted ? 0.6 : 1,
                      marginBottom: 4,
                    } as any}>

                      {/* Top row: title + active badge */}
                      <div style={{
                        display: 'flex', flexDirection: 'row',
                        alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 8,
                      } as any}>
                        <span style={{
                          fontFamily: F,
                          fontSize: 16, fontWeight: 700,
                          color: isActive ? '#FFFFFF' : colors.gray[800],
                        } as any}>{move.client}</span>
                        {isActive && (
                          <div style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 8,
                            padding: '4px 10px',
                            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4,
                          } as any}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12L10 17L19 7" stroke={colors.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{
                              fontFamily: F, fontSize: 11, fontWeight: 600,
                              color: colors.primary[500],
                            } as any}>Active Task</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div style={{
                            backgroundColor: colors.success[50],
                            borderRadius: 8,
                            padding: '4px 10px',
                          } as any}>
                            <span style={{
                              fontFamily: F, fontSize: 11, fontWeight: 600,
                              color: colors.success[600],
                            } as any}>Completed</span>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                        gap: 6, marginBottom: isActive ? 10 : 0,
                      } as any}>
                        <LocationPinIcon color={isActive ? 'rgba(255,255,255,0.7)' : colors.gray[400]} />
                        <span style={{
                          fontFamily: F, fontSize: 13, fontWeight: 500,
                          color: isActive ? 'rgba(255,255,255,0.85)' : colors.gray[500],
                        } as any}>{move.from}</span>
                      </div>

                      {/* Step dots (active only) — mini version of dashboard dots */}
                      {isActive && move.step && move.step !== 'completed' && (
                        <div style={{ marginTop: 2 } as any}>
                          {/* Step dots row */}
                          <div style={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center',
                            marginBottom: 6,
                          } as any}>
                            {STEP_ORDER.map((s, i) => {
                              const done = i < stepIdx;
                              const current = i === stepIdx;
                              return (
                                <React.Fragment key={s}>
                                  <div style={{
                                    width: 14, height: 14, borderRadius: 7,
                                    backgroundColor: done ? 'rgba(255,255,255,0.9)'
                                      : current ? '#FFFFFF'
                                      : 'rgba(255,255,255,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: current ? '0 0 0 2px rgba(255,255,255,0.4)' : 'none',
                                  } as any}>
                                    {done && (
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12L10 17L19 7" stroke={colors.primary[500]} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </div>
                                  {i < STEP_ORDER.length - 1 && (
                                    <div style={{
                                      flex: 1, height: 2,
                                      backgroundColor: done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                                      marginLeft: 2, marginRight: 2,
                                    }} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                          {/* Step label */}
                          <span style={{
                            fontFamily: F, fontSize: 12, fontWeight: 500,
                            color: 'rgba(255,255,255,0.8)',
                          } as any}>Step {stepIdx + 1}/{STEP_ORDER.length}: {STEP_LABELS[move.step]}</span>
                        </div>
                      )}

                      {/* Quick actions for active */}
                      {isActive && move.phone && (
                        <div style={{
                          display: 'flex', flexDirection: 'row', gap: 8,
                          marginTop: 10,
                        } as any}>
                          <Pressable
                            onPress={(e) => { e.stopPropagation?.(); onCallClient?.(move.phone!); }}
                            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                          >
                            <div style={{
                              display: 'flex', flexDirection: 'row', alignItems: 'center',
                              gap: 6, padding: '7px 14px',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 10,
                            } as any}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C14.28 21.43 7.68 17.96 4.03 12C2.72 9.72 1.89 7.17 1.63 4.53C1.58 3.97 2.02 3.5 2.58 3.5H5.58C6.07 3.5 6.49 3.86 6.57 4.34C6.79 5.72 7.2 7.05 7.79 8.29L5.81 10.14C7.7 13.67 10.33 16.3 13.86 18.19L15.71 16.21C16.95 16.8 18.28 17.21 19.66 17.43C20.14 17.51 20.5 17.93 20.5 18.42V16.92" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                              <span style={{
                                fontFamily: F, fontSize: 13, fontWeight: 600,
                                color: '#FFFFFF',
                              } as any}>Call</span>
                            </div>
                          </Pressable>
                          <Pressable
                            onPress={(e) => { e.stopPropagation?.(); onChatClient?.(move.id); }}
                            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                          >
                            <div style={{
                              display: 'flex', flexDirection: 'row', alignItems: 'center',
                              gap: 6, padding: '7px 14px',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: 10,
                            } as any}>
                              <ChatBubbleIcon color="#FFFFFF" />
                              <span style={{
                                fontFamily: F, fontSize: 13, fontWeight: 600,
                                color: '#FFFFFF',
                              } as any}>Chat</span>
                            </div>
                          </Pressable>
                        </div>
                      )}

                      {/* Upcoming meta */}
                      {move.status === 'upcoming' && (
                        <div style={{
                          display: 'flex', flexDirection: 'row', alignItems: 'center',
                          gap: 12, marginTop: 8,
                        } as any}>
                          <span style={{
                            fontFamily: F, fontSize: 12, fontWeight: 500,
                            color: colors.gray[400],
                          } as any}>{move.rooms} room{move.rooms > 1 ? 's' : ''}</span>
                          <span style={{
                            fontFamily: F, fontSize: 12, fontWeight: 500,
                            color: colors.gray[400],
                          } as any}>~{move.estimatedHours}h</span>
                        </div>
                      )}
                    </div>
                  </Pressable>
                </div>
              );
            })
          )}
        </ScrollView>

        {/* ── Bottom dock: unified card with swipe + tabs ── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 8,
        } as any}>
          {/* Single white card container */}
          <div style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            border: '1px solid #F2F4F7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          } as any}>
            {/* Action — Sign Contract button or SwipeButton */}
            {activeMove && activeMove.step && activeMove.step !== 'completed' && onAdvanceStep && (
              <div style={{
                padding: '10px 10px 0',
              } as any}>
                {contractPending && activeMove.step === 'arrived_pickup' ? (
                  <div
                    onClick={onSignContract}
                    style={{
                      height: 58, borderRadius: 29,
                      backgroundColor: colors.primary[500],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      width: '100%',
                    } as any}
                  >
                    <span style={{
                      fontFamily: F, fontSize: 16, fontWeight: 700,
                      color: '#FFFFFF', letterSpacing: -0.3, userSelect: 'none',
                    } as any}>Sign Contract</span>
                  </div>
                ) : (
                  <SwipeButton
                    title={swipeActionLabel || STEP_ACTION[activeMove.step]}
                    onSwipeComplete={onAdvanceStep}
                  />
                )}
              </div>
            )}
            {/* Tab icons */}
            <TabBar active="schedule" onTabPress={onTabPress} role={role} variant="flat" />
          </div>
          {/* Home indicator */}
          <div style={{
            width: 134,
            height: 5,
            borderRadius: 3,
            backgroundColor: colors.gray[900],
            marginTop: 8,
          }} />
        </div>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { flex: 1 },
  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
});
