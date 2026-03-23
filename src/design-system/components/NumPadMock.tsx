/**
 * AI Moving — iOS Number Pad Mock (web preview only)
 *
 * Mimics the native iOS numeric keyboard for desktop browser preview.
 * On a real device, the native keyboard appears automatically.
 *
 * Layout from iOS:
 * - 4 rows × 3 columns
 * - Row 1: 1 2 3
 * - Row 2: 4 5 6
 * - Row 3: 7 8 9
 * - Row 4: (empty) 0 ⌫
 * - Light gray background (#D1D4D9)
 * - White rounded keys with subtle shadow
 * - Inter, 25px
 */

import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';

interface NumPadMockProps {
  onPress: (digit: string) => void;
  onDelete: () => void;
}

// Only render on web
export const NumPadMock: React.FC<NumPadMockProps> = ({ onPress, onDelete }) => {
  if (Platform.OS !== 'web') return null;

  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  return (
    <View style={styles.container}>
      {/* Home indicator bar at top */}
      <View style={styles.topBar} />

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => {
            if (key === '') {
              return <View key={keyIndex} style={styles.emptyKey} />;
            }

            if (key === 'delete') {
              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={styles.emptyKey}
                  onPress={onDelete}
                  activeOpacity={0.5}
                >
                  {Platform.OS === 'web' ? (
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                      <path
                        d="M10.414 1C9.883 1 9.374 1.211 9 1.586L1.586 9C1.211 9.375 1 9.884 1 10.414C1 10.945 1.211 11.454 1.586 11.828L9 19.243C9.374 19.617 9.883 19.828 10.414 19.828H25C25.530 19.828 26.039 19.617 26.414 19.243C26.789 18.868 27 18.359 27 17.828V3C27 2.470 26.789 1.961 26.414 1.586C26.039 1.211 25.530 1 25 1H10.414Z"
                        stroke="#212225"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M21 7L15 13" stroke="#212225" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M15 7L21 13" stroke="#212225" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : null}
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={keyIndex}
                style={styles.key}
                onPress={() => onPress(key)}
                activeOpacity={0.6}
              >
                {Platform.OS === 'web' ? (
                  <span
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 25,
                      fontWeight: 400,
                      color: '#212225',
                      userSelect: 'none',
                    } as any}
                  >
                    {key}
                  </span>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Bottom home indicator */}
      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1D4D9',
    paddingTop: 8,
    paddingHorizontal: 3,
    paddingBottom: 0,
  },

  topBar: {
    height: 0,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 6,
  },

  key: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS key shadow
    shadowColor: '#898A8D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 1,
  },

  emptyKey: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  homeIndicatorArea: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    backgroundColor: '#D1D4D9',
  },

  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#212225',
  },
});
