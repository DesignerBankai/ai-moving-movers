/**
 * AI Moving — Profile Screen (Tab: Profile)
 *
 * Matches wireframe: avatar, name, phone,
 * 8 menu items: Personal Info, Payment Methods, Saved Addresses,
 * Move History, Notification Settings, Help & Support, Legal, Sign Out
 */

import React from 'react';
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
import { TabBar, TabId } from '../home/TabBar';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export type ProfileMenuItem =
  | 'personalInfo'
  | 'paymentMethods'
  | 'savedAddresses'
  | 'moveHistory'
  | 'contracts'
  | 'notifications'
  | 'helpSupport'
  | 'legal'
  | 'signOut'
  | 'companyInfo'
  | 'reportsExport';

interface ProfileScreenProps {
  userName: string;
  userPhone: string;
  onMenuPress: (item: ProfileMenuItem) => void;
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Icons (SVG, web-only)
   ═══════════════════════════════════════════ */

const ic = colors.primary[500];

const PersonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={ic} strokeWidth="1.5" />
    <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={ic} strokeWidth="1.5" />
    <path d="M2 10H22" stroke={ic} strokeWidth="1.5" />
    <path d="M6 15H10" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={ic} strokeWidth="1.5" />
    <path d="M12 6V12L16 14" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 18V12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12V18" stroke={ic} strokeWidth="1.5" />
    <path d="M3 18C3 19.66 3.9 21 5 21C6.1 21 7 19.66 7 18V15C7 13.34 6.1 12 5 12C3.9 12 3 13.34 3 15V18Z" stroke={ic} strokeWidth="1.5" />
    <path d="M21 18C21 19.66 20.1 21 19 21C17.9 21 17 19.66 17 18V15C17 13.34 17.9 12 19 12C20.1 12 21 13.34 21 15V18Z" stroke={ic} strokeWidth="1.5" />
  </svg>
);

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ContractIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={ic} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke={ic} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 21H21M4 18H20M6 18V14M10 18V14M14 18V14M18 18V14M3 10L12 3L21 10H3Z" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 17L21 12L16 7" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Menu Row
   ═══════════════════════════════════════════ */

const MenuRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  last?: boolean;
  onPress?: () => void;
}> = ({ icon, label, danger, last, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.menuRow, !last && s.menuRowBorder, pressed && { opacity: 0.7 }]}
  >
    {Platform.OS === 'web' && (
      <View style={s.menuIconWrap}>{icon}</View>
    )}
    {Platform.OS === 'web' ? (
      <span style={{
        fontFamily: F, fontSize: 16, fontWeight: 500,
        color: danger ? colors.error[500] : colors.gray[800],
        flex: 1, marginLeft: 14,
      } as any}>
        {label}
      </span>
    ) : null}
    {!danger && Platform.OS === 'web' && <ChevronIcon />}
  </Pressable>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName,
  userPhone,
  onMenuPress,
  onTabPress,
  onBack,
  role,
}) => {
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        {/* ══ WHITE HEADER ══ status bar + avatar card */}
        <StatusBarMock onTimeTap={onBack} />

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {/* === White profile header at top === */}
          <View style={s.profileHeader}>
            <View style={s.avatarLg}>
              {Platform.OS === 'web' ? (
                <span style={{ fontFamily: F, fontSize: 28, fontWeight: 700, color: colors.primary[500] } as any}>
                  {initials}
                </span>
              ) : null}
            </View>
            <View style={{ height: 12 }} />
            {Platform.OS === 'web' ? (
              <>
                <span style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: colors.gray[900] } as any}>
                  {userName}
                </span>
                <View style={{ height: 4 }} />
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: colors.gray[400] } as any}>
                  {userPhone}
                </span>
              </>
            ) : null}
          </View>

          {/* ══ TINTED CONTENT AREA ══ starts here, white cards inside */}
          {Platform.OS === 'web' ? (
            <div style={{ backgroundColor: '#FAFAFA', padding: '0 16px 120px', flex: 1 } as any}>

              {/* Main menu */}
              <View style={s.menuCard}>
                {role === 'ceo' ? (
                  <MenuRow icon={<BuildingIcon />} label="Company Info" onPress={() => onMenuPress('companyInfo')} />
                ) : role !== 'mover' ? (
                  <MenuRow icon={<PersonIcon />} label="Personal Info" onPress={() => onMenuPress('personalInfo')} />
                ) : null}
                {role !== 'mover' && (
                  <MenuRow icon={<CreditCardIcon />} label="Payout Methods" onPress={() => onMenuPress('paymentMethods')} />
                )}
                {role !== 'mover' && (
                  <MenuRow icon={<ClockIcon />} label="Move History" onPress={() => onMenuPress('moveHistory')} />
                )}
                {role === 'ceo' && (
                  <MenuRow icon={<DownloadIcon />} label="Reports & Export" onPress={() => onMenuPress('reportsExport')} />
                )}
                <MenuRow icon={<ContractIcon />} label="My Contracts" onPress={() => onMenuPress('contracts')} />
                <MenuRow icon={<BellIcon />} label="Notification Settings" onPress={() => onMenuPress('notifications')} />
                <MenuRow icon={<HeadphonesIcon />} label="Help & Support" onPress={() => onMenuPress('helpSupport')} />
                <MenuRow icon={<FileIcon />} label="Legal" last onPress={() => onMenuPress('legal')} />
              </View>

              {/* Sign out */}
              <View style={[s.menuCard, { marginTop: 12 }]}>
                <MenuRow icon={<LogOutIcon />} label="Sign Out" danger last onPress={() => onMenuPress('signOut')} />
              </View>

              {/* Version */}
              <View style={s.versionRow}>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 400, color: colors.gray[400] } as any}>
                  AI Moving v1.0.0
                </span>
              </View>

            </div>
          ) : (
            <>
              <View style={s.menuCard}>
                {role === 'ceo' ? (
                  <MenuRow icon={<BuildingIcon />} label="Company Info" onPress={() => onMenuPress('companyInfo')} />
                ) : role !== 'mover' ? (
                  <MenuRow icon={<PersonIcon />} label="Personal Info" onPress={() => onMenuPress('personalInfo')} />
                ) : null}
                {role !== 'mover' && (
                  <MenuRow icon={<CreditCardIcon />} label="Payout Methods" onPress={() => onMenuPress('paymentMethods')} />
                )}
                {role !== 'mover' && (
                  <MenuRow icon={<ClockIcon />} label="Move History" onPress={() => onMenuPress('moveHistory')} />
                )}
                {role === 'ceo' && (
                  <MenuRow icon={<DownloadIcon />} label="Reports & Export" onPress={() => onMenuPress('reportsExport')} />
                )}
                <MenuRow icon={<ContractIcon />} label="My Contracts" onPress={() => onMenuPress('contracts')} />
                <MenuRow icon={<BellIcon />} label="Notification Settings" onPress={() => onMenuPress('notifications')} />
                <MenuRow icon={<HeadphonesIcon />} label="Help & Support" onPress={() => onMenuPress('helpSupport')} />
                <MenuRow icon={<FileIcon />} label="Legal" last onPress={() => onMenuPress('legal')} />
              </View>
              <View style={{ height: 100 }} />
            </>
          )}

        </ScrollView>

        {/* Tab bar */}
        <View style={s.tabBarWrap}>
          <TabBar active="profile" onTabPress={onTabPress} role={role} />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  profileHeader: {
    alignItems: 'center', paddingTop: 24, paddingBottom: 28,
    backgroundColor: 'transparent',
  },
  avatarLg: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  // Scroll uses tinted bg — begins right after white header
  scroll: { flex: 1 },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, overflow: 'hidden',
  } as any,
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1, borderBottomColor: colors.gray[100],
  },
  menuIconWrap: {
    width: 28, alignItems: 'center',
  },

  versionRow: {
    alignItems: 'center', paddingVertical: 20,
  },

  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
});
