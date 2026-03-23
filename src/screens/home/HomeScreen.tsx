/**
 * AI Moving — Home Screen (Dreamy Gradient + Glass Cards)
 *
 * Design: Soft pastel gradients, glassmorphism cards,
 * organic blob shapes, dreamy warm aesthetic.
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
import { TabBar, TabId } from './TabBar';

/* ═══════════════════════════════════════════
   Design Tokens — Dreamy
   ═══════════════════════════════════════════ */

const DREAMY_BG = [
  'linear-gradient(180deg, #FFFFFF 0%, #F5FAFF 15%, #EFF8FF 30%, #D1E9FF 55%, #B2DDFF 80%, #D1E9FF 100%)',
].join(', ');

/** Glass card base */
const glassCard: any = Platform.OS === 'web' ? {
  backgroundColor: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 24,
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
} : {
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.6)',
};

const glassCardStrong: any = Platform.OS === 'web' ? {
  ...glassCard,
  backgroundColor: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
} : {
  ...glassCard,
  backgroundColor: 'rgba(255,255,255,0.7)',
};

/* ═══════════════════════════════════════════
   Types & data
   ═══════════════════════════════════════════ */

export type HomePhase = 'searching' | 'offers' | 'confirmed' | 'moveDay' | 'completed';

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
  onBack: () => void;
  onTabPress: (tab: TabId) => void;
}

/* ═══════════════════════════════════════════
   Background Blobs — floating gradient shapes
   ═══════════════════════════════════════════ */

const DreamyBlobs: React.FC = () => {
  if (Platform.OS !== 'web') return null;

  const cssId = 'dreamy-blobs-css';
  useEffect(() => {
    if (document.getElementById(cssId)) return;
    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = `
      @keyframes blobFloat1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -20px) scale(1.05); }
        66% { transform: translate(-15px, 15px) scale(0.97); }
      }
      @keyframes blobFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-25px, 20px) scale(1.08); }
        66% { transform: translate(20px, -10px) scale(0.95); }
      }
      @keyframes blobFloat3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(15px, 25px) scale(1.04); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{
      position: 'absolute' as const,
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none' as const,
    }}>
      {/* Blob 1 — top-left light blue */}
      <div style={{
        position: 'absolute' as const,
        top: -60, left: -40,
        width: 220, height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,144,250,0.2) 0%, transparent 70%)',
        animation: 'blobFloat1 12s ease-in-out infinite',
        filter: 'blur(30px)',
      }} />
      {/* Blob 2 — top-right deeper blue */}
      <div style={{
        position: 'absolute' as const,
        top: 40, right: -30,
        width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(21,112,239,0.18) 0%, transparent 70%)',
        animation: 'blobFloat2 15s ease-in-out infinite',
        filter: 'blur(30px)',
      }} />
      {/* Blob 3 — center sky blue */}
      <div style={{
        position: 'absolute' as const,
        top: 200, left: '30%',
        width: 180, height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(83,177,253,0.2) 0%, transparent 70%)',
        animation: 'blobFloat3 10s ease-in-out infinite',
        filter: 'blur(25px)',
      }} />
      {/* Blob 4 — bottom blue */}
      <div style={{
        position: 'absolute' as const,
        bottom: 100, right: 10,
        width: 160, height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(132,202,255,0.25) 0%, transparent 70%)',
        animation: 'blobFloat1 14s ease-in-out infinite reverse',
        filter: 'blur(25px)',
      }} />
    </div>
  );
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1"/>
  </svg>
);

const PhoneCallIcon = ({ color = colors.primary[500] }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 4H9L11 9L8.5 10.5C9.57 12.57 11.43 14.43 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C9.72 21 3 14.28 3 6C3 4.9 3.9 4 5 4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M12 7V12L15 14" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={colors.primary[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Journey Progress — dreamy glass pills
   ═══════════════════════════════════════════ */

const JourneyProgress: React.FC<{ phase: HomePhase }> = ({ phase }) => {
  const ai = phaseToStageIndex(phase);
  if (Platform.OS !== 'web') return null;

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
                  backgroundColor: done ? colors.primary[400] : 'rgba(255,255,255,0.5)',
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
                backgroundColor: done || act ? colors.primary[500] : 'rgba(255,255,255,0.6)',
                backdropFilter: done || act ? 'none' : 'blur(8px)',
                WebkitBackdropFilter: done || act ? 'none' : 'blur(8px)',
                zIndex: 1,
                transition: 'all 0.4s ease',
                ...(act ? { boxShadow: `0 0 0 4px rgba(46,144,250,0.2), 0 2px 12px rgba(46,144,250,0.3)` } : {}),
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L10 18L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: act ? '#FFFFFF' : colors.gray[500],
                  }}>{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
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
   Searching Spinner — dreamy
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
            <circle cx="36" cy="36" r="32" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <path d="M36 4C55 4 68 17 68 36" stroke={colors.primary[400]} strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </Animated.View>
      <Animated.View style={[{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center', justifyContent: 'center',
      }, { transform: [{ scale: pul }] }]}>
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

const SearchingPhase: React.FC<{ planName: string; planPrice: number }> = ({ planName, planPrice }) => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const d = setInterval(() => setDots(v => v.length >= 3 ? '' : v + '.'), 500);
    return () => { clearInterval(d); };
  }, []);

  return (
    <View style={[s.heroCard, Platform.OS === 'web' ? glassCardStrong : null]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginBottom: 20 }}>
        <SearchingSpinner />
        <View style={{ flex: 1, marginLeft: 16 }}>
          {Platform.OS === 'web' ? (
            <>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.gray[900] } as any}>
                Finding movers{dots}
              </span>
              <View style={{ height: 4 }} />
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[500], lineHeight: '19px' } as any}>
                Matching you with verified movers in your area
              </span>
            </>
          ) : null}
        </View>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, padding: 4 } as any}>
        {[
          { val: planName, label: 'Your Plan', color: colors.gray[900] },
          { val: `$${planPrice.toLocaleString()}`, label: 'Estimate', color: colors.gray[900] },
        ].map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={{ width: 1, marginVertical: 8, backgroundColor: 'rgba(0,0,0,0.06)' }} />}
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 22, fontWeight: 700, color: item.color, letterSpacing: '-0.5px' } as any}>{item.val}</span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 500, color: colors.gray[400], marginTop: 2 } as any}>{item.label}</span>
                </>
              ) : null}
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Phase: OFFERS
   ═══════════════════════════════════════════ */

const OffersPhase: React.FC<{ count: number; onView: () => void }> = ({ count, onView }) => (
  <Pressable
    onPress={onView}
    style={({ pressed }) => [s.heroCard, Platform.OS === 'web' ? glassCardStrong : null, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }] as any}
  >
    {/* Big number */}
    <View style={{
      width: 64, height: 64, borderRadius: 20,
      backgroundColor: 'rgba(46,144,250,0.12)',
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 16,
    }}>
      {Platform.OS === 'web' ? (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 28, fontWeight: 800, color: colors.primary[500] } as any}>{count}</span>
      ) : null}
    </View>
    {Platform.OS === 'web' ? (
      <>
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: colors.gray[900], textAlign: 'center' } as any}>Movers Available</span>
        <View style={{ height: 6 }} />
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[500], textAlign: 'center', lineHeight: '20px' } as any}>
          Verified moving companies ready for your job
        </span>
        <View style={{ height: 20 }} />
        <View style={{
          backgroundColor: colors.primary[500],
          borderRadius: 16, paddingHorizontal: 32, paddingVertical: 14,
          ...(Platform.OS === 'web' ? { boxShadow: '0 4px 16px rgba(46,144,250,0.25)' } : {}),
        } as any}>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: '#FFFFFF' } as any}>View Offers</span>
        </View>
      </>
    ) : null}
  </Pressable>
);

/* ═══════════════════════════════════════════
   Phase: CONFIRMED
   ═══════════════════════════════════════════ */

const ConfirmedPhase: React.FC<{ mover: MoverInfo }> = ({ mover }) => (
  <View style={[s.heroCard, Platform.OS === 'web' ? glassCardStrong : null]}>
    <View style={{ alignItems: 'center', marginBottom: 20 }}>
      {Platform.OS === 'web' ? (
        <>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 48, fontWeight: 800, color: colors.primary[500], letterSpacing: '-2px', lineHeight: '52px' } as any}>7</span>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[500], marginTop: 4 } as any}>days until your move</span>
        </>
      ) : null}
    </View>

    <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 20 }} />

    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' }}>
      <View style={{
        width: 48, height: 48, borderRadius: 16,
        backgroundColor: 'rgba(46,144,250,0.1)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.primary[500] } as any}>{mover.name[0]}</span>
        ) : null}
      </View>
      <View style={{ marginLeft: 14, flex: 1 }}>
        {Platform.OS === 'web' ? (
          <>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 600, color: colors.gray[900] } as any}>{mover.name}</span>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <StarIcon />
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: colors.gray[800], marginLeft: 4 } as any}>{mover.rating}</span>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>({mover.reviews})</span>
            </View>
          </>
        ) : null}
      </View>
    </View>

    <View style={{ flexDirection: 'row', gap: 8, alignSelf: 'stretch', marginTop: 14 }}>
      {[
        { icon: <TruckMiniIcon color={colors.primary[500]} />, text: mover.truck },
        { icon: <CrewIcon color={colors.primary[500]} />, text: `${mover.crewSize} crew` },
      ].map((c, i) => (
        <View key={i} style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 12, paddingVertical: 8,
          borderRadius: 12, backgroundColor: 'rgba(46,144,250,0.08)',
        }}>
          {Platform.OS === 'web' && c.icon}
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: colors.primary[700], marginLeft: 6 } as any}>{c.text}</span>
          ) : null}
        </View>
      ))}
    </View>

    <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch', marginTop: 16 }}>
      {[
        { icon: <PhoneCallIcon />, text: 'Call' },
        { icon: <ChatBubbleIcon />, text: 'Chat' },
      ].map((b, i) => (
        <Pressable key={i} style={({ pressed }) => [{
          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          borderRadius: 14, paddingVertical: 12,
          backgroundColor: 'rgba(46,144,250,0.08)',
        } as any, pressed && { opacity: 0.7 }]}>
          {Platform.OS === 'web' && b.icon}
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.primary[500], marginLeft: 8 } as any}>{b.text}</span>
          ) : null}
        </Pressable>
      ))}
    </View>
  </View>
);

/* ═══════════════════════════════════════════
   Phase: MOVE DAY
   ═══════════════════════════════════════════ */

const MOVE_STEPS = [
  { label: 'Crew dispatched', time: '8:00 AM', done: true, active: false },
  { label: 'Arrived at pickup', time: '9:15 AM', done: true, active: false },
  { label: 'Loading in progress', time: '9:30 AM', done: false, active: true },
  { label: 'In transit', time: '', done: false, active: false },
  { label: 'Delivery & unloading', time: '', done: false, active: false },
];

const MoveDayPhase: React.FC<{ mover: MoverInfo }> = ({ mover }) => (
  <View style={[s.heroCard, Platform.OS === 'web' ? glassCardStrong : null]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 20 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success[400] }} />
      {Platform.OS === 'web' ? (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.gray[900], marginLeft: 10 } as any}>Move in Progress</span>
      ) : null}
    </View>

    <View style={{ alignSelf: 'stretch', paddingLeft: 4 }}>
      {MOVE_STEPS.map((step, idx) => {
        const dotColor = step.done ? colors.success[500] : step.active ? colors.primary[500] : 'rgba(0,0,0,0.12)';
        const lineColor = step.done ? colors.success[300] : 'rgba(0,0,0,0.06)';
        return (
          <View key={idx} style={{ flexDirection: 'row', minHeight: 48 }}>
            <View style={{ width: 24, alignItems: 'center' }}>
              <View style={{
                width: 10, height: 10, borderRadius: 5, backgroundColor: dotColor, zIndex: 1,
                ...(step.active && Platform.OS === 'web' ? {
                  boxShadow: `0 0 0 3px rgba(46,144,250,0.15)`,
                } : {}),
              } as any} />
              {idx < MOVE_STEPS.length - 1 && <View style={{ width: 2, flex: 1, marginVertical: 2, backgroundColor: lineColor }} />}
            </View>
            <View style={{ flex: 1, marginLeft: 14, paddingBottom: 16 }}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14,
                    fontWeight: step.active ? 600 : 400,
                    color: step.done || step.active ? colors.gray[900] : colors.gray[400],
                  } as any}>{step.label}</span>
                  {step.time ? (
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: colors.gray[400], marginTop: 2 } as any}>{step.time}</span>
                  ) : null}
                </>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>

    <View style={{
      flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', marginTop: 8,
      paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 12,
        backgroundColor: 'rgba(46,144,250,0.1)',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 700, color: colors.primary[500] } as any}>{mover.name[0]}</span>
        ) : null}
      </View>
      {Platform.OS === 'web' ? (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[900], flex: 1, marginLeft: 10 } as any}>{mover.name}</span>
      ) : null}
      {[<PhoneCallIcon />, <ChatBubbleIcon />].map((ic, i) => (
        <Pressable key={i} style={({ pressed }) => [{
          width: 38, height: 38, borderRadius: 12,
          backgroundColor: 'rgba(46,144,250,0.08)',
          alignItems: 'center', justifyContent: 'center', marginLeft: 8,
        } as any, pressed && { opacity: 0.7 }]}>
          {Platform.OS === 'web' && ic}
        </Pressable>
      ))}
    </View>
  </View>
);

/* ═══════════════════════════════════════════
   Route Card — real map + ticket info
   ═══════════════════════════════════════════ */

/** Extract short label from address (first word or abbreviation) */
const getShortCode = (addr: string): string => {
  const parts = addr.split(',')[0].split(' ');
  if (parts.length >= 2) return parts.slice(0, 2).join(' ');
  return parts[0] || addr;
};

/* ── Interactive Map via iframe (Leaflet + OpenStreetMap) ── */
const PICKUP_LAT = 40.7484;
const PICKUP_LNG = -73.9882;
const DROPOFF_LAT = 40.6782;
const DROPOFF_LNG = -73.9442;

const buildMapHTML = (): string => {
  const primary = colors.primary[500];
  const error = colors.error[500];
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false,scrollWheelZoom:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var A=[${PICKUP_LAT},${PICKUP_LNG}],B=[${DROPOFF_LAT},${DROPOFF_LNG}];
function mkIcon(c,t){return L.divIcon({className:'',html:'<div style="width:28px;height:28px;border-radius:50%;background:'+c+';border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-size:11px;font-weight:800;font-family:Inter,system-ui,sans-serif;">'+t+'</span></div>',iconSize:[28,28],iconAnchor:[14,14]});}
L.marker(A,{icon:mkIcon('${primary}','A')}).addTo(map);
L.marker(B,{icon:mkIcon('${error}','B')}).addTo(map);
var mid=[(A[0]+B[0])/2+0.012,(A[1]+B[1])/2-0.015];
L.polyline([A,[A[0]-0.008,A[1]+0.005],mid,[B[0]+0.008,B[1]-0.005],B],{color:'${primary}',weight:3,opacity:0.7,dashArray:'8,8',smoothFactor:2}).addTo(map);
map.fitBounds([A,B],{padding:[40,40]});
<\/script>
</body></html>`;
};

const LeafletMap: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const blob = new Blob([buildMapHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  if (Platform.OS !== 'web' || !src) return null;

  return (
    <iframe
      src={src}
      style={{
        width: '100%',
        height: 200,
        border: 'none',
        borderRadius: '24px 24px 0 0',
        display: 'block',
      }}
      scrolling="no"
    />
  );
};

const RouteCard: React.FC<{ from: string; to: string; date: string }> = ({ from, to, date }) => {
  if (Platform.OS !== 'web') return null;

  const fromShort = getShortCode(from);
  const toShort = getShortCode(to);

  return (
    <div style={{
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
    }}>
      {/* Map */}
      <LeafletMap />

      {/* Addresses row */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{
          display: 'flex', flexDirection: 'row' as const,
          alignItems: 'center' as const, gap: 10,
        }}>
          {/* A marker */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: colors.primary[500],
            display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const,
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif' } as any}>A</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block',
            } as any}>{fromShort}</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 11, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 1,
            } as any}>{from}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 1, backgroundColor: 'rgba(0,0,0,0.05)',
          margin: '10px 0', marginLeft: 32,
        }} />

        <div style={{
          display: 'flex', flexDirection: 'row' as const,
          alignItems: 'center' as const, gap: 10,
        }}>
          {/* B marker */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            backgroundColor: colors.error[500],
            display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const,
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif' } as any}>B</span>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block',
            } as any}>{toShort}</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 11, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 1,
            } as any}>{to}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        padding: '14px 20px 16px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
      }}>
        {[
          { label: 'Date', value: date },
          { label: 'Distance', value: '12.4 mi' },
          { label: 'Duration', value: '~35 min' },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'left' as const }}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10, fontWeight: 500, color: colors.gray[400],
              textTransform: 'uppercase' as const, letterSpacing: '0.8px', display: 'block',
            } as any}>{item.label}</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 15, fontWeight: 700, color: colors.gray[900],
              marginTop: 4, display: 'block',
            } as any}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Stories — outline cards with illustrations
   ═══════════════════════════════════════════ */

const STORIES = [
  {
    label: 'Packing Tips',
    // SVG scene: cozy room with boxes being packed
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E0F0FF"/><stop offset="100%" stopColor="#F0F7FF"/></linearGradient>
        </defs>
        <rect width="120" height="120" fill="url(#sky1)"/>
        {/* Floor */}
        <rect x="0" y="85" width="120" height="35" fill="#F5E6D3"/>
        <rect x="0" y="85" width="120" height="2" fill="#E8D5BF"/>
        {/* Big box */}
        <rect x="15" y="45" width="35" height="40" rx="3" fill="#D4A574" stroke="#C49464" strokeWidth="1.5"/>
        <rect x="15" y="45" width="35" height="8" rx="3" fill="#C49464"/>
        <path d="M25 65H42" stroke="#B8845A" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M25 71H38" stroke="#B8845A" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Small box */}
        <rect x="55" y="60" width="25" height="25" rx="2" fill="#7CB9E8" stroke="#5A9FD4" strokeWidth="1.2"/>
        <path d="M55 68H80" stroke="#5A9FD4" strokeWidth="1"/>
        <path d="M67 60V85" stroke="#5A9FD4" strokeWidth="0.8" strokeDasharray="3 2"/>
        {/* Tape roll */}
        <circle cx="95" cy="75" r="10" fill="#FFD166" stroke="#E6B84D" strokeWidth="1.2"/>
        <circle cx="95" cy="75" r="5" fill="#F0F7FF" stroke="#E6B84D" strokeWidth="0.8"/>
        {/* Bubble wrap hint */}
        <circle cx="22" cy="35" r="3" fill="none" stroke={colors.primary[300]} strokeWidth="0.8"/>
        <circle cx="30" cy="33" r="3" fill="none" stroke={colors.primary[300]} strokeWidth="0.8"/>
        <circle cx="38" cy="35" r="3" fill="none" stroke={colors.primary[300]} strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    label: 'Move Checklist',
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F0F4FF"/><stop offset="100%" stopColor="#E8EEFF"/></linearGradient>
        </defs>
        <rect width="120" height="120" fill="url(#sky2)"/>
        {/* Clipboard */}
        <rect x="25" y="15" width="70" height="95" rx="6" fill="#FFFFFF" stroke="#D0D5DD" strokeWidth="1.5"/>
        <rect x="42" y="8" width="36" height="14" rx="4" fill={colors.primary[100]} stroke={colors.primary[300]} strokeWidth="1.2"/>
        <circle cx="60" cy="15" r="3" fill={colors.primary[400]}/>
        {/* Checkmark lines */}
        <path d="M35 40L40 45L48 37" stroke={colors.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="55" y="38" width="30" height="4" rx="2" fill="#E4E7EC"/>
        <path d="M35 58L40 63L48 55" stroke={colors.primary[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="55" y="56" width="25" height="4" rx="2" fill="#E4E7EC"/>
        <circle cx="41" cy="78" r="7" fill="none" stroke="#D0D5DD" strokeWidth="2"/>
        <rect x="55" y="75" width="28" height="4" rx="2" fill="#E4E7EC"/>
        {/* Pencil */}
        <rect x="82" y="88" width="4" height="22" rx="1" fill="#FFD166" transform="rotate(-30 84 99)"/>
        <polygon points="78,112 80,106 84,108" fill="#333"/>
      </svg>
    ),
  },
  {
    label: 'Insurance',
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8F5E9"/><stop offset="100%" stopColor="#F1F8E9"/></linearGradient>
        </defs>
        <rect width="120" height="120" fill="url(#sky3)"/>
        {/* Shield */}
        <path d="M60 12L25 30V55C25 80 40 98 60 108C80 98 95 80 95 55V30L60 12Z" fill="#FFFFFF" stroke={colors.primary[300]} strokeWidth="2"/>
        <path d="M60 20L32 35V55C32 76 44 91 60 100C76 91 88 76 88 55V35L60 20Z" fill={colors.primary[50]}/>
        {/* Checkmark inside shield */}
        <path d="M45 58L55 68L75 48" stroke={colors.primary[500]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Sparkles */}
        <circle cx="20" cy="20" r="2" fill={colors.primary[200]}/>
        <circle cx="100" cy="25" r="1.5" fill={colors.primary[200]}/>
        <circle cx="15" cy="90" r="1.5" fill={colors.primary[200]}/>
        <path d="M102 85L105 80L108 85L105 90Z" fill={colors.primary[200]}/>
      </svg>
    ),
  },
  {
    label: 'Find Storage',
    illustration: (
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF3E0"/><stop offset="100%" stopColor="#FFF8F0"/></linearGradient>
        </defs>
        <rect width="120" height="120" fill="url(#sky4)"/>
        {/* Ground */}
        <rect x="0" y="90" width="120" height="30" fill="#E8D5BF"/>
        {/* Warehouse building */}
        <rect x="15" y="40" width="90" height="50" rx="3" fill="#FFFFFF" stroke="#D0D5DD" strokeWidth="1.5"/>
        {/* Roof */}
        <path d="M10 40L60 15L110 40" stroke={colors.primary[400]} strokeWidth="2" strokeLinejoin="round" fill="#F0F7FF"/>
        {/* Doors */}
        <rect x="25" y="55" width="20" height="25" rx="2" fill={colors.primary[50]} stroke={colors.primary[300]} strokeWidth="1.2"/>
        <rect x="50" y="55" width="20" height="25" rx="2" fill={colors.primary[50]} stroke={colors.primary[300]} strokeWidth="1.2"/>
        <rect x="75" y="55" width="20" height="25" rx="2" fill={colors.primary[50]} stroke={colors.primary[300]} strokeWidth="1.2"/>
        {/* Door handles */}
        <circle cx="42" cy="68" r="1.5" fill={colors.primary[400]}/>
        <circle cx="67" cy="68" r="1.5" fill={colors.primary[400]}/>
        <circle cx="92" cy="68" r="1.5" fill={colors.primary[400]}/>
        {/* Lock icon on middle door */}
        <rect x="57" y="78" width="6" height="5" rx="1" fill={colors.primary[400]}/>
        <path d="M58 78V75C58 73.3 59.3 72 61 72V72C62.7 72 64 73.3 64 75V78" stroke={colors.primary[400]} strokeWidth="1.2" fill="none"/>
      </svg>
    ),
  },
];

const QuickActions: React.FC = () => {
  if (Platform.OS !== 'web') return null;

  return (
    <View style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row' as const,
        gap: 10,
        paddingLeft: 16,
        paddingRight: 16,
        overflowX: 'auto' as const,
        overflowY: 'hidden' as const,
        scrollbarWidth: 'none' as const,
        msOverflowStyle: 'none' as const,
      }}>
          {STORIES.map((story, i) => (
            <div key={i} style={{
              width: 100, minWidth: 100, height: 110, flexShrink: 0, cursor: 'pointer',
              borderRadius: 18,
              border: `1.5px solid ${colors.primary[400]}`,
              padding: 2,
              boxSizing: 'border-box' as const,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                overflow: 'hidden' as const,
                position: 'relative' as const,
              }}>
                {/* Full-bleed illustration background */}
                <div style={{
                  position: 'absolute' as const,
                  top: 0, left: 0, right: 0, bottom: 0,
                }}>
                  {story.illustration}
                </div>

                {/* Bottom gradient overlay for text readability */}
                <div style={{
                  position: 'absolute' as const,
                  bottom: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)',
                }}/>

                {/* Label at bottom-left */}
                <span style={{
                  position: 'absolute' as const,
                  bottom: 10,
                  left: 10,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#FFFFFF',
                  lineHeight: '15px',
                } as any}>{story.label}</span>
              </div>
            </div>
          ))}
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Notification Panel
   ═══════════════════════════════════════════ */

interface NotifItem {
  id: string; title: string; body: string;
  time: string; read: boolean; phase?: HomePhase;
}

const DEMO_NOTIFS: NotifItem[] = [
  { id: 'n1', title: 'Searching for movers…', body: 'We\'re matching you with the best movers nearby', time: 'Now', read: false, phase: 'searching' },
  { id: 'n2', title: '4 mover offers available', body: 'Compare quotes and choose the best one', time: '2m ago', read: false, phase: 'offers' },
  { id: 'n3', title: 'Booking confirmed!', body: 'SOS Moving Co. will handle your move', time: '15m ago', read: true, phase: 'confirmed' },
  { id: 'n4', title: 'Moving day!', body: 'Your movers are on the way — track them live', time: '1h ago', read: true, phase: 'moveDay' },
  { id: 'n5', title: 'Move completed!', body: 'Everything went great! Leave a review', time: '3h ago', read: true, phase: 'completed' },
];

const NotificationsPanel: React.FC<{
  visible: boolean; onClose: () => void; onSelectPhase: (p: HomePhase) => void;
}> = ({ visible, onClose, onSelectPhase }) => {
  if (!visible || Platform.OS !== 'web') return null;
  return (
    <View style={s.notifOverlay}>
      <Pressable style={s.notifBackdrop} onPress={onClose} />
      <View style={[s.notifPanel, Platform.OS === 'web' ? {
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      } as any : null]}>
        <View style={s.notifHeader}>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 700, color: colors.gray[900] } as any}>Notifications</span>
          <Pressable onPress={onClose} hitSlop={8}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
          {DEMO_NOTIFS.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => { if (n.phase) { onSelectPhase(n.phase); onClose(); } }}
              style={({ pressed }) => [s.notifRow, !n.read && s.notifUnread, pressed && { opacity: 0.7 }]}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {!n.read && <View style={s.notifDot} />}
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: n.read ? 400 : 600, color: colors.gray[900] } as any}>{n.title}</span>
                </View>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>{n.body}</span>
              </View>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[300], marginLeft: 8, whiteSpace: 'nowrap' } as any}>{n.time}</span>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Main Screen
   ═══════════════════════════════════════════ */

export const HomeScreen: React.FC<HomeScreenProps> = ({
  phase, userName, planName, planPrice,
  fromAddress, toAddress, moveDate,
  mover, offersCount = 4,
  onViewOffers, onSkipPhase, onPhaseChange, onBack, onTabPress,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);

  const bgStyle = Platform.OS === 'web'
    ? { background: DREAMY_BG } as any
    : { backgroundColor: '#EFF8FF' };

  return (
    <View style={[s.safe, bgStyle]}>
      {/* Floating blobs */}
      <DreamyBlobs />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBarMock variant="dark" onTimeTap={onBack} />

        {/* Header */}
        <View style={s.headerRow}>
          {Platform.OS === 'web' ? (
            <View>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[500] } as any}>Welcome back,</span>
              <View style={{ height: 2 }} />
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 22, fontWeight: 700, color: colors.gray[900], letterSpacing: '-0.3px' } as any}>{userName}</span>
            </View>
          ) : null}
          <Pressable onPress={() => setShowNotifs(true)} hitSlop={12} style={({ pressed }) => [s.bellBtn, pressed && { opacity: 0.6 }]}>
            {Platform.OS === 'web' && <BellIcon />}
            {Platform.OS === 'web' && (
              <View style={s.bellBadge}>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 9, fontWeight: 700, color: '#FFFFFF' } as any}>2</span>
              </View>
            )}
          </Pressable>
        </View>

        {/* Progress */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <JourneyProgress phase={phase} />
        </View>

        {/* Scrollable content */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            {phase === 'searching' && <SearchingPhase planName={planName} planPrice={planPrice} />}
            {phase === 'offers' && <OffersPhase count={offersCount} onView={onViewOffers} />}
            {phase === 'confirmed' && <ConfirmedPhase mover={mover || DEFAULT_MOVER} />}
            {phase === 'moveDay' && <MoveDayPhase mover={mover || DEFAULT_MOVER} />}
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <RouteCard from={fromAddress} to={toAddress} date={moveDate} />
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        <View style={s.tabBarWrap}>
          <TabBar active="dashboard" onTabPress={onTabPress} variant="glass" />
        </View>
      </SafeAreaView>

      <NotificationsPanel
        visible={showNotifs}
        onClose={() => setShowNotifs(false)}
        onSelectPhase={(p) => onPhaseChange?.(p)}
      />
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
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
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
    borderRadius: 24, padding: 24, alignItems: 'center',
    marginTop: 8,
  },

  /* route + chip styles removed — now inline in ticket card */

  notifOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
  },
  notifBackdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  notifPanel: {
    position: 'absolute', top: 90, left: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20,
    paddingBottom: 8,
  },
  notifHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  notifRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  notifUnread: {
    backgroundColor: 'rgba(46,144,250,0.06)',
  },
  notifDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.primary[500],
    marginRight: 6,
  },
});
