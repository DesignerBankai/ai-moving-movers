/**
 * AI Moving — Sign Out Confirmation Modal
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { colors } from '../../design-system/tokens/colors';

interface SignOutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <Pressable style={s.backdrop} onPress={onCancel} />
      <View style={s.modal}>
        {/* Icon */}
        <View style={s.iconWrap}>
          {Platform.OS === 'web' && (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 17L21 12L16 7" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke={colors.error[500]} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </View>

        {/* Title */}
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700, color: colors.gray[900], textAlign: 'center', marginTop: 16 } as any}>
            Sign Out?
          </span>
        ) : null}

        {/* Subtitle */}
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400, color: colors.gray[400], textAlign: 'center', marginTop: 8, lineHeight: '20px' } as any}>
            Are you sure you want to sign out of your account?
          </span>
        ) : null}

        {/* Buttons */}
        <View style={s.buttons}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [s.btn, s.btnCancel, pressed && { opacity: 0.8 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.gray[700] } as any}>
                Cancel
              </span>
            ) : null}
          </Pressable>
          <View style={{ width: 12 }} />
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [s.btn, s.btnSignOut, pressed && { opacity: 0.8 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.white } as any}>
                Sign Out
              </span>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modal: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 1000,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.error[50] || '#FEF3F2',
    alignItems: 'center', justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: colors.gray[100],
  },
  btnSignOut: {
    backgroundColor: colors.error[500],
  },
});
