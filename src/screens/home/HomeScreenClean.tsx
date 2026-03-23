/**
 * AI Moving — Home Screen Clean (Flat White Design)
 *
 * Design: Pure white background, minimal shadow cards, no glassmorphism,
 * no gradients, no blobs. Clean, simple, and accessible.
 *
 * WiFi tap → advance phase. Time tap → go back.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Text, StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { typography, fontFamily } from '../../design-system/tokens/typography';
import { TabBar, TabId } from './TabBar';

/* ═══════════════════════════════════════════
   Types & data
   ═══════════════════════════════════════════ */

import type { HomePhase } from './HomeScreen';

interface JourneyStage { id: string; label: string; }
const JOURNEY_STAGES: JourneyStage[] = [
  { id: 'find', label: 'Find' },
  { id: 'choose', label: 'Choose' },
  { id: 'deposit', label: 'Deposit' },
  { id: 'move', label: 'Move' },
  { id: 'done', label: 'Done' },
];
const phaseToStageIndex = (p: HomePhase): number =>
  ({ searching: 0, offers: 1, confirmed: 2, moveDay: 3, completed: 4 })[p] ?? 0;
const stageIndexToPhase = (i: number): HomePhase =>
  (['searching', 'offers', 'confirmed', 'moveDay', 'completed'] as HomePhase[])[i] ?? 'searching';

interface MoverInfo {
  name: string; rating: number; reviews: number;
  truck: string; crewSize: number; price: number;
  eta: string; phone: string;
}
const DEFAULT_MOVER: MoverInfo = {
  name: 'SOS Moving Co.', rating: 4.9, reviews: 312,
  truck: '20ft truck', crewSize: 3, price: 1340,
  eta: 'March 15', phone: '+1 (555) 123-4567',
};

interface HomeScreenProps {
  phase: HomePhase;
  userName: string;
  planName: string;
  planPrice: number;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  mover?: MoverInfo;
  offersCount?: number;
  onViewOffers: () => void;
  onSkipPhase: () => void;
  onPhaseChange?: (phase: HomePhase) => void;
  onAcceptMover?: (mover: { id: string; name: string; rating: number; reviews: number; truck: string; crew: number; price: number; eta: string; highlights?: string[] }) => void;
  onBack: () => void;
  onTabPress: (tab: TabId) => void;
  onChatWithMover?: () => void;
  /* My Move info */
  distance?: string;
  estimatedTime?: string;
  roomsScanned?: number;
  itemsDetected?: number;
  totalVolume?: string;
  depositPaid?: number;
  /** When true — renders glassmorphism style instead of clean map style */
  glass?: boolean;
}


/* ═══════════════════════════════════════════
   Clean Card Styles
   ═══════════════════════════════════════════ */

const cleanCard: any = Platform.OS === 'web' ? {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F2F4F7',
  borderRadius: 20,
} : {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.gray[100],
};

const heroCleanCard: any = Platform.OS === 'web' ? {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F2F4F7',
  borderRadius: 20,
} : {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.gray[100],
};

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" fill={colors.gray[700]} stroke={colors.gray[700]} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={colors.gray[700]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1"/>
  </svg>
);

const PhoneCallIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 482.6 482.6" fill="none">
    <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 14.6 39.1 41 83.2 80.2 130.3zM25.739 104.2c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8-.2.2-.3.3-.5.5-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5C28.039 146.4 24.139 124.3 25.739 104.2z" fill={color}/>
  </svg>
);

const ChatBubbleIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 22.3a10.62 10.62 0 01-5.16-1.3.26.26 0 00-.2 0l-3.53 1a1.24 1.24 0 01-1.56-1.55l1.06-3.55a.27.27 0 000-.19 10.75 10.75 0 1111.69 5.35 11.47 11.47 0 01-2.3.24zm-5.29-2.87a1.85 1.85 0 01.85.22 9.25 9.25 0 102.9-17.23 9.23 9.23 0 00-6.56 13.58 1.77 1.77 0 01.15 1.35l-.93 3.09 3.09-.93a1.73 1.73 0 01.5-.08z" fill={color}/><circle cx="8" cy="12" r="1.25" fill={color}/><circle cx="12" cy="12" r="1.25" fill={color}/><circle cx="16" cy="12" r="1.25" fill={color}/>
  </svg>
);

const TruckMiniIcon = ({ color = colors.gray[500] }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="6" width="15" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
    <path d="M16 10H19L22 13V16H16V10Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="6.5" cy="18" r="1.5" stroke={color} strokeWidth="1.5"/>
    <circle cx="19.5" cy="18" r="1.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

const CrewIcon = ({ color = colors.gray[500] }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5"/>
    <circle cx="17" cy="7" r="3" stroke={color} strokeWidth="1.5"/>
    <path d="M2 20C2 17.24 4.69 15 9 15C10.04 15 10.98 15.14 11.81 15.4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 20C14 17.24 15.24 15 17 15C18.76 15 20 17.24 20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M3 10H21" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M8 2V6M16 2V6" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DistanceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 12H6L9 6L15 18L18 12H21" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M12 7V12L15 14" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDown: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' } as any}>
    <path d="M6 9L12 15L18 9" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Journey Progress — simple dots with lines
   ═══════════════════════════════════════════ */

const JourneyProgress: React.FC<{ phase: HomePhase }> = ({ phase }) => {
  const ai = phaseToStageIndex(phase);
  if (Platform.OS !== 'web') return null;

  // Inject pulse keyframes once
  const cssId = 'clean-pulse-css';
  useEffect(() => {
    if (document.getElementById(cssId)) return;
    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = `
      @keyframes cleanPulse {
        0%, 100% { box-shadow: 0 0 0 0px rgba(46,144,250,0.3); }
        50% { box-shadow: 0 0 0 6px rgba(46,144,250,0.08); }
      }
      @keyframes searchPulse {
        0% { transform: scale(0.8); opacity: 0.7; }
        70% { transform: scale(1.6); opacity: 0; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes slideAcross {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
      @keyframes shimmerLine {
        0%   { transform: translateX(-120%); }
        100% { transform: translateX(380%); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <View style={s.journeyWrap}>
      <div style={{
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: 0,
      }}>
        {JOURNEY_STAGES.map((st, i) => {
          const done = i < ai;
          const act = i === ai;
          const isLast = i === JOURNEY_STAGES.length - 1;

          return (
            <div key={st.id} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center' as const,
              position: 'relative' as const,
            }}>
              {/* Connector line */}
              {!isLast && (
                <div style={{
                  position: 'absolute' as const,
                  top: 15,
                  left: '50%',
                  right: '-50%',
                  height: 2,
                  backgroundColor: done ? colors.primary[400] : colors.primary[100],
                  transition: 'background-color 0.4s ease',
                  zIndex: 0,
                }} />
              )}

              {/* Circle */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                backgroundColor: done || act ? colors.primary[500] : '#FFFFFF',
                border: done || act ? 'none' : `1.5px solid ${colors.primary[100]}`,
                zIndex: 1,
                transition: 'all 0.4s ease',
                ...(act ? { animation: 'cleanPulse 2s ease-in-out infinite' } : {}),
              }}>
                {done ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L10 18L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: fontFamily.primary,
                    fontSize: 14,
                    fontWeight: 700,
                    color: act ? '#FFFFFF' : colors.gray[400],
                  }}>{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <span style={{
                fontFamily: fontFamily.primary,
                fontSize: 14,
                fontWeight: act ? 600 : 400,
                color: done || act ? colors.primary[600] : colors.gray[500],
                textAlign: 'center' as const,
                marginTop: 6,
                letterSpacing: '-0.02em',
              } as any}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Searching Spinner
   ═══════════════════════════════════════════ */

const SearchingSpinner: React.FC = () => {
  const rot = useRef(new Animated.Value(0)).current;
  const pul = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(rot, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pul, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(pul, { toValue: 0.9, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
    ])).start();
    return () => { rot.stopAnimation(); pul.stopAnimation(); };
  }, []);
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ rotate }], position: 'absolute' }}>
        {Platform.OS === 'web' && (
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="32" stroke="#F2F4F7" strokeWidth="3" />
            <path d="M36 4C55 4 68 17 68 36" stroke={colors.primary[500]} strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </Animated.View>
      <Animated.View style={[{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        border: `1px solid #F2F4F7`,
      } as any, { transform: [{ scale: pul }] }]}>
        {Platform.OS === 'web' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 10C21 15.52 12 22 12 22C12 22 3 15.52 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" fill={colors.primary[100]} stroke={colors.primary[500]} strokeWidth="1.5"/>
            <circle cx="12" cy="10" r="3" fill={colors.primary[500]}/>
          </svg>
        )}
      </Animated.View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Phase: SEARCHING
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   Shared: Route block (reusable)
   ═══════════════════════════════════════════ */

const RouteBlock: React.FC<{ from: string; to: string }> = ({ from, to }) => (
  <div style={{
    display: 'flex', flexDirection: 'column' as const, gap: 0,
    padding: '14px 16px', backgroundColor: '#F8F9FB', borderRadius: 14,
  } as any}>
    <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 } as any}>
      <div style={{ width: 12, display: 'flex', justifyContent: 'center' as const, flexShrink: 0 } as any}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.primary[400] } as any} />
      </div>
      <div style={{ flex: 1, minWidth: 0 } as any}>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[800], display: 'block' } as any}>{getShortCode(from)}</span>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 1 } as any}>{from}</span>
      </div>
    </div>
    <div style={{ paddingLeft: 5, height: 16, display: 'flex', alignItems: 'center' as const } as any}>
      <div style={{ width: 0, height: '100%', borderLeft: `1.5px dashed ${colors.gray[200]}` } as any} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12 } as any}>
      <div style={{ width: 12, display: 'flex', justifyContent: 'center' as const, flexShrink: 0 } as any}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.error[300] } as any} />
      </div>
      <div style={{ flex: 1, minWidth: 0 } as any}>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[800], display: 'block' } as any}>{getShortCode(to)}</span>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 1 } as any}>{to}</span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Shared: Journey stepper (phase-aware)
   ═══════════════════════════════════════════ */

const PHASE_STEPS: { label: string; sublabel: string; phase: HomePhase; date: string }[] = [
  { label: 'Searching',  sublabel: 'Looking for movers',       phase: 'searching', date: 'Mar 12, 9:00 AM' },
  { label: 'Offers',     sublabel: 'Review & choose a mover',  phase: 'offers',    date: 'Mar 12, 9:45 AM' },
  { label: 'Confirmed',  sublabel: 'Deposit & finalize',        phase: 'confirmed', date: 'Mar 12, 10:30 AM' },
  { label: 'Move Day',   sublabel: 'Your move is happening',    phase: 'moveDay',   date: 'Mar 15, 8:00 AM' },
];

/* Icon per phase */
const PhaseIcon: React.FC<{ step: HomePhase; color: string; size?: number }> = ({ step, color, size = 18 }) => {
  switch (step) {
    case 'searching': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2"/>
        <path d="M16.5 16.5L21 21" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="3" fill={color} opacity="0.25"/>
      </svg>
    );
    case 'offers': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2"/>
        <path d="M9 14l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    case 'confirmed': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2"/>
        <path d="M16 3H8C6.9 3 6 3.9 6 5v2h12V5c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2"/>
        <path d="M9 13l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    case 'moveDay': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="1" y="6" width="14" height="10" rx="1.5" stroke={color} strokeWidth="2"/>
        <path d="M15 10h4l2 3v3h-6V10z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="6.5" cy="18" r="2" stroke={color} strokeWidth="2"/>
        <circle cx="18.5" cy="18" r="2" stroke={color} strokeWidth="2"/>
      </svg>
    );
    default: return null;
  }
};

/* Icon-based phase stepper — tap to open detail timeline */
const PhaseStepperInline: React.FC<{ phase: HomePhase; onTap: () => void }> = ({ phase, onTap }) => {
  const activeIdx = PHASE_STEPS.findIndex(s => s.phase === phase);
  const CIRCLE = 52; // uniform size for all steps

  return (
    <div
      onClick={onTap}
      style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', cursor: 'pointer', gap: 0 } as any}
      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.8'; }}
      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
    >
      {/* Steps row */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' as const, alignItems: 'center' } as any}>
        {PHASE_STEPS.map((step, i) => {
          const done   = i < activeIdx;
          const active = i === activeIdx;
          const isLast = i === PHASE_STEPS.length - 1;

          const circleBg   = done ? colors.primary[500] : active ? colors.primary[500] : colors.gray[50];
          const iconColor  = done || active ? '#FFFFFF' : colors.gray[900];
          const labelColor = active ? colors.primary[600] : done ? colors.primary[400] : colors.gray[500];

          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6, flexShrink: 0 } as any}>
                <div style={{
                  width: CIRCLE, height: CIRCLE, borderRadius: '50%',
                  backgroundColor: circleBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: done ? `0 2px 8px ${colors.primary[200]}` : 'none',
                  transition: 'all 0.25s',
                } as any}>
                  {done
                    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13L10 18L20 6" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <PhaseIcon step={step.phase} color={iconColor} size={24} />
                  }
                </div>
                <span style={{
                  fontFamily: fontFamily.primary,
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: labelColor,
                  textAlign: 'center' as const, whiteSpace: 'nowrap' as const,
                } as any}>{step.label}</span>
              </div>

              {!isLast && (
                <div style={{
                  flex: 1, height: 3, marginBottom: 20, borderRadius: 2,
                  backgroundColor: done ? colors.primary[500] : active ? colors.gray[200] : colors.gray[100],
                  position: 'relative' as const,
                  overflow: 'hidden',
                } as any}>
                  {active && (
                    <>
                      {/* Base gradient fill from blue to gray */}
                      <div style={{
                        position: 'absolute' as const,
                        top: 0, bottom: 0, left: 0, right: 0,
                        background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[300]} 30%, ${colors.gray[200]} 70%, ${colors.gray[100]} 100%)`,
                        borderRadius: 2,
                      } as any} />
                      {/* Shimmer highlight that slides across */}
                      <div style={{
                        position: 'absolute' as const,
                        top: 0, bottom: 0, left: 0,
                        width: '35%',
                        borderRadius: 2,
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 60%, transparent 100%)`,
                        animation: 'shimmerLine 2s ease-in-out infinite',
                      } as any} />
                    </>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Chevron */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 4, marginBottom: 18 } as any}>
        <path d="M9 18l6-6-6-6" stroke={colors.gray[300]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Demo movers data
   ═══════════════════════════════════════════ */

const DEMO_MOVERS = [
  { id: '1', name: 'SOS Moving Co.', rating: 4.9, reviews: 312, truck: '20ft truck', crew: 3, price: 1340, eta: '15 min', initials: 'SM', avatarBg: colors.primary[25], avatarColor: colors.primary[600], highlights: ['Top rated', 'Insured', 'On-time guarantee'] },
  { id: '2', name: 'Quick Movers', rating: 4.7, reviews: 187, truck: '16ft truck', crew: 2, price: 1180, eta: '25 min', initials: 'QM', avatarBg: colors.success[50], avatarColor: colors.success[600], highlights: ['Budget friendly', 'Fast response'] },
  { id: '3', name: 'Pro Relocation', rating: 4.8, reviews: 445, truck: '24ft truck', crew: 4, price: 1540, eta: '20 min', initials: 'PR', avatarBg: colors.warning[50], avatarColor: colors.warning[600], highlights: ['Premium service', 'Insured', 'Large capacity'] },
];

type DemoMover = typeof DEMO_MOVERS[0];

/* ═══════════════════════════════════════════
   Map Placeholder
   ═══════════════════════════════════════════ */

/* ── Real Leaflet + OpenStreetMap fullscreen map ── */
const MAP_PICKUP: [number, number] = [40.7484, -73.9882];   // Broadway, Manhattan
const MAP_DROPOFF: [number, number] = [40.6782, -73.9442];  // Park Slope, Brooklyn

const buildFullMapHTML = (): string => {
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
html,body,#map{margin:0;padding:0;width:100%;height:100%;}
.lbl{background:#fff;border-radius:8px;padding:5px 10px;box-shadow:0 1px 4px rgba(0,0,0,0.2);font-family:Roboto,Arial,sans-serif;font-size:12px;font-weight:500;color:#333;white-space:nowrap;border:none;}
.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{display:none;}
</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:true});

/* Google Maps tile layer — forced English, no POI labels */
L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',{maxZoom:12,subdomains:['mt0','mt1','mt2','mt3']}).addTo(map);

var A=[${MAP_PICKUP[0]},${MAP_PICKUP[1]}],B=[${MAP_DROPOFF[0]},${MAP_DROPOFF[1]}];

/* Google-style pickup marker (blue circle with white border and pulsing ring) */
var pickupIcon=L.divIcon({
  className:'',
  html:'<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">'
    +'<div style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(66,133,244,0.15);animation:pulse 2s ease-out infinite;"></div>'
    +'<div style="width:18px;height:18px;border-radius:50%;background:#4285F4;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);position:relative;z-index:2;"></div>'
    +'</div>',
  iconSize:[44,44],iconAnchor:[22,22]
});

/* Google-style destination marker (red pin) */
var destIcon=L.divIcon({
  className:'',
  html:'<svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">'
    +'<path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.72 23.28 0 15 0z" fill="#EA4335"/>'
    +'<circle cx="15" cy="14" r="6" fill="#B31412"/>'
    +'<circle cx="15" cy="14" r="4.5" fill="white"/>'
    +'</svg>',
  iconSize:[30,42],iconAnchor:[15,42]
});

L.marker(A,{icon:pickupIcon}).addTo(map).bindTooltip('Pickup',{permanent:true,direction:'right',offset:[18,0],className:'lbl'});
L.marker(B,{icon:destIcon}).addTo(map).bindTooltip('Destination',{permanent:true,direction:'right',offset:[12,-16],className:'lbl'});

/* Google-style route (blue with border) */
var routeCoords=[
  A,
  [40.7450,-73.9860],
  [40.7380,-73.9830],
  [40.7300,-73.9790],
  [40.7220,-73.9750],
  [40.7150,-73.9700],
  [40.7080,-73.9650],
  [40.7010,-73.9590],
  [40.6940,-73.9540],
  [40.6880,-73.9500],
  [40.6830,-73.9470],
  B
];
/* Route border/shadow */
L.polyline(routeCoords,{color:'#1A73E8',weight:8,opacity:0.25,smoothFactor:3,lineCap:'round',lineJoin:'round'}).addTo(map);
/* Main route */
L.polyline(routeCoords,{color:'#4285F4',weight:5,opacity:1,smoothFactor:3,lineCap:'round',lineJoin:'round'}).addTo(map);

map.fitBounds([A,B],{padding:[80,60]});
map.setMaxZoom(12);
map.once('zoomend',function(){if(map.getZoom()>12)map.setZoom(12);});

/* Pulse animation for pickup */
var style=document.createElement('style');
style.textContent='@keyframes pulse{0%{transform:scale(0.8);opacity:0.8;}100%{transform:scale(2);opacity:0;}}';
document.head.appendChild(style);
<\/script>
</body></html>`;
};

const MapPlaceholder: React.FC<{ phase: HomePhase }> = ({ phase }) => {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    const blob = new Blob([buildFullMapHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  if (Platform.OS !== 'web' || !src) return null;

  return (
    <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' } as any}>
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        } as any}
        scrolling="no"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════
   Top Pill — route + date + plan, always visible
   ═══════════════════════════════════════════ */

const TopPill: React.FC<{ from: string; to: string; moveDate: string; planName: string; planPrice: number }> = ({ from, to, moveDate, planName, planPrice }) => {
  if (Platform.OS !== 'web') return null;
  const fromCity = from.split(',')[0].trim();
  const toCity = to.split(',')[0].trim();
  return (
    <div style={{
      position: 'absolute' as const, top: 52, left: 12, right: 12, zIndex: 30,
      backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)',
      borderRadius: 18, padding: '11px 16px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.10)',
      display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const,
    } as any}>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: '#111827' } as any}>{fromCity}</span>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#9CA3AF', margin: '0 8px' } as any}>→</span>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: '#111827' } as any}>{toCity}</span>
      <div style={{ flex: 1 } as any} />
      <div style={{ width: 1, height: 14, backgroundColor: colors.gray[200], marginRight: 10 } as any} />
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: '#6B7280' } as any}>{moveDate}</span>
      <div style={{ width: 1, height: 14, backgroundColor: colors.gray[200], margin: '0 10px' } as any} />
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#374151' } as any}>{planName}</span>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#D1D5DB', margin: '0 4px' } as any}>·</span>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: '#2563EB' } as any}>${planPrice.toLocaleString()}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Mover Card (inDrive style)
   ═══════════════════════════════════════════ */

const MoverCard: React.FC<{ mover: DemoMover; onAccept: () => void; onPress: () => void }> = ({ mover, onAccept, onPress }) => (
  <div
    onClick={onPress}
    style={{
      display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const,
      paddingTop: 12, paddingBottom: 12, borderBottom: '1px solid #F3F4F6',
      cursor: 'pointer',
    } as any}
  >
    {/* Avatar */}
    <div style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: mover.avatarBg, display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0 } as any}>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: mover.avatarColor } as any}>{mover.initials}</span>
    </div>
    {/* Info */}
    <div style={{ flex: 1, marginLeft: 12, minWidth: 0 } as any}>
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#111827', display: 'block' } as any}>{mover.name}</span>
      <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, marginTop: 3 } as any}>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#F59E0B' } as any}>★ {mover.rating}</span>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#D1D5DB' } as any}>·</span>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#9CA3AF' } as any}>{mover.truck} · {mover.crew} crew</span>
      </div>
    </div>
    {/* Accept button — stops propagation so parent onClick (profile) doesn't fire */}
    <div
      onClick={(e) => { e.stopPropagation(); onAccept(); }}
      style={{
        paddingTop: 9, paddingBottom: 9, paddingLeft: 18, paddingRight: 18,
        borderRadius: 16, backgroundColor: colors.primary[500], marginLeft: 10,
        cursor: 'pointer', flexShrink: 0,
        transition: 'opacity 0.15s',
      } as any}
      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
    >
      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: '#FFFFFF' } as any}>Accept</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Mover Profile Modal (drill-down)
   ═══════════════════════════════════════════ */

const MOVER_REVIEWS = [
  { name: 'Sarah M.', text: 'Extremely professional, arrived on time and handled everything with care.', stars: 5 },
  { name: 'James K.', text: 'Great experience! The crew was friendly and super efficient.', stars: 5 },
  { name: 'Emily R.', text: 'Smooth move, no issues at all. Would definitely recommend.', stars: 4 },
];

const MoverProfileModal: React.FC<{ mover: DemoMover | null; onClose: () => void; onAccept: () => void }> = ({ mover, onClose, onAccept }) => {
  if (!mover || Platform.OS !== 'web') return null;
  return (
    <div style={{ position: 'fixed' as const, inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' as const } as any} onClick={onClose}>
      <div style={{ width: '100%', backgroundColor: '#FAFAFA', borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' as const } as any} onClick={(e: any) => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, backgroundColor: colors.gray[200], borderRadius: 2, margin: '14px auto 0' } as any} />
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const, gap: 14 } as any}>
          <div style={{ width: 68, height: 68, borderRadius: 18, backgroundColor: mover.avatarBg, display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const } as any}>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: mover.avatarColor } as any}>{mover.initials}</span>
          </div>
          <div>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 18, fontWeight: 700, color: '#111827', display: 'block' } as any}>{mover.name}</span>
            <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 6, marginTop: 4, alignItems: 'center' as const } as any}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#F59E0B' } as any}>★ {mover.rating}</span>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#9CA3AF' } as any}>{mover.reviews} reviews</span>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'row' as const, padding: '16px 24px', gap: 8 } as any}>
          {[{ label: 'Truck', value: mover.truck }, { label: 'Crew', value: `${mover.crew} people` }, { label: 'Moves done', value: '500+' }].map((s, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: '#EFF2F7', borderRadius: 12, padding: '12px 14px' } as any}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.6px', display: 'block' } as any}>{s.label}</span>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 4, display: 'block' } as any}>{s.value}</span>
            </div>
          ))}
        </div>
        {/* Reviews */}
        <div style={{ padding: '16px 24px 8px' } as any}>
          <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 14 } as any}>Reviews</span>
          {MOVER_REVIEWS.map((r, i) => (
            <div key={i} style={{ marginBottom: 16 } as any}>
              <div style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 4 } as any}>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: '#374151' } as any}>{r.name}</span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#F59E0B' } as any}>{'★'.repeat(r.stars)}</span>
              </div>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#6B7280', lineHeight: '19px' } as any}>{r.text}</span>
            </div>
          ))}
        </div>
        {/* Accept button */}
        <div style={{ padding: '20px 24px 32px' } as any}>
          <Pressable onPress={onAccept} style={({ pressed }) => [{ alignItems: 'center', justifyContent: 'center', paddingVertical: 18, paddingHorizontal: 24, borderRadius: 16, backgroundColor: colors.primary[500] } as any, pressed && { opacity: 0.85 }]}>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#FFFFFF' } as any}>Accept — {mover.name}</span>
          </Pressable>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Move Day tracking steps
   ═══════════════════════════════════════════ */

const MOVE_STEPS = [
  { label: 'Crew dispatched', time: '8:00 AM', done: true, active: false },
  { label: 'Arrived at pickup', time: '9:15 AM', done: true, active: false },
  { label: 'Loading in progress', time: '9:30 AM', done: false, active: true },
  { label: 'In transit', time: '', done: false, active: false },
  { label: 'Delivery & unloading', time: '', done: false, active: false },
];

/* ═══════════════════════════════════════════
   Route Card — clean white ticket style
   ═══════════════════════════════════════════ */

const getShortCode = (addr: string): string => {
  const parts = addr.split(',')[0].split(' ');
  if (parts.length >= 2) return parts.slice(0, 2).join(' ');
  return parts[0] || addr;
};




/* ═══════════════════════════════════════════
   Notification Bottom Sheet
   ═══════════════════════════════════════════ */

interface NotifItem {
  id: string; title: string; body: string;
  time: string; read: boolean; phase?: HomePhase;
  icon: 'search' | 'offers' | 'confirmed' | 'truck' | 'star';
  group: 'today' | 'earlier';
}

const DEMO_NOTIFS: NotifItem[] = [
  { id: 'n1', title: 'Searching for movers…', body: 'We\'re matching you with the best movers nearby', time: 'Now', read: false, phase: 'searching', icon: 'search', group: 'today' },
  { id: 'n2', title: '4 mover offers available', body: 'Compare quotes and choose the best one', time: '2m ago', read: false, phase: 'offers', icon: 'offers', group: 'today' },
  { id: 'n3', title: 'Booking confirmed!', body: 'SOS Moving Co. will handle your move', time: '15m ago', read: true, phase: 'confirmed', icon: 'confirmed', group: 'today' },
  { id: 'n4', title: 'Moving day!', body: 'Your movers are on the way — track them live', time: '1h ago', read: true, phase: 'moveDay', icon: 'truck', group: 'earlier' },
  { id: 'n5', title: 'Move completed!', body: 'Your items were delivered. Rate your experience', time: '3h ago', read: false, phase: 'completed', icon: 'star', group: 'today' },
];

/* Phase icon per notification type */
const NotifIcon: React.FC<{ type: NotifItem['icon'] }> = ({ type }) => {
  const size = 20;
  const c = colors.primary[500];
  switch (type) {
    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2" />
          <path d="M16 16L21 21" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'offers':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={c} strokeWidth="2" strokeLinecap="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" stroke={c} strokeWidth="2" />
          <path d="M9 14l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'confirmed':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
          <path d="M8 12l3 3 5-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'truck':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="1" y="6" width="14" height="10" rx="1" stroke={c} strokeWidth="2" />
          <path d="M15 10h4l2 3v3h-6V10z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="2" stroke={c} strokeWidth="2" />
          <circle cx="18" cy="18" r="2" stroke={c} strokeWidth="2" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.8 3-1.1-6.5L.4 8.8l6.5-.9L12 2z" stroke="#F59E0B" fill="#FEF08A" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
  }
};

/* Bottom Sheet animation CSS (injected once) */
const SHEET_ANIM_ID = 'notif-sheet-anim';

const NotificationsPanel: React.FC<{
  visible: boolean; onClose: () => void; onSelectPhase: (p: HomePhase) => void;
}> = ({ visible, onClose, onSelectPhase }) => {
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'web' && !document.getElementById(SHEET_ANIM_ID)) {
      const st = document.createElement('style');
      st.id = SHEET_ANIM_ID;
      st.textContent = `
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-15px,15px) scale(0.97)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,20px) scale(1.08)} 66%{transform:translate(20px,-10px) scale(0.95)} }
        @keyframes blobFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,25px) scale(1.04)} }
      `;
      document.head.appendChild(st);
    }
  }, []);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      setClosing(false);
    }
  }, [visible]);

  const handleClose = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => { setMounted(false); setClosing(false); onClose(); }, 280);
  }, [onClose]);

  if ((!visible && !mounted) || Platform.OS !== 'web') return null;

  const todayNotifs = DEMO_NOTIFS.filter(n => n.group === 'today');
  const earlierNotifs = DEMO_NOTIFS.filter(n => n.group === 'earlier');

  return (
    <View style={s.notifOverlay}>
      {/* Backdrop */}
      <Pressable onPress={handleClose}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          animation: closing ? 'fadeOut 0.28s ease forwards' : 'fadeIn 0.28s ease forwards',
        } as any} />
      </Pressable>

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        maxHeight: '62%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        display: 'flex',
        flexDirection: 'column',
        animation: closing ? 'sheetDown 0.28s ease forwards' : 'sheetUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.10)',
      } as any}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 } as any}>
          <div style={{
            width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200],
          } as any} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 20, paddingRight: 20, paddingBottom: 16,
        } as any}>
          <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
            Notifications
          </span>
          <Pressable onPress={handleClose} hitSlop={8}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Pressable>
        </div>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Today group */}
          {todayNotifs.length > 0 && (
            <div style={{ paddingTop: 20 } as any}>
              <span style={{
                fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600,
                color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                paddingLeft: 20, paddingBottom: 12, display: 'block',
              } as any}>Today</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16, paddingRight: 16 } as any}>
                {todayNotifs.map(n => (
                  <Pressable
                    key={n.id}
                    onPress={() => { if (n.phase) { onSelectPhase(n.phase); handleClose(); } }}
                    style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  >
                    <div style={{
                      display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: !n.read ? colors.primary[50] : colors.gray[50],
                    } as any}>
                      {/* Icon circle */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: !n.read ? colors.primary[100] : colors.gray[100],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginRight: 14,
                      } as any}>
                        <NotifIcon type={n.icon} />
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 } as any}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' } as any}>
                          {!n.read && <div style={{
                            width: 7, height: 7, borderRadius: 4,
                            backgroundColor: colors.primary[500], marginRight: 8, flexShrink: 0,
                          } as any} />}
                          <span style={{
                            fontFamily: fontFamily.primary, fontSize: 16,
                            fontWeight: n.read ? 400 : 600, color: colors.gray[900],
                          } as any}>{n.title}</span>
                        </div>
                        <span style={{
                          fontFamily: fontFamily.primary, fontSize: 15,
                          fontWeight: 400, color: colors.gray[500], marginTop: 3, display: 'block',
                        } as any}>{n.body}</span>
                      </div>
                      {/* Time */}
                      <span style={{
                        fontFamily: fontFamily.primary, fontSize: 12, fontWeight: 400,
                        color: colors.gray[400], marginLeft: 12, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 3,
                      } as any}>{n.time}</span>
                    </div>
                  </Pressable>
                ))}
              </div>
            </div>
          )}

          {/* Earlier group */}
          {earlierNotifs.length > 0 && (
            <div style={{ paddingTop: 24 } as any}>
              <span style={{
                fontFamily: fontFamily.primary, fontSize: 13, fontWeight: 600,
                color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                paddingLeft: 20, paddingBottom: 12, display: 'block',
              } as any}>Earlier</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 16, paddingRight: 16 } as any}>
                {earlierNotifs.map(n => (
                  <Pressable
                    key={n.id}
                    onPress={() => { if (n.phase) { onSelectPhase(n.phase); handleClose(); } }}
                    style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  >
                    <div style={{
                      display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
                      padding: 16,
                      borderRadius: 16,
                      backgroundColor: colors.gray[50],
                    } as any}>
                      {/* Icon circle */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: colors.gray[100],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginRight: 14,
                      } as any}>
                        <NotifIcon type={n.icon} />
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 } as any}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' } as any}>
                          {!n.read && <div style={{
                            width: 7, height: 7, borderRadius: 4,
                            backgroundColor: colors.primary[500], marginRight: 8, flexShrink: 0,
                          } as any} />}
                          <span style={{
                            fontFamily: fontFamily.primary, fontSize: 16,
                            fontWeight: n.read ? 400 : 600, color: colors.gray[900],
                          } as any}>{n.title}</span>
                        </div>
                        <span style={{
                          fontFamily: fontFamily.primary, fontSize: 15,
                          fontWeight: 400, color: colors.gray[500], marginTop: 3, display: 'block',
                        } as any}>{n.body}</span>
                      </div>
                      {/* Time */}
                      <span style={{
                        fontFamily: fontFamily.primary, fontSize: 12, fontWeight: 400,
                        color: colors.gray[400], marginLeft: 12, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 3,
                      } as any}>{n.time}</span>
                    </div>
                  </Pressable>
                ))}
              </div>
            </div>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Detail Bottom Sheet (reusable)
   ═══════════════════════════════════════════ */

const DetailSheet: React.FC<{
  visible: boolean; onClose: () => void; title: string; children: React.ReactNode;
}> = ({ visible, onClose, title, children }) => {
  const [mounted, setMounted]   = React.useState(false);
  const [closing, setClosing]   = React.useState(false);
  // height as % of viewport, snaps between 50 and 92
  const [heightPct, setHeightPct] = React.useState(75);
  const dragRef   = React.useRef<{ startY: number; startH: number } | null>(null);
  const sheetRef  = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (visible) { setMounted(true); setClosing(false); setHeightPct(75); }
  }, [visible]);

  const handleClose = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => { setMounted(false); setClosing(false); onClose(); }, 280);
  }, [onClose]);

  // Drag handle — pointer events for both mouse and touch
  const onHandlePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startH: heightPct };
  }, [heightPct]);

  const onHandlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dy   = dragRef.current.startY - e.clientY; // positive = dragging up
    const vhPx = window.innerHeight / 100;
    const newH = Math.min(92, Math.max(30, dragRef.current.startH + dy / vhPx));
    setHeightPct(newH);
  }, []);

  const onHandlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dy = dragRef.current.startY - e.clientY;
    // snap: drag down enough → close; up → 92; small movement → 75
    if (dy < -60) { handleClose(); }
    else if (dy > 60) { setHeightPct(92); }
    else { setHeightPct(heightPct < 60 ? 50 : 75); }
    dragRef.current = null;
  }, [handleClose, heightPct]);

  if ((!visible && !mounted) || Platform.OS !== 'web') return null;

  return (
    <View style={s.notifOverlay}>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          animation: closing ? 'fadeOut 0.28s ease forwards' : 'fadeIn 0.28s ease forwards',
        } as any}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${heightPct}vh`,
          backgroundColor: '#FAFAFA',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          display: 'flex', flexDirection: 'column' as const,
          animation: closing ? 'sheetDown 0.28s ease forwards' : 'sheetUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
          transition: dragRef.current ? 'none' : 'height 0.22s cubic-bezier(0.16,1,0.3,1)',
        } as any}
      >
        {/* Drag handle — touch target */}
        <div
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 8, cursor: 'grab', flexShrink: 0, touchAction: 'none' } as any}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] } as any} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: 24, paddingRight: 20, paddingTop: 4, paddingBottom: 14,
          borderBottom: '1px solid #F2F4F7', flexShrink: 0,
        } as any}>
          <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
            {title}
          </span>
          <div
            onClick={handleClose}
            style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } as any}
            onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = '#E4E8EF'; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = '#EFF2F7'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[500]} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto' as const, WebkitOverflowScrolling: 'touch', backgroundColor: '#FAFAFA' } as any}>
          <div style={{ padding: '16px 16px 48px' } as any}>
            {children}
          </div>
        </div>
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Section Row — tappable row in unified card
   ═══════════════════════════════════════════ */

const SectionRow: React.FC<{
  icon: React.ReactNode; label: string; summary: string; onPress: () => void; last?: boolean;
}> = ({ icon, label, summary, onPress, last }) => {
  if (Platform.OS !== 'web') return null;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
      <div style={{
        padding: '16px 24px',
        display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const,
        borderTop: '1px solid #F2F4F7',
      } as any}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: '#F5F7FA', display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const,
          flexShrink: 0,
        } as any}>
          {icon}
        </div>
        <div style={{ flex: 1, marginLeft: 14, minWidth: 0 } as any}>
          <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 500, color: colors.gray[800], display: 'block' } as any}>{label}</span>
          <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{summary}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 8 } as any}>
          <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Pressable>
  );
};

/* ═══════════════════════════════════════════
   Move Info Sections (from My Move)
   ═══════════════════════════════════════════ */

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; valueColor?: string; last?: boolean }> = ({
  icon, label, value, valueColor = colors.gray[900], last,
}) => {
  if (Platform.OS !== 'web') return null;
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingBottom: 12 } as any}>
        {icon}
        <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 400, color: colors.gray[400], flex: 1, marginLeft: 12 } as any}>{label}</span>
        <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 500, color: valueColor } as any}>{value}</span>
      </div>
      {!last && <div style={{ height: 1, backgroundColor: colors.gray[100] } as any} />}
    </>
  );
};

/* Mini icons — all solid, single color (gray[500]) */
const IC = colors.gray[500];
const MiniIcons = {
  distance: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M3 12H6L9 6L15 18L18 12H21" fill="none" stroke={IC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IC} />
      <circle cx="12" cy="12" r="8" fill="#FFFFFF" />
      <path d="M12 7V12L15 14" fill="none" stroke={IC} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  scan: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" fill={IC} />
      <path d="M7 12L10 15L17 8" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dollar: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IC} />
      <path d="M12 7V17M15 9.5C15 8.12 13.66 7 12 7C10.34 7 9 8.12 9 9.5C9 10.88 10.34 12 12 12C13.66 12 15 13.12 15 14.5C15 15.88 13.66 17 12 17C10.34 17 9 15.88 9 14.5" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  box: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M21 8L12 2L3 8V16L12 22L21 16V8Z" fill={IC} />
      <path d="M12 22V12M3 8L12 14L21 8" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IC} />
      <path d="M8 12L11 15L16 9" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M12 2L3 7V12C3 16.97 7.03 22 12 22C16.97 22 21 16.97 21 12V7L12 2Z" fill={IC} />
      <path d="M8 12L11 15L16 9" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={IC} />
      <path d="M14 2V8H20" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13H16M8 17H13" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};


/* ═══════════════════════════════════════════
   Tariff Detail Sheet (bottom sheet with features + change)
   ═══════════════════════════════════════════ */

const TariffDetailSheet: React.FC<{
  visible: boolean;
  currentPlan: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}> = ({ visible, currentPlan, onClose, onSelect }) => {
  const [selected, setSelected] = useState(currentPlan.toLowerCase());
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (visible) { setMounted(true); setClosing(false); setSelected(currentPlan.toLowerCase()); }
  }, [visible, currentPlan]);

  const handleClose = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => { setMounted(false); setClosing(false); onClose(); }, 280);
  }, [onClose]);

  if ((!visible && !mounted) || Platform.OS !== 'web') return null;

  const selectedTariff = TARIFF_OPTIONS.find(t => t.id === selected) ?? TARIFF_OPTIONS[1];
  const isChanged = selected !== currentPlan.toLowerCase();

  return (
    <View style={s.notifOverlay}>
      {/* Backdrop */}
      <Pressable onPress={handleClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          animation: closing ? 'fadeOut 0.28s ease forwards' : 'fadeIn 0.28s ease forwards',
        } as any} />
      </Pressable>

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: '88%',
        display: 'flex', flexDirection: 'column' as const,
        animation: closing ? 'sheetDown 0.28s ease forwards' : 'sheetUp 0.32s cubic-bezier(0.16,1,0.3,1) forwards',
      } as any}>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 } as any}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] } as any} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 16, borderBottom: '1px solid #F2F4F7' } as any}>
          <div>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: colors.gray[900], display: 'block', letterSpacing: -0.3 } as any}>Moving Plan</span>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 15, color: colors.gray[400], marginTop: 6, display: 'block' } as any}>
              Currently: <span style={{ fontWeight: 600, color: colors.primary[600] }}>{currentPlan}</span>
            </span>
          </div>
          <Pressable onPress={handleClose} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[500]} strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
          </Pressable>
        </div>

        {/* Plan selector tabs */}
        <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 8, padding: '14px 20px', borderBottom: '1px solid #F2F4F7' } as any}>
          {TARIFF_OPTIONS.map(t => {
            const isActive = t.id === selected;
            const isCurrent = t.id === currentPlan.toLowerCase();
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  flex: 1, borderRadius: 18, padding: '20px 10px',
                  backgroundColor: isActive ? t.color : '#EFF2F7',
                  cursor: 'pointer', textAlign: 'center' as const,
                  transition: 'all 0.2s',
                  position: 'relative' as const,
                } as any}
              >
                {isCurrent && (
                  <div style={{ position: 'absolute', top: -7, right: -4, backgroundColor: colors.primary[500], borderRadius: 7, paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 10, fontWeight: 700, color: '#fff' } as any}>Active</span>
                  </div>
                )}
                {'badge' in t && t.badge && !isCurrent && (
                  <div style={{ position: 'absolute', top: -7, right: -4, backgroundColor: colors.primary[500], borderRadius: 7, paddingLeft: 6, paddingRight: 6, paddingTop: 3, paddingBottom: 3 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 10, fontWeight: 700, color: '#fff' } as any}>{t.badge}</span>
                  </div>
                )}
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: isActive ? 'rgba(255,255,255,0.8)' : colors.gray[500], display: 'block', letterSpacing: 0.1 } as any}>{t.name}</span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: isActive ? '#fff' : colors.gray[900], display: 'block', marginTop: 4, letterSpacing: -0.4 } as any}>${t.price.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        {/* Scrollable: plan details */}
        <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '16px 16px 32px' } as any}>

            {/* Plan headline */}
            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 12, marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 } as any}>
              <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${selectedTariff.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="6" width="14" height="10" rx="1.5" stroke={selectedTariff.color} strokeWidth="2"/>
                  <path d="M15 10h4l2 3v3h-6V10z" stroke={selectedTariff.color} strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="6.5" cy="18" r="2" stroke={selectedTariff.color} strokeWidth="2"/>
                  <circle cx="18.5" cy="18" r="2" stroke={selectedTariff.color} strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#111827', display: 'block' } as any}>{selectedTariff.name}</span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400] } as any}>{selectedTariff.desc}</span>
              </div>
              {/* Crew + truck chips */}
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' } as any}>
                <div style={{ backgroundColor: '#EFF2F7', borderRadius: 8, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3 } as any}>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[600] } as any}>{selectedTariff.truck}</span>
                </div>
                <div style={{ backgroundColor: '#EFF2F7', borderRadius: 8, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3 } as any}>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[600] } as any}>{selectedTariff.crew} crew members</span>
                </div>
              </div>
            </div>

            {/* Features list */}
            <span style={{ fontFamily: fontFamily.primary, fontSize: 13, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8, display: 'block', marginBottom: 10, marginTop: 16 } as any}>
              What's included
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
              {selectedTariff.features.map((f, i) => {
                const c = f.included ? colors.primary[500] : colors.gray[300];
                const bg = f.included ? colors.primary[50] : colors.gray[100];
                const featureIcon: Record<string, React.ReactNode> = {
                  'crew':        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke={c} strokeWidth="2"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={c} strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="8" r="2.5" stroke={c} strokeWidth="1.8"/><path d="M21 21v-1.5a3 3 0 00-2-2.83" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
                  'truck':       <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke={c} strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke={c} strokeWidth="2"/></svg>,
                  'loading':     <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8h14M5 12h9M5 16h6" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="2" y="3" width="20" height="18" rx="2" stroke={c} strokeWidth="2"/></svg>,
                  'insurance':   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5 3.5 9.74 8 11 4.5-1.26 8-6 8-11V6L12 2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  'disassembly': <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  'packing':     <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke={c} strokeWidth="2" strokeLinejoin="round"/><path d="M12 22V12M2.27 6.96L12 12.01l9.73-5.05" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
                  'wrapping':    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth="2" strokeLinejoin="round"/></svg>,
                  'delivery':    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M12 7v5l3 3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                };
                const getIcon = (label: string) => {
                  const l = label.toLowerCase();
                  if (l.includes('crew') || l.includes('person')) return featureIcon['crew'];
                  if (l.includes('truck')) return featureIcon['truck'];
                  if (l.includes('loading') || l.includes('unloading')) return featureIcon['loading'];
                  if (l.includes('insurance') || l.includes('liability') || l.includes('coverage')) return featureIcon['insurance'];
                  if (l.includes('disassembly') || l.includes('reassembly')) return featureIcon['disassembly'];
                  if (l.includes('packing') || l.includes('materials')) return featureIcon['packing'];
                  if (l.includes('wrapping')) return featureIcon['wrapping'];
                  if (l.includes('delivery') || l.includes('same-day')) return featureIcon['delivery'];
                  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
                };
                return (
                <div
                  key={i}
                  style={{
                    display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                    padding: '15px 16px',
                    borderBottom: i < selectedTariff.features.length - 1 ? '1px solid #F2F4F7' : 'none',
                    backgroundColor: f.included ? '#FFFFFF' : '#FAFAFA',
                  } as any}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    backgroundColor: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  } as any}>
                    {getIcon(f.label)}
                  </div>
                  <span style={{
                    fontFamily: fontFamily.primary, fontSize: 16,
                    fontWeight: f.included ? 500 : 400,
                    color: f.included ? '#111827' : colors.gray[400],
                    marginLeft: 14,
                  } as any}>{f.label}</span>
                </div>
                );
              })}
            </div>

            {/* Change warning */}
            {isChanged && (
              <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '12px 14px', backgroundColor: '#FFFBEB', borderRadius: 12 } as any}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706" style={{ flexShrink: 0, marginTop: 1 } as any}>
                  <path d="M12 2L1 21H23L12 2ZM12 18C11.45 18 11 17.55 11 17S11.45 16 12 16 13 16.45 13 17 12.55 18 12 18ZM13 14H11V9H13V14Z"/>
                </svg>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#92400E', lineHeight: '18px' } as any}>
                  Plan can only be changed once. Changing to <strong>{selectedTariff.name}</strong> cannot be undone.
                </span>
              </div>
            )}
            <View style={{ height: 20 }} />
          </div>
        </ScrollView>

        {/* Sticky bottom CTA */}
        <div style={{ padding: '14px 20px 22px', borderTop: `1px solid ${colors.gray[100]}`, backgroundColor: '#FFFFFF' } as any}>
          {isChanged ? (
            <div
              onClick={() => { onSelect(selected); handleClose(); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                paddingTop: 18, paddingBottom: 18, borderRadius: 16,
                backgroundColor: colors.primary[500], cursor: 'pointer',
              } as any}
              onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
            >
              <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.2 } as any}>
                Switch to {selectedTariff.name}
              </span>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.75)' } as any}>
                · ${selectedTariff.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 18, paddingBottom: 18, borderRadius: 16, backgroundColor: '#EFF2F7' } as any}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: colors.gray[400] } as any}>
                This is your current plan
              </span>
            </div>
          )}
        </div>

      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Tariff Change Modal
   ═══════════════════════════════════════════ */

const TARIFF_OPTIONS = [
  {
    id: 'standard', name: 'Standard', price: 1340, desc: 'Full packing & disassembly',
    badge: 'Popular', crew: 3, truck: '20ft truck', color: '#2563EB',
    features: [
      { label: '3-person crew', included: true },
      { label: '20ft moving truck', included: true },
      { label: 'Loading & unloading', included: true },
      { label: 'Enhanced liability coverage', included: true },
      { label: 'Furniture disassembly & reassembly', included: true },
      { label: 'Packing materials included', included: true },
      { label: 'Furniture wrapping', included: false },
      { label: 'Same-day delivery', included: false },
    ],
  },
  {
    id: 'premium', name: 'Premium', price: 1540, desc: 'White-glove full service',
    crew: 4, truck: '24ft truck', color: '#7C3AED',
    features: [
      { label: '4-person crew', included: true },
      { label: '24ft moving truck', included: true },
      { label: 'Loading & unloading', included: true },
      { label: 'Full insurance coverage', included: true },
      { label: 'Furniture disassembly & reassembly', included: true },
      { label: 'All packing materials included', included: true },
      { label: 'Full furniture wrapping', included: true },
      { label: 'Same-day delivery guarantee', included: true },
    ],
  },
];

const TariffChangeModal: React.FC<{
  visible: boolean;
  currentPlan: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}> = ({ visible, currentPlan, onClose, onSelect }) => {
  const [selected, setSelected] = useState(currentPlan.toLowerCase());

  if (!visible || Platform.OS !== 'web') return null;

  return (
    <View style={s.notifOverlay}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={onClose} />
      <View style={[{
        position: 'absolute', top: 140, left: 12, right: 12,
        backgroundColor: '#FAFAFA', borderRadius: 20, paddingBottom: 8,
      }]}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18 }}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>Change Plan</span>
          ) : null}
          <Pressable onPress={onClose} hitSlop={8}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Pressable>
        </View>

        {/* Warning */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: '#FFF8E6' } as any}>
          {Platform.OS === 'web' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.warning[500]} style={{ flexShrink: 0 } as any}>
              <path d="M12 2L1 21H23L12 2ZM12 18C11.45 18 11 17.55 11 17C11 16.45 11.45 16 12 16C12.55 16 13 16.45 13 17C13 17.55 12.55 18 12 18ZM13 14H11V9H13V14Z"/>
            </svg>
          )}
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: colors.warning[700], marginLeft: 8, lineHeight: '17px' } as any}>
              Plan can only be changed once. This action cannot be undone.
            </span>
          ) : null}
        </View>

        {/* Tariff options */}
        <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, backgroundColor: '#FAFAFA', marginHorizontal: 12, borderRadius: 16 } as any}>
          {TARIFF_OPTIONS.map((t) => {
            const isCurrent = t.id === currentPlan.toLowerCase();
            const isSelected = t.id === selected;
            return (
              <Pressable
                key={t.id}
                onPress={() => !isCurrent && setSelected(t.id)}
                style={({ pressed }) => [{
                  flexDirection: 'row', alignItems: 'center',
                  padding: 14, borderRadius: 14, marginBottom: 8,
                  backgroundColor: isSelected ? '#DBEAFE' : '#FFFFFF',
                  opacity: isCurrent ? 0.5 : 1,
                } as any, pressed && !isCurrent && { opacity: 0.8 }]}
              >
                {/* Radio */}
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary[500] : colors.gray[200],
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12,
                }}>
                  {isSelected && (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary[500] }} />
                  )}
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  {Platform.OS === 'web' ? (
                    <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 }}>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>{t.name}</span>
                      {t.badge && (
                        <span style={{
                          fontFamily: fontFamily.primary, fontSize: 10, fontWeight: 600,
                          color: colors.primary[600], backgroundColor: colors.primary[50],
                          padding: '2px 8px', borderRadius: 6,
                        } as any}>{t.badge}</span>
                      )}
                      {isCurrent && (
                        <span style={{
                          fontFamily: fontFamily.primary, fontSize: 10, fontWeight: 600,
                          color: colors.gray[500], backgroundColor: '#EFF2F7',
                          padding: '2px 8px', borderRadius: 6,
                        } as any}>Current</span>
                      )}
                    </div>
                  ) : null}
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>{t.desc}</span>
                  ) : null}
                </View>

                {/* Price */}
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>${t.price.toLocaleString()}</span>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Confirm button */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 }}>
          <Pressable
            onPress={() => { if (selected !== currentPlan.toLowerCase()) onSelect(selected); }}
            style={({ pressed }) => [{
              alignItems: 'center', justifyContent: 'center',
              paddingVertical: 18, borderRadius: 16,
              backgroundColor: selected !== currentPlan.toLowerCase() ? colors.primary[500] : '#EFF2F7',
            } as any, pressed && { opacity: 0.85 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: selected !== currentPlan.toLowerCase() ? '#FFFFFF' : colors.gray[400] } as any}>
                Confirm Change
              </span>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Main Screen
   ═══════════════════════════════════════════ */

export const HomeScreenClean: React.FC<HomeScreenProps> = ({
  phase, userName, planName, planPrice,
  fromAddress, toAddress, moveDate,
  mover, offersCount = 4,
  onViewOffers, onSkipPhase, onPhaseChange, onAcceptMover, onBack, onTabPress, onChatWithMover,
  distance, estimatedTime, roomsScanned, itemsDetected, totalVolume, depositPaid,
  glass = false,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(planName);
  const [currentPrice, setCurrentPrice] = useState(planPrice);
  const [activeSheet, setActiveSheet] = useState<'analysis' | 'pricing' | 'info' | 'docs' | null>(null);
  const [openDocIndex, setOpenDocIndex] = useState<number | null>(null);
  const [openRoomIndex, setOpenRoomIndex] = useState<number | null>(null);
  const [selectedMover, setSelectedMover] = useState<DemoMover | null>(null);
  const [dots, setDots] = useState('');
  const [searchSecs, setSearchSecs] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showPhaseDetail, setShowPhaseDetail] = useState(false);
  const [showTariffDetail, setShowTariffDetail] = useState(false);
  const [showOffersList, setShowOffersList] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState<DemoMover | null>(null);
  const [showProgressDetail, setShowProgressDetail] = useState(false);
  const [completedRating, setCompletedRating] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [completedHovered, setCompletedHovered] = useState(0);



  /* Searching dots + timer */
  React.useEffect(() => {
    if (phase !== 'searching') { setDots(''); setSearchSecs(0); setShowOffersList(false); return; }
    const dotsId = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    const timerID = setInterval(() => setSearchSecs(s => s + 1), 1000);
    return () => { clearInterval(dotsId); clearInterval(timerID); };
  }, [phase]);

  const fmtTimer = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const activeMover = DEMO_MOVERS[0]; // default for confirmed/moveDay

  if (Platform.OS !== 'web') return null;

  return (
    <View style={s.safe}>
      {/* Relative wrapper */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#E8EEF4' } as any}>

        {/* MAP — always visible */}
        <MapPlaceholder phase={phase} />

        {/* Glass overlay — dreamy tint + blobs on top of map */}
        {glass && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 } as any}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(160deg, rgba(219,234,254,0.52) 0%, rgba(191,219,254,0.42) 40%, rgba(147,197,253,0.32) 100%)' } as any} />
            <div style={{ position: 'absolute', top: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,144,250,0.28) 0%, transparent 70%)', filter: 'blur(32px)', animation: 'blobFloat1 12s ease-in-out infinite' } as any} />
            <div style={{ position: 'absolute', top: 30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,112,239,0.22) 0%, transparent 70%)', filter: 'blur(28px)', animation: 'blobFloat2 15s ease-in-out infinite' } as any} />
            <div style={{ position: 'absolute', top: '30%', left: '25%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(83,177,253,0.2) 0%, transparent 70%)', filter: 'blur(24px)', animation: 'blobFloat3 10s ease-in-out infinite' } as any} />
          </div>
        )}

        {/* Status bar — absolute top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 } as any}>
          <StatusBarMock variant="dark" onTimeTap={onBack} />
        </div>

        {/* Bell button — absolute top-right */}
        <div style={{ position: 'absolute', top: 46, right: 16, zIndex: 60 } as any}>
          <Pressable
            onPress={() => setShowNotifs(true)}
            hitSlop={12}
            style={({ pressed }) => [
              s.bellBtn,
              glass && { backgroundColor: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.7)' } as any,
              pressed && { opacity: 0.6 },
            ]}
          >
            <BellIcon />
            <View style={s.bellBadge}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 9, fontWeight: 700, color: '#FFFFFF' } as any}>2</span>
            </View>
          </Pressable>
        </div>

        {/* ── Bottom Sheet ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          ...(glass
            ? { backgroundColor: 'rgba(255,255,255,0.62)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderTop: '1.5px solid rgba(255,255,255,0.85)', boxShadow: '0 -4px 40px rgba(46,144,250,0.10)' }
            : { backgroundColor: '#FFFFFF', borderTop: '1.5px solid #EAECF0', boxShadow: '0 -4px 32px rgba(0,0,0,0.08)' }
          ),
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          display: 'flex', flexDirection: 'column' as const,
          maxHeight: '88%',
          zIndex: 40,
        } as any}>

          {/* Handle bar — sticky at top, never scrolls */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6, flexShrink: 0 } as any}>
            <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: glass ? 'rgba(46,144,250,0.25)' : colors.gray[200] } as any} />
          </div>

          {/* ── Everything between handle and CTA scrolls together ── */}
          <div style={{ flex: 1, overflowY: 'auto' as const, WebkitOverflowScrolling: 'touch' as any } as any}>

          {/* ── Phase title row ── */}
          <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 24 } as any}>
            {phase === 'searching' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between' } as any}>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: '32px', color: colors.gray[900] } as any}>
                    Waiting for offers{dots}
                  </span>
                  <div style={{ backgroundColor: colors.primary[50], borderRadius: 10, paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 4 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: colors.primary[600], fontVariantNumeric: 'tabular-nums' } as any}>
                      {fmtTimer(searchSecs)}
                    </span>
                  </div>
                </div>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 15, lineHeight: '20px', letterSpacing: -0.2, color: colors.gray[400], display: 'block', marginTop: 3 } as any}>
                  Finding you a mover — sit back and relax
                </span>
              </div>
            )}
            {phase === 'offers' && (
              <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between' } as any}>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: '32px', color: colors.gray[900] } as any}>
                  {offersCount} offers received
                </span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400] } as any}>Tap for profile</span>
              </div>
            )}
            {phase === 'confirmed' && (
              <div>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: '32px', color: colors.gray[900] } as any}>
                  Move confirmed
                </span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 15, lineHeight: '20px', letterSpacing: -0.2, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                  Deposit paid · Your mover is booked
                </span>
              </div>
            )}
            {phase === 'moveDay' && (
              <span style={{ fontFamily: fontFamily.primary, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: '32px', color: colors.gray[900] } as any}>
                Moving day
              </span>
            )}
            {phase === 'completed' && (
              <div>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 26, fontWeight: '700', letterSpacing: -0.5, lineHeight: '32px', color: colors.gray[900] } as any}>
                  Move complete
                </span>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 15, lineHeight: '20px', letterSpacing: -0.2, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                  Mar 15 · SOS Moving Co.
                </span>
              </div>
            )}
          </div>

          {/* Phase stepper — only visible during moveDay to track move progress */}
          {phase === 'moveDay' && (
            <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 8 } as any}>
              <PhaseStepperInline phase={phase} onTap={() => setShowProgressDetail(true)} />
            </div>
          )}

          {/* Separator */}
          {(phase === 'moveDay') && (
            <div style={{ marginLeft: 20, marginRight: 20, marginTop: 14, marginBottom: 0, height: 1, backgroundColor: glass ? 'rgba(255,255,255,0.22)' : colors.gray[200] } as any} />
          )}

          {/* ── Action buttons — right under the stepper, all phases ── */}
          {phase === 'searching' && (() => {
            const circleCss = (tint: 'red' | 'neutral') => glass
              ? { backgroundColor: tint === 'red' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.42)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: tint === 'red' ? '1px solid rgba(239,68,68,0.22)' : '1px solid rgba(255,255,255,0.65)' }
              : { backgroundColor: tint === 'red' ? '#FEF2F2' : '#EFF2F7' };
            return (
              <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 16 } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                  {/* Cancel */}
                  <div onClick={() => setShowCancelConfirm(true)} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...circleCss('red') } as any}
                      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: colors.gray[400], textAlign: 'center' as const } as any}>Cancel</span>
                  </div>
                  {/* Details */}
                  <div onClick={() => setShowPhaseDetail(true)} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...circleCss('neutral') } as any}
                      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: colors.gray[400], textAlign: 'center' as const } as any}>Details</span>
                  </div>
                  {/* Change plan */}
                  <div onClick={() => setShowTariffDetail(true)} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...circleCss('neutral') } as any}
                      onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M1 4V10H7M23 20V14H17" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14L18.36 18.36A9 9 0 013.51 15" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: colors.gray[400], textAlign: 'center' as const } as any}>Change plan</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Offers action buttons */}
          {phase === 'offers' && (() => {
            const font = fontFamily.primary;
            const glassCircle = (bg?: string) => glass
              ? { backgroundColor: bg === '#FEF2F2' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.42)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: bg === '#FEF2F2' ? '1px solid rgba(239,68,68,0.22)' : '1px solid rgba(255,255,255,0.65)' }
              : { backgroundColor: bg || '#EFF2F7' };
            const Btn = ({ icon, label, color, bg, onClick }: { icon: React.ReactNode; label: string; color?: string; bg?: string; onClick?: () => void }) => (
              <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...glassCircle(bg) } as any}
                  onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                  {icon}
                </div>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: color || colors.gray[400], textAlign: 'center' as const } as any}>{label}</span>
              </div>
            );
            return (
              <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 16 } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                  <Btn onClick={() => setShowCancelConfirm(true)} label="Cancel" bg="#FEF2F2" color={colors.error[500]}
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => setShowPhaseDetail(true)} label="Details"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => setShowTariffDetail(true)} label="Change plan"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M1 4V10H7M23 20V14H17" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14L18.36 18.36A9 9 0 013.51 15" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                </div>
              </div>
            );
          })()}

          {/* Confirmed action buttons */}
          {phase === 'confirmed' && (() => {
            const font = fontFamily.primary;
            const glassCircle = (bg?: string) => glass
              ? { backgroundColor: bg === '#EFF7FF' ? 'rgba(46,144,250,0.12)' : 'rgba(255,255,255,0.42)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: bg === '#EFF7FF' ? '1px solid rgba(46,144,250,0.22)' : '1px solid rgba(255,255,255,0.65)' }
              : { backgroundColor: bg || '#EFF2F7' };
            const Btn = ({ icon, label, bg, onClick }: { icon: React.ReactNode; label: string; bg?: string; onClick?: () => void }) => (
              <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...glassCircle(bg) } as any}
                  onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                  {icon}
                </div>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: colors.gray[400], textAlign: 'center' as const } as any}>{label}</span>
              </div>
            );
            return (
              <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 16 } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                  <Btn label="Call mover" bg="#EFF7FF"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-8.63-8.63A19.79 19.79 0 013.07 1.18 2 2 0 015.26 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => onChatWithMover?.()} label="Chat"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => setShowPhaseDetail(true)} label="Details"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                </div>
              </div>
            );
          })()}

          {/* MoveDay action buttons */}
          {phase === 'moveDay' && (() => {
            const font = fontFamily.primary;
            const glassCircle = (bg?: string) => glass
              ? { backgroundColor: bg === '#EFF7FF' ? 'rgba(46,144,250,0.12)' : 'rgba(255,255,255,0.42)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: bg === '#EFF7FF' ? '1px solid rgba(46,144,250,0.22)' : '1px solid rgba(255,255,255,0.65)' }
              : { backgroundColor: bg || '#EFF2F7' };
            const Btn = ({ icon, label, bg, onClick }: { icon: React.ReactNode; label: string; bg?: string; onClick?: () => void }) => (
              <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer' } as any}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...glassCircle(bg) } as any}
                  onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}>
                  {icon}
                </div>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: colors.gray[400], textAlign: 'center' as const } as any}>{label}</span>
              </div>
            );
            return (
              <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 16 } as any}>
                <div style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'flex-start' } as any}>
                  <Btn label="Call mover" bg="#EFF7FF"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-8.63-8.63A19.79 19.79 0 013.07 1.18 2 2 0 015.26 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => onChatWithMover?.()} label="Chat"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                  <Btn onClick={() => setShowPhaseDetail(true)} label="Details"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  />
                </div>
              </div>
            );
          })()}

          {/* ── Phase content ── */}
          <div>


            {/* OFFERS — пришли предложения, выбираем */}
            {phase === 'offers' && (
              <div style={{ padding: '8px 20px 8px' } as any}>
                {DEMO_MOVERS.map(m => (
                  <MoverCard
                    key={m.id}
                    mover={m}
                    onAccept={() => setShowAcceptConfirm(m)}
                    onPress={() => setSelectedMover(m)}
                  />
                ))}
              </div>
            )}

            {/* CONFIRMED — мувер выбран */}
            {phase === 'confirmed' && (
              <div style={{ padding: '16px 20px 8px' } as any}>
                {/* Mover card */}
                <div
                  onClick={() => setSelectedMover(activeMover)}
                  style={{
                    display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
                    padding: 14, backgroundColor: '#F8F9FB', borderRadius: 16,
                    border: '1px solid #F2F4F7', marginBottom: 14, cursor: 'pointer',
                  } as any}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: activeMover.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 700, color: activeMover.avatarColor } as any}>{activeMover.initials}</span>
                  </div>
                  <div style={{ flex: 1, marginLeft: 12 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block' } as any}>{activeMover.name}</span>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>
                      <span style={{ color: '#F59E0B' } as any}>★</span> {activeMover.rating} · {activeMover.truck} · {activeMover.crew} crew
                    </span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}

            {/* COMPLETED — переезд завершён */}
            {phase === 'completed' && (
              <div style={{ padding: '8px 20px 16px' } as any}>

                {/* Big success illustration */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 12, paddingBottom: 24 } as any}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                    boxShadow: '0 0 0 12px #F0FDF4',
                  } as any}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke={colors.success[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: colors.gray[900], textAlign: 'center' as const } as any}>
                    All done, {userName?.split(' ')[0] || 'there'}!
                  </span>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400], textAlign: 'center' as const, marginTop: 4 } as any}>
                    Your items were delivered safely
                  </span>
                </div>

                {/* Summary stats */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 } as any}>
                  {[
                    { label: 'Distance', value: `${distance || '12'} km` },
                    { label: 'Items moved', value: `${itemsDetected || 47}` },
                    { label: 'Duration', value: '3h 20m' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      flex: 1, backgroundColor: '#F8F9FB', borderRadius: 14,
                      border: '1px solid #F2F4F7',
                      padding: '12px 8px', textAlign: 'center' as const,
                    } as any}>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 700, color: colors.gray[900], display: 'block' } as any}>{value}</span>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Rate your move */}
                <div style={{
                  backgroundColor: '#FFFBEB', borderRadius: 16,
                  border: '1px solid #FEF08A',
                  padding: '16px 18px',
                  marginBottom: 10,
                } as any}>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[800], display: 'block', marginBottom: 12 } as any}>
                    How was SOS Moving Co.?
                  </span>
                  <div style={{ display: 'flex', gap: 8 } as any}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <div
                        key={star}
                        onClick={() => setCompletedRating(star)}
                        onMouseEnter={() => setCompletedHovered(star)}
                        onMouseLeave={() => setCompletedHovered(0)}
                        style={{ fontSize: 30, cursor: 'pointer', transition: 'transform 0.1s', transform: (completedHovered || completedRating) >= star ? 'scale(1.15)' : 'scale(1)' } as any}
                      >
                        <span style={{ color: (completedHovered || completedRating) >= star ? '#F59E0B' : colors.gray[200] } as any}>★</span>
                      </div>
                    ))}
                  </div>
                  {completedRating > 0 && (
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: '#92400E', marginTop: 8, display: 'block' } as any}>
                      {completedRating === 5 ? 'Excellent! Thanks for the feedback 🙌' : completedRating >= 3 ? 'Thanks for rating!' : "Sorry to hear that. We'll improve."}
                    </span>
                  )}
                </div>

              </div>
            )}

            {/* MOVE DAY — день переезда, живой трекинг */}
            {phase === 'moveDay' && (
              <div style={{ padding: '16px 20px 8px' } as any}>
                {/* Mover row */}
                <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8F9FB', borderRadius: 14, border: '1px solid #F2F4F7', marginBottom: 16 } as any}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: activeMover.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 700, color: activeMover.avatarColor } as any}>{activeMover.initials}</span>
                  </div>
                  <div style={{ flex: 1, marginLeft: 10 } as any}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{activeMover.name}</span>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.success[500] } as any}>● On the way · ETA 12 min</span>
                  </div>
                  <div
                    style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } as any}
                    onMouseEnter={(e: any) => { e.currentTarget.style.backgroundColor = colors.primary[100]; }}
                    onMouseLeave={(e: any) => { e.currentTarget.style.backgroundColor = colors.primary[50]; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.9a19.79 19.79 0 013.09-8.63A2 2 0 018 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L12.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Step list */}
                {MOVE_STEPS.map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'flex-start' } as any}>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: 20, flexShrink: 0, marginTop: 2 } as any}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        backgroundColor: step.done ? colors.primary[500] : step.active ? '#fff' : colors.gray[100],
                        border: step.active ? `2px solid ${colors.primary[500]}` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      } as any}>
                        {step.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13L10 18L20 6" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        {step.active && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: colors.primary[500] } as any} />}
                      </div>
                      {i < MOVE_STEPS.length - 1 && (
                        <div style={{ width: 2, height: 24, backgroundColor: step.done ? colors.primary[300] : colors.gray[100], marginTop: 2 } as any} />
                      )}
                    </div>
                    <div style={{ flex: 1, marginLeft: 12, paddingBottom: 18 } as any}>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: step.active ? 700 : 400, color: step.done || step.active ? colors.gray[900] : colors.gray[400], display: 'block' } as any}>{step.label}</span>
                      {step.time && <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400], marginTop: 1, display: 'block' } as any}>{step.time}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>{/* end phase content */}

          </div>{/* end master scroll */}

          {/* ── Sticky CTA — прибита над TabBar, не скроллится ── */}
          {phase !== 'searching' && (
          <div style={{
            paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
            borderTop: glass ? '1px solid rgba(255,255,255,0.4)' : '1px solid #F2F4F7',
            backgroundColor: glass ? 'rgba(255,255,255,0.3)' : '#FFFFFF',
          } as any}>
            {phase === 'offers' && (
              <div
                onClick={() => setShowOffersList(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
                  borderRadius: 16,
                  backgroundColor: colors.primary[500], cursor: 'pointer',
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.43 } as any}>
                  View {offersCount} Offers
                </span>
              </div>
            )}
            {phase === 'confirmed' && (
              <div
                onClick={() => onChatWithMover?.()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
                  borderRadius: 16,
                  backgroundColor: colors.primary[500], cursor: 'pointer',
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.43 } as any}>
                  Chat with {activeMover.name}
                </span>
              </div>
            )}
            {phase === 'confirmed' && (
              <div
                onClick={() => onPhaseChange?.('moveDay')}
                style={{ textAlign: 'center', marginTop: 10, cursor: 'pointer' } as any}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 13, fontWeight: 500, color: colors.gray[400] } as any}>
                  Skip to Move Day →
                </span>
              </div>
            )}
            {phase === 'moveDay' && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  paddingTop: 18, paddingBottom: 18, borderRadius: 16, cursor: 'pointer',
                  backgroundColor: colors.primary[500],
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.9a19.79 19.79 0 013.09-8.63A2 2 0 018 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L12.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#FFFFFF' } as any}>Call {activeMover.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M13 6L19 12L13 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {phase === 'completed' && (
              <div
                onClick={() => onPhaseChange?.('searching')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  paddingTop: 18, paddingBottom: 18, borderRadius: 16,
                  backgroundColor: colors.primary[500], cursor: 'pointer',
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#FFFFFF' } as any}>Book a new move</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M13 6L19 12L13 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          )}

          {/* TabBar */}
          <TabBar active="dashboard" onTabPress={onTabPress} variant="default" />

        </div>{/* end bottom sheet */}

      </div>{/* end relative map wrapper */}

      {/* ── Overlays ── */}
      <MoverProfileModal
        mover={selectedMover}
        onClose={() => setSelectedMover(null)}
        onAccept={() => { const m = selectedMover; setSelectedMover(null); setShowAcceptConfirm(m); }}
      />

      <NotificationsPanel
        visible={showNotifs}
        onClose={() => setShowNotifs(false)}
        onSelectPhase={(p) => onPhaseChange?.(p)}
      />

      {/* ── Offers list sheet ── */}
      {showOffersList && Platform.OS === 'web' && (
        <View style={s.notifOverlay}>
          <Pressable onPress={() => setShowOffersList(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' } as any} />
          </Pressable>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
            maxHeight: '80%', display: 'flex', flexDirection: 'column' as const,
          } as any}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 } as any}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] } as any} />
            </div>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingTop: 4, paddingBottom: 14, borderBottom: '1px solid #F2F4F7' } as any}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 18, fontWeight: 700, color: colors.gray[900] } as any}>
                {offersCount} Offers
              </span>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400] } as any}>Tap card for profile</span>
            </div>
            {/* Mover list */}
            <div style={{ flex: 1, overflowY: 'auto' as const, padding: '8px 20px 24px' } as any}>
              {DEMO_MOVERS.map(m => (
                <MoverCard
                  key={m.id}
                  mover={m}
                  onAccept={() => { setShowOffersList(false); setShowAcceptConfirm(m); }}
                  onPress={() => { setShowOffersList(false); setSelectedMover(m); }}
                />
              ))}
            </div>
          </div>
        </View>
      )}

      {/* ── Accept mover confirmation dialog ── */}
      {showAcceptConfirm && Platform.OS === 'web' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any} onClick={() => setShowAcceptConfirm(null)}>
          <div
            style={{
              width: 310, backgroundColor: '#FAFAFA', borderRadius: 20, padding: '28px 24px 20px',
            } as any}
            onClick={(e: any) => e.stopPropagation()}
          >
            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 } as any}>
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: showAcceptConfirm.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 18, fontWeight: 700, color: showAcceptConfirm.avatarColor } as any}>{showAcceptConfirm.initials}</span>
              </div>
            </div>
            {/* Title */}
            <span style={{ fontFamily: fontFamily.primary, fontSize: 18, fontWeight: 700, color: colors.gray[900], textAlign: 'center', display: 'block' } as any}>
              Confirm your choice?
            </span>
            <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[500], textAlign: 'center', display: 'block', marginTop: 8, lineHeight: '20px' } as any}>
              You are choosing {showAcceptConfirm.name} for your move. You'll need to pay a deposit to finalize.
            </span>
            {/* Buttons */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 } as any}>
              <div
                onClick={() => { const m = showAcceptConfirm; setShowAcceptConfirm(null); if (m) onAcceptMover?.(m); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  paddingTop: 18, paddingBottom: 18, borderRadius: 16,
                  backgroundColor: colors.primary[500], cursor: 'pointer',
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.43 } as any}>Yes, choose {showAcceptConfirm.name}</span>
              </div>
              <div
                onClick={() => setShowAcceptConfirm(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  paddingTop: 18, paddingBottom: 18, borderRadius: 16,
                  backgroundColor: '#EFF2F7', cursor: 'pointer',
                } as any}
                onMouseEnter={(e: any) => { e.currentTarget.style.opacity = '0.7'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span style={{ fontFamily: fontFamily.primary, fontSize: 17, fontWeight: 700, color: colors.primary[500], letterSpacing: -0.43 } as any}>Cancel</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <TariffDetailSheet
        visible={showTariffDetail}
        currentPlan={currentPlan}
        onClose={() => setShowTariffDetail(false)}
        onSelect={(id) => {
          const t = TARIFF_OPTIONS.find(o => o.id === id);
          if (t) { setCurrentPlan(t.name); setCurrentPrice(t.price); }
        }}
      />

      <TariffChangeModal
        visible={showTariffModal}
        currentPlan={currentPlan}
        onClose={() => setShowTariffModal(false)}
        onSelect={(id) => {
          const t = TARIFF_OPTIONS.find(o => o.id === id);
          if (t) { setCurrentPlan(t.name); setCurrentPrice(t.price); }
          setShowTariffModal(false);
        }}
      />

      {/* ── Phase timeline detail ── */}
      {/* ── Progress timeline (stepper tap) ── */}
      <DetailSheet visible={showProgressDetail} onClose={() => setShowProgressDetail(false)} title="Order progress">
        {Platform.OS === 'web' && (() => {
          const font = fontFamily.primary;

          // Icon helpers for timeline events
          const TLIcon = {
            search:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.2"/><path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>,
            submit:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm9 1.5V8h2.5L13 5.5zM7 13a1 1 0 000 2h10a1 1 0 000-2H7zm0-4a1 1 0 000 2h6a1 1 0 000-2H7z" fill="currentColor"/></svg>,
            offers:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/></svg>,
            confirm: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            depart:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>,
            enroute: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            arrived: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>,
            loading: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
            transit: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/><path d="M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
            unload:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
            done:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
          };

          // Full timeline — all possible events across the whole move journey
          const ALL_EVENTS: {
            id: string; label: string;
            sub: string;          // shown when done or active
            futureSub: string;    // shown when future (no details yet known)
            time: string; est?: boolean;
            icon: React.ReactNode;
            activeFor: HomePhase[]; visibleFrom: HomePhase;
          }[] = [
            { id: 'submit',  label: 'Request submitted',       sub: 'Your move details sent',             futureSub: 'Fill in your move details',           time: 'Mar 14, 10:02', icon: TLIcon.submit,  visibleFrom: 'searching', activeFor: [] },
            { id: 'search',  label: 'Searching for movers',    sub: 'Contacting companies near you',      futureSub: 'We will find options for you',         time: 'Mar 14, 10:02', icon: TLIcon.search,  visibleFrom: 'searching', activeFor: ['searching'] },
            { id: 'offers',  label: '3 offers received',       sub: 'Compare and pick the best fit',      futureSub: 'Offers from movers will appear here',  time: 'Mar 14, 10:18', icon: TLIcon.offers,  visibleFrom: 'offers',    activeFor: ['offers'] },
            { id: 'confirm', label: 'Move confirmed',          sub: 'SOS Moving Co. · Basic plan',        futureSub: 'Mover will be confirmed after you pick',time: 'Mar 14, 10:31', icon: TLIcon.confirm, visibleFrom: 'confirmed', activeFor: ['confirmed'] },
            { id: 'depart',  label: 'Crew departed',           sub: 'Team of 2 · 1 truck · 8 km away',   futureSub: 'Crew will head out on move day',       time: 'Mar 15, 9:45',  icon: TLIcon.depart,  visibleFrom: 'moveDay',   activeFor: [] },
            { id: 'enroute', label: 'En route to pickup',      sub: 'ETA 10:30 · Track live on map',      futureSub: 'Live tracking will be available here', time: 'Mar 15, 9:48',  icon: TLIcon.enroute, visibleFrom: 'moveDay',   activeFor: ['moveDay'] },
            { id: 'arrived', label: 'Arrived at your address', sub: 'Crew is at the door',                futureSub: 'Crew will arrive at your pickup',      time: '~10:30', est: true, icon: TLIcon.arrived, visibleFrom: 'moveDay', activeFor: [] },
            { id: 'loading', label: 'Loading items',           sub: 'Packing & carrying to truck',        futureSub: 'Items packed and loaded onto truck',   time: '~10:40', est: true, icon: TLIcon.loading, visibleFrom: 'moveDay', activeFor: [] },
            { id: 'transit', label: 'En route to destination', sub: 'Heading to your new address',        futureSub: 'Truck moving to your new home',        time: '~11:30', est: true, icon: TLIcon.transit, visibleFrom: 'moveDay', activeFor: [] },
            { id: 'unload',  label: 'Arrived & unloading',     sub: 'Placing items in your new home',     futureSub: 'Items brought inside new address',     time: '~12:10', est: true, icon: TLIcon.unload,  visibleFrom: 'moveDay', activeFor: [] },
            { id: 'done',    label: 'Move complete',            sub: 'All items delivered safely',         futureSub: 'Your move will be complete',           time: '~12:45', est: true, icon: TLIcon.done,    visibleFrom: 'completed', activeFor: ['completed'] },
          ];

          const phaseOrder: HomePhase[] = ['searching', 'offers', 'confirmed', 'moveDay', 'completed'];
          const currentPhaseIdx = phaseOrder.indexOf(phase);

          // filter events visible up to current phase
          const visible = ALL_EVENTS.filter(e => phaseOrder.indexOf(e.visibleFrom) <= currentPhaseIdx);

          // for future events beyond current phase — also show as dimmed
          const future = ALL_EVENTS.filter(e => phaseOrder.indexOf(e.visibleFrom) > currentPhaseIdx);
          const rows = [...visible, ...future];

          const activeId = ALL_EVENTS.find(e => e.activeFor.includes(phase))?.id ?? 'submit';
          const activeRowIdx = rows.findIndex(r => r.id === activeId);

          return (
            <div style={{ paddingTop: 8, paddingBottom: 24 } as any}>
              {/* Summary chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 14, padding: '10px 14px', marginBottom: 24 } as any}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.primary[500], flexShrink: 0 } as any} />
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.primary[700] } as any}>
                  {phase === 'searching' ? 'Searching · avg response 8 min'
                    : phase === 'offers' ? '3 offers · select one to confirm'
                    : phase === 'confirmed' ? 'Confirmed · move day Mar 15'
                    : phase === 'moveDay' ? 'En route · ETA 10:30 AM'
                    : 'Move complete · Mar 15'}
                </span>
              </div>

              {rows.map((ev, i) => {
                const rowActiveIdx = rows.findIndex(r => r.id === activeId);
                const isDone   = i < rowActiveIdx;
                const isActive = ev.id === activeId;
                const isFuture = i > rowActiveIdx;
                const isLast   = i === rows.length - 1;

                const dotColor = isDone ? colors.primary[500] : isActive ? colors.primary[500] : colors.gray[200];
                const lineColor = isDone ? colors.primary[200] : colors.gray[100];

                return (
                  <div key={ev.id} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center' } as any}>
                    {/* Left: dot + line */}
                    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: 32, flexShrink: 0 } as any}>
                      <div style={{
                        width: isActive ? 30 : 22, height: isActive ? 30 : 22,
                        borderRadius: '50%',
                        backgroundColor: dotColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: isActive ? `0 0 0 5px ${colors.primary[100]}` : 'none',
                        transition: 'all 0.2s',
                        color: isDone ? '#fff' : isActive ? '#fff' : isFuture ? colors.gray[300] : colors.gray[300],
                      } as any}>
                        {isDone
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13L10 18L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : <div style={{ transform: 'scale(0.7)', transition: 'transform 0.2s' } as any}>{ev.icon}</div>
                        }
                      </div>
                      {!isLast && (
                        <div style={{ width: 2, flex: 1, minHeight: 20, backgroundColor: lineColor, marginTop: 3, marginBottom: 3, borderRadius: 1 } as any} />
                      )}
                    </div>

                    {/* Right: content */}
                    <div style={{ flex: 1, marginLeft: 12, paddingBottom: isLast ? 0 : 20, paddingTop: 0 } as any}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 } as any}>
                        <span style={{
                          fontFamily: font,
                          fontSize: 16,
                          fontWeight: isActive ? 700 : isDone ? 500 : 400,
                          color: isFuture ? colors.gray[300] : isDone ? colors.gray[600] : colors.gray[900],
                          lineHeight: '1.3',
                        } as any}>{ev.label}</span>
                        {!isFuture && (
                          <span style={{
                            fontFamily: font, fontSize: 14, flexShrink: 0,
                            color: isDone ? colors.gray[400] : colors.primary[400],
                            fontWeight: isActive ? 600 : 400,
                          } as any}>{ev.est ? `est. ${ev.time}` : ev.time}</span>
                        )}
                      </div>
                      <span style={{
                        fontFamily: font, fontSize: 14,
                        color: isFuture ? colors.gray[200] : isActive ? colors.primary[600] : colors.gray[400],
                        display: 'block', marginTop: 2, lineHeight: '1.4',
                      } as any}>{isFuture ? ev.futureSub : ev.sub}</span>
                      {isActive && (
                        <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: colors.primary[50], borderRadius: 8, paddingTop: 3, paddingBottom: 3, paddingLeft: 9, paddingRight: 9 } as any}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: colors.primary[500] } as any} />
                          <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.primary[600] } as any}>In progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </DetailSheet>

      {/* ── Order details (Details button) ── */}
      <DetailSheet visible={showPhaseDetail} onClose={() => setShowPhaseDetail(false)} title="Order details">
        {Platform.OS === 'web' && (() => {
          const font = fontFamily.primary;

          const SectionHeader = ({ label }: { label: string }) => (
            <div style={{ paddingTop: 16, paddingBottom: 6, paddingLeft: 16, paddingRight: 16 } as any}>
              <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8 } as any}>{label}</span>
            </div>
          );

          const Row = ({ icon, label, sub, value, chip, chipColor, last, first }: {
            icon: React.ReactNode; label: string; sub?: string;
            value?: string; chip?: string; chipColor?: string; last?: boolean; first?: boolean;
          }) => (
            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', paddingTop: first ? 16 : 14, paddingBottom: last ? 16 : 14, paddingLeft: 16, paddingRight: 16, borderBottom: last ? 'none' : '1px solid #F2F4F7', gap: 14, boxSizing: 'border-box' as const } as any}>
              <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: 12, backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
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

          const dotBlue = <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: colors.primary[500], border: `2.5px solid ${colors.primary[200]}` } as any}/>;
          const dotRed  = <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colors.error[500], border: '2.5px solid #FECACA' } as any}/>;

          const hasScanData = (roomsScanned ?? 0) > 0 || (itemsDetected ?? 0) > 0;
          const hasMover = phase === 'confirmed' || phase === 'moveDay' || phase === 'completed';

          return (
            <div style={{ paddingTop: 4, paddingBottom: 20 } as any}>

              {/* ── PLAN & PRICING ── */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
                <SectionHeader label="Plan & Pricing" />
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="6" width="14" height="10" rx="1.5" stroke={colors.primary[500]} strokeWidth="2"/><path d="M15 10h4l2 3v3h-6V10z" stroke={colors.primary[500]} strokeWidth="2" strokeLinejoin="round"/><circle cx="6.5" cy="18" r="1.8" fill={colors.primary[500]}/><circle cx="18.5" cy="18" r="1.8" fill={colors.primary[500]}/></svg>}
                  label={currentPlan}
                  sub="Moving plan"
                  value={`$${currentPrice.toLocaleString()}`}
                  first
                  last={!hasMover}
                />
                {hasMover && (depositPaid ?? 0) > 0 && (
                  <Row
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="2"/><path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    label={`$${depositPaid} deposit paid`}
                    sub="20% upfront"
                    chip="Paid"
                    chipColor={colors.success[500]}
                  />
                )}
                {hasMover && (
                  <Row
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.gray[400]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round"/></svg>}
                    label={(depositPaid ?? 0) > 0 ? `$${(currentPrice - (depositPaid ?? 0)).toLocaleString()} remaining` : 'Awaiting deposit'}
                    sub={(depositPaid ?? 0) > 0 ? 'Due on move day' : 'Pay 20% to confirm'}
                    chip={(depositPaid ?? 0) > 0 ? 'Due' : 'Pending'}
                    chipColor={(depositPaid ?? 0) > 0 ? colors.gray[500] : undefined}
                    last
                  />
                )}
              </div>

              {/* ── ADDRESSES ── */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Addresses" />
                <Row icon={dotBlue} label={fromAddress} sub="Pickup" first />
                <Row icon={dotRed}  label={toAddress}   sub="Drop-off" last />
              </div>

              {/* ── MOVE INFO ── */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Move info" />
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="3" stroke={colors.gray[500]} strokeWidth="2"/><path d="M16 2V6M8 2V6M3 10H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                  label={moveDate} sub="Moving date"
                  first
                />
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={colors.gray[500]} strokeWidth="2"/><path d="M12 7V12L15 14" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round"/></svg>}
                  label={estimatedTime || '~35 min drive'} sub="Estimated drive time"
                />
                <Row
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12H6L9 6L15 18L18 12H21" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  label={distance || '12.4 mi'} sub="Distance" last
                />
              </div>

              {/* ── AI SCAN (only if data exists) ── */}
              {hasScanData && (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10, padding: 16 } as any}>
                  <div style={{ paddingBottom: 12 } as any}>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase' as const, letterSpacing: 0.8 } as any}>AI Scan</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' as const, gap: 10 } as any}>
                    {[
                      { value: String(roomsScanned ?? 0), label: 'Rooms' },
                      { value: String(itemsDetected ?? 0), label: 'Items' },
                      { value: totalVolume ?? '—', label: 'Volume' },
                    ].map((st, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', paddingTop: 14, paddingBottom: 12, backgroundColor: '#EFF2F7', borderRadius: 12 } as any}>
                        <span style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>{st.value}</span>
                        <span style={{ fontFamily: font, fontSize: 13, color: colors.gray[400], marginTop: 3 } as any}>{st.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── INVENTORY BY ROOM ── */}
              {hasScanData && (() => {
                const roomIcons = {
                  living: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 10V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V10" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 10V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V10C22 10 20 10 20 13H4C4 10 2 10 2 10Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                  bedroom: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 17V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 17H22V19H2V17Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 10H10V13H7V10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 10H17V13H14V10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
                  kitchen: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2V10M12 10C12 12 8 12 8 10V2M12 10C12 12 16 12 16 10V2" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 10V22M9 22H15" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
                  bathroom: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12H20V16C20 18.2 18.2 20 16 20H8C5.8 20 4 18.2 4 16V12Z" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 12V5C4 3.9 4.9 3 6 3H7C8.1 3 9 3.9 9 5V6" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M2 12H22" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
                  office: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M8 21H16M12 17V21" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round"/></svg>,
                };
                const ROOMS_INV = [
                  { room: 'Living Room', icon: roomIcons.living, items: [
                    { name: 'Sofa (3-seater)', qty: 1, tag: 'Large' },
                    { name: 'Coffee Table', qty: 1 },
                    { name: 'TV Stand', qty: 1 },
                    { name: 'TV 55"', qty: 1, tag: 'Fragile' },
                    { name: 'Bookshelf', qty: 1, tag: 'Large' },
                    { name: 'Floor Lamp', qty: 2 },
                    { name: 'Boxes (misc.)', qty: 4 },
                  ]},
                  { room: 'Bedroom', icon: roomIcons.bedroom, items: [
                    { name: 'Queen Bed Frame', qty: 1, tag: 'Large' },
                    { name: 'Mattress (Queen)', qty: 1, tag: 'Large' },
                    { name: 'Nightstand', qty: 2 },
                    { name: 'Dresser', qty: 1, tag: 'Large' },
                    { name: 'Mirror', qty: 1, tag: 'Fragile' },
                    { name: 'Boxes (clothes)', qty: 5 },
                  ]},
                  { room: 'Kitchen', icon: roomIcons.kitchen, items: [
                    { name: 'Dining Table', qty: 1, tag: 'Large' },
                    { name: 'Dining Chairs', qty: 4 },
                    { name: 'Microwave', qty: 1 },
                    { name: 'Boxes (kitchenware)', qty: 6, tag: 'Fragile' },
                  ]},
                  { room: 'Bathroom', icon: roomIcons.bathroom, items: [
                    { name: 'Storage Cabinet', qty: 1 },
                    { name: 'Boxes (toiletries)', qty: 2 },
                  ]},
                  { room: 'Office', icon: roomIcons.office, items: [
                    { name: 'Desk', qty: 1, tag: 'Large' },
                    { name: 'Office Chair', qty: 1 },
                    { name: 'Monitor 27"', qty: 1, tag: 'Fragile' },
                    { name: 'Printer', qty: 1 },
                    { name: 'Boxes (books & docs)', qty: 4 },
                  ]},
                ];
                return (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                    <SectionHeader label="Scanned Inventory" />
                    {ROOMS_INV.map((room, ri) => {
                      const totalItems = room.items.reduce((s, it) => s + it.qty, 0);
                      const isOpen = openRoomIndex === ri;
                      return (
                        <div key={ri} style={{ borderBottom: ri < ROOMS_INV.length - 1 ? '1px solid #F2F4F7' : 'none' } as any}>
                          {/* Room header */}
                          <div onClick={() => setOpenRoomIndex(isOpen ? null : ri)} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, gap: 14, cursor: 'pointer', boxSizing: 'border-box' as const } as any}>
                            <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: 12, backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                              {room.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 } as any}>
                              <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{room.room}</span>
                              <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{totalItems} items</span>
                            </div>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 } as any}><path d="M6 9L12 15L18 9" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          {/* Items list */}
                          {isOpen && (
                            <div style={{ paddingLeft: 74, paddingRight: 16, paddingBottom: 14 } as any}>
                              {room.items.map((it, ii) => (
                                <div key={ii} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8 } as any}>
                                  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, flex: 1, minWidth: 0 } as any}>
                                    <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[700] } as any}>{it.name}</span>
                                    {it.tag && (
                                      <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: it.tag === 'Fragile' ? colors.warning[600] : colors.primary[500], backgroundColor: it.tag === 'Fragile' ? colors.warning[50] : colors.primary[50], paddingLeft: 7, paddingRight: 7, paddingTop: 3, paddingBottom: 3, borderRadius: 6 } as any}>{it.tag}</span>
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
                );
              })()}

              {/* ── IMPORTANT INFO ── */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                <SectionHeader label="Important info" />
                {[
                  'Basic liability coverage included',
                  'Free cancellation up to 48h before move',
                  'Real-time GPS tracking on move day',
                  'Direct chat with your mover',
                ].map((tip, i, arr) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, borderBottom: i < arr.length - 1 ? '1px solid #F2F4F7' : 'none', gap: 14, boxSizing: 'border-box' as const } as any}>
                    <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: 12, backgroundColor: '#EFF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={colors.primary[500]}/><path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontFamily: font, fontSize: 15, color: colors.gray[700], lineHeight: '22px' } as any}>{tip}</span>
                  </div>
                ))}
              </div>

              {/* ── DOCUMENTS ── */}
              {(() => {
                const DOCS_INLINE = [
                  { name: 'Move Confirmation', desc: 'Booking confirmation details', content: [
                    { label: 'Order Number', value: '#MV-2026-04821' },
                    { label: 'Booking Date', value: 'February 24, 2026' },
                    { label: 'Move Date', value: 'March 15, 2026' },
                    { label: 'From', value: fromAddress || '1234 Oak Street, Apt 5B' },
                    { label: 'To', value: toAddress || '5678 Pine Avenue, Unit 12' },
                    { label: 'Service Type', value: currentPlan || 'Standard' },
                    { label: 'Estimated Cost', value: `$${currentPrice?.toLocaleString() || '2,450'}` },
                    { label: 'Deposit Paid', value: `$${depositPaid || 200}` },
                    { label: 'Status', value: 'Confirmed' },
                  ]},
                  { name: 'Inventory List', desc: 'All scanned items and categories', content: [
                    { label: 'Total Items', value: `${itemsDetected || 47} items` },
                    { label: 'Rooms Scanned', value: `${roomsScanned || 5} rooms` },
                    { label: 'Total Volume', value: totalVolume || '820 cu ft' },
                    { label: 'Fragile Items', value: '12 items' },
                    { label: 'Large Furniture', value: '8 items' },
                    { label: 'Boxes (est.)', value: '23 boxes' },
                    { label: 'Special Handling', value: '3 items' },
                    { label: 'Last Updated', value: 'February 26, 2026' },
                  ]},
                  { name: 'Insurance Policy', desc: 'Liability coverage information', content: [
                    { label: 'Policy Number', value: 'INS-2026-78432' },
                    { label: 'Coverage Type', value: 'Full Value Protection' },
                    { label: 'Coverage Amount', value: '$50,000' },
                    { label: 'Deductible', value: '$250' },
                    { label: 'Provider', value: 'MoveSafe Insurance Co.' },
                    { label: 'Effective Date', value: 'March 15, 2026' },
                    { label: 'Claims Contact', value: '1-800-555-0199' },
                    { label: 'Status', value: 'Active' },
                  ]},
                ];
                return DOCS_INLINE.map((doc, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginTop: 10 } as any}>
                    {/* Document row — tap to toggle */}
                    <div onClick={() => setOpenDocIndex(openDocIndex === i ? null : i)} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, gap: 14, cursor: 'pointer', boxSizing: 'border-box' as const } as any}>
                      <div style={{ width: 44, height: 44, minWidth: 44, borderRadius: 12, backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={colors.primary[500]}/><path d="M14 2V8H20" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' } as any}>
                        <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{doc.name}</span>
                        <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{doc.desc}</span>
                      </div>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ transform: openDocIndex === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 } as any}><path d="M6 9L12 15L18 9" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {/* Expanded content */}
                    {openDocIndex === i && (
                      <div style={{ borderTop: '1px solid #F2F4F7' } as any}>
                        {doc.content.map((row, ri) => (
                          <div key={ri} style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderBottom: ri < doc.content.length - 1 ? '1px solid #F2F4F7' : 'none', boxSizing: 'border-box' as const } as any}>
                            <span style={{ fontFamily: font, fontSize: 14, color: colors.gray[400], flexShrink: 0 } as any}>{row.label}</span>
                            <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: colors.gray[900], textAlign: 'right' as const, marginLeft: 16 } as any}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ));
              })()}

            </div>
          );
        })()}
      </DetailSheet>

      {/* ── Detail Sheets ── */}
      <DetailSheet visible={activeSheet === 'analysis'} onClose={() => setActiveSheet(null)} title="AI Analysis">
        {Platform.OS === 'web' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 } as any}>
              {[
                { value: String(roomsScanned ?? 0), label: 'Rooms Scanned' },
                { value: String(itemsDetected ?? 0), label: 'Items Found' },
                { value: totalVolume ?? '—', label: 'Total Volume' },
              ].map((st, i) => (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  paddingTop: 20, paddingBottom: 18, backgroundColor: '#FFFFFF', borderRadius: 16,
                } as any}>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 24, fontWeight: 700, color: colors.gray[900] } as any}>{st.value}</span>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], marginTop: 6 } as any}>{st.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 } as any}>
              <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 400, color: colors.gray[600], lineHeight: '22px' } as any}>
                Our AI scanned your home and detected all items that need to be moved. This data is used to calculate the optimal truck size and crew needed.
              </span>
            </div>
          </>
        )}
      </DetailSheet>

      <DetailSheet visible={activeSheet === 'pricing'} onClose={() => setActiveSheet(null)} title="Plan & Pricing">
        {Platform.OS === 'web' && (
          <>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', paddingLeft: 4, paddingRight: 4 } as any}>
              <InfoRow icon={MiniIcons.box} label="Plan" value={currentPlan} />
              <InfoRow icon={MiniIcons.dollar} label="Total" value={`$${currentPrice.toLocaleString()}`} />
              {(depositPaid ?? 0) > 0 && <InfoRow icon={MiniIcons.check} label="Deposit Paid" value={`$${depositPaid}`} valueColor={colors.success[600]} />}
              {(depositPaid ?? 0) > 0 ? (
                <InfoRow icon={MiniIcons.clock} label="Remaining" value={`$${(currentPrice - (depositPaid ?? 0)).toLocaleString()}`} valueColor={colors.gray[500]} last />
              ) : (
                <InfoRow icon={MiniIcons.clock} label="Status" value="Awaiting deposit" valueColor={colors.gray[400]} last />
              )}
            </div>
            <div style={{ marginTop: 12 } as any}>
              <Pressable onPress={() => { setActiveSheet(null); setTimeout(() => setShowTariffModal(true), 320); }} style={({ pressed }) => [{
                alignItems: 'center', paddingVertical: 16, borderRadius: 16,
                backgroundColor: '#FFFFFF',
              }, pressed && { opacity: 0.7 }]}>
                <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 600, color: colors.primary[500] } as any}>Change Plan</span>
              </Pressable>
            </div>
          </>
        )}
      </DetailSheet>

      <DetailSheet visible={activeSheet === 'info'} onClose={() => setActiveSheet(null)} title="Important Info">
        {Platform.OS === 'web' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
            {['Basic liability coverage included', 'Free cancellation up to 48h before move', 'Real-time GPS tracking on move day', 'Direct chat with your mover'].map((tip, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, gap: 14, borderBottom: i < 3 ? `1px solid ${colors.gray[100]}` : 'none' } as any}>
                {MiniIcons.check}
                <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 400, color: colors.gray[700], lineHeight: '22px' } as any}>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </DetailSheet>

      <DetailSheet visible={activeSheet === 'docs'} onClose={() => { setActiveSheet(null); setOpenDocIndex(null); }} title="Documents">
        {Platform.OS === 'web' && (() => {
          const DOCS = [
            { name: 'Move Confirmation', type: 'PDF', desc: 'Booking confirmation details', content: [
              { label: 'Order Number', value: '#MV-2026-04821' },
              { label: 'Booking Date', value: 'February 24, 2026' },
              { label: 'Move Date', value: 'March 15, 2026' },
              { label: 'From', value: fromAddress || '1234 Oak Street, Apt 5B' },
              { label: 'To', value: toAddress || '5678 Pine Avenue, Unit 12' },
              { label: 'Service Type', value: currentPlan || 'Standard' },
              { label: 'Estimated Cost', value: `$${currentPrice?.toLocaleString() || '2,450'}` },
              { label: 'Deposit Paid', value: `$${depositPaid || 200}` },
              { label: 'Status', value: 'Confirmed' },
            ]},
            { name: 'Inventory List', type: 'PDF', desc: 'All scanned items and categories', content: [
              { label: 'Total Items', value: `${itemsDetected || 47} items` },
              { label: 'Rooms Scanned', value: `${roomsScanned || 5} rooms` },
              { label: 'Total Volume', value: totalVolume || '820 cu ft' },
              { label: 'Fragile Items', value: '12 items' },
              { label: 'Large Furniture', value: '8 items' },
              { label: 'Boxes (est.)', value: '23 boxes' },
              { label: 'Special Handling', value: '3 items' },
              { label: 'Last Updated', value: 'February 26, 2026' },
            ]},
            { name: 'Insurance Policy', type: 'PDF', desc: 'Liability coverage information', content: [
              { label: 'Policy Number', value: 'INS-2026-78432' },
              { label: 'Coverage Type', value: 'Full Value Protection' },
              { label: 'Coverage Amount', value: '$50,000' },
              { label: 'Deductible', value: '$250' },
              { label: 'Provider', value: 'MoveSafe Insurance Co.' },
              { label: 'Effective Date', value: 'March 15, 2026' },
              { label: 'Claims Contact', value: '1-800-555-0199' },
              { label: 'Status', value: 'Active' },
            ]},
          ];

          if (openDocIndex !== null && openDocIndex < DOCS.length) {
            const doc = DOCS[openDocIndex];
            return (
              <div>
                {/* Back to list */}
                <div onClick={() => setOpenDocIndex(null)} style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', padding: '4px 0' } as any}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 500, color: colors.primary[500] } as any}>All Documents</span>
                </div>
                {/* Document card */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
                  {/* Doc header */}
                  <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', padding: 16, gap: 12, borderBottom: '1px solid #F2F4F7' } as any}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0 } as any}>
                      {MiniIcons.file}
                    </div>
                    <div style={{ flex: 1 } as any}>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>{doc.name}</span>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 13, color: colors.gray[400], marginTop: 2, display: 'block' } as any}>{doc.type} Document</span>
                    </div>
                  </div>
                  {/* Doc content rows */}
                  {doc.content.map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16, borderBottom: ri < doc.content.length - 1 ? '1px solid #F2F4F7' : 'none', boxSizing: 'border-box' as const } as any}>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, color: colors.gray[400], flexShrink: 0 } as any}>{row.label}</span>
                      <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 500, color: colors.gray[900], textAlign: 'right' as const, marginLeft: 16 } as any}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
              {DOCS.map((doc, i, arr) => (
                <Pressable key={i} onPress={() => setOpenDocIndex(i)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.gray[100] }, pressed && { opacity: 0.7 }]}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const, flexShrink: 0,
                  } as any}>
                    {MiniIcons.file}
                  </div>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 15, fontWeight: 500, color: colors.gray[800] } as any}>{doc.name}</span>
                    <span style={{ fontFamily: fontFamily.primary, fontSize: 14, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>{doc.desc}</span>
                  </View>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Pressable>
              ))}
            </div>
          );
        })()}
      </DetailSheet>

      {/* ── Cancel Confirmation Modal ── */}
      {showCancelConfirm && Platform.OS === 'web' && (
        <View style={s.notifOverlay}>
          <div onClick={() => setShowCancelConfirm(false)} style={{ position: 'absolute' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' } as any} />
          <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, zIndex: 10 } as any}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.gray[200], marginLeft: 'auto', marginRight: 'auto', marginBottom: 20 } as any} />
            {/* Icon */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: colors.error[50], display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: 16 } as any}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01" stroke={colors.error[500]} strokeWidth="2" strokeLinecap="round"/><path d="M10.29 3.86L1.82 18A2 2 0 003.54 21H20.46A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke={colors.error[500]} strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            {/* Title */}
            <span style={{ fontFamily: fontFamily.primary, fontSize: 20, fontWeight: 700, color: colors.gray[900], textAlign: 'center' as const, display: 'block', marginBottom: 8 } as any}>Cancel Order?</span>
            {/* Description */}
            <span style={{ fontFamily: fontFamily.primary, fontSize: 15, color: colors.gray[500], textAlign: 'center' as const, display: 'block', lineHeight: '22px', marginBottom: 24 } as any}>
              Are you sure you want to cancel your move? This action cannot be undone and you may lose your deposit.
            </span>
            {/* Confirm cancel button */}
            <Pressable
              onPress={() => { setShowCancelConfirm(false); onBack(); }}
              style={({ pressed }) => [{ backgroundColor: colors.error[500], borderRadius: 16, paddingTop: 16, paddingBottom: 16, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 12 }, pressed && { opacity: 0.85 }]}
            >
              <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 600, color: '#FFFFFF' } as any}>Yes, Cancel Order</span>
            </Pressable>
            {/* Keep order button */}
            <Pressable
              onPress={() => setShowCancelConfirm(false)}
              style={({ pressed }) => [{ backgroundColor: '#EFF2F7', borderRadius: 16, paddingTop: 16, paddingBottom: 16, alignItems: 'center' as const, justifyContent: 'center' as const }, pressed && { opacity: 0.85 }]}
            >
              <span style={{ fontFamily: fontFamily.primary, fontSize: 16, fontWeight: 600, color: colors.gray[700] } as any}>Keep My Order</span>
            </Pressable>
          </div>
        </View>
      )}

      {/* ── Payment Modal ── */}

    </View>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safe: { flex: 1 },

  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  bellBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.gray[100],
    alignItems: 'center', justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.error[500],
    alignItems: 'center', justifyContent: 'center',
  },

  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },

  journeyWrap: { marginTop: 8, marginBottom: 8 },

  heroCard: {
    borderRadius: 20, padding: 24, alignItems: 'center',
    marginTop: 8,
  },

  notifOverlay: {
    position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 300,
  },
});
