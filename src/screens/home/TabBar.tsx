/**
 * AI Moving — Bottom Tab Bar (Glassmorphism + Animated)
 *
 * Features:
 * - Glassmorphism container with blur + translucent bg
 * - Bounce animation on active tab (spring-like CSS keyframe)
 * - Fill-up gradient effect on active icon (CSS mask + gradient)
 * - Smooth transitions for inactive tabs
 * - Home indicator bar at bottom
 * - Adapted to app's blue/white design system colors
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../../design-system/tokens/colors';

export type TabId = 'dashboard' | 'myMoves' | 'schedule' | 'chat' | 'profile';
export type AppRole = 'mover' | 'sales' | 'ceo';

interface TabBarProps {
  active: TabId;
  onTabPress: (tab: TabId) => void;
  variant?: 'default' | 'glass' | 'flat';
  /** Filter visible tabs by role */
  role?: AppRole;
}

/* ── Inject CSS keyframes once ── */
const STYLE_ID = 'tabbar-animations';
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes tabBounce {
      0%   { transform: translateY(0) scale(1); }
      25%  { transform: translateY(-6px) scale(1.08); }
      50%  { transform: translateY(1px) scale(0.97); }
      70%  { transform: translateY(-2px) scale(1.02); }
      100% { transform: translateY(0) scale(1); }
    }
    @keyframes tabFillUp {
      0%   { clip-path: inset(100% 0 0 0); opacity: 0; }
      40%  { opacity: 1; }
      100% { clip-path: inset(0 0 0 0); opacity: 1; }
    }
    @keyframes tabFillDown {
      0%   { clip-path: inset(0 0 0 0); opacity: 1; }
      100% { clip-path: inset(100% 0 0 0); opacity: 0; }
    }
    @keyframes pillAppear {
      0%   { transform: scale(0.8); opacity: 0; }
      60%  { transform: scale(1.04); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes dotPop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.3); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Icons ── */

/* Dashboard — grid/squares icon */
const DashboardIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" fill={color} />
        <rect x="13" y="3" width="8" height="8" rx="2" fill={color} />
        <rect x="3" y="13" width="8" height="8" rx="2" fill={color} />
        <rect x="13" y="13" width="8" height="8" rx="2" fill={color} />
      </>
    ) : (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" />
      </>
    )}
  </svg>
);

/* My Moves — clipboard/checklist icon */
const MyMovesIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" fill={color} />
        <path d="M9 7H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 11H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 15H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8" />
        <path d="M9 7H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 11H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 15H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </>
    )}
  </svg>
);

/* Chat — speech bubble icon */
const ChatIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled ? (
      <path d="M21 12C21 16.97 16.97 21 12 21C10.36 21 8.81 20.59 7.46 19.86L3 21L4.14 16.54C3.41 15.19 3 13.64 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round"/>
    ) : (
      <>
        <path d="M21 12C21 16.97 16.97 21 12 21C10.36 21 8.81 20.59 7.46 19.86L3 21L4.14 16.54C3.41 15.19 3 13.64 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

/* Schedule — calendar icon */
const ScheduleIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" fill={color} />
        <path d="M16 2V6M8 2V6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 10H21" stroke="white" strokeWidth="1.5" />
        <rect x="7" y="13" width="4" height="3" rx="0.5" fill="white" />
        <rect x="13" y="13" width="4" height="3" rx="0.5" fill="white" />
      </>
    ) : (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" />
        <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <rect x="7" y="13" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
        <rect x="13" y="13" width="4" height="3" rx="0.5" stroke={color} strokeWidth="1.2" />
      </>
    )}
  </svg>
);

/* Profile — person icon */
const ProfileIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <circle cx="12" cy="8" r="4" fill={color} stroke={color} strokeWidth="1"/>
        <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/>
        <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

/* ── Color palette (from design system) ── */
const INACTIVE_COLOR = colors.gray[400];          // #98A2B3
const ACTIVE_COLOR = colors.primary[500];          // #2E90FA
const PILL_BG = colors.primary[50];                // #EFF8FF
const CONTAINER_BG = 'rgba(255,255,255,0.72)';
const CONTAINER_BG_SOLID = '#FFFFFF';
const CONTAINER_BORDER = `1px solid ${colors.primary[100]}40`; // subtle blue border

const TABS: { id: TabId; label: string; Icon: React.FC<{ color: string; filled?: boolean }> }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'myMoves', label: 'Orders', Icon: MyMovesIcon },
  { id: 'schedule', label: 'Schedule', Icon: ScheduleIcon },
  { id: 'chat', label: 'Chat', Icon: ChatIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
];

/* ── Hook: reliable CSS animation restart via DOM ── */
function useAnimationTrigger() {
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useCallback((animName: string, duration: number) => {
    const el = ref.current;
    if (!el) return;
    // Force restart: remove animation, reflow, re-apply
    el.style.animation = 'none';
    // Force reflow
    void el.offsetHeight;
    el.style.animation = `${animName} ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  }, []);
  return { ref, trigger };
}

/* ── Single Tab Item ── */
const TabItem: React.FC<{
  id: TabId;
  label: string;
  Icon: React.FC<{ color: string; filled?: boolean }>;
  isActive: boolean;
  onPress: () => void;
}> = ({ id, label, Icon, isActive, onPress }) => {
  const wasActive = useRef(isActive);
  const bounceAnim = useAnimationTrigger();
  const pillAnim = useAnimationTrigger();
  const dotAnim = useAnimationTrigger();
  const [showFilled, setShowFilled] = useState(isActive);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      // Just became active — fire all animations
      bounceAnim.trigger('tabBounce', 500);
      pillAnim.trigger('pillAppear', 350);
      dotAnim.trigger('dotPop', 300);
      setShowFilled(true);
    }
    if (!isActive && wasActive.current) {
      setShowFilled(false);
    }
    wasActive.current = isActive;
  }, [isActive]);

  // On first render, if active, show filled without bounce
  useEffect(() => {
    if (isActive) setShowFilled(true);
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [styles.tab, pressed && { opacity: 0.75 }]}
      onPress={onPress}
    >
      {Platform.OS === 'web' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative' as const,
          paddingTop: 10,
          paddingBottom: 6,
          paddingLeft: 4,
          paddingRight: 4,
        }}>
          {/* Active pill — no bg, no border */}
          <div
            ref={pillAnim.ref as any}
            style={{
              position: 'absolute' as const,
              top: 2,
              left: -4,
              right: -4,
              bottom: 0,
              borderRadius: 16,
              backgroundColor: 'transparent',
              border: '1px solid transparent',
            }}
          />

          {/* Icon container with bounce */}
          <div
            ref={bounceAnim.ref as any}
            style={{
              position: 'relative' as const,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
            }}
          >
            {/* Inactive icon (outline) — fades out when active */}
            <div style={{
              position: 'absolute' as const,
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              transition: 'opacity 0.3s ease',
              opacity: showFilled ? 0 : 1,
            }}>
              <Icon color={INACTIVE_COLOR} filled={false} />
            </div>

            {/* Active icon (filled) — clip-path fill-up */}
            <div style={{
              position: 'absolute' as const,
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              clipPath: showFilled ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
              transition: showFilled ? 'clip-path 0.4s cubic-bezier(0.22, 1, 0.36, 1)' : 'clip-path 0.25s ease',
              opacity: showFilled ? 1 : 0,
            }}>
              <Icon color={ACTIVE_COLOR} filled={true} />
            </div>
          </div>

          {/* Label */}
          <span style={{
            position: 'relative' as const,
            zIndex: 1,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
            marginTop: '4px',
            lineHeight: '13px',
            letterSpacing: '0.1px',
            transition: 'color 0.3s ease',
            whiteSpace: 'nowrap' as const,
          } as any}>{label}</span>

          {/* Active dot indicator */}
          <div
            ref={dotAnim.ref as any}
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              backgroundColor: isActive ? ACTIVE_COLOR : 'transparent',
              marginTop: 3,
              position: 'relative' as const,
              zIndex: 1,
              transition: 'background-color 0.3s ease',
            }}
          />
        </div>
      )}
    </Pressable>
  );
};

/* ── Main TabBar ── */

/** Tabs visible per role */
const ROLE_TABS: Record<AppRole, TabId[]> = {
  mover: ['schedule', 'chat', 'profile'],
  sales: ['myMoves', 'chat', 'profile'],
  ceo: ['dashboard', 'myMoves', 'chat', 'profile'],
};

export const TabBar: React.FC<TabBarProps> = ({ active, onTabPress, variant = 'default', role }) => {
  const isGlass = variant === 'glass';
  const isFlat = variant === 'flat';
  const allowedIds = role ? ROLE_TABS[role] : TABS.map(t => t.id);
  const visibleTabs = TABS.filter(t => allowedIds.includes(t.id));

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.fallbackContainer}>
        {visibleTabs.map(({ id, label, Icon }) => (
          <TabItem key={id} id={id} label={label} Icon={Icon} isActive={active === id} onPress={() => onTabPress(id)} />
        ))}
      </View>
    );
  }

  /* Flat variant: no container, no border, no indicator — meant to be embedded */
  if (isFlat) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        width: '100%',
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
      } as any}>
        {visibleTabs.map(({ id, label, Icon }) => (
          <TabItem key={id} id={id} label={label} Icon={Icon} isActive={active === id} onPress={() => onTabPress(id)} />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 8,
    }}>
      {/* Tab bar container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        width: '100%',
        ...(isGlass ? {
          backgroundColor: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          border: '1px solid rgba(255,255,255,0.5)',
        } : {
          backgroundColor: '#FFFFFF',
          border: '1px solid #F2F4F7',
        }),
        borderRadius: 28,
        paddingTop: 2,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        boxShadow: 'none',
      } as any}>
        {visibleTabs.map(({ id, label, Icon }) => (
          <TabItem key={id} id={id} label={label} Icon={Icon} isActive={active === id} onPress={() => onTabPress(id)} />
        ))}
      </div>

      {/* Home indicator bar */}
      <div style={{
        width: 134,
        height: 5,
        borderRadius: 3,
        backgroundColor: isGlass ? 'rgba(255,255,255,0.25)' : colors.gray[900],
        marginTop: 8,
      }} />
    </div>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
