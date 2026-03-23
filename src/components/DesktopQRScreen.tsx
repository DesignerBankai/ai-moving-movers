/**
 * DesktopQRScreen
 *
 * Shown inside the phone mockup on desktop when the user reaches
 * a camera/scanning flow that requires a real phone.
 *
 * Compact design — fits within the 390×844 phone frame.
 */

import React from 'react';
import { Platform } from 'react-native';
import { colors } from '../design-system/tokens/colors';

const F = 'Inter, system-ui, sans-serif';

const APP_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://ai-moving-mobile.vercel.app';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(APP_URL)}&size=180x180&color=1D2939&bgcolor=FFFFFF&margin=10&format=svg`;

/* ── Back chevron ── */
const BackChevron = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M10.306 15.9941C10.306 15.7597 10.3956 15.525 10.5745 15.3461L19.7403 6.18033C20.0984 5.82218 20.9272 5.96484 21.2852 6.32299C21.6431 6.68114 21.8502 7.55165 21.4921 7.90957L13.2235 15.9941L21.4921 24.1702C21.8502 24.5284 21.6921 25.3426 21.334 25.7005C20.9758 26.0585 20.0982 26.166 19.7403 25.8079L10.5745 16.6421C10.3956 16.4632 10.306 16.2285 10.306 15.9941Z"
      fill={colors.primary[500]}
    />
  </svg>
);

/* ── Scan frame corners ── */
const ScanFrame = () => (
  <svg width="212" height="212" viewBox="0 0 212 212" fill="none"
    style={{ position: 'absolute' } as any}>
    <path d="M12 38V12H38"    stroke={colors.primary[400]} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M200 38V12H174"  stroke={colors.primary[400]} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M12 174V200H38"  stroke={colors.primary[400]} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M200 174V200H174" stroke={colors.primary[400]} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

/* ── Phone icon ── */
const PhoneIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="9" y="3" width="22" height="34" rx="5" fill={colors.primary[50]} stroke={colors.primary[300]} strokeWidth="1.5"/>
    <rect x="13" y="9" width="14" height="19" rx="2" fill={colors.primary[100]}/>
    <circle cx="20" cy="33" r="1.5" fill={colors.primary[300]}/>
    <path d="M17 6h6" stroke={colors.primary[300]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

interface DesktopQRScreenProps {
  onBack?: () => void;
}

export const DesktopQRScreen: React.FC<DesktopQRScreenProps> = ({ onBack }) => {
  if (Platform.OS !== 'web') return null;

  return (
    <div style={{
      height: '100%',
      backgroundColor: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: F,
      overflow: 'hidden',
    } as any}>

      {/* Status bar area */}
      <div style={{
        paddingTop: 21,
        paddingBottom: 10,
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      } as any}>
        <span style={{ fontSize: 17, fontWeight: 600, color: colors.gray[900] } as any}>
          {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
        </span>
      </div>

      {/* Navbar with back button */}
      <div style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 8,
        display: 'flex',
        alignItems: 'center',
      } as any}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              width: 32,
              height: 32,
            } as any}
          >
            <BackChevron />
          </button>
        )}
      </div>

      {/* Content — vertically centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px 32px',
      } as any}>

        {/* Icon */}
        <div style={{ marginBottom: 14 } as any}>
          <PhoneIcon />
        </div>

        {/* Title */}
        <span style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.gray[900],
          textAlign: 'center',
          lineHeight: '28px',
          display: 'block',
          marginBottom: 8,
        } as any}>
          Continue on your phone
        </span>

        {/* Subtitle */}
        <span style={{
          fontSize: 13,
          fontWeight: 400,
          color: colors.gray[400],
          textAlign: 'center',
          lineHeight: '18px',
          display: 'block',
          marginBottom: 28,
          maxWidth: 260,
        } as any}>
          This step requires your phone's camera. Scan the QR code to continue right where you left off.
        </span>

        {/* QR + scan frame */}
        <div style={{
          position: 'relative',
          width: 212,
          height: 212,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        } as any}>
          <ScanFrame />
          <div style={{
            width: 180,
            height: 180,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          } as any}>
            <img
              src={QR_URL}
              alt="QR code to open app on phone"
              width={180}
              height={180}
              style={{ display: 'block' } as any}
            />
          </div>
        </div>

        {/* URL chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: colors.primary[50],
          borderRadius: 8,
          padding: '7px 12px',
          maxWidth: '100%',
          overflow: 'hidden',
        } as any}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 } as any}>
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.primary[600],
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          } as any}>
            {APP_URL}
          </span>
        </div>
      </div>
    </div>
  );
};
