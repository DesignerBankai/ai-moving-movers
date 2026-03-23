/**
 * AI Moving — Leave Review Screen
 *
 * Simple review: mover card at top, tap-to-rate 5 stars,
 * text area for feedback, Submit button.
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
import { StatusBarMock, Navbar, Button, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface LeaveReviewScreenProps {
  moverName: string;
  moverRating: number;
  moverReviews: number;
  onSubmit: (rating: number, text: string) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const StarIcon = ({ filled, size = 36 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? '#F79009' : 'none'}
      stroke={filled ? '#F79009' : colors.gray[300]}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const StarSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F79009" stroke="#F79009" strokeWidth="1" />
  </svg>
);

/* ═══════════════════════════════════════════
   Rating labels
   ═══════════════════════════════════════════ */

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const LeaveReviewScreen: React.FC<LeaveReviewScreenProps> = ({
  moverName,
  moverRating,
  moverReviews,
  onSubmit,
  onBack,
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const canSubmit = rating > 0;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />
        <Navbar title="Leave a Review" onBack={onBack} />

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Mover card */}
          <View style={s.moverCard}>
            <View style={s.avatarRow}>
              <View style={s.avatar}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: colors.primary[500] } as any}>
                    {moverName[0]}
                  </span>
                ) : null}
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                {Platform.OS === 'web' ? (
                  <>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 600, color: colors.gray[900] } as any}>
                      {moverName}
                    </span>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <StarSmall />
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[900], marginLeft: 4 } as any}>
                        {moverRating}
                      </span>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], marginLeft: 4 } as any}>
                        ({moverReviews} reviews)
                      </span>
                    </View>
                  </>
                ) : null}
              </View>
            </View>
          </View>

          {/* Rating section */}
          <View style={s.ratingSection}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 600, color: colors.gray[900], textAlign: 'center' } as any}>
                How was your experience?
              </span>
            ) : null}
            <View style={{ height: 16 }} />

            {/* Stars */}
            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  hitSlop={4}
                  style={({ pressed }) => [s.starBtn, pressed && { transform: [{ scale: 1.15 }] }]}
                >
                  {Platform.OS === 'web' && <StarIcon filled={star <= rating} />}
                </Pressable>
              ))}
            </View>

            {/* Rating label */}
            {rating > 0 && Platform.OS === 'web' ? (
              <View style={{ marginTop: 8 }}>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: '#F79009', textAlign: 'center' } as any}>
                  {RATING_LABELS[rating]}
                </span>
              </View>
            ) : null}
          </View>

          {/* Text feedback */}
          <View style={s.feedbackSection}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[700], marginBottom: 8 } as any}>
                Tell us more (optional)
              </span>
            ) : null}
            <View style={s.textAreaWrap}>
              {Platform.OS === 'web' ? (
                <textarea
                  placeholder="Share your experience with the mover..."
                  value={reviewText}
                  onChange={(e: any) => setReviewText(e.target.value)}
                  rows={5}
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 400,
                    color: colors.gray[900],
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    width: '100%',
                    backgroundColor: 'transparent',
                    lineHeight: '20px',
                  } as any}
                />
              ) : null}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Submit button */}
        <View style={s.bottom}>
          <Button
            title="Submit Review"
            variant="primary"
            onPress={() => onSubmit(rating, reviewText)}
            disabled={!canSubmit}
          />
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

  moverCard: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  } as any,
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },

  ratingSection: {
    alignItems: 'center', paddingTop: 32, paddingBottom: 24,
  },
  starsRow: {
    flexDirection: 'row', gap: 10, justifyContent: 'center',
  },
  starBtn: { padding: 4 },

  feedbackSection: { paddingTop: 8 },
  textAreaWrap: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: colors.gray[100] }),
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
  } as any,

  bottom: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: colors.gray[100],
  },
});
