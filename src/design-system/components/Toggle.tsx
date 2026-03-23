/**
 * AI Moving — Toggle Switch
 *
 * iOS-style toggle for boolean options (e.g., "Elevator available").
 * On: Primary 500 (#2E90FA) track, white thumb
 * Off: Gray 200 (#EAECF0) track, white thumb
 * Animated slide transition.
 */

import React, { useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { colors } from '../tokens/colors';

interface ToggleProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
}

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_MARGIN = 2;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

export const Toggle: React.FC<ToggleProps> = ({ value, onToggle }) => {
  const translateX = useRef(new Animated.Value(value ? TRAVEL : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? TRAVEL : 0,
      friction: 8,
      tension: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [value]);

  return (
    <Pressable
      onPress={() => onToggle(!value)}
      style={[
        styles.track,
        { backgroundColor: value ? colors.primary[500] : colors.gray[300] },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    paddingHorizontal: THUMB_MARGIN,
  },

  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
