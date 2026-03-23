import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
} from 'react-native';
import { StatusBarMock, Navbar, Button, Input } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

interface HelpSupportScreenProps {
  onBack: () => void;
}

type ViewType = 'main' | 'faq' | 'contact' | 'chat' | 'reportList' | 'reportNew' | 'reportDetail' | 'reportSuccess';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

const F = 'Inter, system-ui, sans-serif';

/* ── SVG Icons ── */
const QuestionIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={colors.gray[500]} strokeWidth="1.5" fill="none" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.88.5c0 1.5-2.38 2-2.38 3.5M12 17h.01" stroke={colors.gray[500]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const HeadphonesIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 18v-6a9 9 0 1 1 18 0v6M3 18a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a3 3 0 0 0-3 3Zm18 0a3 3 0 0 1-3 3h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a3 3 0 0 1 3 3Z" stroke={colors.gray[500]} strokeWidth="1.5" fill="none" />
    </svg>
  );
};

const ChatBubbleIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" stroke={colors.gray[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const WarningIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke={colors.gray[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const PhoneIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.36 1.93.7 2.85a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.92.34 1.88.57 2.85.7A2 2 0 0 1 22 16.92Z" stroke={colors.primary[500]} strokeWidth="1.5" fill="none" />
    </svg>
  );
};

const MailIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={colors.primary[500]} strokeWidth="1.5" fill="none" />
      <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

const ChatIcon24 = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const PaperclipIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

const SendIcon = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke={colors.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};

const ChevronRight = () => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 6L16 12L10 18" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ChevronUpDown = ({ up }: { up: boolean }) => {
  if (Platform.OS !== 'web') return null;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: up ? 'rotate(180deg)' : undefined }}>
      <path d="M6 9l6 6 6-6" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

interface Report {
  id: string;
  ref: string;
  subject: string;
  type: string;
  date: string;
  status: 'in_review' | 'in_progress' | 'resolved' | 'closed';
  description: string;
  response?: string;
}

const STATUS_CONFIG: Record<Report['status'], { label: string; color: string; bg: string }> = {
  in_review: { label: 'In Review', color: colors.warning[600] || '#DC6803', bg: colors.warning[100] || '#FEF0C7' },
  in_progress: { label: 'In Progress', color: colors.primary[600] || '#1570EF', bg: colors.primary[50] || '#EFF8FF' },
  resolved: { label: 'Resolved', color: colors.success[600] || '#079455', bg: colors.success[100] || '#D1FADF' },
  closed: { label: 'Closed', color: colors.gray[500], bg: colors.gray[100] },
};

const MOCK_REPORTS: Report[] = [
  { id: '1', ref: '#RPT-2026-0201', subject: 'Damaged furniture during move', type: 'Moving Company', date: 'Feb 1, 2026', status: 'in_progress', description: 'During my move on Jan 30, the movers damaged my dining table. There is a large scratch on the surface and one leg is wobbly. I have photos of the damage.', response: 'We have assigned a claims specialist to your case. They will contact you within 2 business days to arrange an inspection.' },
  { id: '2', ref: '#RPT-2026-0185', subject: 'App crashes on payment screen', type: 'App Issue', date: 'Jan 28, 2026', status: 'resolved', description: 'Every time I try to add a new payment method, the app crashes and I have to restart it. This has happened 5 times already.', response: 'This issue has been fixed in the latest update (v2.4.1). Please update your app from the App Store. We apologize for the inconvenience.' },
  { id: '3', ref: '#RPT-2026-0140', subject: 'Double charge on credit card', type: 'Payment Issue', date: 'Jan 15, 2026', status: 'in_review', description: 'I was charged twice for my move on Jan 14. The amount of $350 appeared on my Visa ending in 4242 two times. Please refund the duplicate charge.' },
];

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [expandedFAQs, setExpandedFAQs] = useState<{ [key: string]: boolean }>({});
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hi! How can we help you today?', isUser: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [problemType, setProblemType] = useState('');
  const [reportSubject, setReportSubject] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPhotoAttached, setReportPhotoAttached] = useState(false);
  const [lastSubmittedRef, setLastSubmittedRef] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const chatScrollRef = useRef<ScrollView>(null);

  const faqItems = [
    { id: '1', q: 'How do I book a move?', a: 'Open the app and tap "Get Quote". Enter your locations, select your move date, and choose your preferred mover.' },
    { id: '2', q: 'What is your cancellation policy?', a: 'Cancel up to 48h before for full refund. Within 48h: 50% fee. Within 24h: 100% fee.' },
    { id: '3', q: 'How is pricing determined?', a: 'Based on distance, volume, and movers needed. Transparent quotes upfront with no hidden fees.' },
    { id: '4', q: 'What coverage is included?', a: 'Basic coverage up to $0.60/lb per item. Optional full-value protection available.' },
    { id: '5', q: 'How long does a move take?', a: 'Local: 2-6 hours. Long-distance: 1-3 days. Estimated timeframe provided at booking.' },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQs(p => ({ ...p, [id]: !p[id] }));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(p => [...p, { id: Date.now().toString(), text: chatInput, isUser: true }]);
    setChatInput('');
    setTimeout(() => {
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), text: 'Thanks for your message! An agent will respond shortly.', isUser: false }]);
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 1500);
  };

  const handleSubmitReport = () => {
    if (problemType && reportSubject && reportDescription) {
      const newRef = `#RPT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const newReport: Report = {
        id: Date.now().toString(),
        ref: newRef,
        subject: reportSubject,
        type: problemType,
        date: 'Feb 18, 2026',
        status: 'in_review',
        description: reportDescription,
      };
      setReports(prev => [newReport, ...prev]);
      setLastSubmittedRef(newRef);
      Animated.spring(checkmarkAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }).start();
      setCurrentView('reportSuccess');
    }
  };

  const handleBack = () => {
    if (currentView === 'reportNew' || currentView === 'reportDetail') setCurrentView('reportList');
    else if (currentView === 'main') onBack();
    else setCurrentView('main');
  };

  const goToReportDetail = (report: Report) => {
    setSelectedReport(report);
    setCurrentView('reportDetail');
  };

  const goToReportList = () => setCurrentView('reportList');
  const goToReportNew = () => {
    setProblemType('');
    setReportSubject('');
    setReportDescription('');
    setReportPhotoAttached(false);
    setCurrentView('reportNew');
  };
  const goToChat = () => setCurrentView('chat');
  const goToFAQ = () => setCurrentView('faq');
  const goToContact = () => setCurrentView('contact');
  const goBackToReportList = () => {
    setProblemType('');
    setReportSubject('');
    setReportDescription('');
    setReportPhotoAttached(false);
    checkmarkAnim.setValue(0);
    setCurrentView('reportList');
  };

  // Main Menu
  const MainView = () => (
    <View style={styles.container}>
      <Navbar title="Help & Support" onBack={onBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Pressable style={styles.menuRow} onPress={goToFAQ}>
            <QuestionIcon />
            {Platform.OS === 'web' && <span style={styles.label as any}>FAQ</span>}
            <View style={{ marginLeft: 'auto' }}><ChevronRight /></View>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuRow} onPress={goToContact}>
            <HeadphonesIcon />
            {Platform.OS === 'web' && <span style={styles.label as any}>Contact Support</span>}
            <View style={{ marginLeft: 'auto' }}><ChevronRight /></View>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuRow} onPress={goToChat}>
            <ChatBubbleIcon />
            {Platform.OS === 'web' && <span style={styles.label as any}>Chat with Support</span>}
            <View style={{ marginLeft: 'auto' }}><ChevronRight /></View>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.menuRow} onPress={goToReportList}>
            <WarningIcon />
            {Platform.OS === 'web' && <span style={styles.label as any}>Report a Problem</span>}
            <View style={{ marginLeft: 'auto' }}><ChevronRight /></View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );

  // FAQ
  const FAQView = () => (
    <View style={styles.container}>
      <Navbar title="FAQ" onBack={handleBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {faqItems.map((item, idx) => (
            <View key={item.id}>
              <Pressable style={styles.faqItem} onPress={() => toggleFAQ(item.id)}>
                <View style={styles.faqHeader}>
                  {Platform.OS === 'web' && (
                    <span style={{ fontSize: '15px', fontWeight: '500', color: colors.gray[800], fontFamily: F, flex: '1' } as any}>{item.q}</span>
                  )}
                  <ChevronUpDown up={!!expandedFAQs[item.id]} />
                </View>
                {expandedFAQs[item.id] && Platform.OS === 'web' && (
                  <span style={{ fontSize: '14px', color: colors.gray[600], lineHeight: '22px', marginTop: '12px', fontFamily: F, display: 'block' } as any}>{item.a}</span>
                )}
              </Pressable>
              {idx < faqItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Contact
  const ContactView = () => (
    <View style={styles.container}>
      <Navbar title="Contact Support" onBack={handleBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.contactItem}>
            <View style={styles.iconCircle}><PhoneIcon /></View>
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={styles.contactTitle as any}>Call Us</span>
                  <span style={styles.contactDetail as any}>+1 (800) 555-MOVE</span>
                  <span style={styles.contactHours as any}>Mon-Fri, 9am-6pm EST</span>
                </>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactItem}>
            <View style={styles.iconCircle}><MailIcon /></View>
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={styles.contactTitle as any}>Email Us</span>
                  <span style={styles.contactDetail as any}>support@aimoving.com</span>
                  <span style={styles.contactHours as any}>Response within 24h</span>
                </>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactItem}>
            <View style={styles.iconCircle}><ChatIcon24 /></View>
            <View style={{ flex: 1 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={styles.contactTitle as any}>Live Chat</span>
                  <span style={styles.contactHours as any}>Available 24/7</span>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title="Start Chat" onPress={goToChat} variant="primary" />
        </View>
      </ScrollView>
    </View>
  );

  // Chat
  const ChatView = () => (
    <View style={styles.container}>
      <Navbar title="Support Chat" onBack={handleBack} />
      <ScrollView
        ref={chatScrollRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[styles.bubble, msg.isUser ? styles.userBubble : styles.agentBubble]}
          >
            {Platform.OS === 'web' && (
              <span style={msg.isUser ? styles.userText : styles.agentText as any}>{msg.text}</span>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Type your message..."
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendMessage}
          />
        </View>
        <Pressable
          style={[styles.sendBtn, !chatInput.trim() && styles.sendBtnDisabled]}
          onPress={handleSendMessage}
          disabled={!chatInput.trim()}
        >
          <SendIcon />
        </Pressable>
      </View>
    </View>
  );

  // Report List
  const ReportListView = () => (
    <View style={styles.container}>
      <Navbar title="My Reports" onBack={handleBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {reports.length === 0 && Platform.OS === 'web' ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gray[100], alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <WarningIcon />
            </View>
            <span style={{ fontSize: '16px', fontWeight: '600', color: colors.gray[900], fontFamily: F, textAlign: 'center', display: 'block' } as any}>
              No reports yet
            </span>
            <span style={{ fontSize: '14px', color: colors.gray[500], fontFamily: F, textAlign: 'center', display: 'block', marginTop: '4px' } as any}>
              Your submitted reports will appear here
            </span>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {reports.map(report => {
              const st = STATUS_CONFIG[report.status];
              return (
                <Pressable key={report.id} style={styles.card} onPress={() => goToReportDetail(report)}>
                  <View style={{ padding: 16, gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      {Platform.OS === 'web' && (
                        <span style={{ fontSize: '15px', fontWeight: '600', color: colors.gray[900], fontFamily: F, flex: '1' } as any}>
                          {report.subject}
                        </span>
                      )}
                      <View style={{ backgroundColor: st.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 }}>
                        {Platform.OS === 'web' && (
                          <span style={{ fontSize: '12px', fontWeight: '600', color: st.color, fontFamily: F } as any}>
                            {st.label}
                          </span>
                        )}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ backgroundColor: colors.gray[100], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                        {Platform.OS === 'web' && (
                          <span style={{ fontSize: '12px', fontWeight: '500', color: colors.gray[600], fontFamily: F } as any}>
                            {report.type}
                          </span>
                        )}
                      </View>
                      {Platform.OS === 'web' && (
                        <span style={{ fontSize: '13px', color: colors.gray[500], fontFamily: F } as any}>
                          {report.date}
                        </span>
                      )}
                    </View>
                    {Platform.OS === 'web' && (
                      <span style={{ fontSize: '12px', color: colors.gray[400], fontFamily: F } as any}>
                        {report.ref}
                      </span>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
        <View style={{ marginTop: 20 }}>
          <Button title="New Report" onPress={goToReportNew} variant="primary" />
        </View>
      </ScrollView>
    </View>
  );

  // Report Detail
  const ReportDetailView = () => {
    if (!selectedReport) return null;
    const st = STATUS_CONFIG[selectedReport.status];
    return (
      <View style={styles.container}>
        <Navbar title="Report Details" onBack={handleBack} />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Header with status */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            {Platform.OS === 'web' && (
              <span style={{ fontSize: '12px', color: colors.gray[400], fontFamily: F } as any}>{selectedReport.ref}</span>
            )}
            <View style={{ backgroundColor: st.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              {Platform.OS === 'web' && (
                <span style={{ fontSize: '12px', fontWeight: '600', color: st.color, fontFamily: F } as any}>{st.label}</span>
              )}
            </View>
          </View>

          {/* Subject */}
          {Platform.OS === 'web' && (
            <span style={{ fontSize: '18px', fontWeight: '700', color: colors.gray[900], fontFamily: F, display: 'block', marginBottom: '16px' } as any}>
              {selectedReport.subject}
            </span>
          )}

          {/* Info row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <View style={{ backgroundColor: colors.gray[100], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              {Platform.OS === 'web' && (
                <span style={{ fontSize: '12px', fontWeight: '500', color: colors.gray[600], fontFamily: F } as any}>{selectedReport.type}</span>
              )}
            </View>
            {Platform.OS === 'web' && (
              <span style={{ fontSize: '13px', color: colors.gray[500], fontFamily: F } as any}>{selectedReport.date}</span>
            )}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <View style={{ padding: 16, gap: 8 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray[500], fontFamily: F, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' } as any}>
                    Description
                  </span>
                  <span style={{ fontSize: '14px', color: colors.gray[800], fontFamily: F, lineHeight: '22px', display: 'block' } as any}>
                    {selectedReport.description}
                  </span>
                </>
              )}
            </View>
          </View>

          {/* Response */}
          {selectedReport.response && (
            <View style={[styles.card, { marginTop: 12, borderColor: colors.primary[100] || colors.gray[100] }]}>
              <View style={{ padding: 16, gap: 8 }}>
                {Platform.OS === 'web' && (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary[50] || '#EFF8FF', alignItems: 'center', justifyContent: 'center' }}>
                        <HeadphonesIcon />
                      </View>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: colors.primary[600] || colors.primary[500], fontFamily: F } as any}>
                        Support Response
                      </span>
                    </View>
                    <span style={{ fontSize: '14px', color: colors.gray[800], fontFamily: F, lineHeight: '22px', display: 'block', marginTop: '4px' } as any}>
                      {selectedReport.response}
                    </span>
                  </>
                )}
              </View>
            </View>
          )}

          {/* No response yet */}
          {!selectedReport.response && Platform.OS === 'web' && (
            <View style={{ alignItems: 'center', paddingVertical: 24, marginTop: 12 }}>
              <span style={{ fontSize: '14px', color: colors.gray[400], fontFamily: F, textAlign: 'center', display: 'block' } as any}>
                No response yet. We'll get back to you within 24 hours.
              </span>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // Report New
  const ReportNewView = () => (
    <View style={styles.container}>
      <Navbar title="New Report" onBack={handleBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {Platform.OS === 'web' && (
          <span style={{ fontSize: '14px', fontWeight: '600', color: colors.gray[900], fontFamily: F, marginBottom: '8px', display: 'block' } as any}>
            Problem Type
          </span>
        )}
        <View style={styles.pills}>
          {['Moving Company', 'App Issue', 'Payment Issue', 'Other'].map(type => {
            const isActive = problemType === type;
            return (
              <Pressable
                key={type}
                style={[styles.pill, isActive && styles.pillActive]}
                onPress={() => setProblemType(type)}
              >
                {Platform.OS === 'web' && (
                  <span style={{ fontSize: '13px', fontWeight: '500', color: isActive ? colors.white : colors.gray[800], fontFamily: F } as any}>
                    {type}
                  </span>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 16, gap: 12 }}>
          <Input label="Subject" placeholder="Brief description" value={reportSubject} onChangeText={setReportSubject} />
          <Input label="Description" placeholder="Provide more details" value={reportDescription} onChangeText={setReportDescription} multiline numberOfLines={4} style={{ minHeight: 80 }} />
        </View>

        <Pressable
          style={styles.attachBtn}
          onPress={() => setReportPhotoAttached(!reportPhotoAttached)}
        >
          <PaperclipIcon />
          {Platform.OS === 'web' && (
            <span style={{ fontSize: '14px', fontWeight: '500', color: colors.primary[500], fontFamily: F } as any}>
              {reportPhotoAttached ? '1 photo attached' : 'Attach Photo'}
            </span>
          )}
        </Pressable>

        <View style={{ marginTop: 16 }}>
          <Button
            title="Submit Report"
            onPress={handleSubmitReport}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );

  // Success
  const SuccessView = () => (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.successContainer}>
        <View style={styles.successContent}>
          <Animated.View
            style={[
              styles.checkmark,
              {
                opacity: checkmarkAnim,
                transform: [{
                  scale: checkmarkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                }],
              },
            ]}
          >
            {Platform.OS === 'web' && (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke={colors.success[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Animated.View>
          {Platform.OS === 'web' && (
            <>
              <span style={{ fontSize: '22px', fontWeight: '700', color: colors.gray[900], fontFamily: F, textAlign: 'center', display: 'block' } as any}>
                Report Submitted
              </span>
              <span style={{ fontSize: '15px', color: colors.gray[600], fontFamily: F, textAlign: 'center', lineHeight: '22px', display: 'block' } as any}>
                We'll review your report within 24 hours and get back to you.
              </span>
              <View style={styles.refContainer}>
                <span style={{ fontSize: '14px', color: colors.gray[500], fontFamily: F } as any}>Reference:</span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: colors.gray[900], fontFamily: F } as any}>{lastSubmittedRef || '#RPT-2026-0218'}</span>
              </View>
            </>
          )}
          <View style={{ width: '100%', marginTop: 8 }}>
            <Button title="Done" onPress={goBackToReportList} variant="primary" />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarMock />
      {currentView === 'main' && <MainView />}
      {currentView === 'faq' && <FAQView />}
      {currentView === 'contact' && <ContactView />}
      {currentView === 'chat' && <ChatView />}
      {currentView === 'reportList' && <ReportListView />}
      {currentView === 'reportDetail' && <ReportDetailView />}
      {currentView === 'reportNew' && <ReportNewView />}
      {currentView === 'reportSuccess' && <SuccessView />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 16, paddingVertical: 20 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 40 },

  card: {
    ...(Platform.OS === 'web' ? {
      backgroundColor: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
    borderRadius: 14,
    overflow: 'hidden',
  } as any,
  divider: { height: 1, backgroundColor: colors.gray[100], marginHorizontal: 16 },

  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  label: { fontSize: 15, fontWeight: '500', color: colors.gray[800], fontFamily: F },

  faqItem: { paddingHorizontal: 16, paddingVertical: 14 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  faqQuestion: { fontSize: 15, fontWeight: '500', color: colors.gray[800], fontFamily: F, flex: 1 },
  faqAnswer: { fontSize: 14, color: colors.gray[600], lineHeight: 20, marginTop: 10, fontFamily: F },

  contactItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary[50] || '#EFF8FF', alignItems: 'center', justifyContent: 'center' },
  contactTitle: { fontSize: 15, fontWeight: '600', color: colors.gray[900], fontFamily: F, display: 'block' } as any,
  contactDetail: { fontSize: 14, fontWeight: '500', color: colors.gray[800], fontFamily: F, display: 'block', marginTop: 2 } as any,
  contactHours: { fontSize: 13, color: colors.gray[500], fontFamily: F, display: 'block', marginTop: 2 } as any,

  chatScroll: { flex: 1, ...(Platform.OS === 'web' ? {
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  } : { backgroundColor: 'rgba(255,255,255,0.7)' }) } as any,
  chatContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  bubble: { maxWidth: '85%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary[500], borderBottomRightRadius: 4 },
  agentBubble: { alignSelf: 'flex-start', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[100], borderBottomLeftRadius: 4 },
  userText: { fontSize: 14, color: colors.white, fontFamily: F },
  agentText: { fontSize: 14, color: colors.gray[900], fontFamily: F },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.gray[100], gap: 8 },
  sendBtn: { width: 44, height: 44, backgroundColor: colors.primary[500], borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },

  reportLabel: { fontSize: 14, fontWeight: '600', color: colors.gray[900], fontFamily: F, marginBottom: 8, display: 'block' } as any,
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.gray[200], backgroundColor: colors.white },
  pillActive: { backgroundColor: colors.primary[500], borderColor: colors.primary[500] },
  pillText: { fontSize: 13, fontWeight: '500', color: colors.gray[800], fontFamily: F },
  pillTextActive: { color: colors.white },
  attachBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, ...(Platform.OS === 'web' ? {
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
  } : { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: colors.gray[200] }), borderRadius: 12, gap: 8 } as any,
  attachText: { fontSize: 14, fontWeight: '500', color: colors.primary[500], fontFamily: F },

  successContent: { alignItems: 'center', gap: 16 },
  checkmark: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success[100] || '#D1FADF', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.gray[900], fontFamily: F, textAlign: 'center' },
  successMsg: { fontSize: 15, color: colors.gray[600], fontFamily: F, textAlign: 'center', lineHeight: 22 },
  refContainer: { alignItems: 'center', gap: 4, marginTop: 8 },
  refLabel: { fontSize: 14, color: colors.gray[500], fontFamily: F },
  refNumber: { fontSize: 16, fontWeight: '600', color: colors.gray[900], fontFamily: F },
});

export { HelpSupportScreen };
