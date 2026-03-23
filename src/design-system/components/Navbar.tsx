/**
 * AI Moving — Navbar Component
 *
 * Shared navbar across all screens.
 * Layout: [Back arrow] [Centered title] [Empty spacer]
 * Padding: 0 16px 10px 16px
 * Back icon: 32x32, #2E90FA chevron SVG
 * Title: Inter 17px weight 600, letter-spacing -0.43, color #212225
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../tokens/colors';

// Back chevron SVG
const BackIcon = ({ tintColor }: { tintColor?: string }) => {
  const fill = tintColor || '#2E90FA';
  if (Platform.OS === 'web') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M10.306 15.9941C10.306 15.7597 10.3956 15.525 10.5745 15.3461L19.7403 6.18033C20.0984 5.82218 20.9272 5.96484 21.2852 6.32299C21.6431 6.68114 21.8502 7.55165 21.4921 7.90957L13.2235 15.9941L21.4921 24.1702C21.8502 24.5284 21.6921 25.3426 21.334 25.7005C20.9758 26.0585 20.0982 26.166 19.7403 25.8079L10.5745 16.6421C10.3956 16.4632 10.306 16.2285 10.306 15.9941Z"
          fill={fill}
        />
      </svg>
    );
  }
  return <Text variant="bodyLg" color={tintColor || colors.primary[500]}>‹</Text>;
};

interface NavbarProps {
  title?: string;
  onBack?: () => void;
  tintColor?: string;
  rightAction?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, onBack, tintColor, rightAction }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.navIcon}
        activeOpacity={0.7}
      >
        {onBack && <BackIcon tintColor={tintColor} />}
      </TouchableOpacity>

      <View style={styles.navTitleContainer}>
        {title && (
          Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 17,
              fontWeight: 600,
              lineHeight: '22px',
              letterSpacing: -0.43,
              color: '#212225',
              textAlign: 'center',
            } as any}>
              {title}
            </span>
          ) : (
            <Text variant="bodySm" color="#212225">{title}</Text>
          )
        )}
      </View>

      <View style={styles.navIcon}>
        {rightAction || null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 10,
    paddingLeft: 16,
  },

  navIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
