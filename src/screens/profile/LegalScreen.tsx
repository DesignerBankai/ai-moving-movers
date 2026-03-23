import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBarMock, Navbar } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

const F = 'Inter, system-ui, sans-serif';

interface LegalScreenProps {
  onBack: () => void;
}

type DocumentType = 'terms' | 'privacy' | 'cookies' | 'licenses' | 'dpa' | null;

interface MenuItem {
  id: DocumentType;
  label: string;
  icon: (size: number) => React.ReactNode;
}

const icons = {
  file: (size: number) => (
    <>
      {Platform.OS === 'web' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
            stroke={colors.gray[700]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="13 2 13 9 20 9"
            stroke={colors.gray[700]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  ),
  shield: (size: number) => (
    <>
      {Platform.OS === 'web' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
            stroke={colors.gray[700]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  ),
  cookie: (size: number) => (
    <>
      {Platform.OS === 'web' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={colors.gray[700]} strokeWidth="2" />
          <circle cx="8" cy="9" r="1.5" fill={colors.gray[700]} />
          <circle cx="16" cy="10" r="1.5" fill={colors.gray[700]} />
          <circle cx="10" cy="15" r="1.5" fill={colors.gray[700]} />
        </svg>
      )}
    </>
  ),
  document: (size: number) => (
    <>
      {Platform.OS === 'web' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke={colors.gray[700]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14 2 14 8 20 8"
            stroke={colors.gray[700]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  ),
  lock: (size: number) => (
    <>
      {Platform.OS === 'web' && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            stroke={colors.gray[700]}
            strokeWidth="2"
          />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={colors.gray[700]} strokeWidth="2" />
        </svg>
      )}
    </>
  ),
};

const menuItems: MenuItem[] = [
  { id: 'terms', label: 'Terms of Service', icon: icons.file },
  { id: 'privacy', label: 'Privacy Policy', icon: icons.shield },
  { id: 'cookies', label: 'Cookie Policy', icon: icons.cookie },
  { id: 'licenses', label: 'Licenses', icon: icons.document },
  { id: 'dpa', label: 'Data Processing Agreement', icon: icons.lock },
];

const documentContent = {
  terms: {
    title: 'Terms of Service',
    updatedDate: 'January 15, 2026',
    sections: [
      {
        header: '1. Acceptance of Terms',
        content:
          'By accessing the AI Moving app, you agree to these terms. We provide moving coordination services and connecting you with professional movers. You are responsible for your account security and must promptly report unauthorized access.',
      },
      {
        header: '2. Service Use',
        content:
          'You may use our Service only for lawful purposes and in accordance with these terms. You agree not to use the Service to interfere with its proper functioning or to compete with our business.',
      },
      {
        header: '3. Liability Limitations',
        content:
          'We are not liable for indirect, incidental, or consequential damages arising from your use of the Service. Our liability is limited to the amount you paid us in the past 12 months.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updatedDate: 'January 15, 2026',
    sections: [
      {
        header: '1. Information Collection',
        content:
          'We collect your name, email, phone, address, and payment information when you book services. We also track app usage through analytics. This data helps us provide and improve our moving coordination services.',
      },
      {
        header: '2. Data Usage',
        content:
          'We use your information to fulfill moving requests, process payments, and communicate with you. We never sell personal data to third parties. We may use aggregated data for service improvement.',
      },
      {
        header: '3. Data Protection',
        content:
          'Your data is encrypted during transmission and at rest. We comply with applicable data protection laws and maintain security measures to prevent unauthorized access or disclosure.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    updatedDate: 'January 15, 2026',
    sections: [
      {
        header: '1. Cookie Usage',
        content:
          'We use cookies and similar tracking technologies to enhance your experience. Essential cookies enable login and security features. Analytics cookies help us understand how you use our app.',
      },
      {
        header: '2. Cookie Types',
        content:
          'Session cookies expire when you close the browser. Persistent cookies remain on your device. Third-party service providers may set cookies for analytics and payments.',
      },
      {
        header: '3. Cookie Control',
        content:
          'You can disable cookies through your browser settings, though this may limit app functionality. You can clear cookies at any time. Our app continues to work with most cookies disabled.',
      },
    ],
  },
  licenses: {
    title: 'Licenses',
    updatedDate: 'January 15, 2026',
    sections: [
      {
        header: '1. License Grant',
        content:
          'We grant you a limited, non-exclusive license to use our app for personal, non-commercial purposes. You may not reproduce, modify, or distribute our content without permission.',
      },
      {
        header: '2. Intellectual Property',
        content:
          'All content in our Service, including text, graphics, logos, and software, is protected by copyright and trademark laws. We respect the intellectual property rights of others.',
      },
      {
        header: '3. Open Source',
        content:
          'Our app incorporates open source software licensed under MIT, Apache 2.0, and other licenses. See our repository for the complete list of dependencies and their licenses.',
      },
    ],
  },
  dpa: {
    title: 'Data Processing Agreement',
    updatedDate: 'January 15, 2026',
    sections: [
      {
        header: '1. Processing Scope',
        content:
          'We process personal data to provide moving coordination services. This includes booking management, communication, payments, and service delivery. We act as a service provider for our users.',
      },
      {
        header: '2. Data Categories',
        content:
          'We process contact information, location data, payment details, and service preferences. Processing occurs in secure data centers. We retain data only as long as needed for service provision.',
      },
      {
        header: '3. User Rights',
        content:
          'You can access, correct, delete, or export your personal data. Submit requests through your account settings or contact our privacy team. We respond within 30 days of valid requests.',
      },
    ],
  },
};

const LegalScreen: React.FC<LegalScreenProps> = ({ onBack }) => {
  const [currentDocument, setCurrentDocument] = useState<DocumentType>(null);

  const handleBack = () => {
    if (currentDocument) {
      setCurrentDocument(null);
    } else {
      onBack();
    }
  };

  const renderMainList = () => (
    <SafeAreaView style={styles.container}>
      <StatusBarMock />
      <Navbar title="Legal" onBack={handleBack} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => setCurrentDocument(item.id)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.iconContainer}>{item.icon(22)}</View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    {Platform.OS === 'web' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 18l6-6-6-6"
                          stroke={colors.gray[400]}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Pressable>
                  {index < menuItems.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );

  const renderDocumentDetail = () => {
    if (!currentDocument || !documentContent[currentDocument]) {
      return null;
    }

    const doc = documentContent[currentDocument];

    return (
      <SafeAreaView style={styles.container}>
        <StatusBarMock />
        <Navbar title={doc.title} onBack={handleBack} />
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.documentContainer}>
              <Text style={styles.updatedDate}>
                {Platform.OS === 'web' ? (
                  <span>Last updated: {doc.updatedDate}</span>
                ) : (
                  `Last updated: ${doc.updatedDate}`
                )}
              </Text>
              {doc.sections.map((section, index) => (
                <View key={index} style={styles.section}>
                  <Text style={styles.sectionHeader}>
                    {Platform.OS === 'web' ? <span>{section.header}</span> : section.header}
                  </Text>
                  <Text style={styles.sectionBody}>
                    {Platform.OS === 'web' ? <span>{section.content}</span> : section.content}
                  </Text>
                </View>
              ))}
              <View style={styles.bottomPadding} />
            </View>
          </ScrollView>
      </SafeAreaView>
    );
  };

  return currentDocument ? renderDocumentDetail() : renderMainList();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray[800],
    fontFamily: F,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginLeft: 50,
  },
  documentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  updatedDate: {
    fontSize: 12,
    color: colors.gray[400],
    marginBottom: 16,
    fontFamily: F,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 8,
    fontFamily: F,
  },
  sectionBody: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray[600],
    lineHeight: 22,
    fontFamily: F,
  },
  bottomPadding: {
    height: 40,
  },
});

export { LegalScreen };
