/**
 * AI Moving — Get Started Screen (placeholder)
 *
 * Empty screen with back arrow in navbar.
 * Full flow will be added later.
 */

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBarMock, Navbar } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

interface GetStartedScreenProps {
  onBack: () => void;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar onBack={onBack} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
});
