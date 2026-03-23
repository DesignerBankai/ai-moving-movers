/**
 * AI Moving — Swipe-to-Confirm Button
 *
 * Slide-to-confirm with gradient fill trail + pulsing label & chevron hints.
 * States: Default → Dragging (gradient fill) → Confirmed (green)
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { colors } from '../tokens/colors';
import { fontFamily } from '../tokens/typography';

interface SwipeButtonProps {
  title: string;
  onSwipeComplete: () => void;
}

const THUMB_SIZE = 46;
const TRACK_HEIGHT = 58;
const TRACK_PADDING = 6;
const COMPLETE_THRESHOLD = 0.75;

/* ── Colors ── */
const TRACK_BG = colors.gray[200];
const TRACK_CONFIRMED = '#10B981';
const FILL_COLOR = colors.primary[500];
const THUMB_BG = '#FFFFFF';
const ARROW_COLOR = colors.gray[800];

/* ── SVG Icons ── */

const ChevronIcon = () =>
  Platform.OS === 'web' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6L15 12L9 18"
        stroke={ARROW_COLOR}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : null;

const CheckIcon = () =>
  Platform.OS === 'web' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L19 7"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : null;

/* Hint chevrons (>>>) */
const HintChevronsSvg = () =>
  Platform.OS === 'web' ? (
    <svg width="36" height="12" viewBox="0 0 36 12" fill="none" style={{ marginLeft: 6 }}>
      <path d="M2 2L6 6L2 10" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M14 2L18 6L14 10" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
      <path d="M26 2L30 6L26 10" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="1" />
    </svg>
  ) : null;

const F = fontFamily.primary as string;

export const SwipeButton: React.FC<SwipeButtonProps> = ({
  title,
  onSwipeComplete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;
  const trackWidth = useRef(0);
  const [completed, setCompleted] = useState(false);
  const isAnimating = useRef(false);

  // Keep a ref to the latest callback so the PanResponder always calls the current one
  const onSwipeCompleteRef = useRef(onSwipeComplete);
  useEffect(() => { onSwipeCompleteRef.current = onSwipeComplete; }, [onSwipeComplete]);

  /* Pulse animation for label + chevrons */
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const getMaxX = () => trackWidth.current - THUMB_SIZE - TRACK_PADDING * 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gs) => {
        if (isAnimating.current) return;
        const maxX = getMaxX();
        if (maxX <= 0) return;
        const newX = Math.max(0, Math.min(gs.dx, maxX));
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gs) => {
        if (isAnimating.current) return;
        const maxX = getMaxX();
        if (maxX <= 0) return;

        if (gs.dx >= maxX * COMPLETE_THRESHOLD) {
          isAnimating.current = true;
          Animated.spring(translateX, {
            toValue: maxX,
            useNativeDriver: false,
            bounciness: 0,
            speed: 20,
          }).start(() => {
            setCompleted(true);
            onSwipeCompleteRef.current();
            setTimeout(() => {
              setCompleted(false);
              isAnimating.current = false;
              Animated.timing(translateX, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
              }).start();
            }, 1200);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 4,
            speed: 14,
          }).start();
        }
      },
    }),
  ).current;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  /* ── Interpolations ── */
  const maxXFallback = 250;

  /* Label fades out as thumb moves */
  const labelVisibility = translateX.interpolate({
    inputRange: [0, maxXFallback * 0.25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  /* Combined: pulse × visibility (both text and chevrons pulse together, fade on drag) */
  const labelOpacity = Animated.multiply(pulse, labelVisibility);

  /* Fill width follows thumb */
  const fillWidth = Animated.add(translateX, THUMB_SIZE + TRACK_PADDING + 20);

  /* Fill opacity ramps up quickly */
  const fillOpacity = translateX.interpolate({
    inputRange: [0, 10, maxXFallback * 0.2],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp',
  });

  /* Web-only styles */
  const thumbWebStyle = Platform.OS === 'web' ? {
    cursor: 'grab',
  } as any : {};

  /* Gradient fill web style */
  const fillWebStyle = Platform.OS === 'web' ? {
    background: `linear-gradient(to right, ${colors.primary[500]} 60%, ${colors.primary[300]} 85%, transparent 100%)`,
    backgroundColor: 'transparent',
  } as any : {};

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: completed ? TRACK_CONFIRMED : TRACK_BG },
      ]}
      onLayout={handleLayout}
    >
      {/* Gradient fill behind thumb */}
      {!completed && (
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              opacity: fillOpacity,
            },
            fillWebStyle,
          ]}
        />
      )}

      {/* Confirmed label — full width centered */}
      {completed && Platform.OS === 'web' && (
        <View style={styles.confirmedContainer}>
          <span
            style={{
              fontFamily: F,
              fontSize: 15,
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: -0.2,
              userSelect: 'none',
            } as any}
          >
            Confirmed!
          </span>
        </View>
      )}

      {/* Default label + chevrons — offset for thumb */}
      {!completed && Platform.OS === 'web' && (
        <Animated.View style={[styles.labelContainer, { opacity: labelOpacity }]}>
          <View style={styles.labelRow}>
            <span
              style={{
                fontFamily: F,
                fontSize: 15,
                fontWeight: 600,
                color: colors.gray[500],
                letterSpacing: -0.2,
                userSelect: 'none',
                whiteSpace: 'nowrap',
              } as any}
            >
              {title}
            </span>
            <HintChevronsSvg />
          </View>
        </Animated.View>
      )}

      {/* Draggable thumb */}
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: completed ? TRACK_CONFIRMED : THUMB_BG,
          },
          thumbWebStyle,
        ]}
        {...panResponder.panHandlers}
      >
        {completed ? <CheckIcon /> : <ChevronIcon />}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: TRACK_BG,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: FILL_COLOR,
    borderRadius: TRACK_HEIGHT / 2,
  },
  confirmedContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: THUMB_SIZE + TRACK_PADDING * 2,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: THUMB_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
