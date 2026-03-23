import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import { StatusBarMock, Navbar, Toggle } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

interface NotificationsScreenProps {
  onBack: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

interface NotificationToggles {
  newRequests: boolean;
  requestUpdates: boolean;
  orderStatusChanges: boolean;
  scheduleReminders: boolean;
  newMessages: boolean;
  messagePreviews: boolean;
  earningsUpdates: boolean;
  payoutConfirmations: boolean;
  appUpdates: boolean;
  sound: boolean;
  vibration: boolean;
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  isLast?: boolean;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  value,
  onToggle,
  isLast = false,
}) => {
  return (
    <View
      style={[
        styles.toggleRow,
        !isLast && styles.toggleRowBorder,
      ]}
    >
      {Platform.OS === 'web' ? (
        <span style={styles.toggleRowLabelWeb}>{label}</span>
      ) : (
        <View style={styles.toggleRowLabel}>{label}</View>
      )}
      <Toggle value={value} onToggle={onToggle} />
    </View>
  );
};

interface NotificationSectionProps {
  title: string;
  children: React.ReactNode;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.section}>
      {Platform.OS === 'web' ? (
        <span style={styles.sectionTitleWeb}>{title}</span>
      ) : (
        <View style={styles.sectionTitleNative}>{title}</View>
      )}
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
};

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  role,
}) => {
  const [toggles, setToggles] = useState<NotificationToggles>({
    newRequests: true,
    requestUpdates: true,
    orderStatusChanges: true,
    scheduleReminders: true,
    newMessages: true,
    messagePreviews: false,
    earningsUpdates: true,
    payoutConfirmations: true,
    appUpdates: true,
    sound: true,
    vibration: true,
  });

  const handleToggle = (key: keyof NotificationToggles, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarMock />
      <Navbar title="Notification Settings" onBack={onBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Alerts */}
        <NotificationSection title="Job Alerts">
          {role !== 'mover' && (
            <ToggleRow
              label="New Move Requests"
              value={toggles.newRequests}
              onToggle={(value) => handleToggle('newRequests', value)}
            />
          )}
          {role !== 'mover' && (
            <ToggleRow
              label="Request Updates"
              value={toggles.requestUpdates}
              onToggle={(value) => handleToggle('requestUpdates', value)}
            />
          )}
          <ToggleRow
            label="Order Status Changes"
            value={toggles.orderStatusChanges}
            onToggle={(value) => handleToggle('orderStatusChanges', value)}
          />
          <ToggleRow
            label="Schedule Reminders"
            value={toggles.scheduleReminders}
            onToggle={(value) => handleToggle('scheduleReminders', value)}
            isLast
          />
        </NotificationSection>

        {/* Messages */}
        <NotificationSection title="Messages">
          <ToggleRow
            label="New Messages"
            value={toggles.newMessages}
            onToggle={(value) => handleToggle('newMessages', value)}
          />
          <ToggleRow
            label="Message Previews"
            value={toggles.messagePreviews}
            onToggle={(value) => handleToggle('messagePreviews', value)}
            isLast
          />
        </NotificationSection>

        {/* Earnings — hidden for mover */}
        {role !== 'mover' && (
          <NotificationSection title="Earnings">
            <ToggleRow
              label="Earnings Updates"
              value={toggles.earningsUpdates}
              onToggle={(value) => handleToggle('earningsUpdates', value)}
            />
            <ToggleRow
              label="Payout Confirmations"
              value={toggles.payoutConfirmations}
              onToggle={(value) => handleToggle('payoutConfirmations', value)}
              isLast
            />
          </NotificationSection>
        )}

        {/* General */}
        <NotificationSection title="General">
          <ToggleRow
            label="App Updates"
            value={toggles.appUpdates}
            onToggle={(value) => handleToggle('appUpdates', value)}
          />
          <ToggleRow
            label="Sound"
            value={toggles.sound}
            onToggle={(value) => handleToggle('sound', value)}
          />
          <ToggleRow
            label="Vibration"
            value={toggles.vibration}
            onToggle={(value) => handleToggle('vibration', value)}
            isLast
          />
        </NotificationSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleWeb: {
    fontSize: '12px',
    color: colors.gray[400],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    paddingTop: 20,
    paddingBottom: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
    display: 'block',
  } as any,
  sectionTitleNative: {
    fontSize: 12,
    color: colors.gray[400],
    fontWeight: '600',
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  } as any,
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  toggleRowLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[800],
    fontWeight: '500',
  },
  toggleRowLabelWeb: {
    flex: 1,
    fontSize: '15px',
    color: colors.gray[800],
    fontWeight: '500',
    fontFamily: 'Inter, system-ui, sans-serif',
  } as any,
});
