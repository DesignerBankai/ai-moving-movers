/**
 * AI Moving — Mover Offers Screen
 *
 * List of verified mover offers. Tap a card to select.
 * Design system: white bg, subtle cards, 12px radius.
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
import { Text, StatusBarMock, Navbar, Button, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface MoverOffer {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  truck: string;
  crewSize: number;
  price: number;
  eta: string;
  highlights: string[];
}

const DEMO_OFFERS: MoverOffer[] = [
  {
    id: 'sos',
    name: 'SOS Moving Co.',
    rating: 4.9,
    reviews: 312,
    truck: '20ft truck',
    crewSize: 3,
    price: 1340,
    eta: 'March 15',
    highlights: ['Top Rated', 'Insured'],
  },
  {
    id: 'swift',
    name: 'Swift Relocations',
    rating: 4.7,
    reviews: 198,
    truck: '16ft truck',
    crewSize: 2,
    price: 1180,
    eta: 'March 15',
    highlights: ['Best Price'],
  },
  {
    id: 'premier',
    name: 'Premier Movers',
    rating: 4.8,
    reviews: 245,
    truck: '22ft truck',
    crewSize: 4,
    price: 1520,
    eta: 'March 14',
    highlights: ['Fastest', 'Insured'],
  },
  {
    id: 'city',
    name: 'City Express Moving',
    rating: 4.6,
    reviews: 87,
    truck: '16ft truck',
    crewSize: 2,
    price: 1090,
    eta: 'March 16',
    highlights: ['Budget Friendly'],
  },
];

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const ic = '#667085';

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="6" width="15" height="10" rx="1" stroke={ic} strokeWidth="1.5"/>
    <path d="M16 10H19L22 13V16H16V10Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="6.5" cy="18" r="1.5" stroke={ic} strokeWidth="1.3"/>
    <circle cx="19.5" cy="18" r="1.5" stroke={ic} strokeWidth="1.3"/>
  </svg>
);

const CrewSmIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke={ic} strokeWidth="1.5"/>
    <path d="M15 8C16.66 8 18 9.12 18 10.5" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 20C3 17.24 5.69 15 9 15C12.31 15 15 17.24 15 20" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Mover Card
   ═══════════════════════════════════════════ */

const MoverCard: React.FC<{
  offer: MoverOffer;
  selected: boolean;
  onSelect: () => void;
}> = ({ offer, selected, onSelect }) => (
  <Pressable
    onPress={onSelect}
    style={({ pressed }) => [
      styles.card,
      selected && styles.cardSelected,
      pressed && { opacity: 0.9 },
    ]}
  >
    <View style={styles.cardTop}>
      {/* Avatar + Info */}
      <View style={styles.cardAvatarRow}>
        <View style={[styles.avatar, selected && { backgroundColor: colors.primary[100] }]}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.primary[500] } as any}>{offer.name[0]}</span>
          ) : null}
        </View>
        <View style={styles.cardInfo}>
          {Platform.OS === 'web' ? (
            <>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: '#212225' } as any}>{offer.name}</span>
              <View style={styles.ratingRow}>
                <StarIcon />
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: '#212225', marginLeft: 4 } as any}>{offer.rating}</span>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>({offer.reviews})</span>
              </View>
            </>
          ) : (
            <>
              <Text variant="bodyMdSemibold" color="#212225">{offer.name}</Text>
              <Text variant="bodySm" color={colors.gray[400]}>{offer.rating} ({offer.reviews})</Text>
            </>
          )}
        </View>
        {/* Price */}
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: '#212225' } as any}>${offer.price.toLocaleString()}</span>
        ) : (
          <Text variant="h3" color="#212225">${offer.price.toLocaleString()}</Text>
        )}
      </View>
    </View>

    {/* Details chips */}
    <View style={styles.chipsRow}>
      <View style={styles.chip}>
        {Platform.OS === 'web' && <TruckIcon />}
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: ic, marginLeft: 5 } as any}>{offer.truck}</span>
        ) : null}
      </View>
      <View style={styles.chip}>
        {Platform.OS === 'web' && <CrewSmIcon />}
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: ic, marginLeft: 5 } as any}>{offer.crewSize} crew</span>
        ) : null}
      </View>
      {Platform.OS === 'web' ? (
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400], marginLeft: 'auto' } as any}>Available {offer.eta}</span>
      ) : null}
    </View>

    {/* Highlights */}
    {offer.highlights.length > 0 && (
      <View style={styles.highlightsRow}>
        {offer.highlights.map(h => (
          <View key={h} style={styles.highlightChip}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 600, color: colors.primary[600] } as any}>{h}</span>
            ) : null}
          </View>
        ))}
      </View>
    )}

    {/* Radio */}
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
  </Pressable>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface MoverOffersScreenProps {
  onSelectMover: (offer: MoverOffer) => void;
  onBack: () => void;
}

export const MoverOffersScreen: React.FC<MoverOffersScreenProps> = ({
  onSelectMover,
  onBack,
}) => {
  const [selectedId, setSelectedId] = React.useState<string>(DEMO_OFFERS[0].id);

  const handleConfirm = () => {
    const offer = DEMO_OFFERS.find(o => o.id === selectedId);
    if (offer) onSelectMover(offer);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Choose Your Mover" onBack={onBack} />

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Subtitle */}
          <View style={styles.subtitle}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[400], lineHeight: '20px' } as any}>{DEMO_OFFERS.length} verified movers are ready for your move</span>
            ) : (
              <Text variant="bodySm" color={colors.gray[400]}>{DEMO_OFFERS.length} verified movers are ready</Text>
            )}
          </View>

          {DEMO_OFFERS.map(offer => (
            <MoverCard
              key={offer.id}
              offer={offer}
              selected={selectedId === offer.id}
              onSelect={() => setSelectedId(offer.id)}
            />
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.bottom}>
          <Button
            title="Confirm Mover"
            variant="primary"
            onPress={handleConfirm}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...(Platform.OS === 'web' ? { background: DREAMY_BG } : { backgroundColor: '#EFF8FF' }),
  } as any,
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  subtitle: { paddingTop: 4, paddingBottom: 16 },

  card: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  } as any,
  cardSelected: {
    borderColor: colors.primary[500], backgroundColor: colors.primary[25],
  },
  cardTop: { marginBottom: 12 },
  cardAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1, marginLeft: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },

  chipsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6,
    borderWidth: 1, borderColor: colors.gray[100],
  },

  highlightsRow: { flexDirection: 'row', gap: 6 },
  highlightChip: {
    backgroundColor: colors.primary[50], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },

  radio: {
    position: 'absolute', top: 16, right: 16,
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.gray[300],
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary[500] },
  radioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary[500],
  },

  bottom: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
});
