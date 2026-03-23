/**
 * AI Moving — Moving To Screen (Onboarding Step 2)
 *
 * Collects destination details:
 * - Address input (full width)
 * - Floor + Elevator toggle (one row)
 * - Route Map preview (appears after address filled)
 * - Estimated distance (appears after address filled)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import {
  Text,
  Button,
  Input,
  StatusBarMock,
  ProgressBar,
  Toggle,
  Navbar,
  DREAMY_BG,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ── Real map via Leaflet + OpenStreetMap in iframe ── */
const PICKUP_LAT = 40.7484;
const PICKUP_LNG = -73.9882;
const DROPOFF_LAT = 40.6782;
const DROPOFF_LNG = -73.9442;

const buildRouteMapHTML = (): string => `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>html,body,#map{margin:0;padding:0;width:100%;height:100%;}</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{zoomControl:false,attributionControl:false,scrollWheelZoom:false});
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:19}).addTo(map);
var A=[${PICKUP_LAT},${PICKUP_LNG}],B=[${DROPOFF_LAT},${DROPOFF_LNG}];
function mkIcon(bg,letter){return L.divIcon({className:'',html:'<div style="width:24px;height:24px;border-radius:50%;background:'+bg+';border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-size:10px;font-weight:800;font-family:Inter,system-ui,sans-serif;">'+letter+'</span></div>',iconSize:[24,24],iconAnchor:[12,12]});}
L.marker(A,{icon:mkIcon('#2E90FA','A')}).addTo(map);
L.marker(B,{icon:mkIcon('#F04438','B')}).addTo(map);
var mid=[(A[0]+B[0])/2+0.012,(A[1]+B[1])/2-0.015];
L.polyline([A,[A[0]-0.008,A[1]+0.005],mid,[B[0]+0.008,B[1]-0.005],B],{color:'#2E90FA',weight:3,opacity:0.7,dashArray:'8,8',smoothFactor:2}).addTo(map);
map.fitBounds([A,B],{padding:[30,30]});
<\/script>
</body></html>`;

const MapPlaceholder = () => {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    const blob = new Blob([buildRouteMapHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={mapStyles.container}>
        <Text variant="bodySm" color={colors.gray[400]}>Route Map Preview</Text>
      </View>
    );
  }

  return (
    <View style={mapStyles.container}>
      {src && (
        <iframe
          src={src}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          } as any}
          scrolling="no"
        />
      )}
    </View>
  );
};

const mapStyles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.gray[50],
    overflow: 'hidden',
  },
});

/* ── Map pin icon for distance row ── */
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={colors.gray[400]} fillOpacity={0.15} stroke={colors.gray[400]} strokeWidth="1.5"/>
    <circle cx="12" cy="9" r="2.5" fill={colors.gray[400]}/>
  </svg>
);

/* ── Screen ── */

interface MovingToScreenProps {
  onContinue: (data: any) => void;
  onBack: () => void;
}

export const MovingToScreen: React.FC<MovingToScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [address, setAddress] = useState('');
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState(false);

  const isValid = address.trim().length > 0 && floor.trim().length > 0;
  const hasAddress = address.trim().length > 0;

  // Animate map section appearance
  const mapOpacity = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (hasAddress) {
      Animated.parallel([
        Animated.timing(mapOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(mapTranslateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      mapOpacity.setValue(0);
      mapTranslateY.setValue(12);
    }
  }, [hasAddress]);

  const handleContinue = () => {
    if (!isValid) return;
    onContinue({ address, floor, hasElevator });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar title="Moving to" onBack={onBack} />
        <ProgressBar currentStep={2} />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Address — full width */}
          <View style={styles.section}>
            <Input
              label="Destination Address"
              placeholder="Enter destination address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Floor + Elevator — one row */}
          <View style={styles.floorElevatorRow}>
            <View style={styles.floorInput}>
              <Input
                label="Floor"
                placeholder="Floor"
                value={floor}
                onChangeText={(t) => setFloor(t.slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <View style={styles.elevatorToggle}>
              <Text variant="bodySm" color="#212225">
                Elevator
              </Text>
              <Toggle value={hasElevator} onToggle={setHasElevator} />
            </View>
          </View>

          {/* Map + Distance — only visible after address is entered */}
          {hasAddress && (
            <Animated.View style={{
              opacity: mapOpacity,
              transform: [{ translateY: mapTranslateY }],
              marginTop: 12,
              gap: 12,
            }}>
              <MapPlaceholder />

              <View style={styles.distanceRow}>
                <View style={styles.distanceLeft}>
                  {Platform.OS === 'web' && <MapPinIcon />}
                  <Text variant="bodySm" color={colors.gray[500]}>
                    Estimated distance
                  </Text>
                </View>
                <Text variant="bodySm" color="#212225">
                  5 miles
                </Text>
              </View>
            </Animated.View>
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

  floorElevatorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  floorInput: { flex: 1 },
  elevatorToggle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EFF2F7',
    borderRadius: 12,
    minHeight: 62,
  },

  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EFF2F7',
    borderRadius: 12,
    minHeight: 52,
  },
  distanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
