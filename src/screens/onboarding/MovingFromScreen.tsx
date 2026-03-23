/**
 * AI Moving - Moving From Screen (Onboarding Step 1)
 *
 * Collects origin address details:
 * - Address input
 * - Property Type chips (Apartment / House / Condo / Storage)
 * - Conditional fields based on property type:
 *   Apartment/Condo: Bedrooms + Floor + Elevator
 *   House: Bedrooms only
 *   Storage: Unit Size chips (Small / Medium / Large)
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
  Input,
  StatusBarMock,
  ProgressBar,
  Chip,
  Toggle,
  Navbar,
  DREAMY_BG,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

const PROPERTY_TYPES = ['Apartment', 'House', 'Condo', 'Storage'];
const UNIT_SIZES = ['5×5', '5×10', '10×10', '10×15', '10×20', '10×30', '20×20'];

interface MovingFromScreenProps {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export const MovingFromScreen: React.FC<MovingFromScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(false);
  const [unitSize, setUnitSize] = useState('');

  // Flags for conditional fields
  const showBedrooms = propertyType === 'Apartment' || propertyType === 'House' || propertyType === 'Condo';
  const showFloorElevator = propertyType === 'Apartment' || propertyType === 'Condo';
  const showUnitSize = propertyType === 'Storage';

  const isValid = address.trim().length > 0
    && propertyType.length > 0
    && (showBedrooms ? bedrooms.trim().length > 0 : true)
    && (showFloorElevator ? floor.trim().length > 0 : true)
    && (showUnitSize ? unitSize.length > 0 : true);

  const handleContinue = () => {
    if (!isValid) return;
    onContinue({
      address, propertyType,
      ...(showBedrooms && { bedrooms }),
      ...(showFloorElevator && { floor, hasElevator }),
      ...(showUnitSize && { unitSize }),
    });
  };

  // Reset irrelevant fields when property type changes
  const handlePropertyTypeChange = (type: string) => {
    setPropertyType(type);
    if (type === 'Storage') { setBedrooms(''); setFloor(''); setHasElevator(false); }
    if (type === 'House') { setFloor(''); setHasElevator(false); }
    if (type !== 'Storage') { setUnitSize(''); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />

        {/* Navbar */}
        <Navbar title="Moving from" onBack={onBack} />

        {/* Progress Bar */}
        <ProgressBar currentStep={1} />

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Address */}
          <View style={styles.section}>
            <Input
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Property Type */}
          <View style={styles.section}>
            <Text variant="bodySm" color={colors.gray[500]} style={styles.label}>
              Property Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
              {PROPERTY_TYPES.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  selected={propertyType === type}
                  onPress={() => handlePropertyTypeChange(type)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Apartment / Condo: Bedrooms + Floor side by side */}
          {showBedrooms && showFloorElevator && (
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Input
                  label="Bedrooms"
                  placeholder="Bedrooms"
                  value={bedrooms}
                  onChangeText={(t) => setBedrooms(t.slice(0, 1))}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Floor"
                  placeholder="Floor"
                  value={floor}
                  onChangeText={(t) => setFloor(t.slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>
          )}

          {/* House: Bedrooms only (full width) */}
          {showBedrooms && !showFloorElevator && (
            <View style={styles.section}>
              <Input
                label="Bedrooms"
                placeholder="Bedrooms"
                value={bedrooms}
                onChangeText={(t) => setBedrooms(t.slice(0, 1))}
                keyboardType="number-pad"
                maxLength={1}
              />
            </View>
          )}

          {/* Storage: Unit Size chips */}
          {showUnitSize && (
            <View style={styles.section}>
              <Text variant="bodySm" color={colors.gray[500]} style={styles.label}>
                Unit Size
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsRow}>
                {UNIT_SIZES.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    selected={unitSize === size}
                    onPress={() => setUnitSize(size)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Elevator — only for Apartment / Condo */}
          {showFloorElevator && (
            <View style={styles.toggleRow}>
              <Text variant="bodySm" color="#212225">
                Elevator available
              </Text>
              <Toggle value={hasElevator} onToggle={setHasElevator} />
            </View>
          )}
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

  section: { marginTop: 12 },
  label: { marginBottom: 8 },

  chipsScroll: {},
  chipsRow: { flexDirection: 'row', gap: 8 },

  rowInputs: { flexDirection: 'row', gap: 12, marginTop: 12 },
  halfInput: { flex: 1 },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, padding: 16,
    backgroundColor: '#EFF2F7',
    borderRadius: 12, minHeight: 62,
  },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
