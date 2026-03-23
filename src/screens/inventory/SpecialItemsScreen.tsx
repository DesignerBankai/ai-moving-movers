/**
 * AI Moving — Special Items Screen
 *
 * After scanning rooms, user selects special/heavy items.
 * Tap item → detail screen for sub-options (type, size, etc.)
 * Configured items show blue check + summary of selections.
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

/* ═══════════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════════ */

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#2E90FA"/>
    <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Pool table
const PoolTableIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="#2E90FA" strokeWidth="1.5"/>
    <circle cx="8" cy="12" r="1.5" fill="#2E90FA" fillOpacity="0.4"/>
    <circle cx="12" cy="10" r="1.5" fill="#2E90FA" fillOpacity="0.4"/>
    <circle cx="12" cy="14" r="1.5" fill="#2E90FA" fillOpacity="0.4"/>
    <circle cx="16" cy="12" r="1.5" fill="#2E90FA" fillOpacity="0.4"/>
    <circle cx="4" cy="8" r="1" fill="#2E90FA"/>
    <circle cx="4" cy="16" r="1" fill="#2E90FA"/>
    <circle cx="20" cy="8" r="1" fill="#2E90FA"/>
    <circle cx="20" cy="16" r="1" fill="#2E90FA"/>
  </svg>
);

// Piano
const PianoIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M3 14H21" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M7 14V20M11 14V20M15 14V20M19 14V20" stroke="#2E90FA" strokeWidth="1" opacity="0.3"/>
    <rect x="6" y="6" width="2" height="8" rx="0.5" fill="#2E90FA" fillOpacity="0.3"/>
    <rect x="10" y="6" width="2" height="8" rx="0.5" fill="#2E90FA" fillOpacity="0.3"/>
    <rect x="14" y="6" width="2" height="8" rx="0.5" fill="#2E90FA" fillOpacity="0.3"/>
  </svg>
);

// Safe
const SafeIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#2E90FA" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M12 8V10" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="1" fill="#2E90FA"/>
    <path d="M3 20H5M19 20H21" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Hot tub
const HotTubIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M4 12H20V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V12Z" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M8 5C8 5 8.5 4 9 4.5S9 6 9 6" stroke="#2E90FA" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M12 5C12 5 12.5 4 13 4.5S13 6 13 6" stroke="#2E90FA" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 5C16 5 16.5 4 17 4.5S17 6 17 6" stroke="#2E90FA" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M2 12H22" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Gym equipment
const GymIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M6 9V15M18 9V15" stroke="#2E90FA" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 10V14M21 10V14" stroke="#2E90FA" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 12H18" stroke="#2E90FA" strokeWidth="1.5"/>
  </svg>
);

// Large TV
const TVIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="13" rx="2" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M8 21H16" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 18V21" stroke="#2E90FA" strokeWidth="1.5"/>
  </svg>
);

// Antiques
const AntiquesIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15 8H9L12 2Z" stroke="#2E90FA" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="6" y="10" width="12" height="10" rx="1" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M10 14L12 12L14 14" stroke="#2E90FA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V17" stroke="#2E90FA" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Wine
const WineIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M8 2H16L17 8C17 11.31 14.76 14 12 14C9.24 14 7 11.31 7 8L8 2Z" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M12 14V19" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M8 22H16" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 8H17" stroke="#2E90FA" strokeWidth="1" opacity="0.3"/>
  </svg>
);

// Motorcycle
const MotorcycleIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="16" r="3" stroke="#2E90FA" strokeWidth="1.5"/>
    <circle cx="18" cy="16" r="3" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M6 16L9 10H14L18 16" stroke="#2E90FA" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 10L11 7H14" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Large appliances
const ApplianceIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M5 8H19" stroke="#2E90FA" strokeWidth="1.5"/>
    <circle cx="12" cy="5" r="1" fill="#2E90FA"/>
    <path d="M9 12H15" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 15H15" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Item Config — each with icon + sub-options
   ═══════════════════════════════════════════ */

export interface SpecialItemOption {
  id: string;
  label: string;
}

export interface SpecialItemSection {
  id: string;
  title: string;
  type: 'single' | 'multi';
  options: SpecialItemOption[];
}

export interface SpecialItemConfig {
  id: string;
  name: string;
  subtitle: string;
  icon: React.FC;
  sections: SpecialItemSection[];
}

export const SPECIAL_ITEMS: SpecialItemConfig[] = [
  {
    id: 'pool_table',
    name: 'Pool Table',
    subtitle: 'Type, size & disassembly',
    icon: PoolTableIcon,
    sections: [
      {
        id: 'type',
        title: 'Table Type',
        type: 'single',
        options: [
          { id: 'american', label: 'American Pool' },
          { id: 'russian', label: 'Russian Billiards' },
          { id: 'snooker', label: 'Snooker' },
          { id: 'english', label: 'English Pool' },
          { id: 'carom', label: 'Carom / 3-Cushion' },
        ],
      },
      {
        id: 'size',
        title: 'Table Size',
        type: 'single',
        options: [
          { id: '7ft', label: '7 ft' },
          { id: '8ft', label: '8 ft' },
          { id: '9ft', label: '9 ft' },
          { id: '10ft', label: '10 ft' },
          { id: '12ft', label: '12 ft' },
        ],
      },
      {
        id: 'slate',
        title: 'Slate Type',
        type: 'single',
        options: [
          { id: 'one_piece', label: 'One-piece slate' },
          { id: 'three_piece', label: 'Three-piece slate' },
          { id: 'not_sure', label: 'Not sure' },
        ],
      },
    ],
  },
  {
    id: 'piano',
    name: 'Piano',
    subtitle: 'Type & approximate size',
    icon: PianoIcon,
    sections: [
      {
        id: 'type',
        title: 'Piano Type',
        type: 'single',
        options: [
          { id: 'upright', label: 'Upright' },
          { id: 'baby_grand', label: 'Baby Grand' },
          { id: 'grand', label: 'Grand' },
          { id: 'digital_heavy', label: 'Digital (heavy)' },
          { id: 'organ', label: 'Organ' },
        ],
      },
      {
        id: 'stairs',
        title: 'Stair Access',
        type: 'single',
        options: [
          { id: 'ground', label: 'Ground floor' },
          { id: 'elevator', label: 'Elevator access' },
          { id: 'stairs_1', label: '1 flight of stairs' },
          { id: 'stairs_2', label: '2+ flights' },
        ],
      },
    ],
  },
  {
    id: 'safe',
    name: 'Safe / Heavy Item',
    subtitle: 'Type & weight category',
    icon: SafeIcon,
    sections: [
      {
        id: 'type',
        title: 'Safe Type',
        type: 'single',
        options: [
          { id: 'floor', label: 'Floor safe' },
          { id: 'wall', label: 'Wall safe' },
          { id: 'gun', label: 'Gun safe' },
          { id: 'fireproof', label: 'Fireproof cabinet' },
        ],
      },
      {
        id: 'weight',
        title: 'Estimated Weight',
        type: 'single',
        options: [
          { id: 'light', label: 'Under 100 lbs' },
          { id: 'medium', label: '100–500 lbs' },
          { id: 'heavy', label: '500–1000 lbs' },
          { id: 'very_heavy', label: '1000+ lbs' },
        ],
      },
    ],
  },
  {
    id: 'hot_tub',
    name: 'Hot Tub / Jacuzzi',
    subtitle: 'Type & capacity',
    icon: HotTubIcon,
    sections: [
      {
        id: 'type',
        title: 'Type',
        type: 'single',
        options: [
          { id: 'portable', label: 'Portable / Inflatable' },
          { id: 'acrylic', label: 'Acrylic shell' },
          { id: 'built_in', label: 'Built-in / In-ground' },
        ],
      },
      {
        id: 'capacity',
        title: 'Size / Capacity',
        type: 'single',
        options: [
          { id: '2_person', label: '2-person' },
          { id: '4_person', label: '4-person' },
          { id: '6_person', label: '6-person' },
          { id: '8_person', label: '8+ person' },
        ],
      },
    ],
  },
  {
    id: 'gym',
    name: 'Gym Equipment',
    subtitle: 'Select all that apply',
    icon: GymIcon,
    sections: [
      {
        id: 'equipment',
        title: 'Equipment Type',
        type: 'multi',
        options: [
          { id: 'treadmill', label: 'Treadmill' },
          { id: 'elliptical', label: 'Elliptical' },
          { id: 'bike', label: 'Stationary Bike' },
          { id: 'bench', label: 'Weight Bench' },
          { id: 'multigym', label: 'Multi-gym Station' },
          { id: 'rowing', label: 'Rowing Machine' },
          { id: 'rack', label: 'Squat / Power Rack' },
          { id: 'weights', label: 'Free Weights (set)' },
        ],
      },
    ],
  },
  {
    id: 'tv_large',
    name: 'Large TV / Display',
    subtitle: 'Size & mounting',
    icon: TVIcon,
    sections: [
      {
        id: 'size',
        title: 'Screen Size',
        type: 'single',
        options: [
          { id: '55_65', label: '55–65"' },
          { id: '70_75', label: '70–75"' },
          { id: '80_85', label: '80–85"' },
          { id: '86_plus', label: '86"+' },
        ],
      },
      {
        id: 'mount',
        title: 'Currently Mounted?',
        type: 'single',
        options: [
          { id: 'wall', label: 'Wall-mounted' },
          { id: 'stand', label: 'On a stand' },
        ],
      },
    ],
  },
  {
    id: 'antiques',
    name: 'Antiques / Fine Art',
    subtitle: 'Type & special handling',
    icon: AntiquesIcon,
    sections: [
      {
        id: 'type',
        title: 'Item Type',
        type: 'multi',
        options: [
          { id: 'furniture', label: 'Antique Furniture' },
          { id: 'painting', label: 'Painting / Canvas' },
          { id: 'sculpture', label: 'Sculpture' },
          { id: 'china', label: 'China / Porcelain' },
          { id: 'rug', label: 'Rug / Tapestry' },
          { id: 'mirror', label: 'Large Mirror' },
          { id: 'chandelier', label: 'Chandelier' },
        ],
      },
      {
        id: 'handling',
        title: 'Special Requirements',
        type: 'multi',
        options: [
          { id: 'crating', label: 'Custom crating' },
          { id: 'climate', label: 'Climate control' },
          { id: 'insurance', label: 'Extra insurance' },
        ],
      },
    ],
  },
  {
    id: 'wine',
    name: 'Wine Collection',
    subtitle: 'Volume & storage type',
    icon: WineIcon,
    sections: [
      {
        id: 'volume',
        title: 'Number of Bottles',
        type: 'single',
        options: [
          { id: 'under_50', label: 'Under 50' },
          { id: '50_100', label: '50–100' },
          { id: '100_300', label: '100–300' },
          { id: '300_plus', label: '300+' },
        ],
      },
      {
        id: 'storage',
        title: 'Storage Type',
        type: 'single',
        options: [
          { id: 'fridge', label: 'Wine fridge / cooler' },
          { id: 'rack', label: 'Wine rack' },
          { id: 'cellar', label: 'Wine cellar' },
          { id: 'boxes', label: 'In boxes / cases' },
        ],
      },
    ],
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    subtitle: 'Type & size',
    icon: MotorcycleIcon,
    sections: [
      {
        id: 'type',
        title: 'Motorcycle Type',
        type: 'single',
        options: [
          { id: 'sport', label: 'Sport / Super-sport' },
          { id: 'cruiser', label: 'Cruiser' },
          { id: 'touring', label: 'Touring' },
          { id: 'dirt', label: 'Dirt / Off-road' },
          { id: 'scooter', label: 'Scooter / Moped' },
          { id: 'electric', label: 'Electric' },
        ],
      },
    ],
  },
  {
    id: 'appliances',
    name: 'Large Appliances',
    subtitle: 'Select all oversized items',
    icon: ApplianceIcon,
    sections: [
      {
        id: 'items',
        title: 'Appliance Type',
        type: 'multi',
        options: [
          { id: 'fridge_double', label: 'Double-door Fridge' },
          { id: 'fridge_french', label: 'French-door Fridge' },
          { id: 'washer', label: 'Washer' },
          { id: 'dryer', label: 'Dryer' },
          { id: 'dishwasher', label: 'Dishwasher' },
          { id: 'freezer', label: 'Standalone Freezer' },
          { id: 'range', label: 'Range / Stove (large)' },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════
   Selection data type
   ═══════════════════════════════════════════ */

export type ItemSelections = Record<string, Record<string, string | string[]>>;
// e.g. { pool_table: { type: 'american', size: '8ft', slate: 'three_piece' } }

/** Get human-readable summary of an item's selections */
const getSelectionSummary = (itemId: string, selections: ItemSelections): string => {
  const itemSel = selections[itemId];
  if (!itemSel) return '';

  const config = SPECIAL_ITEMS.find(i => i.id === itemId);
  if (!config) return '';

  const parts: string[] = [];
  for (const section of config.sections) {
    const val = itemSel[section.id];
    if (!val) continue;
    if (Array.isArray(val)) {
      // Multi-select: show count
      const labels = val.map(v => section.options.find(o => o.id === v)?.label).filter(Boolean);
      if (labels.length > 0) {
        parts.push(labels.length <= 2 ? labels.join(', ') : `${labels.length} selected`);
      }
    } else {
      // Single-select: show label
      const opt = section.options.find(o => o.id === val);
      if (opt) parts.push(opt.label);
    }
  }
  return parts.join(' · ');
};

/* ═══════════════════════════════════════════
   Item Row
   ═══════════════════════════════════════════ */

interface ItemRowProps {
  config: SpecialItemConfig;
  isConfigured: boolean;
  summary: string;
  onPress: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ config, isConfigured, summary, onPress }) => {
  const IconComponent = config.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.itemRow,
        isConfigured && styles.itemRowConfigured,
        pressed && styles.itemRowPressed,
      ]}
    >
      {/* Icon */}
      <View style={[styles.itemIconWrap, isConfigured && styles.itemIconWrapConfigured]}>
        {Platform.OS === 'web' ? <IconComponent /> : <Text variant="bodySm" color={colors.gray[400]}>●</Text>}
      </View>

      {/* Info */}
      <View style={styles.itemInfo}>
        {Platform.OS === 'web' ? (
          <>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 15, fontWeight: isConfigured ? 600 : 500,
              color: '#212225', lineHeight: '20px',
            } as any}>{config.name}</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13, fontWeight: 400,
              color: isConfigured ? '#2E90FA' : colors.gray[400],
              lineHeight: '18px',
            } as any}>
              {isConfigured ? summary || 'Configured' : config.subtitle}
            </span>
          </>
        ) : (
          <>
            <Text variant="bodySm" color="#212225">{config.name}</Text>
            <Text variant="bodySm" color={isConfigured ? '#2E90FA' : colors.gray[400]}>
              {isConfigured ? summary || 'Configured' : config.subtitle}
            </Text>
          </>
        )}
      </View>

      {/* Right: check or chevron */}
      <View style={styles.itemAction}>
        {isConfigured ? (
          Platform.OS === 'web' ? <CheckCircleIcon /> : <Text variant="bodySm" color="#2E90FA">✓</Text>
        ) : (
          Platform.OS === 'web' ? <ChevronRightIcon /> : null
        )}
      </View>
    </Pressable>
  );
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface SpecialItemsScreenProps {
  selections: ItemSelections;
  onSelectItem: (itemId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const SpecialItemsScreen: React.FC<SpecialItemsScreenProps> = ({
  selections,
  onSelectItem,
  onContinue,
  onBack,
}) => {
  const configuredCount = Object.keys(selections).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar title="Special Items" onBack={onBack} />

        {/* Header */}
        <View style={styles.header}>
          {Platform.OS === 'web' ? (
            <>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15, fontWeight: 400, color: colors.gray[500],
                lineHeight: '22px',
              } as any}>
                Do you have any of these items?{'\n'}
                Tap to add details for accurate pricing.
              </span>
            </>
          ) : (
            <Text variant="bodySm" color={colors.gray[500]}>
              Do you have any of these items? Tap to add details for accurate pricing.
            </Text>
          )}
        </View>

        {/* Items list */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {SPECIAL_ITEMS.map((item) => {
            const isConfigured = !!selections[item.id];
            const summary = isConfigured ? getSelectionSummary(item.id, selections) : '';
            return (
              <ItemRow
                key={item.id}
                config={item}
                isConfigured={isConfigured}
                summary={summary}
                onPress={() => onSelectItem(item.id)}
              />
            );
          })}

          {/* Bottom spacer */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          {configuredCount > 0 && (
            <View style={styles.countBadge}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 13, fontWeight: 500, color: colors.primary[500],
                } as any}>{configuredCount} item{configuredCount > 1 ? 's' : ''} added</span>
              ) : (
                <Text variant="bodySm" color={colors.primary[500]}>{configuredCount} item{configuredCount > 1 ? 's' : ''} added</Text>
              )}
            </View>
          )}
          <Button
            title={configuredCount > 0 ? 'Continue' : 'Skip — No Special Items'}
            variant="primary"
            onPress={onContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* Item row */
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 14,
    overflow: 'hidden',
  },
  itemRowConfigured: {
    backgroundColor: '#DBEAFE',
  },
  itemRowPressed: {
    opacity: 0.7,
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIconWrapConfigured: {
  },

  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemAction: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom */
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  countBadge: {
    alignItems: 'center',
    marginBottom: 10,
  },
});
