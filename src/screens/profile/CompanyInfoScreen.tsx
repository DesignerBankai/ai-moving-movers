/**
 * AI Moving — Company Info Screen
 *
 * White header (status bar + nav bar) matching the bottom tab bar.
 * Light-blue tinted content area with pure white cards.
 * View mode: label + value rows. Edit mode: inline inputs.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';

interface CompanyInfoScreenProps {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  licenseNumber: string;
  insuranceNumber: string;
  onSave: (data: { companyName: string; companyAddress: string; companyPhone: string; companyEmail: string; licenseNumber: string; insuranceNumber: string }) => void;
  onBack: () => void;
}

export const CompanyInfoScreen: React.FC<CompanyInfoScreenProps> = ({
  companyName: initCompanyName,
  companyAddress: initCompanyAddress,
  companyPhone: initCompanyPhone,
  companyEmail: initCompanyEmail,
  licenseNumber: initLicenseNumber,
  insuranceNumber: initInsuranceNumber,
  onSave,
  onBack,
}) => {
  const [editing, setEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [companyName, setCompanyName] = useState(initCompanyName);
  const [companyAddress, setCompanyAddress] = useState(initCompanyAddress);
  const [companyPhone, setCompanyPhone] = useState(initCompanyPhone);
  const [companyEmail, setCompanyEmail] = useState(initCompanyEmail);
  const [licenseNumber, setLicenseNumber] = useState(initLicenseNumber);
  const [insuranceNumber, setInsuranceNumber] = useState(initInsuranceNumber);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = 'Required';
    if (!companyEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) e.companyEmail = 'Invalid email';
    if (!companyPhone.trim() || companyPhone.replace(/\D/g, '').length < 10) e.companyPhone = 'Invalid phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      licenseNumber,
      insuranceNumber,
    });
    setEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2200);
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setCompanyName(initCompanyName);
    setCompanyAddress(initCompanyAddress);
    setCompanyPhone(initCompanyPhone);
    setCompanyEmail(initCompanyEmail);
    setLicenseNumber(initLicenseNumber);
    setInsuranceNumber(initInsuranceNumber);
  };

  const F = fontFamily.primary;

  if (Platform.OS !== 'web') return null;

  /* ── Field row (view mode) ── */
  const FieldRow = ({ label, value, last }: { label: string; value: string; last?: boolean }) => (
    <div style={{
      paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
      borderBottom: last ? 'none' : `1px solid ${colors.gray[100]}`,
    } as any}>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', marginBottom: 5 } as any}>
        {label}
      </span>
      <span style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: colors.gray[900], display: 'block' } as any}>
        {value || '—'}
      </span>
    </div>
  );

  /* ── Input field (edit mode) ── */
  const InputField = ({ label, value, onChange, error, last }: {
    label: string; value: string; onChange: (v: string) => void; error?: string; last?: boolean;
  }) => (
    <div style={{
      paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
      borderBottom: last ? 'none' : `1px solid ${colors.gray[100]}`,
    } as any}>
      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.6, display: 'block', marginBottom: 8 } as any}>
        {label}
      </span>
      <input
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        style={{
          fontFamily: F, fontSize: 16, fontWeight: 400,
          color: colors.gray[900], backgroundColor: 'transparent',
          border: 'none', outline: 'none', width: '100%',
          padding: 0,
        } as any}
      />
      {error && (
        <span style={{ fontFamily: F, fontSize: 13, color: colors.error[500], display: 'block', marginTop: 4 } as any}>
          {error}
        </span>
      )}
    </div>
  );

  return (
    <SafeAreaView style={s.safe}>

      {/* ══ HEADER ══ status bar + nav bar */}
      <div style={{ backgroundColor: 'transparent' } as any}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Nav bar row */}
        <div style={{
          display: 'flex', flexDirection: 'row' as const, alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 6, paddingRight: 16,
          paddingTop: 4, paddingBottom: 12,
        } as any}>

          {/* Back arrow or Cancel */}
          <Pressable onPress={editing ? handleCancel : onBack} hitSlop={8}>
            <div style={{ display: 'flex', flexDirection: 'row' as const, alignItems: 'center', minWidth: 60 } as any}>
              {editing ? (
                <span style={{ fontFamily: F, fontSize: 16, fontWeight: 500, color: colors.gray[500], paddingLeft: 10 } as any}>
                  Cancel
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 } as any}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <path d="M10.306 15.994C10.306 15.76 10.396 15.525 10.575 15.346L19.74 6.18C20.098 5.822 20.927 5.965 21.285 6.323C21.643 6.681 21.85 7.552 21.492 7.91L13.224 15.994L21.492 24.17C21.85 24.528 21.692 25.343 21.334 25.701C20.976 26.059 20.098 26.166 19.74 25.808L10.575 16.642C10.396 16.463 10.306 16.229 10.306 15.994Z" fill={colors.primary[500]} />
                  </svg>
                </div>
              )}
            </div>
          </Pressable>

          {/* Centered title */}
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: -0.43, color: '#212225' } as any}>
            Company Info
          </span>

          {/* Edit / Save */}
          <Pressable onPress={editing ? handleSave : () => setEditing(true)} hitSlop={8}>
            <span style={{
              fontFamily: F, fontSize: 16, fontWeight: 600,
              color: colors.primary[500],
              minWidth: 60, textAlign: 'right' as const, display: 'block',
            } as any}>
              {editing ? 'Save' : 'Edit'}
            </span>
          </Pressable>
        </div>
      </div>

      {/* ══ TINTED CONTENT AREA ══ primary[50] bg + white cards */}
      <div style={{ flex: 1, backgroundColor: '#FAFAFA', overflowY: 'auto' as const } as any}>
        <div style={{ padding: '16px 16px 48px' } as any}>

          {/* Success banner */}
          {showSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              backgroundColor: colors.success[500], borderRadius: 14,
              padding: '12px 16px', marginBottom: 12,
            } as any}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.3"/>
                <path d="M7 12L10.5 15.5L17 8.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: '#FFFFFF' } as any}>
                Changes saved successfully
              </span>
            </div>
          )}

          {/* White info card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' } as any}>
            {!editing ? (
              <>
                <FieldRow label="Company Name"    value={companyName} />
                <FieldRow label="Company Address" value={companyAddress} />
                <FieldRow label="Phone"           value={companyPhone} />
                <FieldRow label="Email"           value={companyEmail} />
                <FieldRow label="License Number"  value={licenseNumber} />
                <FieldRow label="Insurance Number" value={insuranceNumber} last />
              </>
            ) : (
              <>
                <InputField label="Company Name"    value={companyName}    onChange={setCompanyName}    error={errors.companyName} />
                <InputField label="Company Address" value={companyAddress} onChange={setCompanyAddress} />
                <InputField label="Phone"           value={companyPhone}   onChange={setCompanyPhone}   error={errors.companyPhone} />
                <InputField label="Email"           value={companyEmail}   onChange={setCompanyEmail}   error={errors.companyEmail} />
                <InputField label="License Number"  value={licenseNumber}  onChange={setLicenseNumber} />
                <InputField label="Insurance Number" value={insuranceNumber} onChange={setInsuranceNumber} last />
              </>
            )}
          </div>

        </div>
      </div>

    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
});
