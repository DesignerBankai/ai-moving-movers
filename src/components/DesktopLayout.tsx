/**
 * DesktopLayout
 *
 * On desktop (>=768px): full-viewport wrapper with
 *   - centered phone mockup (left)
 *   - info panel with app download links + QR (right)
 *
 * On mobile: renders children as-is (no wrapper).
 */

import React from 'react';
import { Platform } from 'react-native';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { colors } from '../design-system/tokens/colors';
import { TabId } from '../screens/home/TabBar';

const F = 'Inter, system-ui, sans-serif';

interface DesktopLayoutProps {
  children: React.ReactNode;
  activeTab?: TabId;
  onTabPress?: (tab: TabId) => void;
}

const APP_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://ai-moving-mobile.vercel.app';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(APP_URL)}&size=140x140&color=1D2939&bgcolor=FFFFFF&margin=8&format=svg`;

/** Apple App Store badge */
const AppStoreBadge = () => (
  <svg
    width="156"
    height="52"
    viewBox="0 0 156 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Download on the App Store"
  >
    <rect width="156" height="52" rx="8" fill="#000000"/>
    <rect x="0.5" y="0.5" width="155" height="51" rx="7.5" stroke="#A6A6A6" strokeWidth="1"/>
    <path
      d="M29.3 25.9c0-3.4 2.8-5 2.9-5.1-1.6-2.3-4-2.6-4.9-2.6-2.1-.2-4 1.2-5.1 1.2-1 0-2.7-1.2-4.4-1.2-2.2 0-4.3 1.3-5.5 3.3-2.3 4-.6 10 1.7 13.3 1.1 1.6 2.4 3.4 4.2 3.3 1.7-.1 2.3-1.1 4.3-1.1 2 0 2.6 1.1 4.4 1 1.8 0 2.9-1.6 4-3.2 1.3-1.8 1.8-3.6 1.8-3.7-.1-.1-3.4-1.3-3.4-5.2z"
      fill="white"
    />
    <path
      d="M26.1 16.7c.9-1.1 1.5-2.7 1.4-4.2-1.3.1-2.9.9-3.9 2-.8 1-1.6 2.6-1.4 4.1 1.5.1 3-.8 3.9-1.9z"
      fill="white"
    />
    <text x="42" y="20" fontFamily="SF Pro Display, -apple-system, Helvetica Neue, Arial, sans-serif" fontSize="10" fontWeight="400" letterSpacing="0.3" fill="white">Download on the</text>
    <text x="42" y="37" fontFamily="SF Pro Display, -apple-system, Helvetica Neue, Arial, sans-serif" fontSize="20" fontWeight="600" letterSpacing="-0.4" fill="white">App Store</text>
  </svg>
);

/** Google Play badge */
const GooglePlayBadge = () => (
  <svg
    width="156"
    height="52"
    viewBox="0 0 156 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Get it on Google Play"
  >
    <rect width="156" height="52" rx="8" fill="#000000"/>
    <rect x="0.5" y="0.5" width="155" height="51" rx="7.5" stroke="#A6A6A6" strokeWidth="1"/>
    <path d="M13 14.5L25.5 26L13 37.5V14.5Z" fill="#00D2FF"/>
    <path d="M13 14.5L25.5 26L19.5 32L13 37.5V14.5Z" fill="#00B8D4"/>
    <path d="M13 14.5L25.5 26L29.5 22L18 15.7L13 14.5Z" fill="#FF3D00"/>
    <path d="M13 37.5L25.5 26L29.5 30L18.1 36.3L13 37.5Z" fill="#FFD600"/>
    <path d="M25.5 26L29.5 22L33 24.2C34.1 24.8 34.1 27.2 33 27.8L29.5 30L25.5 26Z" fill="#00E676"/>
    <text x="42" y="20" fontFamily="Roboto, Arial, Helvetica, sans-serif" fontSize="9.5" fontWeight="400" letterSpacing="1.2" fill="white">GET IT ON</text>
    <text x="42" y="37" fontFamily="Roboto, Arial, Helvetica, sans-serif" fontSize="19" fontWeight="500" letterSpacing="-0.2" fill="white">Google Play</text>
  </svg>
);

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  activeTab,
  onTabPress,
}) => {
  const isDesktop = useIsDesktop();

  if (Platform.OS !== 'web' || !isDesktop) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#E8EEF8',
      fontFamily: F,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      overflow: 'hidden',
    } as any}>

      {/* Responsive scaling styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mover-phone-frame {
          transform-origin: center center;
          transform: scale(1);
        }
        @media (max-height: 920px) {
          .mover-phone-frame { transform: scale(0.9); }
        }
        @media (max-height: 820px) {
          .mover-phone-frame { transform: scale(0.8); }
        }
        @media (max-height: 720px) {
          .mover-phone-frame { transform: scale(0.7); }
        }
        @media (max-height: 620px) {
          .mover-phone-frame { transform: scale(0.6); }
        }
        @media (max-width: 900px) {
          .mover-info-panel { display: none !important; }
        }
      `}} />

      {/* Two-column wrapper */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 64,
      } as any}>

        {/* Phone frame */}
        <div className="mover-phone-frame" style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#FAFAFA',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          border: '8px solid #1D2939',
          flexShrink: 0,
        } as any}>
          {/* Notch */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 30,
            backgroundColor: '#1D2939',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 100,
          } as any} />

          {/* Screen content */}
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          } as any}>
            {children}
          </div>
        </div>

        {/* Right info panel */}
        <div className="mover-info-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: 320,
          flexShrink: 0,
        } as any}>

          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 28,
          } as any}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.primary[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(46,144,250,0.3)',
            } as any}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="13" height="9" rx="1.5" stroke="#fff" strokeWidth="1.8"/>
                <path d="M15 10H18L21 13V16H15V10Z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="7" cy="18" r="1.8" stroke="#fff" strokeWidth="1.8"/>
                <circle cx="18" cy="18" r="1.8" stroke="#fff" strokeWidth="1.8"/>
              </svg>
            </div>
            <span style={{
              fontSize: 20,
              fontWeight: 700,
              color: colors.gray[900],
              fontFamily: F,
            } as any}>
              AI Moving
            </span>
          </div>

          {/* Headline */}
          <span style={{
            fontSize: 26,
            fontWeight: 700,
            color: colors.gray[900],
            lineHeight: '32px',
            display: 'block',
            marginBottom: 12,
            fontFamily: F,
          } as any}>
            Better on mobile
          </span>

          {/* Description */}
          <span style={{
            fontSize: 15,
            fontWeight: 400,
            color: colors.gray[500],
            lineHeight: '22px',
            display: 'block',
            marginBottom: 32,
            fontFamily: F,
          } as any}>
            We recommend using the mobile version of the service. Or download our app to scan rooms, estimate your move, and chat with your mover right from your phone.
          </span>

          {/* App Store badge */}
          <a
            href="#"
            style={{
              display: 'inline-block',
              marginBottom: 12,
              textDecoration: 'none',
              borderRadius: 8,
              overflow: 'hidden',
            } as any}
            aria-label="Download on the App Store"
          >
            <AppStoreBadge />
          </a>

          {/* Google Play badge */}
          <a
            href="#"
            style={{
              display: 'inline-block',
              marginBottom: 32,
              textDecoration: 'none',
              borderRadius: 8,
              overflow: 'hidden',
            } as any}
            aria-label="Get it on Google Play"
          >
            <GooglePlayBadge />
          </a>

          {/* QR section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          } as any}>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: colors.gray[400],
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              fontFamily: F,
            } as any}>
              Scan the QR code
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            } as any}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } as any}>
                <img
                  src={QR_URL}
                  alt="QR code to open app on phone"
                  width={80}
                  height={80}
                  style={{ display: 'block' } as any}
                />
              </div>
              <span style={{
                fontSize: 13,
                color: colors.gray[400],
                lineHeight: '18px',
                fontFamily: F,
              } as any}>
                Open your phone camera and point it at the code
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
