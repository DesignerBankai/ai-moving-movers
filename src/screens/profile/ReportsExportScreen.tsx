/**
 * AI Moving — Reports & Export Screen
 *
 * CEO-only screen for generating and exporting reports.
 * Three report types with detail views, period selection, and export functionality.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const ACCENT_PURPLE = '#7C3AED';

type ReportType = 'revenue' | 'orders' | 'movers' | null;
type Period = 'week' | 'month' | 'all';

interface ReportsExportScreenProps {
  onBack: () => void;
}

export const ReportsExportScreen: React.FC<ReportsExportScreenProps> = ({ onBack }) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const F = fontFamily.primary;

  if (Platform.OS !== 'web') return null;

  const handleExport = (format: 'csv' | 'pdf') => {
    setSuccessMessage(`Report exported as ${format.toUpperCase()} successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2200);
  };

  /* ── Report card item ── */
  const ReportCard = ({
    icon: Icon,
    iconBgColor,
    title,
    description,
    reportType,
  }: {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    reportType: ReportType;
  }) => (
    <Pressable onPress={() => setSelectedReport(reportType)}>
      <div style={{
        display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
        paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
        borderBottom: `1px solid ${colors.gray[100]}`,
      } as any}>

        {/* Icon container */}
        <div style={{
          width: 44, height: 44,
          borderRadius: 12,
          backgroundColor: `${iconBgColor}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        } as any}>
          {Icon}
        </div>

        {/* Title & description */}
        <div style={{ flex: 1 } as any}>
          <span style={{
            fontFamily: F, fontSize: 15, fontWeight: 600,
            color: colors.gray[900],
            display: 'block', marginBottom: 3,
          } as any}>
            {title}
          </span>
          <span style={{
            fontFamily: F, fontSize: 13,
            color: colors.gray[500],
            display: 'block',
          } as any}>
            {description}
          </span>
        </div>

        {/* Chevron right */}
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ marginLeft: 8 } as any}>
          <path d="M21.694 16.006C21.694 16.24 21.604 16.475 21.425 16.654L12.26 25.82C11.902 26.178 11.073 26.035 10.715 25.677C10.357 25.319 10.15 24.448 10.508 24.09L18.776 16.006L10.508 7.83C10.15 7.472 10.308 6.657 10.666 6.299C11.024 5.941 11.902 5.834 12.26 6.192L21.425 15.358C21.604 15.537 21.694 15.771 21.694 16.006Z" fill={colors.gray[400]} />
        </svg>
      </div>
    </Pressable>
  );

  /* ── Period chip ── */
  const PeriodChip = ({ period, label }: { period: Period; label: string }) => (
    <Pressable onPress={() => setSelectedPeriod(period)}>
      <div style={{
        paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6,
        borderRadius: 12,
        backgroundColor: selectedPeriod === period ? colors.primary[500] : '#EFF2F7',
      } as any}>
        <span style={{
          fontFamily: F, fontSize: 14, fontWeight: 600,
          color: selectedPeriod === period ? '#FFFFFF' : colors.gray[600],
          display: 'block',
        } as any}>
          {label}
        </span>
      </div>
    </Pressable>
  );

  /* ── Stat mini card ── */
  const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <div style={{
      flex: 1,
      paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12,
      textAlign: 'center' as const,
    } as any}>
      <span style={{
        fontFamily: F, fontSize: 12, fontWeight: 600,
        color: colors.gray[500],
        display: 'block', marginBottom: 4,
      } as any}>
        {label}
      </span>
      <span style={{
        fontFamily: F, fontSize: 18, fontWeight: 700,
        color: colors.gray[900],
        display: 'block',
      } as any}>
        {value}
      </span>
    </div>
  );

  /* ── Export button ── */
  const ExportButton = ({
    label,
    format,
    filled,
  }: {
    label: string;
    format: 'csv' | 'pdf';
    filled: boolean;
  }) => (
    <Pressable onPress={() => handleExport(format)}>
      <div style={{
        flex: 1,
        borderRadius: 14,
        paddingTop: 14, paddingBottom: 14,
        border: filled ? 'none' : `1.5px solid ${colors.primary[500]}`,
        backgroundColor: filled ? colors.primary[500] : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      } as any}>
        <span style={{
          fontFamily: F, fontSize: 15, fontWeight: 600,
          color: filled ? '#FFFFFF' : colors.primary[500],
        } as any}>
          {label}
        </span>
      </div>
    </Pressable>
  );

  return (
    <SafeAreaView style={s.safe}>

      {/* ══ HEADER ══ status bar + nav bar */}
      <div style={{ backgroundColor: 'transparent' } as any}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Nav bar row */}
        <div style={{
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 6, paddingRight: 16,
          paddingTop: 4, paddingBottom: 12,
        } as any}>

          {/* Back arrow */}
          <Pressable
            onPress={() => {
              if (selectedReport) {
                setSelectedReport(null);
              } else {
                onBack();
              }
            }}
            hitSlop={8}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 } as any}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M10.306 15.994C10.306 15.76 10.396 15.525 10.575 15.346L19.74 6.18C20.098 5.822 20.927 5.965 21.285 6.323C21.643 6.681 21.85 7.552 21.492 7.91L13.224 15.994L21.492 24.17C21.85 24.528 21.692 25.343 21.334 25.701C20.976 26.059 20.098 26.166 19.74 25.808L10.575 16.642C10.396 16.463 10.306 16.229 10.306 15.994Z" fill={colors.primary[500]} />
              </svg>
            </div>
          </Pressable>

          {/* Centered title */}
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: -0.43, color: '#212225' } as any}>
            {selectedReport ? (
              selectedReport === 'revenue'
                ? 'Revenue Report'
                : selectedReport === 'orders'
                ? 'Orders Report'
                : 'Movers Report'
            ) : 'Reports & Export'}
          </span>

          {/* Right spacer */}
          <div style={{ minWidth: 60 }} />
        </div>
      </div>

      {/* ══ CONTENT AREA ══ */}
      <div style={{ flex: 1, backgroundColor: '#FAFAFA', overflowY: 'auto' as const } as any}>
        <div style={{ padding: '16px 16px 48px' } as any}>

          {/* Success banner */}
          {showSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              backgroundColor: colors.success[500], borderRadius: 14,
              padding: '12px 16px', marginBottom: 12,
            } as any}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.3"/>
                <path d="M7 12L10.5 15.5L17 8.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: '#FFFFFF' } as any}>
                {successMessage}
              </span>
            </div>
          )}

          {!selectedReport ? (
            /* ── List view: 3 report type cards ── */
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>

              {/* Revenue Report */}
              <ReportCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill={colors.success[500]}/>
                    <circle cx="12" cy="12" r="8" fill={colors.success[500]}/>
                    <path d="M12 7V17M9 10H15C15.5 10 16 10.5 16 11V13C16 13.5 15.5 14 15 14H9C8.5 14 8 13.5 8 13V11C8 10.5 8.5 10 9 10Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
                iconBgColor={colors.success[500]}
                title="Revenue Report"
                description="Revenue breakdown by period and mover"
                reportType="revenue"
              />

              {/* Orders Report */}
              <ReportCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z" fill={colors.primary[500]}/>
                    <path d="M7 6H17M7 10H17M7 14H17M7 18H13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
                iconBgColor={colors.primary[500]}
                title="Orders Report"
                description="All orders with status, amounts, clients"
                reportType="orders"
              />

              {/* Movers Report */}
              <ReportCard
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" fill={ACCENT_PURPLE}/>
                    <path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" fill={ACCENT_PURPLE}/>
                  </svg>
                }
                iconBgColor={ACCENT_PURPLE}
                title="Movers Report"
                description="Performance stats for each mover"
                reportType="movers"
              />

            </div>
          ) : (
            /* ── Detail view ── */
            <>
              {/* Period selector */}
              <div style={{
                display: 'flex', flexDirection: 'row' as const, gap: 8,
                marginBottom: 16,
              } as any}>
                <PeriodChip period="week" label="This Week" />
                <PeriodChip period="month" label="This Month" />
                <PeriodChip period="all" label="All Time" />
              </div>

              {/* Preview card */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16 } as any}>
                <div style={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 } as any}>
                  <span style={{
                    fontFamily: F, fontSize: 13, fontWeight: 600,
                    color: colors.gray[500],
                    textTransform: 'uppercase' as const,
                    letterSpacing: 0.6,
                    display: 'block', marginBottom: 12,
                  } as any}>
                    Summary Stats
                  </span>

                  <div style={{
                    display: 'flex', flexDirection: 'row' as const,
                    justifyContent: 'space-between',
                  } as any}>
                    {selectedReport === 'revenue' && (
                      <>
                        <StatCard label="Total Revenue" value="$12,450" />
                        <StatCard label="Orders" value="48" />
                        <StatCard label="Avg Check" value="$259" />
                      </>
                    )}
                    {selectedReport === 'orders' && (
                      <>
                        <StatCard label="Total" value="132" />
                        <StatCard label="Completed" value="118" />
                        <StatCard label="Cancelled" value="7" />
                        <StatCard label="In Progress" value="7" />
                      </>
                    )}
                    {selectedReport === 'movers' && (
                      <>
                        <StatCard label="Active Movers" value="24" />
                        <StatCard label="Avg Rating" value="4.8" />
                        <StatCard label="Top Performer" value="Alex M." />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Export buttons */}
              <div style={{
                display: 'flex', flexDirection: 'row' as const, gap: 12,
              } as any}>
                <ExportButton label="Export CSV" format="csv" filled={false} />
                <ExportButton label="Export PDF" format="pdf" filled={true} />
              </div>
            </>
          )}

        </div>
      </div>

    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
});
