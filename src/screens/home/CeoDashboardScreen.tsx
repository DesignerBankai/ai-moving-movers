/**
 * AI Moving — CEO Dashboard Screen
 *
 * Enhanced analytics dashboard for company leadership.
 * Sections:
 * 1. Revenue overview (total + trend)
 * 2. Key metrics cards (orders, rating, conversion, avg check)
 * 3. Weekly revenue chart (bar chart)
 * 4. Team utilization
 * 5. Top movers leaderboard
 * 6. Recent activity
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
import { StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import { TabBar, TabId } from './TabBar';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface CeoDashboardScreenProps {
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════ */

const WEEKLY_REVENUE = [
  { day: 'Mon', value: 2400 },
  { day: 'Tue', value: 3100 },
  { day: 'Wed', value: 2800 },
  { day: 'Thu', value: 4200 },
  { day: 'Fri', value: 3600 },
  { day: 'Sat', value: 5100 },
  { day: 'Sun', value: 1900 },
];

const TOP_MOVERS = [
  { name: 'Dmitriy K.', moves: 34, rating: 4.9, revenue: 18200 },
  { name: 'Alex M.', moves: 28, rating: 4.8, revenue: 15600 },
  { name: 'James L.', moves: 22, rating: 4.7, revenue: 12400 },
  { name: 'Carlos R.', moves: 19, rating: 4.9, revenue: 10800 },
];

const TEAM_STATS = {
  totalMovers: 12,
  activeNow: 7,
  onBreak: 2,
  available: 3,
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const CeoDashboardScreen: React.FC<CeoDashboardScreenProps> = ({
  onTabPress,
  onBack,
}) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  if (Platform.OS !== 'web') return null;

  const maxRev = Math.max(...WEEKLY_REVENUE.map(d => d.value));
  const totalWeekly = WEEKLY_REVENUE.reduce((s, d) => s + d.value, 0);

  /* ── Metric Card ── */
  const MetricCard = ({ label, value, sub, color, icon }: {
    label: string; value: string; sub?: string; color: string; icon: React.ReactNode;
  }) => (
    <div style={{
      flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16,
      padding: '16px 14px', minWidth: 0,
    } as any}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
      } as any}>
        {icon}
      </div>
      <span style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: colors.gray[900], display: 'block', letterSpacing: -0.5 } as any}>
        {value}
      </span>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
        {label}
      </span>
      {sub && (
        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color, display: 'block', marginTop: 4 } as any}>
          {sub}
        </span>
      )}
    </div>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '12px 16px 120px' } as any}>

            {/* ── Header ── */}
            <div style={{ marginBottom: 20 } as any}>
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: colors.gray[400], display: 'block' } as any}>
                Good morning
              </span>
              <span style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: colors.gray[900], display: 'block', marginTop: 2, letterSpacing: -0.5 } as any}>
                Company Overview
              </span>
            </div>

            {/* ── Revenue Hero Card ── */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[700] || '#1570CD'})`,
              borderRadius: 20, padding: '24px 20px', marginBottom: 12,
            } as any}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}>
                <div>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', display: 'block' } as any}>
                    Total Revenue
                  </span>
                  <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: '#FFFFFF', display: 'block', marginTop: 4, letterSpacing: -1 } as any}>
                    $124,800
                  </span>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#86EFAC', display: 'block', marginTop: 6 } as any}>
                    ↑ 12.5% vs last month
                  </span>
                </div>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                } as any}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Period toggle */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 } as any}>
                {(['week', 'month'] as const).map(p => (
                  <div
                    key={p}
                    onClick={() => setPeriod(p)}
                    style={{
                      padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
                      backgroundColor: period === p ? 'rgba(255,255,255,0.25)' : 'transparent',
                    } as any}
                  >
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: '#FFFFFF', textTransform: 'capitalize' } as any}>
                      {p === 'week' ? 'This Week' : 'This Month'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Key Metrics Grid (2x2) ── */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10 } as any}>
              <MetricCard
                label="Total Orders"
                value="186"
                sub="↑ 8 this week"
                color={colors.primary[500]}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={colors.primary[500]} strokeWidth="1.8"/><path d="M9 7H15M9 11H15M9 15H12" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round"/></svg>}
              />
              <MetricCard
                label="Avg Rating"
                value="4.87"
                sub="Top 5% in LA"
                color={colors.warning[500]}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={colors.warning[500]} strokeWidth="1.8" strokeLinejoin="round"/></svg>}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12 } as any}>
              <MetricCard
                label="Conversion Rate"
                value="68%"
                sub="Requests → Orders"
                color={colors.success[500]}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12A10 10 0 1112.93 2C17 2 20.54 4.59 22 8.22" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01L9 11.01" stroke={colors.success[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
              <MetricCard
                label="Avg Check"
                value="$670"
                sub="↑ $32 vs last month"
                color="#7C3AED"
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1V23M17 5H9.5C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14H14.5C16.99 14 19 16.01 19 18.5S16.99 23 14.5 23H5" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/></svg>}
              />
            </div>

            {/* ── Weekly Revenue Chart ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 } as any}>
                <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900] } as any}>Weekly Revenue</span>
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.primary[500] } as any}>${totalWeekly.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120 } as any}>
                {WEEKLY_REVENUE.map((d, i) => {
                  const h = Math.max((d.value / maxRev) * 100, 8);
                  const isMax = d.value === maxRev;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 } as any}>
                      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: colors.gray[400] } as any}>
                        ${(d.value / 1000).toFixed(1)}k
                      </span>
                      <div style={{
                        width: '100%', height: h, borderRadius: 8,
                        backgroundColor: isMax ? colors.primary[500] : colors.primary[100],
                        transition: 'height 0.3s ease',
                      } as any} />
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: colors.gray[400] } as any}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Team Utilization ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 16 } as any}>
                Team Utilization
              </span>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 8 } as any}>
                {[
                  { label: 'Active', value: TEAM_STATS.activeNow, color: colors.success[500], bg: colors.success[50] },
                  { label: 'On Break', value: TEAM_STATS.onBreak, color: colors.warning[500], bg: colors.warning[50] },
                  { label: 'Available', value: TEAM_STATS.available, color: colors.primary[500], bg: colors.primary[25] },
                ].map((st, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '12px 10px', borderRadius: 12, textAlign: 'center',
                    backgroundColor: st.bg,
                  } as any}>
                    <span style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: st.color, display: 'block' } as any}>
                      {st.value}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: st.color, display: 'block', marginTop: 2, opacity: 0.8 } as any}>
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Utilization bar */}
              <div style={{ marginTop: 12, display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' } as any}>
                <div style={{ width: `${(TEAM_STATS.activeNow / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.success[500] } as any} />
                <div style={{ width: `${(TEAM_STATS.onBreak / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.warning[400] } as any} />
                <div style={{ width: `${(TEAM_STATS.available / TEAM_STATS.totalMovers) * 100}%`, backgroundColor: colors.primary[300] } as any} />
              </div>
              <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 8, textAlign: 'center' } as any}>
                {TEAM_STATS.totalMovers} movers total · {Math.round((TEAM_STATS.activeNow / TEAM_STATS.totalMovers) * 100)}% utilization
              </span>
            </div>

            {/* ── Top Movers Leaderboard ── */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '20px 16px', marginBottom: 12 } as any}>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginBottom: 14 } as any}>
                Top Movers
              </span>
              {TOP_MOVERS.map((mover, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: i < TOP_MOVERS.length - 1 ? `1px solid ${colors.gray[50]}` : 'none',
                } as any}>
                  {/* Rank */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: i === 0 ? colors.warning[50] : colors.gray[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  } as any}>
                    <span style={{
                      fontFamily: F, fontSize: 13, fontWeight: 700,
                      color: i === 0 ? colors.warning[600] : colors.gray[500],
                    } as any}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  } as any}>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.primary[500] } as any}>
                      {mover.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 } as any}>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>
                      {mover.name}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                      {mover.moves} moves · ⭐ {mover.rating}
                    </span>
                  </div>

                  {/* Revenue */}
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[900], flexShrink: 0 } as any}>
                    ${mover.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* ── On-time & Cancellation ── */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 12 } as any}>
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px' } as any}>
                <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: colors.success[500], display: 'block' } as any}>94%</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>On-time Rate</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px' } as any}>
                <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: colors.error[500], display: 'block' } as any}>3.2%</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>Cancellation Rate</span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: '16px 14px' } as any}>
                <span style={{ fontFamily: F, fontSize: 28, fontWeight: 800, color: colors.primary[500], display: 'block' } as any}>4.2h</span>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>Avg Move Time</span>
              </div>
            </div>

          </div>
        </ScrollView>

        <TabBar active="dashboard" onTabPress={onTabPress} role="ceo" />
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
