/**
 * AI Moving — Summary / Confirmation Screen
 *
 * Final review before submission. Uses same design system:
 * - White bg, subtle (#F9F9F9) section blocks, 12px radius
 * - Simple section labels with "Edit" text link
 * - Data in label: value rows inside subtle containers
 * - No colored accents, shadows, or custom card styles
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
import {
  Text,
  Button,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

const font = fontFamily.primary;
import { RoomData } from '../scanning/RoomsScreen';
import { SPECIAL_ITEMS, ItemSelections } from '../inventory/SpecialItemsScreen';

/* ═══════════════════════════════════════════
   Types (exported for App.tsx)
   ═══════════════════════════════════════════ */

export interface MovingFromData {
  address: string;
  propertyType: string;
  bedrooms: string;
  floor: string;
  hasElevator: boolean;
}

export interface MovingToData {
  address: string;
  floor: string;
  hasElevator: boolean;
}

export interface MovingDateData {
  date: Date;
  timePref: string;
}

export interface ContactData {
  fullName: string;
  phone: string;
  email: string;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const formatDate = (d: Date): string =>
  `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const getItemSummary = (itemId: string, selections: ItemSelections): string => {
  const itemSel = selections[itemId];
  if (!itemSel) return '';
  const config = SPECIAL_ITEMS.find(i => i.id === itemId);
  if (!config) return '';
  const parts: string[] = [];
  for (const section of config.sections) {
    const val = itemSel[section.id];
    if (!val) continue;
    if (Array.isArray(val)) {
      const labels = val.map(v => section.options.find(o => o.id === v)?.label).filter(Boolean);
      if (labels.length > 0) parts.push(labels.join(', '));
    } else {
      const opt = section.options.find(o => o.id === val);
      if (opt) parts.push(opt.label);
    }
  }
  return parts.join(' · ');
};

/* ═══════════════════════════════════════════
   Reusable: Section header (title + Edit)
   ═══════════════════════════════════════════ */

const SectionHeader: React.FC<{ title: string; onEdit?: () => void }> = ({ title, onEdit }) => (
  <View style={styles.sectionHeader}>
    {Platform.OS === 'web' ? (
      <span style={{
        fontFamily: font,
        fontSize: 14, fontWeight: 600, color: colors.gray[400],
        letterSpacing: 0.8, textTransform: 'uppercase' as const,
      } as any}>{title}</span>
    ) : (
      <Text variant="bodySm" color={colors.gray[400]}>{title}</Text>
    )}
    {onEdit && (
      <Pressable onPress={onEdit} hitSlop={8} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: font,
            fontSize: 14, fontWeight: 600, color: colors.primary[500],
          } as any}>Edit</span>
        ) : (
          <Text variant="bodySm" color={colors.primary[500]}>Edit</Text>
        )}
      </Pressable>
    )}
  </View>
);

/* ═══════════════════════════════════════════
   Reusable: Data row (icon + label → value)
   ═══════════════════════════════════════════ */

const DataRow: React.FC<{ icon?: React.FC; label: string; value: string; isLast?: boolean }> = ({ icon: IconComponent, label, value, isLast }) => (
  <View style={[styles.dataRow, !isLast && styles.dataRowBorder]}>
    {IconComponent && Platform.OS === 'web' && (
      <View style={styles.dataRowIcon}>
        <IconComponent />
      </View>
    )}
    {Platform.OS === 'web' ? (
      <>
        <span style={{
          fontFamily: font,
          fontSize: 15, fontWeight: 400, color: colors.gray[400],
          minWidth: 80,
        } as any}>{label}</span>
        <span style={{
          fontFamily: font,
          fontSize: 16, fontWeight: 500, color: colors.gray[900],
          flex: 1, textAlign: 'right' as const,
        } as any}>{value}</span>
      </>
    ) : (
      <>
        <Text variant="bodySm" color={colors.gray[400]}>{label}</Text>
        <Text variant="bodySm" color="#212225">{value}</Text>
      </>
    )}
  </View>
);

/* ═══════════════════════════════════════════
   Compact SVG icons (18×18) for data rows
   ═══════════════════════════════════════════ */

// Moving From / Moving To
const MiniPinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={ic} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniHomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 4L21 12" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12V20H19V12" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniBedroomIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 18V12C3 10.34 4.34 9 6 9H18C19.66 9 21 10.34 21 12V18" stroke={ic} strokeWidth="1.5"/>
    <rect x="5" y="5" width="6" height="4" rx="1.5" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 12H21" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniFloorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M4 9H20M4 15H20" stroke={ic} strokeWidth="1.5"/>
    <path d="M12 3V21" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniElevatorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M12 2V22" stroke={ic} strokeWidth="1.5"/>
    <path d="M8 10L6 8L8 6" stroke={ic} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14L18 16L16 18" stroke={ic} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Moving Date
const MiniCalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 10H21" stroke={ic} strokeWidth="1.5"/>
    <path d="M8 2V6M16 2V6" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const MiniClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={ic} strokeWidth="1.5"/>
    <path d="M12 7V12L15 15" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Contact
const MiniPersonIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={ic} strokeWidth="1.5"/>
    <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const MiniPhoneIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M5 4H9L11 9L8.5 10.5C9.57 12.57 11.43 14.43 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C9.72 21 3 14.28 3 6C3 4.9 3.9 4 5 4Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const MiniEmailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 7L12 13L21 7" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Compact SVG icons (18×18) for rooms
   ═══════════════════════════════════════════ */

const ic = '#2E90FA'; // icon stroke color — blue

const MiniDoorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={ic} strokeWidth="1.5"/>
    <circle cx="15" cy="12" r="1" fill={ic}/>
  </svg>
);
const MiniBedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 18V12C3 10.34 4.34 9 6 9H18C19.66 9 21 10.34 21 12V18" stroke={ic} strokeWidth="1.5"/>
    <rect x="5" y="5" width="6" height="4" rx="1.5" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 12H21" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniCouchIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 13V10C4 8.34 5.34 7 7 7H17C18.66 7 20 8.34 20 10V13" stroke={ic} strokeWidth="1.5"/>
    <path d="M2 13C2 11.9 2.9 11 4 11V16H20V11C21.1 11 22 11.9 22 13V16H2V13Z" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniStoveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="14" rx="2" stroke={ic} strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1.5" stroke={ic} strokeWidth="1.2"/>
    <circle cx="15" cy="10" r="1.5" stroke={ic} strokeWidth="1.2"/>
    <path d="M4 14H20" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniShowerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 12H20V14C20 17.31 17.31 20 14 20H10C6.69 20 4 17.31 4 14V12Z" stroke={ic} strokeWidth="1.5"/>
    <path d="M12 4V8M12 8C14.21 8 16 9.79 16 12H8C8 9.79 9.79 8 12 8Z" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniBoxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="12" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 8L5 4H19L21 8" stroke={ic} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const MiniDiningIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="6" stroke={ic} strokeWidth="1.5"/>
    <path d="M6 16V20M18 16V20M9 16V20M15 16V20" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const MiniOfficeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="10" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M8 20H16" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 16V20" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniGarageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 4L21 12" stroke={ic} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12V20H19V12" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniGenericIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={ic} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke={ic} strokeWidth="1.5"/>
  </svg>
);

const ROOM_ICON_MAP: Record<string, React.FC> = {
  street: MiniDoorIcon, bedroom: MiniBedIcon, living: MiniCouchIcon,
  kitchen: MiniStoveIcon, bathroom: MiniShowerIcon, storage: MiniBoxIcon,
  dining: MiniDiningIcon, office: MiniOfficeIcon, garage: MiniGarageIcon,
};

const getRoomIcon = (roomId: string, roomName: string): React.FC => {
  if (ROOM_ICON_MAP[roomId]) return ROOM_ICON_MAP[roomId];
  const l = roomName.toLowerCase();
  if (l.includes('bed')) return MiniBedIcon;
  if (l.includes('living') || l.includes('lounge')) return MiniCouchIcon;
  if (l.includes('kitchen') || l.includes('cook')) return MiniStoveIcon;
  if (l.includes('bath') || l.includes('shower')) return MiniShowerIcon;
  if (l.includes('dining')) return MiniDiningIcon;
  if (l.includes('office') || l.includes('work')) return MiniOfficeIcon;
  if (l.includes('garage')) return MiniGarageIcon;
  if (l.includes('storage') || l.includes('closet')) return MiniBoxIcon;
  if (l.includes('door') || l.includes('street') || l.includes('hall')) return MiniDoorIcon;
  return MiniGenericIcon;
};

/* ═══════════════════════════════════════════
   Compact SVG icons (18×18) for special items
   ═══════════════════════════════════════════ */

const MiniPoolIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={ic} strokeWidth="1.5"/>
    <circle cx="6" cy="12" r="1.5" fill={ic} fillOpacity="0.3"/>
    <circle cx="12" cy="12" r="1.5" fill={ic} fillOpacity="0.3"/>
    <circle cx="18" cy="12" r="1.5" fill={ic} fillOpacity="0.3"/>
  </svg>
);
const MiniPianoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M3 14H21" stroke={ic} strokeWidth="1.5"/>
    <rect x="7" y="6" width="2" height="8" rx="0.5" fill={ic} fillOpacity="0.25"/>
    <rect x="11" y="6" width="2" height="8" rx="0.5" fill={ic} fillOpacity="0.25"/>
    <rect x="15" y="6" width="2" height="8" rx="0.5" fill={ic} fillOpacity="0.25"/>
  </svg>
);
const MiniSafeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke={ic} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" stroke={ic} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1" fill={ic}/>
  </svg>
);
const MiniHotTubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 12H20V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V12Z" stroke={ic} strokeWidth="1.5"/>
    <path d="M2 12H22" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 5C9 5 9.5 4 10 4.5S10 6 10 6M14 5C14 5 14.5 4 15 4.5S15 6 15 6" stroke={ic} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const MiniGymIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M6 9V15M18 9V15" stroke={ic} strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 10V14M21 10V14" stroke={ic} strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12H18" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniTVIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="13" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M8 21H16" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 18V21" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniAntiquesIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15 8H9L12 2Z" stroke={ic} strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="6" y="10" width="12" height="10" rx="1" stroke={ic} strokeWidth="1.5"/>
  </svg>
);
const MiniWineIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M8 2H16L17 8C17 11.31 14.76 14 12 14C9.24 14 7 11.31 7 8L8 2Z" stroke={ic} strokeWidth="1.5"/>
    <path d="M12 14V19" stroke={ic} strokeWidth="1.5"/>
    <path d="M8 22H16" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const MiniMotoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="16" r="3" stroke={ic} strokeWidth="1.5"/>
    <circle cx="18" cy="16" r="3" stroke={ic} strokeWidth="1.5"/>
    <path d="M6 16L9 10H14L18 16" stroke={ic} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const MiniApplianceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={ic} strokeWidth="1.5"/>
    <path d="M5 8H19" stroke={ic} strokeWidth="1.5"/>
    <path d="M9 12H15M9 15H15" stroke={ic} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ITEM_ICON_MAP: Record<string, React.FC> = {
  pool_table: MiniPoolIcon, piano: MiniPianoIcon, safe: MiniSafeIcon,
  hot_tub: MiniHotTubIcon, gym: MiniGymIcon, tv_large: MiniTVIcon,
  antiques: MiniAntiquesIcon, wine: MiniWineIcon, motorcycle: MiniMotoIcon,
  appliances: MiniApplianceIcon,
};

/* ═══════════════════════════════════════════
   Reusable: List item row (icon + name + detail)
   ═══════════════════════════════════════════ */

interface ListRowProps {
  icon?: React.FC;
  name: string;
  detail: string;
  isLast?: boolean;
}

const ListRow: React.FC<ListRowProps> = ({ icon: IconComponent, name, detail, isLast }) => (
  <View style={[styles.listRow, !isLast && styles.dataRowBorder]}>
    {IconComponent && Platform.OS === 'web' && (
      <View style={styles.listRowIcon}>
        <IconComponent />
      </View>
    )}
    {Platform.OS === 'web' ? (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 2, minWidth: 0 } as any}>
        <span style={{
          fontFamily: font,
          fontSize: 16, fontWeight: 500, color: colors.gray[900],
        } as any}>{name}</span>
        {detail ? (
          <span style={{
            fontFamily: font,
            fontSize: 14, fontWeight: 400, color: colors.gray[400],
            whiteSpace: 'normal' as const, wordBreak: 'break-word' as const,
          } as any}>{detail}</span>
        ) : null}
      </div>
    ) : (
      <View style={{ flex: 1 }}>
        <Text variant="bodySm" color="#212225">{name}</Text>
        {detail ? <Text variant="bodySm" color={colors.gray[400]}>{detail}</Text> : null}
      </View>
    )}
  </View>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface SummaryScreenProps {
  movingFrom: MovingFromData | null;
  movingTo: MovingToData | null;
  movingDate: MovingDateData | null;
  contact: ContactData | null;
  rooms: RoomData[];
  specialItems: ItemSelections;
  onEdit: (section: 'movingFrom' | 'movingTo' | 'movingDate' | 'contactInfo' | 'rooms' | 'specialItems') => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  movingFrom,
  movingTo,
  movingDate,
  contact,
  rooms,
  specialItems,
  onEdit,
  onConfirm,
  onBack,
}) => {
  const completedRooms = rooms.filter(r => r.status === 'completed');
  const specialItemIds = Object.keys(specialItems);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar title="Review & Confirm" onBack={onBack} />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.headerBlock}>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: font,
                fontSize: 16, fontWeight: 400, color: colors.gray[400],
                lineHeight: '24px',
              } as any}>Please review your move details before submitting.</span>
            ) : (
              <Text variant="bodySm" color={colors.gray[400]}>
                Please review your move details before submitting.
              </Text>
            )}
          </View>

          {/* ── Moving From ── */}
          {movingFrom && (
            <View style={styles.sectionBlock}>
              <SectionHeader title="Moving From" onEdit={() => onEdit('movingFrom')} />
              <DataRow icon={MiniPinIcon} label="Address" value={movingFrom.address} />
              <DataRow icon={MiniHomeIcon} label="Property" value={movingFrom.propertyType} />
              <DataRow icon={MiniFloorIcon} label="Floor" value={movingFrom.floor} />
              <DataRow icon={MiniElevatorIcon} label="Elevator" value={movingFrom.hasElevator ? 'Yes' : 'No'} isLast />
            </View>
          )}

          {/* ── Moving To ── */}
          {movingTo && (
            <View style={styles.sectionBlock}>
              <SectionHeader title="Moving To" onEdit={() => onEdit('movingTo')} />
              <DataRow icon={MiniPinIcon} label="Address" value={movingTo.address} />
              <DataRow icon={MiniFloorIcon} label="Floor" value={movingTo.floor} />
              <DataRow icon={MiniElevatorIcon} label="Elevator" value={movingTo.hasElevator ? 'Yes' : 'No'} isLast />
            </View>
          )}

          {/* ── Moving Date ── */}
          {movingDate && (
            <View style={styles.sectionBlock}>
              <SectionHeader title="Moving Date" onEdit={() => onEdit('movingDate')} />
              <DataRow icon={MiniCalendarIcon} label="Date" value={formatDate(movingDate.date)} />
              <DataRow icon={MiniClockIcon} label="Time" value={movingDate.timePref} isLast />
            </View>
          )}

          {/* ── Contact Info ── */}
          {contact && (
            <View style={styles.sectionBlock}>
              <SectionHeader title="Contact" onEdit={() => onEdit('contactInfo')} />
              <DataRow icon={MiniPersonIcon} label="Name" value={contact.fullName} />
              <DataRow icon={MiniPhoneIcon} label="Phone" value={contact.phone} />
              <DataRow icon={MiniEmailIcon} label="Email" value={contact.email} isLast />
            </View>
          )}

          {/* ── Scanned Rooms ── */}
          <View style={styles.sectionBlock}>
            <SectionHeader title={`Rooms (${completedRooms.length})`} onEdit={() => onEdit('rooms')} />
            {completedRooms.length > 0 ? (
              completedRooms.map((room, idx) => (
                <ListRow
                  key={room.id}
                  icon={getRoomIcon(room.id, room.name)}
                  name={room.name}
                  detail={room.duration && room.duration > 0 ? formatDuration(room.duration) : 'Scanned'}
                  isLast={idx === completedRooms.length - 1}
                />
              ))
            ) : (
              <View style={styles.emptyRow}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 400, color: colors.gray[400] } as any}>No rooms scanned yet</span>
                ) : (
                  <Text variant="bodySm" color={colors.gray[400]}>No rooms scanned yet</Text>
                )}
              </View>
            )}
          </View>

          {/* ── Special Items ── */}
          <View style={styles.sectionBlock}>
            <SectionHeader title={`Special Items (${specialItemIds.length})`} onEdit={() => onEdit('specialItems')} />
            {specialItemIds.length > 0 ? (
              specialItemIds.map((itemId, idx) => {
                const config = SPECIAL_ITEMS.find(i => i.id === itemId);
                const summary = getItemSummary(itemId, specialItems);
                return (
                  <ListRow
                    key={itemId}
                    icon={ITEM_ICON_MAP[itemId] || MiniGenericIcon}
                    name={config?.name || itemId}
                    detail={summary}
                    isLast={idx === specialItemIds.length - 1}
                  />
                );
              })
            ) : (
              <View style={styles.emptyRow}>
                {Platform.OS === 'web' ? (
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 400, color: colors.gray[400] } as any}>None added</span>
                ) : (
                  <Text variant="bodySm" color={colors.gray[400]}>None added</Text>
                )}
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <View style={styles.disclaimer}>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: font,
                fontSize: 13, fontWeight: 400, color: colors.gray[400],
                textAlign: 'center' as const, lineHeight: '18px',
              } as any}>By confirming, you agree to receive a moving{'\n'}estimate based on the information above.</span>
            ) : (
              <Text variant="bodySm" color={colors.gray[400]}>
                By confirming, you agree to receive a moving estimate based on the information above.
              </Text>
            )}
          </View>
          <Button
            title="Confirm & Submit"
            variant="primary"
            onPress={onConfirm}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles — consistent with design system
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as any,
  container: { flex: 1 },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },

  headerBlock: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  /* Section header: LABEL + Edit — now inside sectionBlock */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },

  /* Section content block — white card */
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
  } as any,

  /* Data row: label | value */
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  dataRowIcon: {
    width: 36,
    height: 36,
    minWidth: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

  /* List row (rooms / items) */
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  listRowIcon: {
    width: 36,
    height: 36,
    minWidth: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  } as any,

  emptyRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  /* Bottom */
  bottomContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  disclaimer: {
    alignItems: 'center',
    marginBottom: 12,
  },
});
