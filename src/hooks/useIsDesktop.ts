/**
 * useIsDesktop — returns true if viewport width >= 768px (desktop/tablet)
 * Updates on window resize.
 */
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export const DESKTOP_BREAKPOINT = 768;

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (Platform.OS !== 'web') return false;
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  });

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isDesktop;
}
