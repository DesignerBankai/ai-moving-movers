import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { StatusBarMock, Navbar, Button, Input } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

export interface SavedAddress {
  id: string;
  label: 'home' | 'work' | 'other';
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  instructions?: string;
}

interface SavedAddressesScreenProps {
  initialAddresses: SavedAddress[];
  onBack: () => void;
}

type ViewType = 'list' | 'add' | 'edit';

const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
  initialAddresses,
  onBack,
}) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successOpacity] = useState(new Animated.Value(1));

  const [formData, setFormData] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    instructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (showSuccessBanner) {
      successOpacity.setValue(1);
      const timer = setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }).start(() => setShowSuccessBanner(false));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner, successOpacity]);

  const resetForm = () => {
    setFormData({ address1: '', address2: '', city: '', state: '', zip: '', instructions: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    if (!formData.zip.trim()) newErrors.zip = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    resetForm();
    setEditingId(null);
    setCurrentView('add');
  };

  const handleEditAddress = (address: SavedAddress) => {
    setFormData({
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      instructions: address.instructions || '',
    });
    setEditingId(address.id);
    setCurrentView('edit');
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;

    if (editingId) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...addr, ...formData, label: addr.label } : addr
        )
      );
    } else {
      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        label: 'other',
        ...formData,
      };
      setAddresses([...addresses, newAddress]);
    }

    setShowSuccessBanner(true);
    setCurrentView('list');
    resetForm();
  };

  const handleDeleteAddress = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setAddresses(addresses.filter((addr) => addr.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // SVG icons
  const EditIcon = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 0l.6.6a1.2 1.2 0 0 1 0 1.7l-1.1 1.1-2.3-2.3 1.1-1.1Zm-1.8 1.8L4 13.7V16h2.3l9.05-9.05-2.3-2.3Z" fill={colors.gray[400]} />
      </svg>
    );
  };

  const TrashIcon = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7 2h6v1H7V2Zm-4 2h14v1H3V4Zm2 2h10l-.7 11.1a1 1 0 0 1-1 .9H6.7a1 1 0 0 1-1-.9L5 6Zm3 2v7h1V8H8Zm3 0v7h1V8h-1Z" fill={colors.gray[400]} />
      </svg>
    );
  };

  // LIST VIEW
  if (currentView === 'list') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any}>
        <StatusBarMock />
        <Navbar
          title="Saved Addresses"
          onBack={onBack}
          rightAction={
            Platform.OS === 'web' ? (
              <Pressable onPress={handleAddAddress} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: colors.primary[500], cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Add
                </span>
              </Pressable>
            ) : undefined
          }
        />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Success Banner */}
          {showSuccessBanner && (
            <Animated.View
              style={{
                backgroundColor: colors.success[500],
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginTop: 12,
                marginHorizontal: 16,
                borderRadius: 12,
                opacity: successOpacity,
              }}
            >
              {Platform.OS === 'web' && (
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', color: colors.white, fontWeight: '500', fontSize: '14px' }}>
                  Address saved successfully
                </span>
              )}
            </Animated.View>
          )}

          {/* Content */}
          {addresses.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: 16 }}>
              {Platform.OS === 'web' && (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill={colors.gray[300]} />
                  </svg>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '18px', fontWeight: '600', color: colors.gray[900], marginBottom: '8px', textAlign: 'center' }}>
                    No saved addresses
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: colors.gray[600], marginBottom: '24px', textAlign: 'center' }}>
                    Add your first address to get started
                  </span>
                </>
              )}
              <Button title="Add Address" onPress={handleAddAddress} variant="primary" />
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 12 }}>
              {addresses.map((address) => (
                <View
                  key={address.id}
                  style={{
                    ...(Platform.OS === 'web' ? {
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                    } : { backgroundColor: 'rgba(255,255,255,0.7)' }),
                    borderRadius: 14,
                    padding: 16,
                  } as any}
                >
                  {/* Address + actions row */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      {Platform.OS === 'web' && (
                        <>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', fontWeight: '500', color: colors.gray[900], marginBottom: '4px', display: 'block' }}>
                            {address.address1}{address.address2 ? `, ${address.address2}` : ''}
                          </span>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px', color: colors.gray[500] }}>
                            {address.city}, {address.state} {address.zip}
                          </span>
                        </>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Pressable onPress={() => handleEditAddress(address)} style={{ padding: 6 }}>
                        <EditIcon />
                      </Pressable>
                      <Pressable onPress={() => handleDeleteAddress(address.id)} style={{ padding: 6 }}>
                        <TrashIcon />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
            <Pressable
              onPress={() => setShowDeleteModal(false)}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
            <View style={{ position: 'absolute', top: '50%' as any, left: 16, right: 16, transform: [{ translateY: -80 }], backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 }}>
              {Platform.OS === 'web' && (
                <>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '17px', fontWeight: '700', color: colors.gray[900], textAlign: 'center', display: 'block', marginBottom: '8px' }}>
                    Delete Address?
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: colors.gray[600], textAlign: 'center', display: 'block', marginBottom: '20px' }}>
                    Are you sure you want to delete this address?
                  </span>
                </>
              )}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Button title="Cancel" variant="secondary" onPress={() => setShowDeleteModal(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Pressable
                    onPress={confirmDelete}
                    style={{ height: 48, borderRadius: 14, backgroundColor: colors.error[500], alignItems: 'center', justifyContent: 'center' }}
                  >
                    {Platform.OS === 'web' && (
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', fontWeight: '600', color: colors.white, cursor: 'pointer' }}>Delete</span>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ADD/EDIT VIEW
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' } as any}>
        <StatusBarMock />
        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.gray[100] }}>
          <Navbar
            title={currentView === 'add' ? 'Add Address' : 'Edit Address'}
            onBack={() => setCurrentView('list')}
          />
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 20, gap: 16 }}>
            <Input
              label="Address Line 1"
              placeholder="Address Line 1"
              value={formData.address1}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, address1: text }))}
              error={errors.address1}
            />

            <Input
              label="Address Line 2 (Optional)"
              placeholder="Apt, Suite, etc."
              value={formData.address2 || ''}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, address2: text }))}
            />

            <Input
              label="City"
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
              error={errors.city}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="State"
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, state: text }))}
                  error={errors.state}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, zip: text }))}
                  error={errors.zip}
                />
              </View>
            </View>

            <Input
              label="Special Instructions (Optional)"
              placeholder="e.g., Ring doorbell, gate code 1234"
              value={formData.instructions || ''}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, instructions: text }))}
              multiline
              numberOfLines={4}
              style={{ minHeight: 80 }}
            />

            <View style={{ marginTop: 8 }}>
              <Button
                title="Save Address"
                onPress={handleSaveAddress}
                variant="primary"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
};

export { SavedAddressesScreen };
