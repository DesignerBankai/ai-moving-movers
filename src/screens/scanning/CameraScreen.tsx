/**
 * AI Moving — Camera Screen (Scanning)
 *
 * Layout:
 * - Dark navbar: back arrow (left), room title (center), help icon (right)
 * - Camera viewfinder area (dark placeholder with corner brackets)
 * - Timer (MM:SS)
 * - Controls: discard (left, on pause), record/pause (center), finish (right, on pause)
 * - Discard confirmation overlay
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Text, StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { DesktopQRScreen } from '../../components/DesktopQRScreen';
import { useIsDesktop } from '../../hooks/useIsDesktop';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/* -- SVG Icons -- */
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="1.5"/>
    <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.88 13.38 12 12 12V13.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="16.5" r="0.75" fill="#FFFFFF"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 12L10 17L19 8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DiscardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M6 6L16 16M16 6L6 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

/* -- Corner bracket overlay for viewfinder -- */
const ViewfinderCorners = () => (
  <svg width="100%" height="100%" viewBox="0 0 370 460" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0 } as any}>
    {/* Top-left */}
    <path d="M40 60 L40 40 L60 40" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Top-right */}
    <path d="M330 60 L330 40 L310 40" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Bottom-left */}
    <path d="M40 400 L40 420 L60 420" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
    {/* Bottom-right */}
    <path d="M330 400 L330 420 L310 420" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>

    {/* Subtle scanning guide lines */}
    <line x1="50" y1="230" x2="320" y2="230" stroke="white" strokeWidth="0.5" opacity="0.15"/>
    <line x1="185" y1="50" x2="185" y2="410" stroke="white" strokeWidth="0.5" opacity="0.15"/>
  </svg>
);

/* -- Timer formatter -- */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/* -- Discard Confirmation Overlay -- */
interface DiscardOverlayProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DiscardOverlay: React.FC<DiscardOverlayProps> = ({ visible, onConfirm, onCancel }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else if (rendered) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setRendered(false);
        scale.setValue(0.9);
      });
    }
  }, [visible]);

  if (!rendered) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyles.root, { opacity }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <Animated.View style={[overlayStyles.card, { transform: [{ scale }] }]}>
        {/* Warning icon */}
        <View style={overlayStyles.iconWrap}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#FEF3F2" stroke="#FEE4E2" strokeWidth="2"/>
            <path d="M20 14V22" stroke="#F04438" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="27" r="1.5" fill="#F04438"/>
          </svg>
        </View>

        {Platform.OS === 'web' ? (
          <>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 18, fontWeight: 600, color: '#FFFFFF',
              textAlign: 'center',
            } as any}>Discard recording?</span>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.6)',
              textAlign: 'center', marginTop: 6, lineHeight: '20px',
            } as any}>This will delete the current recording{'\n'}and reset the timer.</span>
          </>
        ) : (
          <>
            <Text variant="bodySm" color="#FFFFFF">Discard recording?</Text>
            <Text variant="bodySm" color="rgba(255,255,255,0.6)">
              This will delete the current recording and reset the timer.
            </Text>
          </>
        )}

        {/* Buttons */}
        <View style={overlayStyles.buttonRow}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [overlayStyles.cancelBtn, pressed && { opacity: 0.7 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15, fontWeight: 600, color: '#FFFFFF',
              } as any}>Cancel</span>
            ) : (
              <Text variant="bodySm" color="#FFFFFF">Cancel</Text>
            )}
          </Pressable>

          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [overlayStyles.discardBtn, pressed && { opacity: 0.7 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15, fontWeight: 600, color: '#FFFFFF',
              } as any}>Discard</span>
            ) : (
              <Text variant="bodySm" color="#FFFFFF">Discard</Text>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const overlayStyles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 100,
  },
  card: {
    backgroundColor: 'rgba(40,40,40,0.95)',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 28,
    alignItems: 'center',
    width: '85%',
    maxWidth: 320,
  },
  iconWrap: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* ===================================
   FAQ Bottom Sheet
   =================================== */

const FAQ_ITEMS = [
  {
    q: 'How should I record a room?',
    a: 'Slowly pan your camera around the entire room, making sure all furniture and items are visible. Move at a steady pace - the AI needs a few seconds to detect each item.',
  },
  {
    q: 'How long should each recording be?',
    a: 'A typical room takes 30-60 seconds. Larger rooms with more items may need up to 2 minutes. The timer helps you track.',
  },
  {
    q: 'Do I need to scan every room?',
    a: 'You need at least one room scanned to get an estimate. For the most accurate result, scan all rooms that contain items you plan to move.',
  },
  {
    q: 'What if I miss some items?',
    a: 'You can always re-scan a room from the rooms list. The AI combines all visible items across your recording, so try to capture everything in one pass.',
  },
  {
    q: 'Can I pause and resume recording?',
    a: 'Yes! Tap the center button to pause. You can then resume or finish the recording. If needed, you can also discard and start over.',
  },
  {
    q: 'What does the AI detect?',
    a: 'The AI identifies furniture (beds, sofas, tables, chairs), appliances, boxes, and other household items. It estimates their size and volume to calculate moving costs.',
  },
  {
    q: 'How long does the estimate take?',
    a: 'After you finish scanning all rooms, the AI processes your recordings in about 30 minutes. You can close the app - we will notify you when it is ready.',
  },
  {
    q: 'Is my video data secure?',
    a: 'Your recordings are processed securely and used only for generating your moving estimate. Videos are not shared with third parties.',
  },
];

/* FAQ icons */
const FaqCloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M18 6L6 18" stroke="#667085" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronDownIcon = ({ rotated }: { rotated: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
    transition: 'transform 0.2s ease',
    transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
  } as any}>
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FaqQuestionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.5" stroke="#2E90FA" strokeWidth="1.5"/>
    <path d="M7.5 7.5C7.5 6.12 8.62 5 10 5C11.38 5 12.5 6.12 12.5 7.5C12.5 8.88 11.38 10 10 10V11" stroke="#2E90FA" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="0.75" fill="#2E90FA"/>
  </svg>
);

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <Pressable onPress={onToggle} style={faqItemStyles.container}>
    <View style={faqItemStyles.header}>
      <View style={faqItemStyles.iconWrap}>
        {Platform.OS === 'web' ? <FaqQuestionIcon /> : <Text variant="bodySm" color="#2E90FA">?</Text>}
      </View>
      <View style={faqItemStyles.questionWrap}>
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 15, fontWeight: 600, color: '#212225',
            lineHeight: '20px',
          } as any}>{question}</span>
        ) : (
          <Text variant="bodySm" color="#212225">{question}</Text>
        )}
      </View>
      <View style={faqItemStyles.chevron}>
        {Platform.OS === 'web' ? <ChevronDownIcon rotated={isOpen} /> : <Text variant="bodySm" color="#667085">{isOpen ? '\u25B2' : '\u25BC'}</Text>}
      </View>
    </View>
    {isOpen && (
      <View style={faqItemStyles.answerWrap}>
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14, fontWeight: 400, color: '#667085',
            lineHeight: '20px',
          } as any}>{answer}</span>
        ) : (
          <Text variant="bodySm" color="#667085">{answer}</Text>
        )}
      </View>
    )}
  </Pressable>
);

const faqItemStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  iconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionWrap: {
    flex: 1,
  },
  chevron: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerWrap: {
    paddingLeft: 32,
    paddingBottom: 16,
    paddingRight: 8,
  },
});

interface FaqSheetProps {
  visible: boolean;
  onClose: () => void;
}

const FaqSheet: React.FC<FaqSheetProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      setOpenIndex(null);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
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
          duration: 250,
          easing: Easing.in(Easing.cubic),
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
      <Animated.View style={[faqSheetStyles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[faqSheetStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={faqSheetStyles.handleWrap}>
          <View style={faqSheetStyles.handle} />
        </View>

        {/* Header */}
        <View style={faqSheetStyles.header}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 18, fontWeight: 700, color: '#212225',
            } as any}>Recording FAQ</span>
          ) : (
            <Text variant="bodySm" color="#212225">Recording FAQ</Text>
          )}
          <Pressable onPress={onClose} hitSlop={8} style={faqSheetStyles.closeBtn}>
            {Platform.OS === 'web' ? <FaqCloseIcon /> : <Text variant="bodySm" color="#667085">X</Text>}
          </Pressable>
        </View>

        {/* FAQ list */}
        <ScrollView style={faqSheetStyles.scrollArea} showsVerticalScrollIndicator={false}>
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const faqSheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.75,
    zIndex: 201,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[200],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
});

/* -- Screen -- */

interface CameraScreenProps {
  title?: string;
  onFinish: () => void;
  onDiscard: () => void;
  onBack: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  title = 'Street to door access',
  onFinish,
  onDiscard,
  onBack,
}) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) return <DesktopQRScreen onBack={onBack} />;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Discard confirmation
  const [showDiscard, setShowDiscard] = useState(false);

  // FAQ sheet
  const [showFaq, setShowFaq] = useState(false);

  // Finish button animation
  const finishScale = useRef(new Animated.Value(0)).current;
  const finishOpacity = useRef(new Animated.Value(0)).current;

  // Discard button animation
  const discardScale = useRef(new Animated.Value(0)).current;
  const discardOpacity = useRef(new Animated.Value(0)).current;

  // Recording pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Recording pulse animation
  useEffect(() => {
    if (isRecording && !isPaused) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => { pulseLoop.current?.stop(); };
  }, [isRecording, isPaused]);

  // Show/hide finish + discard buttons
  useEffect(() => {
    if (isPaused) {
      Animated.parallel([
        Animated.spring(finishScale, {
          toValue: 1,
          friction: 6,
          tension: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(finishOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(discardScale, {
          toValue: 1,
          friction: 6,
          tension: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(discardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      finishScale.setValue(0);
      finishOpacity.setValue(0);
      discardScale.setValue(0);
      discardOpacity.setValue(0);
    }
  }, [isPaused]);

  const handleRecordPress = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsPaused(false);
    } else if (!isPaused) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  };

  const handleFinish = () => {
    setIsRecording(false);
    setIsPaused(false);
    onFinish();
  };

  const handleDiscardConfirm = () => {
    setShowDiscard(false);
    setIsRecording(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    onDiscard();
  };

  // Timer color: red when recording, white when paused/idle
  const timerColor = isRecording && !isPaused ? '#FF3B30' : '#FFFFFF';

  return (
    <View style={styles.root}>
      <StatusBarMock variant="light" />

      {/* Dark navbar */}
      <View style={styles.navbar}>
        <Pressable onPress={onBack} style={styles.navButton} hitSlop={8}>
          {Platform.OS === 'web' ? <BackArrowIcon /> : <Text variant="bodySm" color="#FFF">{'<-'}</Text>}
        </Pressable>

        <View style={styles.navTitleWrap}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 17, fontWeight: 600, color: '#FFFFFF',
              letterSpacing: -0.3,
            } as any}>{title}</span>
          ) : (
            <Text variant="bodySm" color="#FFFFFF">{title}</Text>
          )}
        </View>

        <Pressable onPress={() => setShowFaq(true)} style={styles.navButton} hitSlop={8}>
          {Platform.OS === 'web' ? <HelpIcon /> : <Text variant="bodySm" color="#FFF">?</Text>}
        </Pressable>
      </View>

      {/* Camera viewfinder area */}
      <View style={styles.viewfinder}>
        <View style={styles.cameraPreview}>
          {Platform.OS === 'web' && <ViewfinderCorners />}

          {/* Recording indicator dot */}
          {isRecording && !isPaused && (
            <View style={styles.recDot}>
              <Animated.View style={[styles.recDotInner, { transform: [{ scale: pulseAnim }] }]} />
            </View>
          )}
        </View>
      </View>

      {/* Bottom controls area */}
      <View style={styles.controlsArea}>
        {/* Timer */}
        <View style={styles.timerWrap}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: "'SF Mono', 'Menlo', 'Courier New', monospace",
              fontSize: 20, fontWeight: 500, color: timerColor,
              letterSpacing: 2,
            } as any}>{formatTime(elapsedSeconds)}</span>
          ) : (
            <Text variant="bodySm" color={timerColor}>{formatTime(elapsedSeconds)}</Text>
          )}

          {/* Status label */}
          {isRecording && (
            Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12, fontWeight: 500,
                color: isPaused ? colors.gray[400] : 'rgba(255,255,255,0.5)',
                marginTop: 4,
              } as any}>{isPaused ? 'Paused' : 'Recording...'}</span>
            ) : (
              <Text variant="bodySm" color={isPaused ? colors.gray[400] : 'rgba(255,255,255,0.5)'}>
                {isPaused ? 'Paused' : 'Recording...'}
              </Text>
            )
          )}
        </View>

        {/* Buttons row */}
        <View style={styles.buttonsRow}>
          {/* Discard button -- appears on pause (LEFT) */}
          <View style={styles.sideButton}>
            {isPaused && (
              <Animated.View style={{
                transform: [{ scale: discardScale }],
                opacity: discardOpacity,
              }}>
                <Pressable onPress={() => setShowDiscard(true)} style={styles.discardButton}>
                  {Platform.OS === 'web' ? <DiscardIcon /> : <Text variant="bodySm" color="#FFF">X</Text>}
                </Pressable>
              </Animated.View>
            )}
          </View>

          {/* Record / Pause button */}
          <Pressable onPress={handleRecordPress} style={styles.recordOuter}>
            {({ pressed }) => (
              <View style={[
                styles.recordOuter,
                { opacity: pressed ? 0.7 : 1 },
              ]}>
                <View style={styles.recordRing}>
                  {isRecording && !isPaused ? (
                    <View style={styles.pauseIcon}>
                      <View style={styles.pauseBar} />
                      <View style={styles.pauseBar} />
                    </View>
                  ) : isRecording && isPaused ? (
                    <View style={styles.playIcon} />
                  ) : (
                    <View style={styles.recordDot} />
                  )}
                </View>
              </View>
            )}
          </Pressable>

          {/* Finish button -- appears on pause (RIGHT) */}
          <View style={styles.sideButton}>
            {isPaused && (
              <Animated.View style={{
                transform: [{ scale: finishScale }],
                opacity: finishOpacity,
              }}>
                <Pressable onPress={handleFinish} style={styles.finishButton}>
                  {Platform.OS === 'web' ? <CheckIcon /> : <Text variant="bodySm" color="#FFF">OK</Text>}
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicator}>
          <View style={styles.homeBar} />
        </View>
      </View>

      {/* Discard confirmation overlay */}
      <DiscardOverlay
        visible={showDiscard}
        onConfirm={handleDiscardConfirm}
        onCancel={() => setShowDiscard(false)}
      />

      {/* FAQ bottom sheet */}
      <FaqSheet
        visible={showFaq}
        onClose={() => setShowFaq(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /* Navbar */
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },

  /* Viewfinder */
  viewfinder: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    margin: 0,
  },

  /* Recording dot */
  recDot: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  recDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },

  /* Controls */
  controlsArea: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingTop: 20,
    paddingBottom: 8,
    alignItems: 'center',
  },

  timerWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  sideButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },

  /* Record button */
  recordOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF3B30',
  },

  /* Pause icon */
  pauseIcon: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBar: {
    width: 8,
    height: 26,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },

  /* Play/resume icon */
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 13,
    borderBottomWidth: 13,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 5,
  },

  /* Discard button */
  discardButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  /* Finish button */
  finishButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Home indicator */
  homeIndicator: {
    marginTop: 16,
    alignItems: 'center',
    paddingBottom: 4,
  },
  homeBar: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
