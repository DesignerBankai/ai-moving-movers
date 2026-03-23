/**
 * AI Moving — Tariff Selection Screen (redesigned)
 *
 * Layout mirrors the TariffDetailSheet from HomeScreenClean:
 *   • Animated AI Estimate card (count-up) — tap to open scanned items in bottom sheet
 *   • 2 coloured plan tabs (Standard / Premium)
 *   • Plan headline card: icon + name + desc + crew/truck chips
 *   • Full "What's included" feature list with icons
 *   • Sticky CTA button coloured to the selected plan
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Text, Button, StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Tariff Data  (extends original with color / crew / truck)
   ═══════════════════════════════════════════ */

export interface TariffFeature { label: string; included: boolean; }

export interface Tariff {
  id: string;
  name: string;
  price: number;
  badge?: string;
  desc: string;
  crew: number;
  truck: string;
  color: string;
  features: TariffFeature[];
}

export const TARIFFS: Tariff[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 1340,
    badge: 'Popular',
    desc: 'Full packing & disassembly',
    crew: 3,
    truck: '20ft truck',
    color: '#2563EB',
    features: [
      { label: '3-person crew',             included: true  },
      { label: '20ft moving truck',         included: true  },
      { label: 'Loading & unloading',       included: true  },
      { label: 'Enhanced insurance',        included: true  },
      { label: 'Blanket wrapping',          included: true  },
      { label: 'Disassembly & reassembly',  included: true  },
      { label: 'Professional packing',      included: true  },
      { label: 'Packing materials',         included: true  },
      { label: 'Premium insurance',         included: false },
      { label: 'Dedicated coordinator',     included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1540,
    badge: 'Full service',
    desc: 'White-glove full service',
    crew: 4,
    truck: '24ft truck',
    color: '#7C3AED',
    features: [
      { label: '4-person crew',             included: true },
      { label: '24ft moving truck',         included: true },
      { label: 'Loading & unloading',       included: true },
      { label: 'Full insurance coverage',   included: true },
      { label: 'Blanket wrapping',          included: true },
      { label: 'Disassembly & reassembly',  included: true },
      { label: 'Professional packing',      included: true },
      { label: 'Packing materials',         included: true },
      { label: 'Premium insurance',         included: true },
      { label: 'Dedicated coordinator',     included: true },
    ],
  },
];

/* ═══════════════════════════════════════════
   Demo scanned-item data (passed as prop or used as default)
   ═══════════════════════════════════════════ */

export interface ScannedRoom {
  room: string;
  items: { name: string; count: number; volume?: string }[];
}

const DEFAULT_SCANNED_ITEMS: ScannedRoom[] = [
  {
    room: 'Living Room',
    items: [
      { name: 'Sofa (3-seat)',  count: 1, volume: '2.4 m³' },
      { name: 'Coffee table',   count: 1, volume: '0.3 m³' },
      { name: 'TV stand',       count: 1, volume: '0.5 m³' },
      { name: 'Bookshelf',      count: 2, volume: '0.8 m³' },
    ],
  },
  {
    room: 'Bedroom',
    items: [
      { name: 'King bed frame', count: 1, volume: '1.8 m³' },
      { name: 'Wardrobe',       count: 1, volume: '1.2 m³' },
      { name: 'Nightstand',     count: 2, volume: '0.2 m³' },
    ],
  },
  {
    room: 'Kitchen',
    items: [
      { name: 'Dining table',        count: 1, volume: '0.9 m³' },
      { name: 'Dining chairs',       count: 4, volume: '0.6 m³' },
      { name: 'Appliances (boxed)',  count: 6, volume: '1.1 m³' },
    ],
  },
];

/* ═══════════════════════════════════════════
   Item icons  (for scanned items)
   ═══════════════════════════════════════════ */

function ItemIcon({ label, color: c }: { label: string; color: string }) {
  const l = label.toLowerCase();

  if (l.includes('bed') || l.includes('frame'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="9" width="20" height="10" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M2 9V5a1 1 0 011-1h18a1 1 0 011 1v4M6 14v5M18 14v5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('sofa') || l.includes('couch'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M2 8v8a2 2 0 002 2h16a2 2 0 002-2V8" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M6 18v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('table') || l.includes('dining'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="10" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M6 15v3a1 1 0 001 1h10a1 1 0 001-1v-3M7 5v-1a1 1 0 011-1h8a1 1 0 011 1v1M9 5v-2M15 5v-2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('chair'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="4" width="10" height="8" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M6 12v6a1 1 0 001 1h10a1 1 0 001-1v-6" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <line x1="9" y1="19" x2="9" y2="22" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="19" x2="15" y2="22" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('wardrobe') || l.includes('closet') || l.includes('cabinet'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="18" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M12 2v18M3 8h18M3 14h18" stroke={c} strokeWidth="2"/>
      </svg>
    );

  if (l.includes('desk') || l.includes('office'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="12" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M2 7V4a1 1 0 011-1h18a1 1 0 011 1v3M4 19v2M20 19v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="9" y1="9" x2="9" y2="13" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="15" y1="9" x2="15" y2="13" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('box') || l.includes('appliance'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="1" stroke={c} strokeWidth="2"/>
        <path d="M3 9h18M9 3v18M15 3v18" stroke={c} strokeWidth="1.5"/>
      </svg>
    );

  if (l.includes('shelf') || l.includes('bookshelf'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="1" stroke={c} strokeWidth="2"/>
        <line x1="2" y1="9" x2="22" y2="9" stroke={c} strokeWidth="1.5"/>
        <line x1="2" y1="15" x2="22" y2="15" stroke={c} strokeWidth="1.5"/>
      </svg>
    );

  // default box
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke={c} strokeWidth="2"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Scanned Items Bottom Sheet
   ═══════════════════════════════════════════ */

interface ScannedItemsSheetProps {
  visible: boolean;
  scannedRooms: ScannedRoom[];
  onClose: () => void;
}

const ScannedItemsSheet: React.FC<ScannedItemsSheetProps> = ({ visible, scannedRooms, onClose }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible || Platform.OS !== 'web') return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {/* Handle */}
        <View style={styles.sheetHandle}>
          {Platform.OS === 'web' && <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] } as any}/>}
        </View>

        {/* Header */}
        <View style={styles.sheetHeader}>
          {Platform.OS === 'web' ? (
            <>
              <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: '#212225', display: 'block', letterSpacing: -0.3 } as any}>Scanned Items</span>
              <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], marginTop: 4, display: 'block' } as any}>
                {scannedRooms.reduce((s, r) => s + r.items.reduce((ss, i) => ss + i.count, 0), 0)} items across {scannedRooms.length} rooms
              </span>
            </>
          ) : (
            <>
              <Text variant="h3" color="#212225">Scanned Items</Text>
              <Text variant="bodySm" color={colors.gray[400]}>Items across rooms</Text>
            </>
          )}
          <Pressable onPress={onClose} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.gray[100], display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke={colors.gray[500]} strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.itemsWrapper}>
            {scannedRooms.map((room, ri) => (
              <View key={ri} style={{ marginBottom: ri < scannedRooms.length - 1 ? 20 : 0 }}>
                {/* Room label */}
                {Platform.OS === 'web' ? (
                  <span style={{
                    fontFamily: F, fontSize: 13, fontWeight: 600,
                    color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                    display: 'block', marginBottom: 10,
                  } as any}>{room.room}</span>
                ) : (
                  <Text variant="bodySm" color={colors.gray[400]}>ROOM: {room.room}</Text>
                )}

                {/* Room items */}
                {room.items.map((item, ii) => (
                  <View key={ii} style={styles.itemRow}>
                    <View style={styles.itemIconWrap}>
                      {Platform.OS === 'web' && <ItemIcon label={item.name} color={colors.primary[500]} />}
                    </View>
                    {Platform.OS === 'web' ? (
                      <div style={{ display: 'flex', flexDirection: 'column' as const, flex: 1 }}>
                        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: '#111827' } as any}>{item.name}</span>
                        {item.volume && (
                          <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], marginTop: 2 } as any}>{item.volume} • ×{item.count}</span>
                        )}
                      </div>
                    ) : (
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySm" color="#111827">{item.name}</Text>
                        {item.volume && (
                          <Text variant="bodySm" color={colors.gray[400]}>{item.volume} • ×{item.count}</Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

/* ═══════════════════════════════════════════
   Animated price count-up
   ═══════════════════════════════════════════ */

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'web') { setValue(target); return; }
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

/* ═══════════════════════════════════════════
   Confetti burst — fires once on mount
   ═══════════════════════════════════════════ */

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
  drift: number;
}

const CONFETTI_COLORS = [
  '#2E90FA', '#7C3AED', '#F79009', '#12B76A', '#F04438',
  '#E040FB', '#00BCD4', '#FF6D00', '#2563EB', '#16A34A',
];

const ConfettiBurst: React.FC = () => {
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.4,
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 60,
    })),
  ).current;

  if (Platform.OS !== 'web') return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden', pointerEvents: 'none', zIndex: 50,
    } as any}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
        }
      `}} />
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: -10,
          width: p.size,
          height: p.size * 0.6,
          backgroundColor: p.color,
          borderRadius: 1,
          opacity: 0,
          transform: `rotate(${p.rotation}deg) translateX(${p.drift}px)`,
          animation: `confetti-fall 2.2s ease-in ${p.delay}s forwards`,
        } as any} />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Feature icons  (copied from HomeScreenClean)
   ═══════════════════════════════════════════ */

function FeatureIcon({ label, color: c }: { label: string; color: string }) {
  const l = label.toLowerCase();

  if (l.includes('crew') || l.includes('person'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="2"/>
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="8" r="2.5" stroke={c} strokeWidth="1.8"/>
        <path d="M21 21v-1.5a3 3 0 00-2-2.83" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('truck'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M1 3h15v13H1z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 8h4l3 3v5h-7V8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="5.5" cy="18.5" r="2.5" stroke={c} strokeWidth="2"/>
        <circle cx="18.5" cy="18.5" r="2.5" stroke={c} strokeWidth="2"/>
      </svg>
    );

  if (l.includes('loading') || l.includes('unloading'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 8h14M5 12h9M5 16h6" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <rect x="2" y="3" width="20" height="18" rx="2" stroke={c} strokeWidth="2"/>
      </svg>
    );

  if (l.includes('insurance') || l.includes('liability') || l.includes('coverage'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6v6c0 5 3.5 9.74 8 11 4.5-1.26 8-6 8-11V6L12 2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

  if (l.includes('disassembly') || l.includes('reassembly'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

  if (l.includes('packing') || l.includes('materials'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M12 22V12M2.27 6.96L12 12.01l9.73-5.05" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  if (l.includes('coordinator'))
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/>
        <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );

  // default check
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
      <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface TariffSelectionScreenProps {
  userName: string;
  estimatePrice: number;
  scannedRooms?: ScannedRoom[];
  onSelectTariff: (tariffId: string) => void;
  onBack: () => void;
}

export const TariffSelectionScreen: React.FC<TariffSelectionScreenProps> = ({
  userName,
  estimatePrice,
  scannedRooms = DEFAULT_SCANNED_ITEMS,
  onSelectTariff,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState('standard');
  const [sheetVisible, setSheetVisible] = useState(false);
  const animatedPrice = useCountUp(estimatePrice);

  const tariff = TARIFFS.find(t => t.id === selectedId) ?? TARIFFS[0];

  const totalItems = scannedRooms.reduce(
    (s, r) => s + r.items.reduce((ss, it) => ss + it.count, 0), 0,
  );
  const totalVol = scannedRooms.reduce(
    (s, r) => s + r.items.reduce((ss, it) => ss + parseFloat((it.volume ?? '0 m³').replace(' m³', '')), 0), 0,
  ).toFixed(1);

  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showConfetti && <ConfettiBurst />}
        <StatusBarMock onTimeTap={onBack} />

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View style={styles.greetingBlock}>
            {Platform.OS === 'web' ? (
              <>
                <span style={{ fontFamily: F, fontSize: 14, color: colors.gray[400] } as any}>Welcome back,</span>
                <span style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: '#212225' } as any}>{userName}</span>
              </>
            ) : (
              <>
                <Text variant="bodySm" color={colors.gray[400]}>Welcome back,</Text>
                <Text variant="h3" color="#212225">{userName}</Text>
              </>
            )}
          </View>
          <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [styles.bellBtn, pressed && { opacity: 0.6 }]}>
            {Platform.OS === 'web' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── AI Estimate card (animated, tap to see items) ── */}
          <Pressable
            onPress={() => setSheetVisible(true)}
            style={({ pressed }) => [styles.estimateCard, pressed && { opacity: 0.96 }]}
          >
            {/* Top section */}
            <View style={styles.estimateTop}>
              {/* Sparkle + label */}
              <View style={styles.estimateLabel}>
                {Platform.OS === 'web' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                      fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                )}
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginLeft: 6 } as any}>Your AI Estimate</span>
                ) : (
                  <Text variant="bodySm" color="rgba(255,255,255,0.8)">  ✦ Your AI Estimate</Text>
                )}
              </View>

              {/* Price */}
              <View style={styles.estimatePriceRow}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: F, fontSize: 42, fontWeight: 700, color: '#fff', letterSpacing: -1.5, marginTop: 6 } as any}>
                    ${animatedPrice.toLocaleString()}
                  </span>
                ) : (
                  <Text variant="display" color="white">${estimatePrice.toLocaleString()}</Text>
                )}
              </View>

              {/* Stats row — left-aligned with gaps */}
              <View style={styles.statsRow}>
                {/* Items */}
                <Pressable onPress={() => setSheetVisible(true)} style={styles.stat}>
                  {Platform.OS === 'web' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <rect x="6" y="6" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                      <rect x="14" y="6" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                      <rect x="6" y="14" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                      <rect x="14" y="14" width="4" height="4" fill="rgba(255,255,255,0.5)"/>
                    </svg>
                  )}
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: '#fff' } as any}>{totalItems} items</span>
                  ) : <Text variant="bodySm" color="rgba(255,255,255,0.8)">{totalItems} items</Text>}
                </Pressable>

                <View style={styles.statDiv}/>

                {/* Volume */}
                <Pressable onPress={() => setSheetVisible(true)} style={styles.stat}>
                  {Platform.OS === 'web' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M3.27 6.96L12 12.01l8.73-5.05" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="12 22 12 12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: '#fff' } as any}>{totalVol} m³</span>
                  ) : <Text variant="bodySm" color="rgba(255,255,255,0.8)">{totalVol} m³</Text>}
                </Pressable>

                <View style={styles.statDiv}/>

                {/* Rooms */}
                <Pressable onPress={() => setSheetVisible(true)} style={styles.stat}>
                  {Platform.OS === 'web' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="3" width="11" height="11" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <rect x="11" y="3" width="11" height="11" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <rect x="2" y="14" width="11" height="7" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <rect x="11" y="14" width="11" height="7" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                    </svg>
                  )}
                  {Platform.OS === 'web' ? (
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: '#fff' } as any}>{scannedRooms.length} rooms</span>
                  ) : <Text variant="bodySm" color="rgba(255,255,255,0.8)">{scannedRooms.length} rooms</Text>}
                </Pressable>
              </View>
            </View>

            {/* Bottom label */}
            <View style={styles.estimateBottom}>
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.55)' } as any}>
                  Based on AI analysis of your room scans&nbsp;&nbsp;·&nbsp;&nbsp;Tap to see all items
                </span>
              ) : (
                <Text variant="bodySm" color="rgba(255,255,255,0.6)">Based on AI analysis of your room scans</Text>
              )}
            </View>
          </Pressable>

          {/* ── Discount banner ── */}
          <View style={styles.discountBanner}>
            {Platform.OS === 'web' ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: 'rgba(46,144,250,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                } as any}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                      fill={colors.primary[500]} fillOpacity="0.2" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1 } as any}>
                  <span style={{
                    fontFamily: F, fontSize: 15, fontWeight: 700,
                    color: colors.primary[600], display: 'block',
                  } as any}>$100 off — limited time offer</span>
                  <span style={{
                    fontFamily: F, fontSize: 13, fontWeight: 400,
                    color: colors.gray[500], marginTop: 2, display: 'block',
                  } as any}>Discount applied automatically at checkout</span>
                </div>
              </div>
            ) : (
              <Text variant="bodySm" color={colors.primary[600]}>$100 off — limited time offer</Text>
            )}
          </View>

          {/* ── Section label ── */}
          <View style={styles.sectionRow}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: '#212225' } as any}>Choose your service level</span>
            ) : (
              <Text variant="bodyLgBold" color="#212225">Choose your service level</Text>
            )}
          </View>

          {/* ── Plan tabs ── */}
          <View style={styles.planTabs}>
            {TARIFFS.map(t => {
              const active = t.id === selectedId;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setSelectedId(t.id)}
                  style={({ pressed }) => [
                    styles.planTab,
                    { backgroundColor: active ? t.color : '#EFF2F7' },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, letterSpacing: 0.1, color: active ? 'rgba(255,255,255,0.8)' : colors.gray[400], display: 'block' } as any}>{t.name}</span>
                      <span style={{ fontFamily: F, fontSize: 19, fontWeight: 700, letterSpacing: -0.4, color: active ? '#fff' : colors.gray[900], display: 'block', marginTop: 4 } as any}>${t.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <>
                      <Text variant="bodySm" color={active ? 'rgba(255,255,255,0.8)' : colors.gray[400]}>{t.name}</Text>
                      <Text variant="bodyLgBold" color={active ? '#fff' : colors.gray[900]}>${t.price.toLocaleString()}</Text>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ── Plan headline card ── */}
          <View style={styles.planCard}>
            {/* Truck icon */}
            <View style={[styles.planIcon, { backgroundColor: `${tariff.color}18` }]}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="6" width="14" height="10" rx="1.5" stroke={tariff.color} strokeWidth="2"/>
                <path d="M15 10h4l2 3v3h-6V10z" stroke={tariff.color} strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="6.5" cy="18" r="2" stroke={tariff.color} strokeWidth="2"/>
                <circle cx="18.5" cy="18" r="2" stroke={tariff.color} strokeWidth="2"/>
              </svg>
            </View>
            {/* Name + desc */}
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: '#111827', display: 'block' } as any}>{tariff.name}</span>
                  <span style={{ fontFamily: F, fontSize: 14, color: colors.gray[400] } as any}>{tariff.desc}</span>
                </>
              ) : (
                <>
                  <Text variant="bodyLgBold" color="#111827">{tariff.name}</Text>
                  <Text variant="bodySm" color={colors.gray[400]}>{tariff.desc}</Text>
                </>
              )}
            </View>
            {/* Chips */}
            <View style={styles.planChips}>
              <View style={styles.planChip}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[600] } as any}>{tariff.truck}</span>
                ) : <Text variant="bodySm" color={colors.gray[600]}>{tariff.truck}</Text>}
              </View>
              <View style={styles.planChip}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[600] } as any}>{tariff.crew} crew</span>
                ) : <Text variant="bodySm" color={colors.gray[600]}>{tariff.crew} crew</Text>}
              </View>
            </View>
          </View>

          {/* ── Feature rows with header inside ── */}
          <View style={[styles.featuresList, { marginTop: 16 }]}>
            {/* Header inside card */}
            <View style={styles.featuresHeader}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                } as any}>What's included</span>
              ) : (
                <Text variant="bodySm" color={colors.gray[400]}>WHAT'S INCLUDED</Text>
              )}
            </View>
            {tariff.features.map((f, i) => {
              const iconColor = f.included ? tariff.color : colors.gray[300];
              const iconBg    = f.included ? `${tariff.color}18` : colors.gray[100];
              return (
                <View
                  key={i}
                  style={[
                    styles.featureRow,
                    i < tariff.features.length - 1 && styles.featureRowBorder,
                    !f.included && { backgroundColor: '#FAFAFA' },
                  ]}
                >
                  <View style={[styles.featureIconWrap, { backgroundColor: iconBg }]}>
                    {Platform.OS === 'web' && <FeatureIcon label={f.label} color={iconColor} />}
                  </View>
                  {Platform.OS === 'web' ? (
                    <span style={{
                      fontFamily: F, fontSize: 15,
                      fontWeight: f.included ? 500 : 400,
                      color: f.included ? '#111827' : colors.gray[400],
                      marginLeft: 14,
                    } as any}>{f.label}</span>
                  ) : (
                    <Text variant="bodySm" color={f.included ? '#111827' : colors.gray[400]} style={{ marginLeft: 14 }}>{f.label}</Text>
                  )}
                </View>
              );
            })}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* ── Sticky CTA ── */}
        <View style={styles.bottomContainer}>
          {Platform.OS === 'web' ? (
            <Pressable
              onPress={() => onSelectTariff(selectedId)}
              style={({ pressed }) => [styles.ctaBtn, { backgroundColor: tariff.color }, pressed && { opacity: 0.88 }]}
            >
              <span style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: -0.2 } as any}>
                Select {tariff.name}
              </span>
              <span style={{ fontFamily: F, fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.7)' } as any}>
                &nbsp;· ${tariff.price.toLocaleString()}
              </span>
            </Pressable>
          ) : (
            <Button
              title={`Select ${tariff.name} · $${tariff.price.toLocaleString()}`}
              variant="primary"
              onPress={() => onSelectTariff(selectedId)}
            />
          )}
        </View>

        {/* ── Scanned items bottom sheet ── */}
        <ScannedItemsSheet
          visible={sheetVisible}
          scannedRooms={scannedRooms}
          onClose={() => setSheetVisible(false)}
        />
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

  /* Header */
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  greetingBlock: { gap: 2 },
  bellBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: 'none',
    } : {}),
  } as any,

  scroll: { flex: 1, paddingHorizontal: 16 },

  /* ── Estimate card ── */
  estimateCard: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
  },
  estimateTop: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  estimateLabel: {
    flexDirection: 'row', alignItems: 'center',
  },
  estimatePriceRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, gap: 20,
  },
  stat: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  statDiv: {
    width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.2)',
  },
  estimateBottom: {
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: 20, paddingVertical: 10,
  },

  /* ── Discount banner ── */
  discountBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  /* ── Section label ── */
  sectionRow: { marginBottom: 14 },

  /* ── Plan tabs ── */
  planTabs: {
    flexDirection: 'row', gap: 8, marginBottom: 12,
  },
  planTab: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    position: 'relative',
  },

  /* ── Plan headline card ── */
  planCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    gap: 12, marginBottom: 0,
  },
  planIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  planChips: {
    alignItems: 'flex-end', gap: 4,
  },
  planChip: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },

  /* ── Features ── */
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuresHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  featureRowBorder: {
    borderBottomWidth: 1, borderBottomColor: '#F2F4F7',
  },
  featureIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  /* ── CTA ── */
  bottomContainer: {
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },

  /* ── Bottom sheet ── */
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 101,
  },
  sheetHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  sheetScroll: {
    flex: 1,
  },
  itemsWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  itemIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
