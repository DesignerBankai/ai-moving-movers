/**
 * AI Moving — Mover Detail Screen
 *
 * Full profile of a single mover: avatar, rating, stats,
 * "Included in your plan" checklist, photo gallery placeholder,
 * reviews section, and "Choose This Mover" CTA.
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

export interface MoverDetailData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  jobsCompleted: number;
  truck: string;
  crewSize: number;
  price: number;
  eta: string;
  verified: boolean;
  includedItems: string[];
  reviewsList: { author: string; text: string; rating: number; date: string }[];
}

interface MoverDetailScreenProps {
  mover: MoverDetailData;
  onChoose: () => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const ic = colors.gray[400];

const StarIcon = ({ size = 14, filled = true }: { size?: number; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? '#F79009' : 'none'} stroke="#F79009" strokeWidth="1.5" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={colors.primary[500]} />
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={colors.success[500]} strokeWidth="1.5" />
    <path d="M8 12L11 15L16 9" stroke={colors.success[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke={ic} strokeWidth="1.5" />
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

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.gray[300]} strokeWidth="1.5" />
    <circle cx="8.5" cy="8.5" r="1.5" stroke={colors.gray[300]} strokeWidth="1.5" />
    <path d="M21 15L16 10L5 21" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const MoverDetailScreen: React.FC<MoverDetailScreenProps> = ({
  mover,
  onChoose,
  onBack,
}) => {
  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Mover Details" onBack={onBack} />

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* === Profile Header === */}
          <View style={s.profileHeader}>
            <View style={s.avatarLg}>
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 28, fontWeight: 700, color: colors.primary[500] } as any}>
                  {mover.name[0]}
                </span>
              ) : null}
            </View>
            <View style={{ height: 12 }} />
            <View style={s.nameRow}>
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: colors.gray[900] } as any}>
                  {mover.name}
                </span>
              ) : null}
              {mover.verified && Platform.OS === 'web' && (
                <View style={{ marginLeft: 6 }}><VerifiedIcon /></View>
              )}
            </View>
            <View style={{ height: 6 }} />
            <View style={s.ratingRow}>
              {Platform.OS === 'web' && <StarIcon />}
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900], marginLeft: 4 } as any}>
                  {mover.rating}
                </span>
              ) : null}
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>
                  ({mover.reviews} reviews)
                </span>
              ) : null}
            </View>
          </View>

          {/* === Stats Row === */}
          <View style={s.statsRow}>
            {[
              { icon: <BriefcaseIcon />, value: String(mover.jobsCompleted), label: 'Jobs Done' },
              { icon: <TruckIcon />, value: mover.truck, label: 'Vehicle' },
              { icon: <CrewIcon />, value: `${mover.crewSize} people`, label: 'Crew' },
            ].map((stat, i) => (
              <View key={i} style={s.statCard}>
                {Platform.OS === 'web' && stat.icon}
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900], marginTop: 6 } as any}>
                      {stat.value}
                    </span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[400], marginTop: 2 } as any}>
                      {stat.label}
                    </span>
                  </>
                ) : null}
              </View>
            ))}
          </View>

          {/* === Included in Your Plan === */}
          <View style={s.section}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>
                Included in Your Plan
              </span>
            ) : null}
            <View style={{ height: 12 }} />
            {mover.includedItems.map((item, i) => (
              <View key={i} style={s.includedRow}>
                {Platform.OS === 'web' && <CheckCircleIcon />}
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[700], marginLeft: 10, lineHeight: '20px' } as any}>
                    {item}
                  </span>
                ) : null}
              </View>
            ))}
          </View>

          {/* === Photo Gallery Placeholder === */}
          <View style={s.section}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>
                Photos
              </span>
            ) : null}
            <View style={{ height: 12 }} />
            <View style={s.photoRow}>
              {[0, 1, 2].map(i => (
                <View key={i} style={s.photoPlaceholder}>
                  {Platform.OS === 'web' && <ImageIcon />}
                </View>
              ))}
            </View>
          </View>

          {/* === Reviews === */}
          <View style={s.section}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>
                Reviews
              </span>
            ) : null}
            <View style={{ height: 12 }} />
            {mover.reviewsList.map((review, i) => (
              <View key={i} style={s.reviewCard}>
                <View style={s.reviewHeader}>
                  <View style={s.reviewAvatar}>
                    {Platform.OS === 'web' ? (
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: colors.primary[500] } as any}>
                        {review.author[0]}
                      </span>
                    ) : null}
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    {Platform.OS === 'web' ? (
                      <>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: colors.gray[900] } as any}>
                          {review.author}
                        </span>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          {Array.from({ length: 5 }).map((_, si) => (
                            <View key={si} style={{ marginRight: 1 }}>
                              <StarIcon size={11} filled={si < review.rating} />
                            </View>
                          ))}
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 400, color: colors.gray[400], marginLeft: 6 } as any}>
                            {review.date}
                          </span>
                        </View>
                      </>
                    ) : null}
                  </View>
                </View>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[600], lineHeight: '18px', marginTop: 8 } as any}>
                    {review.text}
                  </span>
                ) : null}
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* === Bottom CTA === */}
        <View style={s.bottom}>
          <View style={s.priceRow}>
            {Platform.OS === 'web' ? (
              <>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400] } as any}>
                  Total estimate
                </span>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 22, fontWeight: 700, color: colors.gray[900] } as any}>
                  ${mover.price.toLocaleString()}
                </span>
              </>
            ) : null}
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <Button title="Choose This Mover" variant="primary" onPress={onChoose} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...(Platform.OS === 'web' ? { background: DREAMY_BG } : { backgroundColor: '#EFF8FF' }),
  } as any,
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  profileHeader: { alignItems: 'center', paddingTop: 20, paddingBottom: 16 },
  avatarLg: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },

  statsRow: {
    flexDirection: 'row', gap: 8, marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 12,
  } as any,

  section: { marginBottom: 24 },
  includedRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
  },

  photoRow: { flexDirection: 'row', gap: 8 },
  photoPlaceholder: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: colors.gray[100], borderStyle: 'dashed' }),
    alignItems: 'center',
    justifyContent: 'center',
  } as any,

  reviewCard: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  } as any,
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },

  bottom: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.gray[100],
  },
  priceRow: { alignItems: 'flex-start' },
});
