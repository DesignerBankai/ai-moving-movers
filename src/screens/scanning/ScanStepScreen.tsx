/**
 * AI Moving — Scan Step Screen (Screen 9)
 *
 * Speak-app inspired design with large phone mockup illustrations
 * that fade into the background at the bottom.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
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

/* ── Inject CSS animations once ── */
const ANIM_STYLE_ID = 'scan-step-animations';

function injectAnimations() {
  if (Platform.OS !== 'web') return;
  if (document.getElementById(ANIM_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = ANIM_STYLE_ID;
  style.textContent = `
    @keyframes scanBeam {
      0%, 100% { transform: translateY(0px); opacity: 0.4; }
      50% { transform: translateY(280px); opacity: 0.9; }
    }
    @keyframes itemFadeIn1 {
      0% { opacity: 0; transform: translateY(8px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes itemFadeIn2 {
      0%, 25% { opacity: 0; transform: translateY(8px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes itemFadeIn3 {
      0%, 50% { opacity: 0; transform: translateY(8px) scale(0.9); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes checkPop1 {
      0%, 40% { opacity: 0; transform: scale(0); }
      70% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes checkPop2 {
      0%, 55% { opacity: 0; transform: scale(0); }
      85% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes checkPop3 {
      0%, 70% { opacity: 0; transform: scale(0); }
      95% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes estimateSlideUp {
      0% { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes pricePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    @keyframes badgeAppear {
      0% { opacity: 0; transform: scale(0) rotate(-30deg); }
      60% { opacity: 1; transform: scale(1.15) rotate(5deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes cornerPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes labelPop {
      0% { opacity: 0; transform: scale(0.7) translateY(4px); }
      60% { opacity: 1; transform: scale(1.05) translateY(-1px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/* ── Step data ── */
const SCAN_STEPS = [
  {
    title: 'Point & Scan',
    description: 'Hold your phone steady and slowly pan across the room. The camera will automatically detect and outline items.',
  },
  {
    title: 'Review Items',
    description: 'After scanning, review the detected items list. Add missed items or remove ones you don\'t plan to move.',
  },
  {
    title: 'Confirm & Estimate',
    description: 'Once your inventory is complete, confirm the list and get an accurate moving cost estimate.',
  },
];

/* ── Furniture SVGs — Braun/Dieter Rams inspired ──
 * Clean rounded forms, warm cream/beige palette,
 * subtle gradients + soft drop shadows for 3D depth. */

const SofaSVG = () => (
  <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
    <defs>
      <linearGradient id="sf1" x1="70" y1="15" x2="70" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAF5EE" /><stop offset="1" stopColor="#E8DED2" />
      </linearGradient>
      <linearGradient id="sf2" x1="70" y1="38" x2="70" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF9F2" /><stop offset="1" stopColor="#F0E6D8" />
      </linearGradient>
    </defs>
    {/* Soft shadow */}
    <ellipse cx="70" cy="82" rx="54" ry="6" fill="#D5C8B8" fillOpacity="0.3" />
    {/* Back rest */}
    <rect x="16" y="15" width="108" height="28" rx="10" fill="url(#sf1)" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Seat cushion */}
    <rect x="16" y="40" width="108" height="24" rx="8" fill="url(#sf2)" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Left arm */}
    <rect x="4" y="20" width="18" height="44" rx="8" fill="#F0E8DC" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Right arm */}
    <rect x="118" y="20" width="18" height="44" rx="8" fill="#F0E8DC" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Cushion split */}
    <line x1="70" y1="43" x2="70" y2="61" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Pillow left */}
    <ellipse cx="48" cy="30" rx="16" ry="10" fill="#F5EDE4" stroke="#E0D6C8" strokeWidth="0.6" />
    {/* Pillow right */}
    <ellipse cx="92" cy="30" rx="16" ry="10" fill="#EDE4D8" stroke="#E0D6C8" strokeWidth="0.6" />
    {/* Legs */}
    <rect x="24" y="64" width="3" height="12" rx="1.5" fill="#C4B8A8" />
    <rect x="113" y="64" width="3" height="12" rx="1.5" fill="#C4B8A8" />
  </svg>
);

const LampSVG = () => (
  <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
    <defs>
      <linearGradient id="lsh" x1="30" y1="2" x2="30" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF8EE" /><stop offset="1" stopColor="#F0E6D8" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="30" cy="95" rx="16" ry="4" fill="#D5C8B8" fillOpacity="0.25" />
    {/* Shade — smooth trapezoid */}
    <path d="M12 44 L16 6 Q30 10 44 6 L48 44 Z" fill="url(#lsh)" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Inner glow */}
    <ellipse cx="30" cy="26" rx="10" ry="8" fill="#FFFBF2" fillOpacity="0.5" />
    {/* Pole */}
    <rect x="28" y="44" width="4" height="40" rx="2" fill="#D5C8B8" />
    <rect x="29" y="44" width="2" height="40" rx="1" fill="#E0D6C8" fillOpacity="0.6" />
    {/* Base disc */}
    <ellipse cx="30" cy="88" rx="16" ry="6" fill="#E8DED2" stroke="#D5C8B8" strokeWidth="0.6" />
    <ellipse cx="30" cy="87" rx="13" ry="4.5" fill="#F0E8DC" />
  </svg>
);

const BoxesSVG = () => (
  <svg width="120" height="85" viewBox="0 0 120 85" fill="none">
    <defs>
      <linearGradient id="bx1" x1="38" y1="26" x2="38" y2="78" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0E6D8" /><stop offset="1" stopColor="#E0D4C4" />
      </linearGradient>
      <linearGradient id="bx2" x1="80" y1="8" x2="80" y2="55" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E8DED2" /><stop offset="1" stopColor="#D8CCC0" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="55" cy="80" rx="50" ry="4" fill="#C4B8A8" fillOpacity="0.25" />
    {/* Back box (smaller, behind) */}
    <rect x="52" y="10" width="52" height="44" rx="5" fill="url(#bx2)" stroke="#CFC2B2" strokeWidth="0.8" />
    <line x1="78" y1="10" x2="78" y2="54" stroke="#CFC2B2" strokeWidth="0.6" />
    {/* Back box tape */}
    <rect x="74" y="10" width="8" height="8" rx="1.5" fill="#F5EDE4" fillOpacity="0.7" />
    {/* Front box (larger, front) */}
    <rect x="8" y="28" width="60" height="48" rx="5" fill="url(#bx1)" stroke="#CFC2B2" strokeWidth="0.8" />
    <line x1="38" y1="28" x2="38" y2="76" stroke="#CFC2B2" strokeWidth="0.6" />
    {/* Front box tape */}
    <rect x="34" y="28" width="8" height="9" rx="1.5" fill="#F5EDE4" fillOpacity="0.7" />
    {/* Front box flaps hint */}
    <path d="M10 30 Q38 36 66 30" stroke="#D8CCC0" strokeWidth="0.5" fill="none" />
  </svg>
);

const TruckSVG = () => (
  <svg width="160" height="100" viewBox="0 0 160 100" fill="none">
    <defs>
      <linearGradient id="trk1" x1="65" y1="14" x2="65" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FAF5EE" /><stop offset="1" stopColor="#E8DED2" />
      </linearGradient>
      <linearGradient id="trk2" x1="130" y1="30" x2="130" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0E8DC" /><stop offset="1" stopColor="#DDD2C4" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="80" cy="92" rx="66" ry="6" fill="#C4B8A8" fillOpacity="0.25" />
    {/* Cargo body */}
    <rect x="6" y="16" width="100" height="56" rx="6" fill="url(#trk1)" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Cargo door lines */}
    <line x1="56" y1="20" x2="56" y2="68" stroke="#DDD2C4" strokeWidth="0.6" />
    <rect x="52" y="38" width="8" height="5" rx="2" fill="#D5C8B8" />
    {/* Cab */}
    <rect x="106" y="32" width="46" height="40" rx="6" fill="url(#trk2)" stroke="#DDD2C4" strokeWidth="0.8" />
    {/* Windshield */}
    <rect x="120" y="38" width="26" height="18" rx="4" fill="#E8F0F8" stroke="#C8D8E8" strokeWidth="0.6" />
    {/* Bumper */}
    <rect x="106" y="68" width="48" height="6" rx="3" fill="#DDD2C4" />
    {/* Wheels */}
    <circle cx="30" cy="78" r="12" fill="#888" stroke="#666" strokeWidth="1.5" />
    <circle cx="30" cy="78" r="5" fill="#AAA" />
    <circle cx="126" cy="78" r="12" fill="#888" stroke="#666" strokeWidth="1.5" />
    <circle cx="126" cy="78" r="5" fill="#AAA" />
    {/* Headlight */}
    <rect x="148" y="50" width="5" height="8" rx="2" fill="#FFF0C8" stroke="#E8D8B0" strokeWidth="0.5" />
  </svg>
);

const CabinetSVG = () => (
  <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
    <defs>
      <linearGradient id="cab1" x1="35" y1="4" x2="35" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5EDE4" /><stop offset="1" stopColor="#E0D6C8" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="35" cy="86" rx="28" ry="4" fill="#C4B8A8" fillOpacity="0.2" />
    {/* Body */}
    <rect x="6" y="4" width="58" height="76" rx="4" fill="url(#cab1)" stroke="#D5C8B8" strokeWidth="0.8" />
    {/* Top doors */}
    <rect x="10" y="8" width="23" height="30" rx="2" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.6" />
    <rect x="37" y="8" width="23" height="30" rx="2" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.6" />
    {/* Door knobs */}
    <circle cx="30" cy="23" r="2" fill="#D4B896" />
    <circle cx="40" cy="23" r="2" fill="#D4B896" />
    {/* Bottom drawers */}
    <rect x="10" y="42" width="50" height="14" rx="2" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.6" />
    <rect x="10" y="60" width="50" height="14" rx="2" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.6" />
    {/* Drawer pulls */}
    <rect x="28" y="48" width="14" height="3" rx="1.5" fill="#D4B896" />
    <rect x="28" y="65" width="14" height="3" rx="1.5" fill="#D4B896" />
    {/* Legs */}
    <rect x="12" y="80" width="3" height="6" rx="1.5" fill="#C4B8A8" />
    <rect x="55" y="80" width="3" height="6" rx="1.5" fill="#C4B8A8" />
  </svg>
);

/* Mini icons for Review Items list */
const MiniSofa = () => (
  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
    <rect x="3" y="4" width="26" height="7" rx="3" fill="#F0E8DC" stroke="#DDD2C4" strokeWidth="0.5" />
    <rect x="3" y="9" width="26" height="6" rx="2.5" fill="#FAF5EE" stroke="#DDD2C4" strokeWidth="0.5" />
    <rect x="0" y="5" width="5" height="10" rx="2.5" fill="#F0E8DC" stroke="#DDD2C4" strokeWidth="0.5" />
    <rect x="27" y="5" width="5" height="10" rx="2.5" fill="#F0E8DC" stroke="#DDD2C4" strokeWidth="0.5" />
    <rect x="8" y="15" width="2" height="3" rx="1" fill="#C4B8A8" />
    <rect x="22" y="15" width="2" height="3" rx="1" fill="#C4B8A8" />
  </svg>
);
const MiniLamp = () => (
  <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
    <path d="M5 14 L7 4 Q10 5.5 13 4 L15 14 Z" fill="#F5EDE4" stroke="#DDD2C4" strokeWidth="0.5" />
    <rect x="9" y="14" width="2" height="10" rx="1" fill="#D5C8B8" />
    <ellipse cx="10" cy="25.5" rx="5" ry="2" fill="#E8DED2" stroke="#D5C8B8" strokeWidth="0.4" />
  </svg>
);
const MiniBox = () => (
  <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
    <rect x="2" y="3" width="20" height="17" rx="3" fill="#F0E6D8" stroke="#CFC2B2" strokeWidth="0.5" />
    <line x1="12" y1="3" x2="12" y2="20" stroke="#CFC2B2" strokeWidth="0.5" />
    <rect x="9" y="3" width="6" height="3.5" rx="1" fill="#F5EDE4" fillOpacity="0.8" />
  </svg>
);
const MiniShelf = () => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
    <rect x="3" y="2" width="18" height="24" rx="2" fill="#F0E8DC" stroke="#D5C8B8" strokeWidth="0.5" />
    <rect x="5" y="4" width="7" height="9" rx="1" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.4" />
    <rect x="14" y="4" width="5" height="9" rx="1" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.4" />
    <circle cx="11" cy="9" r="1" fill="#D4B896" />
    <circle cx="15" cy="9" r="1" fill="#D4B896" />
    <rect x="5" y="15" width="14" height="4" rx="1" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.4" />
    <rect x="5" y="21" width="14" height="3" rx="1" fill="#FFF9F2" stroke="#DDD2C4" strokeWidth="0.4" />
    <rect x="9" y="16.5" width="6" height="1.5" rx="0.75" fill="#D4B896" />
  </svg>
);

/* ── Large phone mockup with bottom gradient fade ── */
const PhoneMockup = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS !== 'web') {
    return (
      <View style={phoneStyles.fallback}>
        <Text variant="bodySm" color={colors.gray[400]}>Illustration</Text>
      </View>
    );
  }

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center' as const,
      position: 'relative' as const,
      overflow: 'hidden',
      height: 420,
    }}>
      {/* Phone body — large, only top portion visible */}
      <div style={{
        width: 280,
        height: 560,
        flexShrink: 0,
        borderRadius: 40,
        background: `linear-gradient(145deg, ${colors.gray[100]} 0%, ${colors.gray[200]} 50%, ${colors.gray[100]} 100%)`,
        boxShadow: '0 16px 56px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05)',
        padding: 4,
        position: 'relative' as const,
        marginTop: 0,
      }}>
        {/* Inner white bezel */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 36,
          background: '#FFFFFF',
          overflow: 'hidden',
          position: 'relative' as const,
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: 'absolute' as const,
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 26,
            borderRadius: 15,
            background: colors.gray[200],
            zIndex: 10,
          }} />

          {/* Screen area */}
          <div style={{
            position: 'absolute' as const,
            top: 46,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: 28,
            background: 'linear-gradient(180deg, #EFF6FF 0%, #E8F2FF 100%)',
            overflow: 'hidden',
          }}>
            {children}
          </div>
        </div>
      </div>

      {/* Bottom fade removed — clean edge */}
    </div>
  );
};

const phoneStyles = StyleSheet.create({
  fallback: {
    width: 280,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 40,
  },
});

/* ── Step 1: Point & Scan ── */
const ScanIllustration = () => {
  if (Platform.OS !== 'web') return null;

  return (
    <PhoneMockup>
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(145deg, #EEF4FF 0%, #E4EEFF 50%, #F0F6FF 100%)',
        position: 'relative' as const,
      }}>
        {/* Corner brackets */}
        <svg width="100%" height="100%" viewBox="0 0 268 500" fill="none"
          style={{ position: 'absolute' as const, top: 0, left: 0 }}>
          <g style={{ animation: 'cornerPulse 2s ease-in-out infinite' }}>
            <path d="M40 70 L40 45 L65 45" stroke="#2E90FA" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={{ animation: 'cornerPulse 2s ease-in-out infinite 0.5s' }}>
            <path d="M228 70 L228 45 L203 45" stroke="#2E90FA" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={{ animation: 'cornerPulse 2s ease-in-out infinite 1s' }}>
            <path d="M40 380 L40 405 L65 405" stroke="#2E90FA" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={{ animation: 'cornerPulse 2s ease-in-out infinite 1.5s' }}>
            <path d="M228 380 L228 405 L203 405" stroke="#2E90FA" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>

        {/* Scanning beam — z-index above furniture */}
        <div style={{
          position: 'absolute' as const,
          top: 60,
          left: 25,
          right: 25,
          height: 3,
          borderRadius: 2,
          background: 'linear-gradient(90deg, transparent 0%, #2E90FA 30%, #2E90FA 70%, transparent 100%)',
          boxShadow: '0 0 16px rgba(46,144,250,0.5)',
          animation: 'scanBeam 2.8s ease-in-out infinite',
          zIndex: 10,
        }} />
        {/* Beam glow */}
        <div style={{
          position: 'absolute' as const,
          top: 60,
          left: 25,
          right: 25,
          height: 24,
          borderRadius: 12,
          background: 'linear-gradient(180deg, rgba(46,144,250,0.15) 0%, transparent 100%)',
          animation: 'scanBeam 2.8s ease-in-out infinite',
          zIndex: 10,
        }} />

        {/* Sofa — center-left */}
        <div style={{
          position: 'absolute' as const,
          top: 90,
          left: 20,
          animation: 'itemFadeIn1 1.2s ease-out forwards',
        }}>
          <SofaSVG />
          <div style={{
            position: 'absolute' as const,
            top: -8,
            right: 0,
            background: '#2E90FA',
            color: 'white',
            fontSize: 9,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '3px 7px',
            borderRadius: 6,
            boxShadow: '0 2px 6px rgba(46,144,250,0.3)',
            animation: 'labelPop 0.8s ease-out 0.6s both',
          }}>Sofa</div>
        </div>

        {/* Lamp — right */}
        <div style={{
          position: 'absolute' as const,
          top: 50,
          right: 25,
          animation: 'itemFadeIn2 1.2s ease-out forwards',
        }}>
          <LampSVG />
          <div style={{
            position: 'absolute' as const,
            top: -8,
            right: -4,
            background: '#2E90FA',
            color: 'white',
            fontSize: 9,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '3px 7px',
            borderRadius: 6,
            boxShadow: '0 2px 6px rgba(46,144,250,0.3)',
            animation: 'labelPop 0.8s ease-out 0.9s both',
          }}>Lamp</div>
        </div>

        {/* Boxes — bottom center */}
        <div style={{
          position: 'absolute' as const,
          top: 200,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'itemFadeIn3 1.2s ease-out forwards',
        }}>
          <BoxesSVG />
          <div style={{
            position: 'absolute' as const,
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#2E90FA',
            color: 'white',
            fontSize: 9,
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '3px 7px',
            borderRadius: 6,
            whiteSpace: 'nowrap' as const,
            boxShadow: '0 2px 6px rgba(46,144,250,0.3)',
            animation: 'labelPop 0.8s ease-out 1.2s both',
          }}>Boxes</div>
        </div>

        {/* Items found badge */}
        <div style={{
          position: 'absolute' as const,
          bottom: 150,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 14,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center' as const,
          gap: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4,
            background: '#2E90FA',
            animation: 'cornerPulse 1.5s ease infinite',
          }} />
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            color: '#2E90FA',
          }}>3 items found</span>
        </div>
      </div>
    </PhoneMockup>
  );
};

/* ── Step 2: Review Items ── */
const ReviewIllustration = () => {
  if (Platform.OS !== 'web') return null;

  const items = [
    { name: 'Sofa', dims: '200 × 90 cm', Icon: MiniSofa, delay: 0 },
    { name: 'Floor Lamp', dims: '40 × 160 cm', Icon: MiniLamp, delay: 0.15 },
    { name: 'Moving Boxes', dims: '60 × 40 cm', Icon: MiniBox, delay: 0.3 },
    { name: 'Bookshelf', dims: '80 × 180 cm', Icon: MiniShelf, delay: 0.45 },
  ];

  return (
    <PhoneMockup>
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(180deg, #F4F8FF 0%, #EDF3FF 100%)',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 8,
        boxSizing: 'border-box' as const,
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center' as const,
          paddingTop: 8,
          paddingBottom: 6,
        }}>
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            color: '#212225',
          }}>Your Items</span>
          <div style={{
            fontSize: 11,
            fontFamily: 'Inter, system-ui, sans-serif',
            color: colors.gray[400],
            marginTop: 3,
          }}>4 items detected</div>
        </div>

        {/* Item rows */}
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center' as const,
            gap: 10,
            background: 'white',
            borderRadius: 14,
            padding: '10px 12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            animation: `estimateSlideUp 0.6s ease-out ${item.delay}s both`,
          }}>
            {/* 3D icon */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#FFF8F0',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
              flexShrink: 0,
            }}>
              <item.Icon />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#212225',
              }}>{item.name}</div>
              <div style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 10,
                color: colors.gray[400],
                marginTop: 1,
              }}>{item.dims}</div>
            </div>

            {/* Check circle */}
            <div style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              background: '#2E90FA',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
              flexShrink: 0,
              animation: `checkPop${Math.min(i + 1, 3)} 1.2s ease-out forwards`,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 6 L5 8 L9 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}

        {/* Add item */}
        <div style={{
          display: 'flex',
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          gap: 6,
          border: `1.5px dashed ${colors.gray[200]}`,
          borderRadius: 14,
          padding: '10px 12px',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="2" x2="7" y2="12" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="7" x2="12" y2="7" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            color: colors.gray[400],
          }}>Add item manually</span>
        </div>
      </div>
    </PhoneMockup>
  );
};

/* ── Step 3: Confirm & Estimate ── */
const EstimateIllustration = () => {
  if (Platform.OS !== 'web') return null;

  return (
    <PhoneMockup>
      <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(180deg, #E8F0FF 0%, #F0F6FF 50%, #EDF3FF 100%)',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center' as const,
        boxSizing: 'border-box' as const,
      }}>
        {/* Truck */}
        <div style={{
          marginTop: 12,
          animation: 'badgeAppear 0.8s ease-out forwards',
        }}>
          <TruckSVG />
        </div>

        {/* Title */}
        <div style={{
          textAlign: 'center' as const,
          marginTop: 14,
          animation: 'estimateSlideUp 0.6s ease-out 0.3s both',
        }}>
          <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            color: '#212225',
          }}>Inventory Complete</div>
          <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 11,
            color: colors.gray[400],
            marginTop: 3,
          }}>12 items &bull; 2 rooms</div>
        </div>

        {/* Price card */}
        <div style={{
          width: '100%',
          marginTop: 16,
          background: 'white',
          borderRadius: 16,
          padding: '16px 14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          animation: 'estimateSlideUp 0.6s ease-out 0.5s both',
        }}>
          <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 10,
            fontWeight: 500,
            color: colors.gray[400],
            textTransform: 'uppercase' as const,
            letterSpacing: 0.8,
          }}>Estimated Cost</div>
          <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 30,
            fontWeight: 800,
            color: '#2E90FA',
            marginTop: 4,
            animation: 'pricePulse 3s ease-in-out infinite 1s',
          }}>$2,450</div>
          <div style={{
            display: 'flex',
            gap: 8,
            marginTop: 12,
          }}>
            {[
              { label: 'Volume', val: '18 m\u00B3' },
              { label: 'Weight', val: '~850 kg' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1,
                background: colors.gray[50],
                borderRadius: 10,
                padding: '8px 10px',
                animation: `estimateSlideUp 0.6s ease-out ${0.7 + i * 0.15}s both`,
              }}>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 9,
                  color: colors.gray[400],
                }}>{stat.label}</div>
                <div style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#212225',
                  marginTop: 2,
                }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail rows */}
        <div style={{
          width: '100%',
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 5,
        }}>
          {[
            { icon: '\uD83D\uDE9B', text: 'Moving truck + 2 movers' },
            { icon: '\uD83D\uDCE6', text: 'Packing materials included' },
            { icon: '\uD83D\uDEE1\uFE0F', text: 'Basic insurance coverage' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center' as const,
              gap: 8,
              background: 'white',
              borderRadius: 10,
              padding: '8px 10px',
              animation: `estimateSlideUp 0.6s ease-out ${0.9 + i * 0.12}s both`,
            }}>
              <span style={{ fontSize: 13 }}>{row.icon}</span>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
                color: colors.gray[500],
              }}>{row.text}</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneMockup>
  );
};

/* ── Step illustration selector ── */
const StepIllustration = ({ step }: { step: number }) => {
  if (Platform.OS !== 'web') {
    return (
      <View style={illustrationStyles.container}>
        <Text variant="bodySm" color={colors.gray[400]}>Step {step} Illustration</Text>
      </View>
    );
  }

  const illustrations: Record<number, React.ReactNode> = {
    1: <ScanIllustration />,
    2: <ReviewIllustration />,
    3: <EstimateIllustration />,
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flex: 1,
      minHeight: 0,
    }}>
      {illustrations[step] || illustrations[1]}
    </div>
  );
};

const illustrationStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF2F7',
    borderRadius: 24,
    marginTop: 12,
  },
});

/* ── Screen ── */

interface ScanStepScreenProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
}

export const ScanStepScreen: React.FC<ScanStepScreenProps> = ({
  step,
  onNext,
  onBack,
}) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) return <DesktopQRScreen onBack={onBack} />;
  const data = SCAN_STEPS[step - 1];
  const isLast = step === 3;
  const hasInjected = useRef(false);

  useEffect(() => {
    if (!hasInjected.current) {
      injectAnimations();
      hasInjected.current = true;
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBarMock />
        <Navbar onBack={onBack} />

        {/* Step indicator — text left, dots right */}
        <View style={styles.stepIndicator}>
          {Platform.OS === 'web' ? (
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 13,
              fontWeight: 500,
              color: colors.gray[400],
            }}>Step {step} of 3</span>
          ) : (
            <Text variant="bodySm" color={colors.gray[400]}>Step {step} of 3</Text>
          )}
          <View style={styles.dots}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === step ? styles.dotActive : (i < step ? styles.dotDone : styles.dotInactive),
                ]}
              />
            ))}
          </View>
        </View>

        {/* Large illustration with gradient fade */}
        <StepIllustration step={step} />

        {/* Content */}
        <View style={styles.contentSection}>
          {Platform.OS === 'web' ? (
            <>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 24,
                fontWeight: 700,
                color: '#212225',
                lineHeight: '30px',
                textAlign: 'center' as const,
                display: 'block',
              }}>{data.title}</span>
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 400,
                color: colors.gray[500],
                lineHeight: '22px',
                textAlign: 'center' as const,
                display: 'block',
                marginTop: 8,
                paddingLeft: 8,
                paddingRight: 8,
              }}>{data.description}</span>
            </>
          ) : (
            <>
              <Text variant="h2" color="#212225" align="center">{data.title}</Text>
              <Text variant="bodySm" color={colors.gray[500]} align="center" style={{ marginTop: 8 }}>
                {data.description}
              </Text>
            </>
          )}
        </View>

        {/* Bottom buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonRow}>
            <View style={styles.backButton}>
              <Button
                title="Back"
                variant="secondary"
                onPress={onBack}
              />
            </View>
            <View style={styles.nextButton}>
              <Button
                title={isLast ? 'Start Camera' : 'Next'}
                variant="primary"
                onPress={onNext}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as any,
  container: { flex: 1 },

  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary[500],
    width: 24,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#EFF2F7',
  },
  dotDone: {
    backgroundColor: colors.primary[200],
  },

  contentSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
  },

  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 20, marginTop: 'auto' as any },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: { flex: 1 },
  nextButton: { flex: 1 },
});
