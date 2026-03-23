/**
 * AI Moving — Moving Date Screen (Onboarding Step 3)
 *
 * Collects scheduling details:
 * - Calendar (month view, selectable day)
 * - Time input
 * - Preferred Time chips (Morning / Afternoon / Flexible)
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  StatusBarMock,
  ProgressBar,
  Chip,
  Navbar,
  DREAMY_BG,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

// Chevron icons for calendar navigation
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#212225" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#212225" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const TIME_PREFS = ['Morning', 'Afternoon', 'Flexible'];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

interface MovingDateScreenProps {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export const MovingDateScreen: React.FC<MovingDateScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [timePref, setTimePref] = useState('');

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isValid = selectedDay !== null && timePref.length > 0;

  const handleContinue = () => {
    if (!isValid) return;
    onContinue({
      date: new Date(viewYear, viewMonth, selectedDay!),
      timePref,
    });
  };

  // Build calendar grid
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />

        {/* Navbar */}
        <Navbar title="Moving date" onBack={onBack} />

        {/* Progress Bar */}
        <ProgressBar currentStep={3} />

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Calendar card */}
          <View style={styles.card}>
            {/* Month Header */}
            <View style={styles.monthHeader}>
              <TouchableOpacity onPress={prevMonth} activeOpacity={0.7}>
                <ChevronLeft />
              </TouchableOpacity>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 16, fontWeight: 600, color: '#212225',
                } as any}>{MONTHS[viewMonth]} {viewYear}</span>
              ) : (
                <Text variant="bodySm" color="#212225">
                  {MONTHS[viewMonth]} {viewYear}
                </Text>
              )}
              <TouchableOpacity onPress={nextMonth} activeOpacity={0.7}>
                <ChevronRight />
              </TouchableOpacity>
            </View>

            {/* Day of week headers */}
            <View style={styles.weekRow}>
              {DAYS_OF_WEEK.map((day) => (
                <View key={day} style={styles.dayCell}>
                  {Platform.OS === 'web' ? (
                    <span style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 14, fontWeight: 500, color: colors.gray[400],
                      textAlign: 'center',
                    } as any}>{day}</span>
                  ) : (
                    <Text variant="bodySm" color={colors.gray[400]} align="center">{day}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Days grid */}
            <View style={styles.daysGrid}>
              {calendarCells.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    day === selectedDay && styles.dayCellSelected,
                  ]}
                  onPress={() => day && setSelectedDay(day)}
                  activeOpacity={day ? 0.7 : 1}
                  disabled={!day}
                >
                  {day && Platform.OS === 'web' ? (
                    <span style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 16, fontWeight: 500,
                      color: day === selectedDay ? '#FFFFFF' : '#212225',
                      textAlign: 'center',
                    } as any}>{day}</span>
                  ) : day ? (
                    <Text variant="bodySm" color={day === selectedDay ? '#FFFFFF' : '#212225'} align="center">
                      {day}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferred Time card */}
          <View style={styles.card}>
            <Text variant="bodySm" color={colors.gray[500]} style={styles.label}>
              Preferred Time
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
              {TIME_PREFS.map((pref) => (
                <Chip
                  key={pref}
                  label={pref}
                  selected={timePref === pref}
                  onPress={() => setTimePref(pref)}
                  inactiveBg="#EFF2F7"
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title="Continue"
            variant="primary"
            onPress={handleContinue}
            disabled={!isValid}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  scrollContent: { flex: 1, paddingHorizontal: 16 },

  // White card — same pattern as input rows in other onboarding screens
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  monthHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 12,
  },

  weekRow: { flexDirection: 'row', marginBottom: 4 },

  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },

  dayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  dayCellSelected: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
  },

  label: { marginBottom: 8 },
  chipsScroll: {},
  chipsRow: { flexDirection: 'row', gap: 8 },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
