/**
 * AI Moving — Contracts List Screen (Profile → My Contracts)
 *
 * Displays all signed contracts with option to view details or download as PDF.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock, Navbar } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { fontFamily } from '../../design-system/tokens/typography';
import type { SignedContract } from './ContractGenerator';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface ContractsListScreenProps {
  contracts: SignedContract[];
  onViewContract: (contract: SignedContract) => void;
  onDownloadPdf: (contract: SignedContract) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const FileSignedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 15L11 17L15 13" stroke={colors.success[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 13H16M8 17H12" stroke={colors.gray[300]} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return iso; }
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ContractsListScreen: React.FC<ContractsListScreenProps> = ({
  contracts,
  onViewContract,
  onDownloadPdf,
  onBack,
}) => {
  if (Platform.OS !== 'web') return null;

  return (
    <SafeAreaView style={st.safeArea}>
      <View style={st.container}>
        <StatusBarMock onTimeTap={onBack} />

        <Navbar title="My Contracts" onBack={onBack} />

        <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
          <div style={{ padding: '16px 16px 120px', backgroundColor: '#FAFAFA', minHeight: '100%' } as any}>

            {/* Empty state */}
            {contracts.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 8,
              } as any}>
                <EmptyIcon />
                <div style={{ marginTop: 16 } as any}>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: colors.gray[700], display: 'block' } as any}>
                    No contracts yet
                  </span>
                  <span style={{ fontFamily: F, fontSize: 14, color: colors.gray[400], display: 'block', marginTop: 4 } as any}>
                    Contracts will appear here after your mover arrives and you sign the moving agreement
                  </span>
                </div>
              </div>
            )}

            {/* Contract cards */}
            {contracts.map((contract) => (
              <div
                key={contract.id}
                onClick={() => onViewContract(contract)}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 16,
                  padding: '16px', marginBottom: 10, cursor: 'pointer',
                  border: `1px solid ${colors.gray[100]}`,
                  transition: 'all 0.15s',
                } as any}
              >
                {/* Top row: icon + info + chevron */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 12 } as any}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: colors.primary[25],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  } as any}>
                    <FileSignedIcon />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 } as any}>
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: colors.gray[900], display: 'block', marginBottom: 4 } as any}>
                      Moving Agreement
                    </span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[500], display: 'block', marginBottom: 2 } as any}>
                      {contract.mover.companyName} · {fmtDate(contract.generatedAt)}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: colors.gray[400] } as any}>
                      {contract.contractNumber}
                    </span>
                  </div>

                  <ChevronIcon />
                </div>

                {/* Route summary */}
                <div style={{
                  display: 'flex', flexDirection: 'row', gap: 8,
                  marginTop: 12, paddingTop: 12,
                  borderTop: `1px solid ${colors.gray[50]}`,
                } as any}>
                  <div style={{ flex: 1 } as any}>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.3 } as any}>From</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[700], display: 'block', marginTop: 2 } as any}>
                      {contract.moveDetails.fromAddress}
                    </span>
                  </div>
                  <div style={{ flex: 1 } as any}>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.3 } as any}>To</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[700], display: 'block', marginTop: 2 } as any}>
                      {contract.moveDetails.toAddress}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' } as any}>
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.3 } as any}>Price</span>
                    <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: colors.gray[900], display: 'block', marginTop: 2 } as any}>
                      ${contract.moveDetails.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Download PDF — full-width solid button, design system style */}
                {contract.status === 'fully_signed' && (
                  <div
                    onClick={(e: any) => { e.stopPropagation(); onDownloadPdf(contract); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      marginTop: 16, paddingTop: 4,
                      padding: '12px 0',
                      borderRadius: 12,
                      backgroundColor: colors.primary[500],
                      cursor: 'pointer',
                      transition: 'opacity 0.15s',
                    } as any}
                  >
                    <DownloadIcon />
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: '#FFFFFF' } as any}>
                      Download PDF
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const st = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { flex: 1 },
});
