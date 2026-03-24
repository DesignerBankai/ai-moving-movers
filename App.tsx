import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Animated, Dimensions, View, StyleSheet, Platform } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { PhoneInputScreen } from './src/screens/auth/PhoneInputScreen';
import { OTPScreen } from './src/screens/auth/OTPScreen';
import { MovingFromScreen } from './src/screens/onboarding/MovingFromScreen';
import { MovingToScreen } from './src/screens/onboarding/MovingToScreen';
import { MovingDateScreen } from './src/screens/onboarding/MovingDateScreen';
import { ContactInfoScreen } from './src/screens/onboarding/ContactInfoScreen';
import { ScanOnboardingScreen } from './src/screens/scanning/ScanOnboardingScreen';
import { ScanStepScreen } from './src/screens/scanning/ScanStepScreen';
import { CameraScreen } from './src/screens/scanning/CameraScreen';
import { RoomsScreen, RoomData } from './src/screens/scanning/RoomsScreen';
import { SpecialItemsScreen, ItemSelections } from './src/screens/inventory/SpecialItemsScreen';
import { SpecialItemDetailScreen } from './src/screens/inventory/SpecialItemDetailScreen';
import {
  SummaryScreen,
  MovingFromData,
  MovingToData,
  MovingDateData,
  ContactData,
} from './src/screens/summary/SummaryScreen';
import { AnalysisWaitingScreen } from './src/screens/analysis/AnalysisWaitingScreen';
import { TariffSelectionScreen } from './src/screens/analysis/TariffSelectionScreen';
import { TariffConfirmScreen } from './src/screens/analysis/TariffConfirmScreen';
import { HomeScreen, HomePhase } from './src/screens/home/HomeScreen';
import { HomeScreenClean } from './src/screens/home/HomeScreenClean';
import { DashboardScreen, MoveStep, ActiveMove } from './src/screens/home/DashboardScreen';
import { MoveDetailScreen, MoveDetailData, AdditionalMoveItem } from './src/screens/move/MoveDetailScreen';
import { OrdersScreen, MoveRequest, MoverOrder } from './src/screens/orders/OrdersScreen';
import { RequestDetailScreen, RequestDetailData } from './src/screens/orders/RequestDetailScreen';
import { ApplicationSentScreen } from './src/screens/orders/ApplicationSentScreen';
import { useTheme } from './src/design-system/ThemeContext';
import { DesktopLayout } from './src/components/DesktopLayout';
import { TabId } from './src/screens/home/TabBar';

/** Always uses HomeScreenClean, passes glass prop based on theme toggle */
const ThemedHomeScreen: React.FC<React.ComponentProps<typeof HomeScreenClean>> = (props) => {
  const { glassmorphism } = useTheme();
  return <HomeScreenClean {...props} glass={glassmorphism} />;
};

/** Picks the right MyMoveScreen variant based on active theme */
const ThemedMyMoveScreen: React.FC<{
  glassProps: React.ComponentProps<typeof MyMoveScreen>;
  cleanProps: React.ComponentProps<typeof MyMovesScreenClean>;
}> = ({ glassProps, cleanProps }) => {
  const { glassmorphism } = useTheme();
  return glassmorphism ? <MyMoveScreen {...glassProps} /> : <MyMovesScreenClean {...cleanProps} />;
};
import { MoverOffersScreen, MoverOffer } from './src/screens/home/MoverOffersScreen';
import { MoverDetailScreen, MoverDetailData } from './src/screens/booking/MoverDetailScreen';
import { ConfirmBookingScreen } from './src/screens/booking/ConfirmBookingScreen';
import { PaymentScreen } from './src/screens/booking/PaymentScreen';
import { BookingConfirmedScreen } from './src/screens/booking/BookingConfirmedScreen';
import { ChatListScreen, ChatContact } from './src/screens/chat/ChatListScreen';
import { ChatScreen, ChatMessage } from './src/screens/chat/ChatScreen';
import { MoveCompletedScreen } from './src/screens/booking/MoveCompletedScreen';
import { LeaveReviewScreen } from './src/screens/booking/LeaveReviewScreen';
import { MyMoveScreen } from './src/screens/move/MyMoveScreen';
import { MyMovesScreenClean } from './src/screens/move/MyMovesScreenClean';
import { ProfileScreen, ProfileMenuItem } from './src/screens/profile/ProfileScreen';
import { PersonalInfoScreen } from './src/screens/profile/PersonalInfoScreen';
import { PaymentMethodsScreen } from './src/screens/profile/PaymentMethodsScreen';
import { SavedAddressesScreen } from './src/screens/profile/SavedAddressesScreen';
import { MoveHistoryScreen } from './src/screens/profile/MoveHistoryScreen';
import { NotificationsScreen } from './src/screens/profile/NotificationsScreen';
import { HelpSupportScreen } from './src/screens/profile/HelpSupportScreen';
import { LegalScreen } from './src/screens/profile/LegalScreen';
import { SignOutModal } from './src/screens/profile/SignOutModal';
import { CompanyInfoScreen } from './src/screens/profile/CompanyInfoScreen';
import { ThemeProvider } from './src/design-system/ThemeContext';
import { ContractSigningScreen } from './src/screens/contract/ContractSigningScreen';
import { ContractsListScreen } from './src/screens/contract/ContractsListScreen';
import { createContract, type SignedContract, type ContractSignature, type InventoryItem } from './src/screens/contract/ContractGenerator';
import { RoleSelectionScreen, UserRole } from './src/screens/auth/RoleSelectionScreen';
import { CeoDashboardScreen } from './src/screens/home/CeoDashboardScreen';
import { SalesDashboardScreen } from './src/screens/home/SalesDashboardScreen';
import { ScheduleScreen, ScheduleMove } from './src/screens/schedule/ScheduleScreen';

type Screen =
  | 'login'
  | 'roleSelect'
  | 'phone'
  | 'otp'
  | 'movingFrom'
  | 'movingTo'
  | 'movingDate'
  | 'contactInfo'
  | 'scanOnboarding'
  | 'scanStep1'
  | 'scanStep2'
  | 'scanStep3'
  | 'camera'
  | 'rooms'
  | 'specialItems'
  | 'specialItemDetail'
  | 'summary'
  | 'analysisWaiting'
  | 'tariffSelection'
  | 'tariffConfirm'
  | 'dashboard'
  | 'moveDetail'
  | 'orders'
  | 'requestDetail'
  | 'applicationSent'
  | 'moverOffers'
  | 'moverDetail'
  | 'confirmBooking'
  | 'payment'
  | 'bookingConfirmed'
  | 'chatList'
  | 'chat'
  | 'moveCompleted'
  | 'leaveReview'
  | 'myMoves'
  | 'profile'
  | 'personalInfo'
  | 'paymentMethods'
  | 'savedAddresses'
  | 'moveHistory'
  | 'notifications'
  | 'helpSupport'
  | 'legal'
  | 'schedule'
  | 'contracts'
  | 'contractSigning'
  | 'companyInfo'
  | 'salesDashboard';

// Screen order for determining slide direction
const SCREEN_ORDER: Screen[] = [
  'login',
  'roleSelect',
  'phone',
  'otp',
  'movingFrom',
  'movingTo',
  'movingDate',
  'contactInfo',
  'scanOnboarding',
  'scanStep1',
  'scanStep2',
  'scanStep3',
  'camera',
  'rooms',
  'specialItems',
  'specialItemDetail',
  'summary',
  'analysisWaiting',
  'tariffSelection',
  'tariffConfirm',
  'dashboard',
  'schedule',
  'moveDetail',
  'orders',
  'requestDetail',
  'applicationSent',
  'moverOffers',
  'moverDetail',
  'confirmBooking',
  'payment',
  'bookingConfirmed',
  'chatList',
  'chat',
  'moveCompleted',
  'leaveReview',
  'myMoves',
  'profile',
  'personalInfo',
  'paymentMethods',
  'savedAddresses',
  'moveHistory',
  'notifications',
  'helpSupport',
  'legal',
  'contracts',
  'contractSigning',
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const ANIM_DURATION = 280;

// Default rooms list
const INITIAL_ROOMS: RoomData[] = [
  { id: 'street', name: 'Street to door access', status: 'pending' },
  { id: 'bedroom', name: 'Bedroom', status: 'pending' },
  { id: 'living', name: 'Living Room', status: 'pending' },
  { id: 'kitchen', name: 'Kitchen', status: 'pending' },
  { id: 'bathroom', name: 'Bathroom', status: 'pending' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const previousScreenRef = useRef<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Rooms state
  const [rooms, setRooms] = useState<RoomData[]>(INITIAL_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [cameraStartTime, setCameraStartTime] = useState<number>(0);

  // Onboarding data
  const [movingFromData, setMovingFromData] = useState<MovingFromData | null>(null);
  const [movingToData, setMovingToData] = useState<MovingToData | null>(null);
  const [movingDateData, setMovingDateData] = useState<MovingDateData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  // Special items state
  const [specialItemSelections, setSpecialItemSelections] = useState<ItemSelections>({});
  const [activeSpecialItemId, setActiveSpecialItemId] = useState<string | null>(null);

  // Edit-from-summary: when set, editing screens return to summary instead of continuing flow
  const [editingFromSummary, setEditingFromSummary] = useState<string | null>(null);

  // Tariff state
  const [selectedTariffId, setSelectedTariffId] = useState<string>('standard');

  // Home phase state
  const PHASE_ORDER: HomePhase[] = ['searching', 'offers', 'confirmed', 'moveDay', 'completed'];
  const [homePhase, setHomePhase] = useState<HomePhase>('searching');
  const [selectedMover, setSelectedMover] = useState<MoverOffer | null>(null);

  // Build detail data for the selected mover
  const moverDetailData: MoverDetailData | null = selectedMover ? {
    id: selectedMover.id,
    name: selectedMover.name,
    rating: selectedMover.rating,
    reviews: selectedMover.reviews,
    jobsCompleted: selectedMover.reviews + 42, // demo
    truck: selectedMover.truck,
    crewSize: selectedMover.crewSize,
    price: selectedMover.price,
    eta: selectedMover.eta,
    verified: true,
    includedItems: [
      'Loading & unloading',
      'Furniture disassembly & reassembly',
      'Moving blankets & padding',
      'Floor & doorway protection',
      'Basic liability coverage',
    ],
    reviewsList: [
      { author: 'Sarah M.', text: 'Amazing service! The crew was super careful with all our furniture. Highly recommend.', rating: 5, date: '2 weeks ago' },
      { author: 'James K.', text: 'Professional and on time. Made our move stress-free. Would use again.', rating: 5, date: '1 month ago' },
      { author: 'Emily R.', text: 'Good overall, arrived a bit late but made up for it with efficient work.', rating: 4, date: '2 months ago' },
    ],
  } : null;

  // Sign out modal
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Contract state
  const [contracts, setContracts] = useState<SignedContract[]>([]);
  const [activeContract, setActiveContract] = useState<SignedContract | null>(null);
  const [contractSignedForMove, setContractSignedForMove] = useState(false);
  const [showContractPrompt, setShowContractPrompt] = useState(false);
  const [contractReturnScreen, setContractReturnScreen] = useState<'dashboard' | 'contracts' | 'schedule'>('dashboard');

  // Additional items/services added by mover to active move
  const [additionalMoveItems, setAdditionalMoveItems] = useState<AdditionalMoveItem[]>([]);

  const handleAddMoveItem = (item: AdditionalMoveItem) => {
    setAdditionalMoveItems(prev => [...prev, item]);
  };

  const handleRemoveMoveItem = (id: string) => {
    setAdditionalMoveItems(prev => prev.filter(i => i.id !== id));
  };

  // ── Mover Dashboard: Active move + step management ──
  const MOVE_STEPS: MoveStep[] = [
    'accepted', 'en_route_pickup', 'arrived_pickup', 'loading',
    'en_route_delivery', 'arrived_delivery', 'unloading', 'completed',
  ];

  const [activeMove, setActiveMove] = useState<ActiveMove | null>({
    id: 'move1',
    client: 'Sarah Johnson',
    from: '123 Main St, Brooklyn',
    to: '456 Park Ave, Manhattan',
    date: 'Mar 8',
    time: '10:00 AM',
    rooms: 3,
    price: 1200,
    step: 'accepted',
  });

  const advanceMoveStep = () => {
    if (!activeMove) return;
    const idx = MOVE_STEPS.indexOf(activeMove.step);
    if (idx < MOVE_STEPS.length - 1) {
      const nextStep = MOVE_STEPS[idx + 1];

      // Block advancing past arrived_pickup until contract is signed
      // (the "Sign Contract" button handles navigation separately)
      if (activeMove.step === 'arrived_pickup' && !contractSignedForMove) {
        return;
      }

      setActiveMove({ ...activeMove, step: nextStep });
    }
  };

  /** Called when mover taps "Sign Contract" button on Dashboard */
  const handleSignContract = () => {
    if (!activeMove) return;
    // Generate contract if not already created for this move
    if (!activeContract) {
      // Build inventory from move detail rooms
      const inventoryItems: InventoryItem[] = [];
      if (activeMoveDetail?.rooms) {
        activeMoveDetail.rooms.forEach(room => {
          room.items.forEach(item => {
            inventoryItems.push({
              id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: item.name,
              quantity: item.qty,
              room: room.name,
              tag: item.tag as 'Large' | 'Fragile' | 'Heavy' | undefined,
            });
          });
        });
      }

      const contract = createContract(
        {
          fullName: activeMove.client,
          email: 'client@email.com',
          phone: '+1 (555) 234-5678',
        },
        {
          fullName: contactData?.fullName || 'Dmitriy',
          companyName: 'AI Moving Co.',
          email: contactData?.email || 'mover@aimoving.com',
          phone: phoneNumber || '+1 (555) 000-0000',
          license: 'CA-PUC-T-190847',
          insurancePolicy: 'INS-2026-0482',
        },
        {
          fromAddress: activeMove.from,
          toAddress: activeMove.to,
          moveDate: activeMove.date,
          planName: 'Standard',
          totalPrice: activeMove.price,
          depositPaid: Math.round(activeMove.price * 0.2),
          truckSize: '20ft truck',
          crewSize: 2,
          estimatedDuration: '4–6 hours',
          itemsCount: inventoryItems.reduce((s, i) => s + i.quantity, 0) || 47,
          inventory: inventoryItems,
          additionalCharges: additionalMoveItems.map(ai => ({
            id: ai.id,
            type: ai.type,
            name: ai.name,
            price: ai.price,
          })),
        },
      );
      setActiveContract(contract);
      setContracts(prev => [...prev, contract]);
    }
    setContractReturnScreen(userRole === 'mover' ? 'schedule' : 'dashboard');
    navigateTo('contractSigning');
  };

  const MOVER_STATS = { rating: 4.9, completedMoves: 47, earnings: 12840 };

  const MOVER_ACTIVITY = [
    { id: 'a1', text: 'Move completed for Alex Rivera', time: '2h ago', type: 'completed' as const },
    { id: 'a2', text: 'New review: 5 stars from Lisa Park', time: '5h ago', type: 'review' as const },
    { id: 'a3', text: 'Payment received: $1,120', time: 'Yesterday', type: 'payment' as const },
    { id: 'a4', text: 'New order from Mike Chen', time: 'Yesterday', type: 'new_order' as const },
  ];

  // Build full detail data for the active move
  const activeMoveDetail: MoveDetailData | null = activeMove ? {
    ...activeMove,
    roomsCount: activeMove.rooms,
    clientPhone: '+1 (555) 234-5678',
    clientEmail: 'sarah.j@email.com',
    fromApt: '4B',
    fromFloor: '4',
    fromElevator: true,
    toApt: '12A',
    toFloor: '12',
    toElevator: true,
    distance: '12.4 mi',
    estimatedTime: '~35 min',
    totalVolume: '380 cu ft',
    totalItems: 47,
    rooms: [
      { name: 'Living Room', items: [
        { name: 'Sofa (3-seater)', qty: 1, tag: 'Large' },
        { name: 'Coffee Table', qty: 1 },
        { name: 'TV Stand', qty: 1 },
        { name: 'TV 55"', qty: 1, tag: 'Fragile' },
        { name: 'Bookshelf', qty: 1, tag: 'Large' },
        { name: 'Floor Lamp', qty: 2 },
        { name: 'Boxes (misc.)', qty: 4 },
      ]},
      { name: 'Bedroom', items: [
        { name: 'Queen Bed Frame', qty: 1, tag: 'Large' },
        { name: 'Mattress (Queen)', qty: 1, tag: 'Large' },
        { name: 'Nightstand', qty: 2 },
        { name: 'Dresser', qty: 1, tag: 'Large' },
        { name: 'Mirror', qty: 1, tag: 'Fragile' },
        { name: 'Boxes (clothes)', qty: 5 },
      ]},
      { name: 'Kitchen', items: [
        { name: 'Dining Table', qty: 1, tag: 'Large' },
        { name: 'Dining Chairs', qty: 4 },
        { name: 'Microwave', qty: 1 },
        { name: 'Boxes (kitchenware)', qty: 6, tag: 'Fragile' },
      ]},
      { name: 'Bathroom', items: [
        { name: 'Storage Cabinet', qty: 1 },
        { name: 'Boxes (toiletries)', qty: 2 },
      ]},
      { name: 'Office', items: [
        { name: 'Desk', qty: 1, tag: 'Large' },
        { name: 'Office Chair', qty: 1 },
        { name: 'Monitor 27"', qty: 1, tag: 'Fragile' },
        { name: 'Printer', qty: 1 },
        { name: 'Boxes (books & docs)', qty: 4 },
      ]},
    ],
    specialItems: [
      { name: 'Piano', quantity: 1, note: 'Grand piano — needs 3 people' },
      { name: 'Large Mirror', quantity: 2, note: 'Fragile, wrap carefully' },
      { name: 'Aquarium', quantity: 1, note: '55 gallon, drain before move' },
    ],
    depositPaid: 240,
    notes: 'Please be careful with the antique dresser in the bedroom. The dog will be in the bathroom during the move. Ring doorbell on arrival.',
    planName: 'Standard',
  } : null;

  // ── Orders mock data ──
  const mockRequests: MoveRequest[] = [
    { id: 'r1', client: 'Emily Chen', from: '88 Warren St, Tribeca', to: '412 Atlantic Ave, Park Slope', date: 'Mar 12', rooms: 2, estimatedPrice: 890, distance: '8.2 mi', volume: '240 cu ft', postedAgo: '12 min ago' },
    { id: 'r2', client: 'Marcus Williams', from: '205 W 95th St, Upper West Side', to: '1100 Grand Concourse, Bronx', date: 'Mar 14', rooms: 4, estimatedPrice: 1650, distance: '14.7 mi', volume: '480 cu ft', postedAgo: '1 hr ago' },
    { id: 'r3', client: 'Priya Patel', from: '56-12 Queens Blvd, Woodside', to: '320 E 54th St, Midtown', date: 'Mar 15', rooms: 1, estimatedPrice: 520, distance: '6.1 mi', volume: '150 cu ft', postedAgo: '3 hrs ago' },
  ];

  const mockOrders: MoverOrder[] = [
    { id: 'o1', client: 'Sarah Johnson', from: '123 Main St, Brooklyn', to: '456 Park Ave, Manhattan', date: 'Mar 8', status: 'inProgress', earnings: 1200, planName: 'Standard', distance: '11.3 mi', volume: '380 cu ft' },
    { id: 'o2', client: 'David Kim', from: '789 Broadway, Manhattan', to: '321 Court St, Brooklyn', date: 'Mar 10', status: 'accepted', earnings: 950, planName: 'Standard', distance: '5.8 mi', volume: '220 cu ft' },
    { id: 'o3', client: 'Lisa Thompson', from: '44 Wall St, Manhattan', to: '55 Water St, Brooklyn', date: 'Feb 28', status: 'completed', earnings: 1100, planName: 'Premium', distance: '9.4 mi', volume: '510 cu ft' },
    { id: 'o4', client: 'James Brown', from: '100 W 72nd St, Manhattan', to: '250 Bedford Ave, Brooklyn', date: 'Feb 20', status: 'completed', earnings: 780, planName: 'Standard', distance: '7.1 mi', volume: '180 cu ft' },
  ];

  // ── Schedule mock data (keyed by YYYY-MM-DD) ──
  // Active move syncs its step from the main activeMove state
  const mockScheduleMoves: Record<string, ScheduleMove[]> = {
    '2026-03-20': [
      {
        id: 's1', client: 'Sarah Johnson', from: '123 Main St, Brooklyn', to: '456 Park Ave, Manhattan',
        time: '10:00 AM', rooms: 3, estimatedHours: 4,
        status: 'completed',
        phone: '+1 (212) 555-0142',
        floor: 3, elevator: true, distance: '11.3 mi',
      },
      { id: 's2', client: 'Mike Rivera', from: '789 Broadway, Manhattan', to: '321 Court St, Brooklyn', time: '3:00 PM', rooms: 2, estimatedHours: 2.5, status: 'completed', phone: '+1 (718) 555-0198', floor: 2, elevator: true, distance: '5.8 mi' },
    ],
    '2026-03-21': [
      { id: 's3', client: 'Emily Chen', from: '88 Warren St, Tribeca', to: '412 Atlantic Ave, Park Slope', time: '9:00 AM', rooms: 2, estimatedHours: 3, status: 'completed', phone: '+1 (917) 555-0167', floor: 3, elevator: false, distance: '8.2 mi' },
      { id: 's4', client: 'Marcus Williams', from: '205 W 95th St, UWS', to: '1100 Grand Concourse, Bronx', time: '1:00 PM', rooms: 4, estimatedHours: 5, status: 'completed', phone: '+1 (347) 555-0213', floor: 8, elevator: true, distance: '14.7 mi' },
      { id: 's5', client: 'Priya Patel', from: '56-12 Queens Blvd', to: '320 E 54th St, Midtown', time: '6:00 PM', rooms: 1, estimatedHours: 1.5, status: 'completed', phone: '+1 (646) 555-0089', floor: 1, elevator: true, distance: '6.1 mi' },
    ],
    '2026-03-23': [
      {
        id: 's6', client: 'David Kim', from: '100 W 72nd St, Manhattan', to: '250 Bedford Ave, Brooklyn',
        time: '11:00 AM', rooms: 2, estimatedHours: 3,
        status: activeMove?.step === 'completed' ? 'completed' : 'in_progress',
        phone: '+1 (212) 555-0305',
        step: activeMove?.step,
        floor: 5, elevator: false, distance: '7.1 mi',
      },
    ],
    '2026-03-19': [
      { id: 's7', client: 'Lisa Thompson', from: '44 Wall St, Manhattan', to: '55 Water St, Brooklyn', time: '10:00 AM', rooms: 3, estimatedHours: 4, status: 'completed', floor: 6, elevator: true, distance: '9.4 mi' },
    ],
    '2026-03-24': [
      { id: 's8', client: 'Anna Lee', from: '350 5th Ave, Midtown', to: '180 Montague St, Brooklyn Heights', time: '9:30 AM', rooms: 3, estimatedHours: 4, status: 'upcoming', phone: '+1 (917) 555-0411', floor: 12, elevator: true, distance: '10.5 mi' },
      { id: 's9', client: 'Tom Harris', from: '55 Prospect Park W', to: '401 E 60th St, UES', time: '2:00 PM', rooms: 1, estimatedHours: 2, status: 'upcoming', phone: '+1 (646) 555-0322', floor: 4, elevator: false, distance: '8.8 mi' },
    ],
  };

  // ── Request detail data (keyed by request id) ──
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const requestDetails: Record<string, RequestDetailData> = {
    r1: {
      id: 'r1', client: 'Emily Chen',
      from: '88 Warren St, Tribeca', to: '412 Atlantic Ave, Park Slope',
      fromApt: '3A', fromFloor: '3', fromElevator: true,
      toApt: '1B', toFloor: '1', toElevator: false,
      date: 'Mar 12', time: '9:00 AM', rooms: 2, estimatedPrice: 890,
      distance: '8.2 mi', estimatedTime: '~25 min', postedAgo: '12 min ago',
      totalItems: 28, totalVolume: '220 cu ft', planName: 'Standard',
      inventory: [
        { name: 'Living Room', items: [
          { name: 'Sofa (2-seater)', qty: 1, tag: 'Large' },
          { name: 'TV 50"', qty: 1, tag: 'Fragile' },
          { name: 'Coffee Table', qty: 1 },
          { name: 'Boxes (misc.)', qty: 6 },
        ]},
        { name: 'Bedroom', items: [
          { name: 'Queen Bed Frame', qty: 1, tag: 'Large' },
          { name: 'Mattress (Queen)', qty: 1, tag: 'Large' },
          { name: 'Nightstand', qty: 1 },
          { name: 'Boxes (clothes)', qty: 4 },
        ]},
      ],
      notes: 'Building has no loading dock — use side entrance on Warren St. Doorman available until 6 PM.',
    },
    r2: {
      id: 'r2', client: 'Marcus Williams',
      from: '205 W 95th St, Upper West Side', to: '1100 Grand Concourse, Bronx',
      fromApt: '8F', fromFloor: '8', fromElevator: true,
      toApt: '4C', toFloor: '4', toElevator: true,
      date: 'Mar 14', time: '11:00 AM', rooms: 4, estimatedPrice: 1650,
      distance: '14.7 mi', estimatedTime: '~45 min', postedAgo: '1 hr ago',
      totalItems: 62, totalVolume: '580 cu ft', planName: 'Standard',
      inventory: [
        { name: 'Living Room', items: [
          { name: 'Sectional Sofa', qty: 1, tag: 'Large' },
          { name: 'Entertainment Center', qty: 1, tag: 'Large' },
          { name: 'TV 65"', qty: 1, tag: 'Fragile' },
          { name: 'Floor Lamp', qty: 2 },
          { name: 'Boxes (misc.)', qty: 5 },
        ]},
        { name: 'Bedroom', items: [
          { name: 'King Bed Frame', qty: 1, tag: 'Large' },
          { name: 'Mattress (King)', qty: 1, tag: 'Large' },
          { name: 'Dresser', qty: 1, tag: 'Large' },
          { name: 'Nightstand', qty: 2 },
          { name: 'Boxes (clothes)', qty: 8 },
        ]},
        { name: 'Kitchen', items: [
          { name: 'Dining Table', qty: 1, tag: 'Large' },
          { name: 'Dining Chairs', qty: 6 },
          { name: 'Microwave', qty: 1 },
          { name: 'Boxes (kitchenware)', qty: 7, tag: 'Fragile' },
        ]},
        { name: 'Office', items: [
          { name: 'Desk', qty: 1, tag: 'Large' },
          { name: 'Office Chair', qty: 1 },
          { name: 'Bookshelf', qty: 2, tag: 'Large' },
          { name: 'Boxes (books)', qty: 6 },
        ]},
      ],
      notes: 'Two large dogs in the apartment — will be kenneled during move. Grand piano in living room needs special handling.',
    },
    r3: {
      id: 'r3', client: 'Priya Patel',
      from: '56-12 Queens Blvd, Woodside', to: '320 E 54th St, Midtown',
      fromApt: '2D', fromFloor: '2', fromElevator: false,
      toApt: '10A', toFloor: '10', toElevator: true,
      date: 'Mar 15', time: '8:00 AM', rooms: 1, estimatedPrice: 520,
      distance: '6.1 mi', estimatedTime: '~30 min', postedAgo: '3 hrs ago',
      totalItems: 15, totalVolume: '120 cu ft', planName: 'Standard',
      inventory: [
        { name: 'Bedroom', items: [
          { name: 'Full Bed Frame', qty: 1, tag: 'Large' },
          { name: 'Mattress (Full)', qty: 1 },
          { name: 'Desk', qty: 1 },
          { name: 'Office Chair', qty: 1 },
          { name: 'Boxes (misc.)', qty: 8 },
        ]},
      ],
      notes: 'Studio apartment — all items in one room. Narrow staircase at pickup, no elevator.',
    },
  };

  const selectedRequest = selectedRequestId ? requestDetails[selectedRequestId] ?? null : null;

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Build chat contacts from active orders (mover talks to clients)
  const chatContacts: ChatContact[] = [
    {
      id: 'c-sarah',
      name: 'Sarah Johnson',
      lastMessage: 'Will you arrive on time?',
      time: '11:42 AM',
      unread: 2,
      online: true,
    },
    {
      id: 'c-david',
      name: 'David Kim',
      lastMessage: 'Great, see you on the 10th!',
      time: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 'c-support',
      name: 'AI Moving Support',
      lastMessage: 'Your documents have been verified.',
      time: 'Mon',
      unread: 0,
      online: true,
    },
  ];

  const DEMO_MESSAGES: ChatMessage[] = [
    { id: 'm1', text: 'Hi! I saw you accepted my move request. When can I expect you?', fromMe: false, time: '11:30 AM' },
    { id: 'm2', text: 'Hello Sarah! We\'ll be there at 10 AM sharp with a 3-person crew.', fromMe: true, time: '11:32 AM' },
    { id: 'm3', text: 'Should I have everything boxed up by then?', fromMe: false, time: '11:35 AM' },
    { id: 'm4', text: 'That would be great! Label any fragile items and we\'ll take care of the rest.', fromMe: true, time: '11:37 AM' },
    { id: 'm5', text: 'Perfect. What about the piano? It\'s pretty heavy.', fromMe: false, time: '11:39 AM' },
    { id: 'm6', text: 'No worries — we have specialized equipment for that. We\'ll wrap and strap it properly.', fromMe: true, time: '11:40 AM' },
    { id: 'm7', text: 'Will you arrive on time?', fromMe: false, time: '11:42 AM' },
  ];

  const advanceHomePhase = () => {
    const idx = PHASE_ORDER.indexOf(homePhase);
    if (idx < PHASE_ORDER.length - 1) {
      const next = PHASE_ORDER[idx + 1];
      setHomePhase(next);
      // When phase becomes 'completed', jump to move completed screen
      if (next === 'completed') {
        navigateTo('moveCompleted');
      }
    }
  };
  const retreatHomePhase = () => {
    const idx = PHASE_ORDER.indexOf(homePhase);
    if (idx > 0) {
      setHomePhase(PHASE_ORDER[idx - 1]);
    } else {
      navigateTo('tariffConfirm');
    }
  };

  // Animation
  const [displayedScreen, setDisplayedScreen] = useState<Screen>('login');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  const navigateTo = (next: Screen) => {
    previousScreenRef.current = currentScreen;
    if (isAnimating.current || next === currentScreen) {
      setCurrentScreen(next);
      setDisplayedScreen(next);
      return;
    }

    isAnimating.current = true;

    const currentIdx = SCREEN_ORDER.indexOf(currentScreen);
    const nextIdx = SCREEN_ORDER.indexOf(next);
    const isForward = nextIdx > currentIdx;

    // Phase 1: slide current screen out + fade
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isForward ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3,
        duration: ANIM_DURATION,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: ANIM_DURATION * 0.6,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setCurrentScreen(next);
      setDisplayedScreen(next);

      slideAnim.setValue(isForward ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_DURATION,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIM_DURATION * 0.7,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    });
  };

  // Start camera for a specific room
  const startCameraForRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setCameraStartTime(Date.now());
    navigateTo('camera');
  };

  // Finish recording for the active room
  const finishRoomRecording = () => {
    if (activeRoomId) {
      const duration = Math.round((Date.now() - cameraStartTime) / 1000);
      setRooms(prev => prev.map(r =>
        r.id === activeRoomId ? { ...r, status: 'completed' as const, duration } : r
      ));
      setActiveRoomId(null);
    }
    navigateTo('rooms');
  };

  // Add a new custom room with a given name
  const addRoom = (name: string) => {
    const id = `custom_${Date.now()}`;
    setRooms(prev => [...prev, { id, name, status: 'pending' }]);
  };

  // Discard current recording (camera X button)
  const discardRecording = () => {
    setActiveRoomId(null);
    navigateTo('rooms');
  };

  // Re-scan a completed room (reset to pending, open camera)
  const rescanRoom = (roomId: string) => {
    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, status: 'pending' as const, duration: undefined } : r
    ));
    startCameraForRoom(roomId);
  };

  // Delete a room's recording (reset to pending)
  const deleteRoomRecording = (roomId: string) => {
    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, status: 'pending' as const, duration: undefined } : r
    ));
  };

  // Sync displayedScreen on first render
  useEffect(() => {
    setDisplayedScreen(currentScreen);
  }, []);

  // Camera navbar title based on active room
  const cameraTitle = activeRoomId
    ? rooms.find(r => r.id === activeRoomId)?.name || 'Scanning'
    : 'Scanning';

  const renderScreen = () => {
    switch (displayedScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={(login, pass) => {
              console.log('Login:', login);
              setHomePhase('searching');
              navigateTo('roleSelect');
            }}
            onForgotPassword={() => navigateTo('phone')}
          />
        );

      case 'roleSelect':
        return (
          <RoleSelectionScreen
            userName={contactData?.fullName || 'User'}
            onSelectRole={(role) => {
              setUserRole(role);
              if (role === 'mover') {
                navigateTo('schedule');
              } else if (role === 'sales') {
                navigateTo('salesDashboard');
              } else {
                navigateTo('dashboard');
              }
            }}
          />
        );

      // --- Login flow ---
      case 'phone':
        return (
          <PhoneInputScreen
            onSendCode={(phone) => {
              setPhoneNumber(phone);
              navigateTo('otp');
            }}
            onBack={() => navigateTo('login')}
          />
        );
      case 'otp':
        return (
          <OTPScreen
            phoneNumber={phoneNumber}
            onConfirm={(code) => {
              console.log('OTP confirmed:', code);
              setHomePhase('searching');
              navigateTo('dashboard');
            }}
            onResendCode={() => {
              console.log('Resend code');
            }}
            onBack={() => navigateTo('phone')}
          />
        );

      // --- Onboarding flow ---
      case 'movingFrom':
        return (
          <MovingFromScreen
            onContinue={(data) => {
              setMovingFromData(data);
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('movingTo');
              }
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('login');
              }
            }}
          />
        );
      case 'movingTo':
        return (
          <MovingToScreen
            onContinue={(data) => {
              setMovingToData(data);
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('movingDate');
              }
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('movingFrom');
              }
            }}
          />
        );
      case 'movingDate':
        return (
          <MovingDateScreen
            onContinue={(data) => {
              setMovingDateData(data);
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('contactInfo');
              }
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('movingTo');
              }
            }}
          />
        );
      case 'contactInfo':
        return (
          <ContactInfoScreen
            onContinue={(data) => {
              setContactData(data);
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('scanOnboarding');
              }
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('movingDate');
              }
            }}
          />
        );

      // --- Scanning flow ---
      case 'scanOnboarding':
        return (
          <ScanOnboardingScreen
            onStartScanning={() => navigateTo('scanStep1')}
            onBack={() => navigateTo('contactInfo')}
          />
        );
      case 'scanStep1':
        return (
          <ScanStepScreen
            step={1}
            onNext={() => navigateTo('scanStep2')}
            onBack={() => navigateTo('scanOnboarding')}
          />
        );
      case 'scanStep2':
        return (
          <ScanStepScreen
            step={2}
            onNext={() => navigateTo('scanStep3')}
            onBack={() => navigateTo('scanStep1')}
          />
        );
      case 'scanStep3':
        return (
          <ScanStepScreen
            step={3}
            onNext={() => {
              // First recording is always "Street to door access"
              startCameraForRoom('street');
            }}
            onBack={() => navigateTo('scanStep2')}
          />
        );
      case 'camera':
        return (
          <CameraScreen
            title={cameraTitle}
            onFinish={finishRoomRecording}
            onDiscard={discardRecording}
            onBack={() => navigateTo('rooms')}
          />
        );
      case 'rooms':
        return (
          <RoomsScreen
            rooms={rooms}
            onScanRoom={(roomId) => startCameraForRoom(roomId)}
            onAddRoom={(name) => addRoom(name)}
            onRescanRoom={(roomId) => rescanRoom(roomId)}
            onDeleteRoom={(roomId) => deleteRoomRecording(roomId)}
            onContinue={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('specialItems');
              }
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('scanOnboarding');
              }
            }}
          />
        );

      // --- Special Items ---
      case 'specialItems':
        return (
          <SpecialItemsScreen
            selections={specialItemSelections}
            onSelectItem={(itemId) => {
              setActiveSpecialItemId(itemId);
              navigateTo('specialItemDetail');
            }}
            onContinue={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
              }
              navigateTo('summary');
            }}
            onBack={() => {
              if (editingFromSummary) {
                setEditingFromSummary(null);
                navigateTo('summary');
              } else {
                navigateTo('rooms');
              }
            }}
          />
        );
      case 'specialItemDetail':
        return activeSpecialItemId ? (
          <SpecialItemDetailScreen
            itemId={activeSpecialItemId}
            initialSelections={specialItemSelections[activeSpecialItemId]}
            onSave={(itemId, selections) => {
              setSpecialItemSelections(prev => ({ ...prev, [itemId]: selections }));
              navigateTo('specialItems');
            }}
            onRemove={(itemId) => {
              setSpecialItemSelections(prev => {
                const next = { ...prev };
                delete next[itemId];
                return next;
              });
              navigateTo('specialItems');
            }}
            onBack={() => navigateTo('specialItems')}
          />
        ) : null;

      // --- Analysis & Tariff flow ---
      case 'analysisWaiting':
        return (
          <AnalysisWaitingScreen
            onSkip={() => navigateTo('tariffSelection')}
            onBack={() => navigateTo('summary')}
            onAnalysisComplete={() => navigateTo('tariffSelection')}
          />
        );
      case 'tariffSelection':
        return (
          <TariffSelectionScreen
            userName={contactData?.fullName?.split(' ')[0] || 'Dmitriy'}
            estimatePrice={1340}
            onSelectTariff={(tariffId) => {
              setSelectedTariffId(tariffId);
              navigateTo('tariffConfirm');
            }}
            onBack={() => navigateTo('analysisWaiting')}
          />
        );
      case 'tariffConfirm':
        return (
          <TariffConfirmScreen
            tariffId={selectedTariffId}
            estimatePrice={1340}
            onConfirm={() => {
              setHomePhase('searching');
              navigateTo('dashboard');
            }}
            onBack={() => navigateTo('tariffSelection')}
            onChangePlan={() => navigateTo('tariffSelection')}
          />
        );

      // --- Dashboard (role-aware) ---
      case 'dashboard':
        // CEO gets enhanced analytics dashboard
        if (userRole === 'ceo') {
          return (
            <CeoDashboardScreen
              onTabPress={(tab) => {
                if (tab === 'chat') navigateTo('chatList');
                else if (tab === 'myMoves') navigateTo('orders');
                else if (tab === 'schedule') navigateTo('schedule');
                else if (tab === 'profile') navigateTo('profile');
              }}
              onBack={() => navigateTo('roleSelect')}
            />
          );
        }
        // Mover gets standard dashboard
        return (
          <DashboardScreen
            userName={contactData?.fullName?.split(' ')[0] || 'Dmitriy'}
            activeMove={activeMove}
            stats={MOVER_STATS}
            activity={MOVER_ACTIVITY}
            onAdvanceStep={advanceMoveStep}
            onViewMoveDetails={() => navigateTo('moveDetail')}
            onCallClient={() => console.log('Call client')}
            onChatClient={() => {
              setActiveChatId(activeMove?.id || '1');
              navigateTo('chat');
            }}
            onTabPress={(tab) => {
              if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'myMoves') navigateTo('orders');
              else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'profile') navigateTo('profile');
            }}
            onNotifications={() => {
              navigateTo('notifications');
            }}
            contractPending={activeMove?.step === 'arrived_pickup' && !contractSignedForMove}
            onSignContract={handleSignContract}
            role={userRole || undefined}
          />
        );
      case 'salesDashboard':
        return (
          <SalesDashboardScreen
            onTabPress={(tab) => {
              if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'myMoves') navigateTo('orders');
              else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'profile') navigateTo('profile');
            }}
            onBack={() => navigateTo('roleSelect')}
          />
        );
      case 'moveDetail':
        return activeMoveDetail ? (
          <MoveDetailScreen
            move={activeMoveDetail}
            onAdvanceStep={advanceMoveStep}
            onCallClient={() => console.log('Call client')}
            onChatClient={() => {
              setActiveChatId(activeMove?.id || '1');
              navigateTo('chat');
            }}
            onBack={() => {
              const prev = previousScreenRef.current;
              navigateTo(prev === 'schedule' ? 'schedule' : 'dashboard');
            }}
            additionalItems={additionalMoveItems}
            onAddItem={activeMove?.step !== 'completed' ? handleAddMoveItem : undefined}
            onRemoveItem={activeMove?.step !== 'completed' ? handleRemoveMoveItem : undefined}
            role={userRole || undefined}
          />
        ) : null;
      case 'schedule':
        return (
          <ScheduleScreen
            movesByDate={mockScheduleMoves}
            onTabPress={(tab) => {
              if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
              else if (tab === 'schedule') { /* already here */ }
              else if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'profile') navigateTo('profile');
            }}
            onMovePress={(moveId) => {
              navigateTo('moveDetail');
            }}
            onAdvanceStep={advanceMoveStep}
            onCallClient={(phone) => console.log('Call client:', phone)}
            onChatClient={(moveId) => {
              setActiveChatId(moveId);
              navigateTo('chat');
            }}
            contractPending={activeMove?.step === 'arrived_pickup' && !contractSignedForMove}
            onSignContract={handleSignContract}
            role={userRole || undefined}
          />
        );
      case 'orders':
        return (
          <OrdersScreen
            requests={mockRequests}
            orders={mockOrders}
            onTabPress={(tab) => {
              if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
              else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'profile') navigateTo('profile');
            }}
            onBack={() => navigateTo('dashboard')}
            onApplyRequest={(id) => {
              setSelectedRequestId(id);
              navigateTo('requestDetail');
            }}
            onViewRequest={(id) => {
              setSelectedRequestId(id);
              navigateTo('requestDetail');
            }}
            onSelectOrder={(id) => navigateTo('moveDetail')}
            role={userRole || undefined}
          />
        );
      case 'requestDetail':
        return selectedRequest ? (
          <RequestDetailScreen
            request={selectedRequest}
            onApply={(id) => {
              navigateTo('applicationSent');
            }}
            onBack={() => navigateTo('orders')}
          />
        ) : null;
      case 'applicationSent':
        return selectedRequest ? (
          <ApplicationSentScreen
            clientName={selectedRequest.client}
            onViewOrders={() => navigateTo('orders')}
            onBackToDashboard={() => navigateTo('dashboard')}
          />
        ) : null;
      case 'moverOffers':
        return (
          <MoverOffersScreen
            onSelectMover={(offer) => {
              setSelectedMover(offer);
              navigateTo('moverDetail');
            }}
            onBack={() => navigateTo('dashboard')}
          />
        );
      case 'moverDetail':
        return moverDetailData ? (
          <MoverDetailScreen
            mover={moverDetailData}
            onChoose={() => navigateTo('confirmBooking')}
            onBack={() => navigateTo('moverOffers')}
          />
        ) : null;
      case 'confirmBooking':
        return (
          <ConfirmBookingScreen
            moverName={selectedMover?.name || 'SOS Moving Co.'}
            moverRating={selectedMover?.rating || 4.9}
            moverReviews={selectedMover?.reviews || 312}
            fromAddress={movingFromData?.address || '123 Main St, Apt 4'}
            toAddress={movingToData?.address || '456 Oak Ave, Unit 2'}
            moveDate={movingDateData?.date ? movingDateData.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'March 15, 2026'}
            planName={selectedTariffId.charAt(0).toUpperCase() + selectedTariffId.slice(1)}
            totalPrice={selectedMover?.price || 1340}
            onPayDeposit={() => navigateTo('payment')}
            onBack={() => navigateTo('moverDetail')}
          />
        );
      case 'payment': {
        const moveDate = movingDateData?.date || new Date(Date.now() + 30 * 86400000);
        const daysUntil = Math.max(0, Math.ceil((moveDate.getTime() - Date.now()) / 86400000));
        const moveDateLabel = moveDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        return (
          <PaymentScreen
            offerPrice={selectedMover?.price || 1340}
            moveDateStr={moveDateLabel}
            daysUntilMove={daysUntil}
            onPay={() => {
              setHomePhase('confirmed');
              navigateTo('bookingConfirmed');
            }}
            onBack={() => navigateTo('dashboard')}
          />
        );
      }
      case 'bookingConfirmed': {
        const offerPrice = selectedMover?.price || 1340;
        const moveDt = movingDateData?.date || new Date(Date.now() + 30 * 86400000);
        const daysUntil = Math.max(0, Math.ceil((moveDt.getTime() - Date.now()) / 86400000));
        const isFullPay = daysUntil <= 2;
        const deposit = isFullPay ? offerPrice : Math.round(offerPrice * 0.2);
        const remaining = offerPrice - deposit;
        const moveDateLabel = moveDt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const dayBefore = new Date(moveDt.getTime() - 86400000);
        const remainPayDate = isFullPay ? 'paid in full' : dayBefore.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <BookingConfirmedScreen
            moverName={selectedMover?.name || 'SOS Moving Co.'}
            moveDate={moveDateLabel}
            depositAmount={deposit}
            remainingAmount={remaining}
            totalAmount={offerPrice}
            remainingPayDate={remainPayDate}
            onChatWithMover={() => {
              setHomePhase('confirmed');
              setActiveChatId(selectedMover?.id || null);
              navigateTo('chat');
            }}
            onViewDetails={() => {
              setHomePhase('confirmed');
              navigateTo('dashboard');
            }}
            onBack={() => navigateTo('payment')}
          />
        );
      }

      // --- Chat ---
      case 'chatList':
        return (
          <ChatListScreen
            contacts={chatContacts}
            onOpenChat={(contactId) => {
              setActiveChatId(contactId);
              navigateTo('chat');
            }}
            onTabPress={(tab) => {
              if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
              else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'myMoves') navigateTo('orders');
              else if (tab === 'profile') navigateTo('profile');
            }}
            onBack={() => navigateTo('dashboard')}
            role={userRole || undefined}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            contactName={chatContacts.find(c => c.id === activeChatId)?.name || 'Sarah Johnson'}
            contactOnline={chatContacts.find(c => c.id === activeChatId)?.online || false}
            initialMessages={DEMO_MESSAGES}
            onBack={() => navigateTo('chatList')}
          />
        );

      // --- My Move (tab) ---
      case 'myMoves': {
        const moveStatus = homePhase === 'completed' ? 'completed' as const
          : homePhase === 'moveDay' ? 'inProgress' as const
          : (homePhase === 'confirmed' && selectedMover) ? 'booked' as const
          : 'searching' as const;
        const moveTabPress = (tab: any) => {
          if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
          else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'chat') navigateTo('chatList');
          else if (tab === 'profile') navigateTo('profile');
        };
        const moveDateStr = movingDateData?.date
          ? movingDateData.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : 'March 15, 2026';
        const movePlanName = selectedTariffId.charAt(0).toUpperCase() + selectedTariffId.slice(1);
        const movePrice = selectedMover?.price || (selectedTariffId === 'standard' ? 1140 : selectedTariffId === 'premium' ? 1540 : 1340);

        return (
          <ThemedMyMoveScreen
            /* Glass variant props */
            glassProps={{
              status: moveStatus,
              fromAddress: movingFromData?.address || '123 Main St, Apt 4',
              toAddress: movingToData?.address || '456 Oak Ave, Unit 2',
              moveDate: moveDateStr,
              distance: '12.4 mi',
              estimatedTime: '~35 min',
              planName: movePlanName,
              planPrice: movePrice,
              depositPaid: selectedMover ? Math.round(movePrice * 0.2) : 0,
              roomsScanned: rooms.filter(r => r.status === 'completed').length,
              itemsDetected: 47,
              totalVolume: '380 cu ft',
              mover: selectedMover ? {
                name: selectedMover.name,
                rating: selectedMover.rating,
                reviews: selectedMover.reviews,
                truck: selectedMover.truck,
                crewSize: selectedMover.crewSize,
                phone: '+1 (555) 123-4567',
              } : undefined,
              onTabPress: moveTabPress,
              onBack: () => navigateTo('dashboard'),
            }}
            /* Clean variant props */
            cleanProps={{
              moves: [
                {
                  id: 'current',
                  from: movingFromData?.address || '123 Main St, Apt 4',
                  to: movingToData?.address || '456 Oak Ave, Unit 2',
                  date: moveDateStr,
                  status: moveStatus === 'inProgress' ? 'inProgress' : moveStatus,
                  planName: movePlanName,
                  price: movePrice,
                  moverName: selectedMover?.name,
                },
              ],
              onTabPress: moveTabPress,
              onBack: () => navigateTo('dashboard'),
              onCreateRequest: () => navigateTo('movingFrom'),
              onSelectMove: () => {},
            }}
          />
        );
      }

      // --- Profile (tab) ---
      case 'profile':
        return (
          <ProfileScreen
            userName={contactData?.fullName || 'Dmitriy'}
            userPhone={phoneNumber || '+1 (555) 000-0000'}
            onMenuPress={(item: ProfileMenuItem) => {
              if (item === 'signOut') {
                setShowSignOutModal(true);
              } else {
                const screenMap: Record<string, Screen> = {
                  personalInfo: 'personalInfo',
                  companyInfo: 'companyInfo',
                  paymentMethods: 'paymentMethods',
                  savedAddresses: 'savedAddresses',
                  moveHistory: 'moveHistory',

                  contracts: 'contracts',
                  notifications: 'notifications',
                  helpSupport: 'helpSupport',
                  legal: 'legal',
                };
                if (screenMap[item]) navigateTo(screenMap[item]);
              }
            }}
            onTabPress={(tab) => {
              if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
              else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'chat') navigateTo('chatList');
              else if (tab === 'myMoves') navigateTo('orders');
            }}
            onBack={() => navigateTo('dashboard')}
            role={userRole || undefined}
          />
        );

      // --- Profile Sub-Screens ---
      case 'personalInfo':
        return (
          <PersonalInfoScreen
            fullName={contactData?.fullName || 'Dmitriy'}
            email={contactData?.email || 'dmitriy@example.com'}
            phone={phoneNumber || '+1 (555) 000-0000'}
            dateOfBirth="January 15, 1995"
            onSave={(data) => {
              console.log('Personal info saved:', data);
            }}
            onBack={() => navigateTo('profile')}
          />
        );
      case 'companyInfo':
        return (
          <CompanyInfoScreen
            onBack={() => navigateTo('profile')}
          />
        );
      case 'paymentMethods':
        return (
          <PaymentMethodsScreen
            initialCards={[
              { id: 'c1', type: 'visa', last4: '4242', expiry: '12/27', isDefault: true, holderName: contactData?.fullName || 'Dmitriy' },
              { id: 'c2', type: 'mastercard', last4: '8831', expiry: '03/26', isDefault: false, holderName: contactData?.fullName || 'Dmitriy' },
            ]}
            onBack={() => navigateTo('profile')}
            role={userRole || undefined}
          />
        );
      case 'savedAddresses':
        return (
          <SavedAddressesScreen
            initialAddresses={[
              { id: 'a1', label: 'home', address1: movingFromData?.address || '123 Main Street, Apt 4B', city: 'New York', state: 'NY', zip: '10001' },
              { id: 'a2', label: 'work', address1: '456 Corporate Blvd, Suite 200', city: 'New York', state: 'NY', zip: '10018' },
            ]}
            onBack={() => navigateTo('profile')}
          />
        );
      case 'moveHistory':
        return (
          <MoveHistoryScreen
            moves={[
              { id: 'h1', status: 'completed', fromAddress: '123 Main St, Apt 4', toAddress: '456 Oak Ave, Unit 2', date: 'Jan 15, 2026', moverName: 'Sarah Johnson', moverRating: 5, crewSize: 3, totalPrice: 1340, duration: '4h 25m', roomsCount: 4, itemsCount: 47, volume: '380 cu ft' },
              { id: 'h2', status: 'cancelled', fromAddress: '789 Pine Rd', toAddress: '321 Elm St', date: 'Dec 5, 2025', moverName: 'Mike Chen', moverRating: 4, crewSize: 2, totalPrice: 980, duration: '-', roomsCount: 3, itemsCount: 28, volume: '220 cu ft' },
            ]}
            onBack={() => navigateTo('profile')}
            role={userRole || undefined}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => navigateTo('profile')}
            role={userRole || undefined}
          />
        );
      case 'helpSupport':
        return (
          <HelpSupportScreen
            onBack={() => navigateTo('profile')}
          />
        );
      case 'legal':
        return (
          <LegalScreen
            onBack={() => navigateTo('profile')}
          />
        );

      // --- Contracts ---
      case 'contracts':
        return (
          <ContractsListScreen
            contracts={contracts}
            onViewContract={(c) => {
              setActiveContract(c);
              setContractReturnScreen('contracts');
              navigateTo('contractSigning');
            }}
            onDownloadPdf={(c) => {
              console.log('Download PDF for contract:', c.contractNumber);
            }}
            onBack={() => navigateTo('profile')}
          />
        );

      case 'contractSigning':
        return activeContract ? (
          <ContractSigningScreen
            contract={activeContract}
            signerRole="mover"
            signerName={contactData?.fullName || 'Dmitriy'}
            clientName={activeContract.client.fullName}
            onSign={(moverSig: ContractSignature, clientSig: ContractSignature, updatedContract: SignedContract) => {
              const fullySigned: SignedContract = {
                ...updatedContract,
                moverSignature: moverSig,
                clientSignature: clientSig,
                status: 'fully_signed' as const,
              };
              setContracts(prev => prev.map(c => c.id === fullySigned.id ? fullySigned : c));
              setActiveContract(fullySigned);
              setContractSignedForMove(true);
              setShowContractPrompt(false);
              navigateTo(contractReturnScreen);
            }}
            onBack={() => {
              navigateTo(contractReturnScreen);
            }}
          />
        ) : null;

      // --- Move Completed & Review ---
      case 'moveCompleted':
        return (
          <MoveCompletedScreen
            moverName={selectedMover?.name || 'SOS Moving Co.'}
            totalPaid={selectedMover?.price || 1340}
            moveDuration="4h 25m"
            itemsMoved={47}
            onLeaveReview={() => navigateTo('leaveReview')}
            onBackToHome={() => navigateTo('dashboard')}
            onPayRemainder={() => navigateTo('payment')}
            onBack={() => navigateTo('dashboard')}
          />
        );
      case 'leaveReview':
        return (
          <LeaveReviewScreen
            moverName={selectedMover?.name || 'SOS Moving Co.'}
            moverRating={selectedMover?.rating || 4.9}
            moverReviews={selectedMover?.reviews || 312}
            onSubmit={(rating, text) => {
              console.log('Review submitted:', rating, text);
              navigateTo('dashboard');
            }}
            onBack={() => navigateTo('moveCompleted')}
          />
        );

      // --- Summary / Confirmation ---
      case 'summary':
        return (
          <SummaryScreen
            movingFrom={movingFromData}
            movingTo={movingToData}
            movingDate={movingDateData}
            contact={contactData}
            rooms={rooms}
            specialItems={specialItemSelections}
            onEdit={(section) => {
              const map: Record<string, Screen> = {
                movingFrom: 'movingFrom',
                movingTo: 'movingTo',
                movingDate: 'movingDate',
                contactInfo: 'contactInfo',
                rooms: 'rooms',
                specialItems: 'specialItems',
              };
              setEditingFromSummary(section);
              navigateTo(map[section] || 'summary');
            }}
            onConfirm={() => {
              console.log('SUBMITTED! All data:', {
                movingFromData,
                movingToData,
                movingDateData,
                contactData,
                rooms,
                specialItemSelections,
              });
              navigateTo('analysisWaiting');
            }}
            onBack={() => navigateTo('specialItems')}
          />
        );
    }
  };

  // Map currentScreen → active sidebar tab
  const activeTab: TabId = (() => {
    if (['chatList', 'chat'].includes(currentScreen)) return 'chat';
    if (currentScreen === 'myMoves') return 'myMoves';
    if (['profile', 'personalInfo', 'paymentMethods', 'savedAddresses',
         'moveHistory', 'contracts', 'notifications', 'helpSupport', 'legal'].includes(currentScreen)) return 'profile';
    return 'dashboard';
  })();

  const handleSidebarTab = (tab: TabId) => {
    if (tab === 'dashboard') navigateTo(userRole === 'sales' ? 'salesDashboard' : 'dashboard');
    else if (tab === 'schedule') navigateTo('schedule');
              else if (tab === 'chat') navigateTo('chatList');
    else if (tab === 'myMoves') navigateTo('orders');
    else if (tab === 'profile') navigateTo('profile');
  };

  return (
    <ThemeProvider>
      <DesktopLayout activeTab={activeTab} onTabPress={handleSidebarTab}>
        <View style={styles.root}>
          <StatusBar style="dark" />
          <Animated.View
            style={[
              styles.screenWrapper,
              {
                transform: [{ translateX: slideAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            {renderScreen()}
          </Animated.View>
          <SignOutModal
            visible={showSignOutModal}
            onCancel={() => setShowSignOutModal(false)}
            onConfirm={() => {
              setShowSignOutModal(false);
              setUserRole(null);
              navigateTo('login');
            }}
          />
        </View>
      </DesktopLayout>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100%' as any } : {}),
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  screenWrapper: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100%' as any } : {}),
  },
});
