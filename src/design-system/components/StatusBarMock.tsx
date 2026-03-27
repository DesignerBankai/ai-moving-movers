/**
 * AI Moving — iOS Status Bar Mock
 *
 * Mock status bar for web preview.
 * Shows time (left), and battery/signal icons (right).
 * On native devices, the real status bar is used instead.
 *
 * Variants:
 * - "dark" (default): black text/icons on light bg
 * - "light": white text/icons for dark backgrounds (camera, etc.)
 *
 * Figma:
 * - Container: padding 21px 24px 19px 24px, gap 154px
 * - Time: Inter, 17px, weight 600, line-height 22px
 * - Icons area: height 22px, gap 7px
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { Text } from './Text';
import { colors } from '../tokens/colors';

interface StatusBarMockProps {
  variant?: 'dark' | 'light';
  onTimeTap?: () => void;  // Hidden shortcut: tap time to trigger action
}

export const StatusBarMock: React.FC<StatusBarMockProps> = ({ variant = 'dark', onTimeTap }) => {
  // Only show on web — native has real status bar
  if (Platform.OS !== 'web') return null;

  const iconColor = variant === 'light' ? '#FFFFFF' : colors.black;

  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [timeString, setTimeString] = useState(getTimeString);

  useEffect(() => {
    const id = setInterval(() => setTimeString(getTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      {/* Left — Time */}
      <View style={styles.timeContainer}>
        {onTimeTap ? (
          <Pressable onPress={onTimeTap} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.5 }]}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 17,
              fontWeight: 600,
              lineHeight: '22px',
              color: iconColor,
              textAlign: 'center',
            } as any}>
              {timeString}
            </span>
          </Pressable>
        ) : (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 17,
            fontWeight: 600,
            lineHeight: '22px',
            color: iconColor,
            textAlign: 'center',
          } as any}>
            {timeString}
          </span>
        )}
      </View>

      {/* Right — Signal, WiFi, Battery icons */}
      <View style={styles.iconsContainer}>
        {/* Signal bars */}
        <View style={styles.signalContainer}>
          <View style={[styles.signalBar, { height: 4, backgroundColor: iconColor }]} />
          <View style={[styles.signalBar, { height: 7, backgroundColor: iconColor }]} />
          <View style={[styles.signalBar, { height: 10, backgroundColor: iconColor }]} />
          <View style={[styles.signalBar, { height: 13, backgroundColor: iconColor }]} />
        </View>

        {/* WiFi icon */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill={iconColor}/>
          <path d="M5.3 8.3a4.5 4.5 0 016.4 0" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2.8 5.8a8 8 0 0111.4 0" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M0.5 3.3a11.5 11.5 0 0116 0" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        {/* Battery */}
        <View style={styles.batteryContainer}>
          <View style={[styles.batteryBody, { borderColor: iconColor }]}>
            <View style={[styles.batteryLevel, { backgroundColor: iconColor }]} />
          </View>
          <View style={[styles.batteryTip, { backgroundColor: iconColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 21,
    paddingBottom: 19,
    paddingHorizontal: 24,
  },

  timeContainer: {
    height: 22,
    justifyContent: 'center',
  },

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
    gap: 7,
  },

  // Signal bars
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 13,
  },

  signalBar: {
    width: 3,
    borderRadius: 0.5,
  },

  // Battery
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  batteryBody: {
    width: 25,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.2,
    padding: 1.5,
    justifyContent: 'center',
  },

  batteryLevel: {
    flex: 1,
    borderRadius: 1,
  },

  batteryTip: {
    width: 2,
    height: 5,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    marginLeft: 1,
  },
});
