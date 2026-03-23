/**
 * AI Moving — Role Selection Screen
 *
 * After login, user picks their role: Mover, Sales, or CEO.
 * Later this will be replaced by CRM-based role flags.
 */

import React from 'react';
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

export type UserRole = 'mover' | 'sales' | 'ceo';

interface RoleSelectionScreenProps {
  userName: string;
  onSelectRole: (role: UserRole) => void;
}

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Role cards config
   ═══════════════════════════════════════════ */

const ROLES: {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: [string, string];
}[] = [
  {
    id: 'mover',
    title: 'Mover',
    subtitle: 'Manage moves, sign contracts, track progress',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M1 3H16V13H1V3Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M16 7H20L23 10V13H16V7Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="5.5" cy="15.5" r="2.5" stroke="#FFFFFF" strokeWidth="1.8"/>
        <circle cx="18.5" cy="15.5" r="2.5" stroke="#FFFFFF" strokeWidth="1.8"/>
      </svg>
    ),
    gradient: [colors.primary[500], colors.primary[600]],
  },
  {
    id: 'sales',
    title: 'Sales',
    subtitle: 'Browse requests, send proposals, close deals',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: ['#7C3AED', '#6D28D9'],
  },
  {
    id: 'ceo',
    title: 'CEO',
    subtitle: 'Full overview, analytics, team performance',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20V14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: ['#F79009', '#DC6803'],
  },
];

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  userName,
  onSelectRole,
}) => {
  if (Platform.OS !== 'web') return null;

  const firstName = userName.split(' ')[0] || userName;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' } as any}>
          {/* Header */}
          <div style={{ marginBottom: 36 } as any}>
            <span style={{
              fontFamily: F, fontSize: 28, fontWeight: 800, color: colors.gray[900],
              display: 'block', letterSpacing: -0.5,
            } as any}>
              Welcome, {firstName}
            </span>
            <span style={{
              fontFamily: F, fontSize: 16, color: colors.gray[400],
              display: 'block', marginTop: 8, lineHeight: '24px',
            } as any}>
              Select your role to continue
            </span>
          </div>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 } as any}>
            {ROLES.map((role) => (
              <Pressable
                key={role.id}
                onPress={() => onSelectRole(role.id)}
                style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
              >
                <div style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
                  padding: '20px 20px',
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${role.gradient[0]}, ${role.gradient[1]})`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: `0 4px 16px ${role.gradient[0]}30`,
                } as any}>
                  {/* Icon circle */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  } as any}>
                    {role.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 } as any}>
                    <span style={{
                      fontFamily: F, fontSize: 20, fontWeight: 700, color: '#FFFFFF',
                      display: 'block', letterSpacing: -0.3,
                    } as any}>
                      {role.title}
                    </span>
                    <span style={{
                      fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.75)',
                      display: 'block', marginTop: 4, lineHeight: '18px',
                    } as any}>
                      {role.subtitle}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 } as any}>
                    <path d="M9 6L15 12L9 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Pressable>
            ))}
          </div>

          {/* Footer hint */}
          <div style={{ marginTop: 24, textAlign: 'center' } as any}>
            <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[300] } as any}>
              Role access will be managed via CRM in production
            </span>
          </div>
        </div>
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  container: { flex: 1, backgroundColor: '#FAFBFD' },
});
