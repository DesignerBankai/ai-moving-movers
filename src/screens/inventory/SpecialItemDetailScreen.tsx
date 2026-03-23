/**
 * AI Moving — Special Item Detail Screen
 *
 * Config-driven detail screen for each special item.
 * Shows sections of options (single-select as chips, multi-select as toggleable chips).
 * User selects options → Save → back to list with data.
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
import {
  Text,
  Button,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import {
  SPECIAL_ITEMS,
  SpecialItemConfig,
  SpecialItemSection,
} from './SpecialItemsScreen';

/* ═══════════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════════ */

const CheckSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7L6 10L11 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RemoveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" stroke="#F04438" strokeWidth="1.2"/>
    <path d="M6 6L12 12M12 6L6 12" stroke="#F04438" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Chip Component
   ═══════════════════════════════════════════ */

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

const Chip: React.FC<ChipProps> = ({ label, selected, onPress, multiSelect }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      chipStyles.chip,
      selected && chipStyles.chipSelected,
      pressed && { opacity: 0.7 },
    ]}
  >
    {/* Multi-select check indicator */}
    {multiSelect && selected && (
      <View style={chipStyles.checkBadge}>
        {Platform.OS === 'web' ? <CheckSmallIcon /> : <Text variant="bodySm" color="#FFF">✓</Text>}
      </View>
    )}
    {Platform.OS === 'web' ? (
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        fontWeight: selected ? 600 : 500,
        color: selected ? '#FFFFFF' : '#344054',
        lineHeight: '20px',
      } as any}>{label}</span>
    ) : (
      <Text variant="bodySm" color={selected ? '#FFFFFF' : '#344054'}>{label}</Text>
    )}
  </Pressable>
);

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EFF2F7',
  } as any,
  chipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ═══════════════════════════════════════════
   Section Component
   ═══════════════════════════════════════════ */

interface SectionViewProps {
  section: SpecialItemSection;
  value: string | string[] | undefined;
  onChange: (sectionId: string, value: string | string[]) => void;
}

const SectionView: React.FC<SectionViewProps> = ({ section, value, onChange }) => {
  const isMulti = section.type === 'multi';
  const selectedValues: string[] = isMulti
    ? (Array.isArray(value) ? value : [])
    : [];
  const selectedSingle: string = !isMulti ? (typeof value === 'string' ? value : '') : '';

  const handlePress = (optionId: string) => {
    if (isMulti) {
      const current = [...selectedValues];
      const idx = current.indexOf(optionId);
      if (idx >= 0) {
        current.splice(idx, 1);
      } else {
        current.push(optionId);
      }
      onChange(section.id, current);
    } else {
      // Single select — toggle off if same
      onChange(section.id, selectedSingle === optionId ? '' : optionId);
    }
  };

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.card}>
        <View style={sectionStyles.titleRow}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: fontFamily.primary,
              fontSize: 13, fontWeight: 600, color: colors.gray[400],
              textTransform: 'uppercase' as const, letterSpacing: 0.8,
            } as any}>{section.title}</span>
          ) : (
            <Text variant="bodySm" color={colors.gray[400]}>{section.title}</Text>
          )}
          {isMulti && (
            Platform.OS === 'web' ? (
              <span style={{
                fontFamily: fontFamily.primary,
                fontSize: 12, fontWeight: 400, color: colors.gray[300],
              } as any}>Select all that apply</span>
            ) : (
              <Text variant="bodySm" color={colors.gray[400]}>Select all that apply</Text>
            )
          )}
        </View>
        <View style={sectionStyles.chipsWrap}>
          {section.options.map((opt) => {
            const isSelected = isMulti
              ? selectedValues.includes(opt.id)
              : selectedSingle === opt.id;
            return (
              <Chip
                key={opt.id}
                label={opt.label}
                selected={isSelected}
                onPress={() => handlePress(opt.id)}
                multiSelect={isMulti}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  } as any,
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface SpecialItemDetailScreenProps {
  itemId: string;
  initialSelections?: Record<string, string | string[]>;
  onSave: (itemId: string, selections: Record<string, string | string[]>) => void;
  onRemove: (itemId: string) => void;
  onBack: () => void;
}

export const SpecialItemDetailScreen: React.FC<SpecialItemDetailScreenProps> = ({
  itemId,
  initialSelections,
  onSave,
  onRemove,
  onBack,
}) => {
  const config = SPECIAL_ITEMS.find(i => i.id === itemId);
  if (!config) return null;

  const [localSelections, setLocalSelections] = useState<Record<string, string | string[]>>(
    initialSelections || {}
  );

  const isEditing = !!initialSelections;

  const handleSectionChange = (sectionId: string, value: string | string[]) => {
    setLocalSelections(prev => ({ ...prev, [sectionId]: value }));
  };

  // Check if at least 1 thing is selected
  const hasAnySelection = Object.values(localSelections).some(v => {
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === 'string' && v.length > 0;
  });

  const handleSave = () => {
    if (hasAnySelection) {
      // Clean empty entries
      const cleaned: Record<string, string | string[]> = {};
      for (const [key, val] of Object.entries(localSelections)) {
        if (Array.isArray(val) && val.length > 0) cleaned[key] = val;
        else if (typeof val === 'string' && val.length > 0) cleaned[key] = val;
      }
      onSave(itemId, cleaned);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar title={config.name} onBack={onBack} />

        {/* Item hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            {Platform.OS === 'web' ? <config.icon /> : <Text variant="bodySm" color={colors.gray[400]}>●</Text>}
          </View>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13, fontWeight: 400, color: colors.gray[400],
              lineHeight: '18px', textAlign: 'center',
            } as any}>{config.subtitle}</span>
          ) : (
            <Text variant="bodySm" color={colors.gray[400]}>{config.subtitle}</Text>
          )}
        </View>

        {/* Sections */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {config.sections.map((section) => (
            <SectionView
              key={section.id}
              section={section}
              value={localSelections[section.id]}
              onChange={handleSectionChange}
            />
          ))}

          {/* Remove button for already-configured items */}
          {isEditing && (
            <Pressable
              onPress={() => onRemove(itemId)}
              style={({ pressed }) => [styles.removeRow, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.removeIcon}>
                {Platform.OS === 'web' ? <RemoveIcon /> : <Text variant="bodySm" color="#F04438">×</Text>}
              </View>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 15, fontWeight: 500, color: '#F04438',
                } as any}>Remove this item</span>
              ) : (
                <Text variant="bodySm" color="#F04438">Remove this item</Text>
              )}
            </Pressable>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title={isEditing ? 'Save Changes' : 'Add Item'}
            variant="primary"
            onPress={handleSave}
            disabled={!hasAnySelection}
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
  } as any,
  container: { flex: 1 },

  hero: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  } as any,

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  removeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  removeIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
