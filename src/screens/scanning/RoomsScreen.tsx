/**
 * AI Moving — Rooms Screen
 *
 * After finishing a room recording, user sees:
 * - Search bar to filter rooms
 * - Room list with contextual icons per room type
 * - Completed rooms: sorted to top, blue-tinted bg, three-dot menu
 * - Pending rooms show "Tap to scan" + chevron
 * - "+ Add Room" with inline naming (TextInput)
 * - Bottom sheet for completed rooms: Re-scan / Delete / Cancel
 * - "Continue" button (enabled if at least 1 scanned)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  StatusBarMock,
  Navbar,
} from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { DesktopQRScreen } from '../../components/DesktopQRScreen';
import { useIsDesktop } from '../../hooks/useIsDesktop';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/* ═══════════════════════════════════════════
   SVG Icons — Room types + UI
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

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={colors.gray[400]} strokeWidth="1.5"/>
    <path d="M16 16L20 20" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 4V16M4 10H16" stroke="#2E90FA" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4L12 12M12 4L4 12" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Three-dot menu icon for completed rooms
const MoreIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="7" r="2" fill={colors.gray[400]}/>
    <circle cx="14" cy="14" r="2" fill={colors.gray[400]}/>
    <circle cx="14" cy="21" r="2" fill={colors.gray[400]}/>
  </svg>
);

// Bottom sheet icons
const RescanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 10C3 6.13 6.13 3 10 3C12.39 3 14.51 4.13 15.82 5.87" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 10C17 13.87 13.87 17 10 17C7.61 17 5.49 15.87 4.18 14.13" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 6L16 6L16 4" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14L4 14L4 16" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 5H17" stroke="#F04438" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 3H12" stroke="#F04438" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 5L6 16C6 16.55 6.45 17 7 17H13C13.55 17 14 16.55 14 16L15 5" stroke="#F04438" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 8V14M12 8V14" stroke="#F04438" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ── Room-type icons ── */
const DoorIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="15" cy="12" r="1" fill={color}/>
    <path d="M5 22H19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BedIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 18V12C3 10.34 4.34 9 6 9H18C19.66 9 21 10.34 21 12V18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 18V20M21 18V20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="5" y="5" width="6" height="4" rx="1.5" stroke={color} strokeWidth="1.5"/>
    <path d="M3 12H21" stroke={color} strokeWidth="1.5"/>
  </svg>
);

const CouchIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 13V10C4 8.34 5.34 7 7 7H17C18.66 7 20 8.34 20 10V13" stroke={color} strokeWidth="1.5"/>
    <path d="M2 13C2 11.9 2.9 11 4 11V16H20V11C21.1 11 22 11.9 22 13V16H2V13Z" stroke={color} strokeWidth="1.5"/>
    <path d="M4 16V18M20 16V18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const StoveIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1.5" stroke={color} strokeWidth="1.2"/>
    <circle cx="15" cy="10" r="1.5" stroke={color} strokeWidth="1.2"/>
    <path d="M4 14H20" stroke={color} strokeWidth="1.5"/>
    <rect x="7" y="16" width="10" height="2" rx="0.5" fill={color} fillOpacity="0.2"/>
  </svg>
);

const ShowerIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 12H20V14C20 17.31 17.31 20 14 20H10C6.69 20 4 17.31 4 14V12Z" stroke={color} strokeWidth="1.5"/>
    <path d="M12 4V8M12 8C14.21 8 16 9.79 16 12H8C8 9.79 9.79 8 12 8Z" stroke={color} strokeWidth="1.5"/>
    <circle cx="10" cy="15" r="0.5" fill={color}/>
    <circle cx="12" cy="16" r="0.5" fill={color}/>
    <circle cx="14" cy="15" r="0.5" fill={color}/>
  </svg>
);

const BoxIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M3 8L5 4H19L21 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8V12H14V8" stroke={color} strokeWidth="1.5"/>
  </svg>
);

const DiningIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="6" stroke={color} strokeWidth="1.5"/>
    <path d="M6 16V20M18 16V20M9 16V20M15 16V20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const OfficeIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="10" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M8 20H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 16V20" stroke={color} strokeWidth="1.5"/>
  </svg>
);

const GarageIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 4L21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12V20H19V12" stroke={color} strokeWidth="1.5"/>
    <path d="M8 20V15H16V20" stroke={color} strokeWidth="1.5"/>
    <path d="M8 17H16" stroke={color} strokeWidth="1" strokeDasharray="2 1"/>
  </svg>
);

const CustomRoomIcon = ({ color = '#667085' }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
  </svg>
);

/* ── Map room id/name → icon ── */
const ROOM_ICON_MAP: Record<string, React.FC<{ color?: string }>> = {
  street: DoorIcon,
  bedroom: BedIcon,
  living: CouchIcon,
  kitchen: StoveIcon,
  bathroom: ShowerIcon,
  storage: BoxIcon,
  dining: DiningIcon,
  office: OfficeIcon,
  garage: GarageIcon,
};

const getRoomIcon = (roomId: string, roomName: string): React.FC<{ color?: string }> => {
  if (ROOM_ICON_MAP[roomId]) return ROOM_ICON_MAP[roomId];
  const lower = roomName.toLowerCase();
  if (lower.includes('bed')) return BedIcon;
  if (lower.includes('living') || lower.includes('lounge')) return CouchIcon;
  if (lower.includes('kitchen') || lower.includes('cook')) return StoveIcon;
  if (lower.includes('bath') || lower.includes('shower') || lower.includes('toilet')) return ShowerIcon;
  if (lower.includes('dining') || lower.includes('eat')) return DiningIcon;
  if (lower.includes('office') || lower.includes('work') || lower.includes('desk')) return OfficeIcon;
  if (lower.includes('garage') || lower.includes('park')) return GarageIcon;
  if (lower.includes('storage') || lower.includes('closet') || lower.includes('box')) return BoxIcon;
  if (lower.includes('door') || lower.includes('street') || lower.includes('entry') || lower.includes('hall')) return DoorIcon;
  return CustomRoomIcon;
};

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface RoomData {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  duration?: number;
}

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ═══════════════════════════════════════════
   Room Row
   ═══════════════════════════════════════════ */

interface RoomRowProps {
  room: RoomData;
  onPress: () => void;
  onManage?: () => void;
}

const RoomRow: React.FC<RoomRowProps> = ({ room, onPress, onManage }) => {
  const isCompleted = room.status === 'completed';
  const IconComponent = getRoomIcon(room.id, room.name);
  const iconColor = isCompleted ? '#2E90FA' : '#667085';

  return (
    <Pressable
      onPress={isCompleted ? onManage : onPress}
      style={({ pressed }) => [
        styles.roomRow,
        isCompleted && styles.roomRowCompleted,
        pressed && styles.roomRowPressed,
      ]}
    >
      {/* Icon */}
      <View style={styles.roomIconWrap}>
        {isCompleted ? (
          <View style={styles.roomIconCircleCompleted}>
            {Platform.OS === 'web' ? <IconComponent color="#2E90FA" /> : <Text variant="bodySm" color="#2E90FA">✓</Text>}
            {/* Mini check badge */}
            <View style={styles.miniBadge}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#2E90FA"/>
                <path d="M3.5 6L5.5 8L8.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </View>
          </View>
        ) : (
          <View style={styles.roomIconCircle}>
            {Platform.OS === 'web' ? <IconComponent /> : <Text variant="bodySm" color={colors.gray[400]}>●</Text>}
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.roomInfo}>
        {Platform.OS === 'web' ? (
          <>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 15, fontWeight: isCompleted ? 600 : 500,
              color: isCompleted ? '#212225' : '#212225',
              lineHeight: '20px',
            } as any}>{room.name}</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13, fontWeight: 400,
              color: isCompleted ? '#2E90FA' : colors.gray[400],
              lineHeight: '18px',
            } as any}>
              {isCompleted
                ? (room.duration && room.duration > 0 ? `Completed · ${formatDuration(room.duration)}` : 'Completed')
                : 'Tap to scan'}
            </span>
          </>
        ) : (
          <>
            <Text variant="bodySm" color="#212225">{room.name}</Text>
            <Text variant="bodySm" color={isCompleted ? '#2E90FA' : colors.gray[400]}>
              {isCompleted
                ? (room.duration && room.duration > 0 ? `Completed · ${formatDuration(room.duration)}` : 'Completed')
                : 'Tap to scan'}
            </Text>
          </>
        )}
      </View>

      {/* Right action */}
      <View style={styles.roomAction}>
        {isCompleted ? (
          Platform.OS === 'web' ? <MoreIcon /> : <Text variant="bodySm" color={colors.gray[400]}>⋮</Text>
        ) : (
          Platform.OS === 'web' ? <ChevronRightIcon /> : null
        )}
      </View>
    </Pressable>
  );
};

/* ═══════════════════════════════════════════
   Bottom Sheet
   ═══════════════════════════════════════════ */

interface BottomSheetProps {
  visible: boolean;
  roomName: string;
  onRescan: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  roomName,
  onRescan,
  onDelete,
  onCancel,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 100,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else if (rendered) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => setRendered(false));
    }
  }, [visible]);

  if (!rendered) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View style={[sheetStyles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[sheetStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={sheetStyles.handleWrap}>
          <View style={sheetStyles.handle} />
        </View>

        {/* Title */}
        <View style={sheetStyles.titleWrap}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 17, fontWeight: 600, color: '#212225',
            } as any}>{roomName}</span>
          ) : (
            <Text variant="bodySm" color="#212225">{roomName}</Text>
          )}
        </View>

        {/* Actions */}
        <View style={sheetStyles.actions}>
          <Pressable
            onPress={onRescan}
            style={({ pressed }) => [sheetStyles.actionRow, pressed && { opacity: 0.7 }]}
          >
            <View style={sheetStyles.actionIcon}>
              {Platform.OS === 'web' ? <RescanIcon /> : <Text variant="bodySm" color="#2E90FA">↻</Text>}
            </View>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16, fontWeight: 500, color: '#212225',
              } as any}>Re-scan room</span>
            ) : (
              <Text variant="bodySm" color="#212225">Re-scan room</Text>
            )}
          </Pressable>

          <View style={sheetStyles.divider} />

          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [sheetStyles.actionRow, pressed && { opacity: 0.7 }]}
          >
            <View style={sheetStyles.actionIcon}>
              {Platform.OS === 'web' ? <TrashIcon /> : <Text variant="bodySm" color="#F04438">🗑</Text>}
            </View>
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16, fontWeight: 500, color: '#F04438',
              } as any}>Delete recording</span>
            ) : (
              <Text variant="bodySm" color="#F04438">Delete recording</Text>
            )}
          </Pressable>
        </View>

        {/* Cancel */}
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [sheetStyles.cancelButton, pressed && { opacity: 0.7 }]}
        >
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 16, fontWeight: 600, color: colors.gray[500],
            } as any}>Cancel</span>
          ) : (
            <Text variant="bodySm" color={colors.gray[500]}>Cancel</Text>
          )}
        </Pressable>

        {/* Home indicator */}
        <View style={{ height: 20 }} />
      </Animated.View>
    </View>
  );
};

const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[200],
  },
  titleWrap: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  actions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
  } as any,
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginHorizontal: 16,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  } as any,
});

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

interface RoomsScreenProps {
  rooms: RoomData[];
  onScanRoom: (roomId: string) => void;
  onAddRoom: (name: string) => void;
  onRescanRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const RoomsScreen: React.FC<RoomsScreenProps> = ({
  rooms,
  onScanRoom,
  onAddRoom,
  onRescanRoom,
  onDeleteRoom,
  onContinue,
  onBack,
}) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) return <DesktopQRScreen onBack={onBack} />;
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const addInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Bottom sheet state
  const [sheetRoom, setSheetRoom] = useState<RoomData | null>(null);

  const completedCount = rooms.filter(r => r.status === 'completed').length;

  // Filter + sort: completed first, then pending
  const filteredRooms = (() => {
    let list = searchQuery.trim().length > 0
      ? rooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : rooms;
    // Sort: completed rooms first
    return [...list].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      return 0;
    });
  })();

  // Focus input when add mode starts
  useEffect(() => {
    if (isAddingRoom) {
      setTimeout(() => addInputRef.current?.focus(), 100);
    }
  }, [isAddingRoom]);

  const handleAddRoom = () => {
    const name = newRoomName.trim();
    if (name.length > 0) {
      onAddRoom(name);
      setNewRoomName('');
      setIsAddingRoom(false);
      // Scroll to the bottom so the new room is visible
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handleCancelAdd = () => {
    setNewRoomName('');
    setIsAddingRoom(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar title="Scan Rooms" onBack={onBack} />

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            {Platform.OS === 'web' && <SearchIcon />}
            <TextInput
              style={styles.searchInput}
              placeholder="Search rooms..."
              placeholderTextColor={colors.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                {Platform.OS === 'web' ? <CloseIcon /> : <Text variant="bodySm" color={colors.gray[400]}>×</Text>}
              </Pressable>
            )}
          </View>
        </View>

        {/* Room list */}
        <ScrollView ref={scrollRef} style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredRooms.map((room) => (
            <RoomRow
              key={room.id}
              room={room}
              onPress={() => onScanRoom(room.id)}
              onManage={() => setSheetRoom(room)}
            />
          ))}

          {/* Add Room — toggle between button and input */}
          {isAddingRoom ? (
            <View style={styles.addRoomInputRow}>
              <View style={styles.addRoomInputWrap}>
                <TextInput
                  ref={addInputRef}
                  style={styles.addRoomInput}
                  placeholder="Room name..."
                  placeholderTextColor={colors.gray[400]}
                  value={newRoomName}
                  onChangeText={setNewRoomName}
                  onSubmitEditing={handleAddRoom}
                  returnKeyType="done"
                />
              </View>
              <Pressable onPress={handleAddRoom} style={styles.addConfirmBtn}>
                {Platform.OS === 'web' ? (
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                  } as any}>Add</span>
                ) : (
                  <Text variant="bodySm" color="#FFF">Add</Text>
                )}
              </Pressable>
              <Pressable onPress={handleCancelAdd} style={styles.addCancelBtn} hitSlop={8}>
                {Platform.OS === 'web' ? <CloseIcon /> : <Text variant="bodySm" color={colors.gray[400]}>×</Text>}
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsAddingRoom(true)}
              style={({ pressed }) => [styles.addRoomBtn, pressed && { opacity: 0.7 }]}
            >
              <View style={styles.addRoomIconCircle}>
                {Platform.OS === 'web' ? <PlusIcon /> : <Text variant="bodySm" color="#2E90FA">+</Text>}
              </View>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 15, fontWeight: 600, color: '#2E90FA',
                  lineHeight: '20px',
                } as any}>Add Room</span>
              ) : (
                <Text variant="bodySm" color="#2E90FA">Add Room</Text>
              )}
            </Pressable>
          )}
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <Button
            title="Continue"
            variant="primary"
            onPress={onContinue}
            disabled={completedCount < 1}
          />
        </View>

        {/* Bottom sheet for completed room management */}
        <BottomSheet
          visible={sheetRoom !== null}
          roomName={sheetRoom?.name || ''}
          onRescan={() => {
            if (sheetRoom) {
              onRescanRoom(sheetRoom.id);
              setSheetRoom(null);
            }
          }}
          onDelete={() => {
            if (sheetRoom) {
              onDeleteRoom(sheetRoom.id);
              setSheetRoom(null);
            }
          }}
          onCancel={() => setSheetRoom(null)}
        />
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },

  /* Search */
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 15,
    color: '#212225',
    padding: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },

  scrollContent: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },

  /* Room row */
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 14,
    overflow: 'hidden',
  },
  roomRowCompleted: {
    backgroundColor: '#DBEAFE',
  },
  roomRowPressed: {
    opacity: 0.7,
  },

  roomIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomIconCircleCompleted: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },

  roomInfo: {
    flex: 1,
    gap: 2,
  },
  roomAction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Add room button */
  addRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 14,
  },
  addRoomIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Add room input row */
  addRoomInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addRoomInputWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  addRoomInput: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 15,
    color: '#212225',
    padding: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },
  addConfirmBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCancelBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
});
