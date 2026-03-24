import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  Pressable,
  Animated,
} from 'react-native';
import { StatusBarMock, Navbar, Button, Input, Toggle } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  isDefault: boolean;
  holderName: string;
}

interface PaymentMethodsScreenProps {
  initialCards?: PaymentCard[];
  onBack: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

type ViewType = 'list' | 'addCard' | 'cardDetail' | 'deleteConfirm' | 'success';

const DEMO_CARDS: PaymentCard[] = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiry: '12/27',
    isDefault: true,
    holderName: 'John Doe',
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8831',
    expiry: '03/26',
    isDefault: false,
    holderName: 'Jane Smith',
  },
];

export const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({
  initialCards = DEMO_CARDS,
  onBack,
  role,
}) => {
  const [view, setView] = useState<ViewType>('list');
  const [cards, setCards] = useState<PaymentCard[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [scaleAnim] = useState(new Animated.Value(0));

  // Form fields for add card
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    setExpiry(formatted.substring(0, 5));
  };

  const handleCVVChange = (text: string) => {
    setCvv(text.replace(/\D/g, '').substring(0, 4));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    if (expiry.length !== 5) {
      errors.expiry = 'Expiry must be MM/YY';
    } else {
      const [month, year] = expiry.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.expiry = 'Invalid month';
      }
    }

    if (cvv.length < 3 || cvv.length > 4) {
      errors.cvv = 'CVV must be 3-4 digits';
    }

    if (holderName.trim().length === 0) {
      errors.holderName = 'Cardholder name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCard = () => {
    if (!validateForm()) {
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const newCard: PaymentCard = {
      id: Date.now().toString(),
      type: cleanCardNumber.startsWith('5') ? 'mastercard' : 'visa',
      last4: cleanCardNumber.substring(12),
      expiry,
      isDefault: setAsDefault || cards.length === 0,
      holderName,
    };

    const updatedCards = cards.map(card => ({
      ...card,
      isDefault: setAsDefault ? false : card.isDefault,
    }));
    updatedCards.push(newCard);
    setCards(updatedCards);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    setCardNumber('');
    setExpiry('');
    setCvv('');
    setHolderName('');
    setSetAsDefault(false);
    setFormErrors({});
    setView('success');
  };

  const handleSetAsDefault = () => {
    if (selectedCard) {
      const updatedCards = cards.map(card => ({
        ...card,
        isDefault: card.id === selectedCard.id,
      }));
      setCards(updatedCards);
      setSelectedCard({ ...selectedCard, isDefault: true });
      setView('list');
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      const updatedCards = cards.filter(card => card.id !== selectedCard.id);
      setCards(updatedCards);
      setSelectedCard(null);
      setView('list');
    }
  };

  const renderBackArrowSVG = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M10.306 15.994C10.306 15.76 10.396 15.525 10.575 15.346L19.74 6.18C20.098 5.822 20.927 5.965 21.285 6.323C21.643 6.681 21.85 7.552 21.492 7.91L13.224 15.994L21.492 24.17C21.85 24.528 21.692 25.343 21.334 25.701C20.976 26.059 20.098 26.166 19.74 25.808L10.575 16.642C10.396 16.463 10.306 16.229 10.306 15.994Z"
          fill={colors.primary[500]}
        />
      </svg>
    );
  };

  const renderVisaIcon = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="40" height="26" viewBox="0 0 40 26" fill="none">
        <rect width="40" height="26" rx="4" fill="#1A1F71" />
        <path d="M16.2 17.5L18 8.5H20.2L18.4 17.5H16.2Z" fill="white" />
        <path d="M26.4 8.7C25.9 8.5 25.1 8.3 24.1 8.3C21.9 8.3 20.3 9.5 20.3 11.1C20.3 12.3 21.3 12.9 22.1 13.3C22.9 13.7 23.2 13.9 23.2 14.3C23.2 14.8 22.6 15.1 22 15.1C21.2 15.1 20.7 14.9 20 14.6L19.7 14.5L19.4 16.3C19.9 16.5 20.8 16.7 21.8 16.7C24.1 16.7 25.7 15.5 25.7 13.8C25.7 12.9 25.1 12.2 23.9 11.6C23.2 11.2 22.7 11 22.7 10.5C22.7 10.1 23.2 9.7 24.1 9.7C24.9 9.7 25.5 9.8 25.9 10L26.2 10.1L26.4 8.7Z" fill="white" />
        <path d="M29.2 8.5H27.5C27 8.5 26.6 8.7 26.4 9.2L23.2 17.5H25.5L26 16.1H28.8L29.1 17.5H31.1L29.2 8.5ZM26.6 14.3C26.8 13.8 27.6 11.6 27.6 11.6L28.3 14.3H26.6Z" fill="white" />
        <path d="M15.4 8.5L13.2 14.5L13 13.4C12.5 11.9 11.1 10.3 9.5 9.5L11.5 17.5H13.8L17.7 8.5H15.4Z" fill="white" />
        <path d="M11.7 8.5H8.1L8 8.7C10.8 9.4 12.6 11.1 13.2 13.1L12.5 9.2C12.4 8.7 12 8.5 11.7 8.5Z" fill="#F9A533" />
      </svg>
    );
  };

  const renderMastercardIcon = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="40" height="26" viewBox="0 0 40 26" fill="none">
        <rect width="40" height="26" rx="4" fill="#252525" />
        <circle cx="16" cy="13" r="7" fill="#EB001B" />
        <circle cx="24" cy="13" r="7" fill="#F79E1B" />
        <path d="M20 7.8C21.5 9 22.4 10.9 22.4 13C22.4 15.1 21.5 17 20 18.2C18.5 17 17.6 15.1 17.6 13C17.6 10.9 18.5 9 20 7.8Z" fill="#FF5F00" />
      </svg>
    );
  };

  const renderChevronRightSVG = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M10 6L16 12L10 18"
          stroke={colors.gray[400]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderBankBuildingSVG = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21H21M4 18H20M6 18V14M10 18V14M14 18V14M18 18V14M3 10L12 3L21 10H3Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  // View: List
  const renderListView = () => {
    const hasCards = cards.length > 0;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any}>
        <StatusBarMock />
        <View>
          <Navbar
            title="Payout Methods"
            onBack={onBack}
            rightAction={
              Platform.OS === 'web' ? (
                <Pressable
                  onPress={() => setView('addCard')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: colors.primary[500],
                      cursor: 'pointer',
                    } as any}
                  >
                    Add
                  </span>
                </Pressable>
              ) : undefined
            }
          />
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          {hasCards ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
              {/* Company Bank Account Section - CEO only */}
              {role === 'ceo' && (
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
                  <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
                    {Platform.OS === 'web' && (
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.gray[400],
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                        fontFamily: 'Inter, system-ui, sans-serif',
                      } as any}>
                        COMPANY BANK ACCOUNT
                      </span>
                    )}
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray[100],
                  }}>
                    {renderBankBuildingSVG()}
                    <View style={{ flex: 1 }}>
                      {Platform.OS === 'web' && (
                        <>
                          <span style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: colors.gray[900],
                            fontFamily: 'Inter, system-ui, sans-serif',
                          } as any}>
                            Chase Business Checking
                          </span>
                          <span style={{
                            fontSize: 13,
                            color: colors.gray[500],
                            fontFamily: 'Inter, system-ui, sans-serif',
                          } as any}>
                            ****6789
                          </span>
                        </>
                      )}
                    </View>
                    <View style={{
                      backgroundColor: colors.success[50],
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}>
                      {Platform.OS === 'web' && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.success[600],
                          fontFamily: 'Inter, system-ui, sans-serif',
                        } as any}>
                          Connected
                        </span>
                      )}
                    </View>
                  </View>
                  <Pressable style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    alignItems: 'center',
                  }}>
                    {Platform.OS === 'web' && (
                      <span style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: colors.primary[500],
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      } as any}>
                        Edit
                      </span>
                    )}
                  </Pressable>
                </View>
              )}

              {/* Personal Cards Header - CEO only */}
              {role === 'ceo' && (
                <View style={{ paddingHorizontal: 0, paddingBottom: 4 }}>
                  {Platform.OS === 'web' && (
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: colors.gray[400],
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    } as any}>
                      PERSONAL CARDS
                    </span>
                  )}
                </View>
              )}

              {cards.map(card => (
                <Pressable
                  key={card.id}
                  onPress={() => {
                    setSelectedCard(card);
                    setView('cardDetail');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    ...(Platform.OS === 'web' ? {
                      backgroundColor: '#FFFFFF',
                    } : { backgroundColor: '#FFFFFF' }),
                    borderRadius: 14,
                  } as any}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    {card.type === 'visa' ? renderVisaIcon() : renderMastercardIcon()}
                    <View style={{ flexDirection: 'column', gap: 4 }}>
                      {Platform.OS === 'web' && (
                        <>
                          <span
                            style={{
                              fontSize: '15px',
                              fontWeight: '500',
                              color: colors.gray[800],
                              fontFamily: 'Inter, system-ui, sans-serif',
                            } as any}
                          >
                            {card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: colors.gray[600],
                              fontFamily: 'Inter, system-ui, sans-serif',
                            } as any}
                          >
                            Expires {card.expiry}
                          </span>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {card.isDefault && (
                      <View
                        style={{
                          backgroundColor: colors.primary[500],
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                        }}
                      >
                        {Platform.OS === 'web' && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: colors.white,
                              fontFamily: 'Inter, system-ui, sans-serif',
                            } as any}
                          >
                            Default
                          </span>
                        )}
                      </View>
                    )}
                    {renderChevronRightSVG()}
                  </View>
                </Pressable>
              ))}
              <View style={{ marginTop: 4 }}>
                <Button
                  title="Add Card"
                  variant="secondary"
                  onPress={() => setView('addCard')}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 48,
                gap: 16,
              }}
            >
              {Platform.OS === 'web' && (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke={colors.gray[300]} strokeWidth="1.5" />
                    <path d="M2 10H22" stroke={colors.gray[300]} strokeWidth="1.5" />
                    <path d="M6 15H10" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: colors.gray[900],
                      fontFamily: 'Inter, system-ui, sans-serif',
                    } as any}
                  >
                    No payout methods
                  </span>
                </>
              )}
              <Button
                title="Add a Card"
                variant="primary"
                onPress={() => setView('addCard')}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };

  // View: Add Card
  const renderAddCardView = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any}>
        <StatusBarMock />
        <View>
          <Navbar
            title="Add Card"
            onBack={() => {
              setView('list');
              setFormErrors({});
            }}
          />
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 24, gap: 16 }}>
            {/* Card Number */}
            <Input
              label="Card Number"
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={(text) => handleCardNumberChange(text)}
              error={formErrors.cardNumber}
              maxLength={19}
            />

            {/* Expiry and CVV */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={(text) => handleExpiryChange(text)}
                  error={formErrors.expiry}
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="CVV"
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={(text) => handleCVVChange(text)}
                  error={formErrors.cvv}
                  maxLength={4}
                />
              </View>
            </View>

            {/* Cardholder Name */}
            <Input
              label="Cardholder Name"
              placeholder="Cardholder Name"
              value={holderName}
              onChangeText={setHolderName}
              error={formErrors.holderName}
            />

            {/* Set as Default Toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
              {Platform.OS === 'web' && (
                <span
                  style={{
                    fontSize: '15px',
                    color: colors.gray[700],
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: '500',
                  } as any}
                >
                  Set as default payment method
                </span>
              )}
              <Toggle value={setAsDefault} onToggle={() => setSetAsDefault(!setAsDefault)} />
            </View>

            {/* Add Card Button */}
            <View style={{ marginTop: 8 }}>
              <Button
                title="Add Card"
                variant="primary"
                onPress={handleAddCard}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Bottom sheet overlay for card actions
  const renderCardActionSheet = () => {
    if (!selectedCard) return null;

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Backdrop */}
        <Pressable
          onPress={() => { setSelectedCard(null); setView('list'); }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
        {/* Sheet */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 12,
            paddingBottom: 34,
            paddingHorizontal: 16,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.gray[200] }} />
          </View>

          {/* Card info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20, paddingHorizontal: 4 }}>
            {selectedCard.type === 'visa' ? renderVisaIcon() : renderMastercardIcon()}
            <View style={{ gap: 2 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: colors.gray[900], fontFamily: 'Inter, system-ui, sans-serif' } as any}>
                    {selectedCard.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {selectedCard.last4}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.gray[500], fontFamily: 'Inter, system-ui, sans-serif' } as any}>
                    Expires {selectedCard.expiry}
                  </span>
                </>
              )}
            </View>
            {selectedCard.isDefault && (
              <View style={{ backgroundColor: colors.primary[500], paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 'auto' as any }}>
                {Platform.OS === 'web' && (
                  <span style={{ fontSize: '11px', fontWeight: '600', color: colors.white, fontFamily: 'Inter, system-ui, sans-serif' } as any}>Default</span>
                )}
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={{ gap: 10 }}>
            {!selectedCard.isDefault && (
              <Pressable
                onPress={handleSetAsDefault}
                style={{
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: colors.primary[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {Platform.OS === 'web' && (
                  <span style={{ fontSize: '15px', fontWeight: '600', color: colors.white, fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' } as any}>
                    Set as Default
                  </span>
                )}
              </Pressable>
            )}
            <Pressable
              onPress={() => setView('deleteConfirm')}
              style={{
                height: 52,
                borderRadius: 14,
                backgroundColor: colors.error[50] || '#FEF3F2',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Platform.OS === 'web' && (
                <span style={{ fontSize: '15px', fontWeight: '600', color: colors.error[500], fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' } as any}>
                  Remove Card
                </span>
              )}
            </Pressable>
            <Pressable
              onPress={() => { setSelectedCard(null); setView('list'); }}
              style={{
                height: 52,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Platform.OS === 'web' && (
                <span style={{ fontSize: '15px', fontWeight: '500', color: colors.gray[500], fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' } as any}>
                  Cancel
                </span>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // Delete confirmation modal overlay
  const renderDeleteConfirmOverlay = () => {
    if (!selectedCard) return null;

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
        }}
      >
        {/* Backdrop */}
        <Pressable
          onPress={() => setView('cardDetail')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
        {/* Modal */}
        <View
          style={{
            position: 'absolute',
            top: '50%' as any,
            left: 16,
            right: 16,
            transform: [{ translateY: -80 }],
            backgroundColor: colors.white,
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 24,
          }}
        >
          {Platform.OS === 'web' && (
            <>
              <span style={{ fontSize: '17px', fontWeight: '700', color: colors.gray[900], fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'center', display: 'block', marginBottom: '8px' } as any}>
                Remove Card?
              </span>
              <span style={{ fontSize: '14px', color: colors.gray[600], fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'center', display: 'block', marginBottom: '20px' } as any}>
                Are you sure you want to remove {selectedCard.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {selectedCard.last4}?
              </span>
            </>
          )}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Button title="Cancel" variant="secondary" onPress={() => setView('cardDetail')} />
            </View>
            <View style={{ flex: 1 }}>
              <Pressable
                onPress={handleDeleteCard}
                style={{
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: colors.error[500],
                  alignItems: 'center',
                }}
              >
                {Platform.OS === 'web' && (
                  <span style={{ fontSize: '15px', fontWeight: '600', color: colors.white, fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' } as any}>Remove</span>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // View: Success
  const renderSuccessView = () => {
    const lastCard = cards[cards.length - 1];

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any}>
        <StatusBarMock />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Animated.View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.success[500],
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {Platform.OS === 'web' && (
              <span
                style={{
                  fontSize: '44px',
                  color: colors.white,
                  fontWeight: 'bold',
                } as any}
              >
                ✓
              </span>
            )}
          </Animated.View>

          {Platform.OS === 'web' && (
            <>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.gray[900],
                  marginBottom: 8,
                  textAlign: 'center',
                  fontFamily: 'Inter, system-ui, sans-serif',
                } as any}
              >
                Card Added Successfully
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: colors.gray[700],
                  marginBottom: 24,
                  textAlign: 'center',
                  fontFamily: 'Inter, system-ui, sans-serif',
                } as any}
              >
                •••• {lastCard.last4} has been added to your payment methods
              </span>
            </>
          )}

          <Button
            title="Done"
            variant="primary"
            onPress={() => {
              scaleAnim.setValue(0);
              setView('list');
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Render based on current view
  if (view === 'addCard') return renderAddCardView();
  if (view === 'success') return renderSuccessView();

  // List is always the base, with overlays on top
  return (
    <View style={{ flex: 1 }}>
      {renderListView()}
      {view === 'cardDetail' && renderCardActionSheet()}
      {view === 'deleteConfirm' && renderDeleteConfirmOverlay()}
    </View>
  );
};
