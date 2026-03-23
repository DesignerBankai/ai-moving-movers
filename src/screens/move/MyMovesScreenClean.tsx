/**
 * AI Moving — My Moves Screen (Clean variant)
 *
 * Card-based list of user's moves with ability to:
 * - View current active move
 * - Create a new request
 * - Archive or cancel existing moves
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { TabBar, TabId } from '../home/TabBar';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type MoveStatus = 'searching' | 'booked' | 'inProgress' | 'completed' | 'cancelled' | 'archived';

interface MoveCard {
  id: string;
  from: string;
  to: string;
  date: string;
  status: MoveStatus;
  planName: string;
  price: number;
  moverName?: string;
}

export interface MyMovesScreenCleanProps {
  moves: MoveCard[];
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
  onCreateRequest?: () => void;
  onCancelMove?: (id: string) => void;
  onArchiveMove?: (id: string) => void;
  onSelectMove?: (id: string) => void;
}

/* ═══════════════════════════════════════════
   Status config
   ═══════════════════════════════════════════ */

const STATUS_CONFIG: Record<MoveStatus, { label: string; color: string; bg: string; icon: 'pulse' | 'check' | 'truck' | 'x' | 'archive' }> = {
  searching:  { label: 'Finding Movers', color: colors.primary[600], bg: colors.primary[50], icon: 'pulse' },
  booked:     { label: 'Confirmed',      color: colors.success[600], bg: colors.success[50], icon: 'check' },
  inProgress: { label: 'In Progress',    color: '#B54708',           bg: '#FFFAEB',          icon: 'truck' },
  completed:  { label: 'Completed',      color: colors.success[600], bg: colors.success[50], icon: 'check' },
  cancelled:  { label: 'Cancelled',      color: colors.gray[400],    bg: colors.gray[50],    icon: 'x' },
  archived:   { label: 'Archived',       color: colors.gray[400],    bg: colors.gray[50],    icon: 'archive' },
};

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const MapPinSmall = ({ color = colors.gray[400] }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M21 10C21 15.52 12 22 12 22C12 22 3 15.52 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth="2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M13 6L19 12L13 18" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarSmall = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={colors.gray[400]} strokeWidth="2" />
    <path d="M3 10H21" stroke={colors.gray[400]} strokeWidth="2" />
    <path d="M8 2V6M16 2V6" stroke={colors.gray[400]} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill={colors.gray[400]} />
    <circle cx="12" cy="12" r="1.5" fill={colors.gray[400]} />
    <circle cx="12" cy="18" r="1.5" fill={colors.gray[400]} />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke={colors.gray[300]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════
   Action Menu (context menu for a move card)
   ═══════════════════════════════════════════ */

const ActionMenu: React.FC<{
  moveId: string;
  status: MoveStatus;
  onClose: () => void;
  onCancel: (id: string) => void;
  onArchive: (id: string) => void;
}> = ({ moveId, status, onClose, onCancel, onArchive }) => {
  if (Platform.OS !== 'web') return null;

  const canCancel = status === 'searching' || status === 'booked';
  const canArchive = status === 'completed' || status === 'cancelled';

  return (
    <View style={ms.menuOverlay}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <div style={{
        position: 'absolute', top: '40%', left: 32, right: 32,
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8,
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      } as any}>
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid #F2F4F7',
          marginBottom: 4,
        } as any}>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.gray[900] } as any}>
            Manage Request
          </span>
        </div>

        {canArchive && (
          <Pressable
            onPress={() => { onArchive(moveId); onClose(); }}
            style={({ pressed }) => [ms.menuItem, pressed && { opacity: 0.7 }]}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 } as any}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: colors.gray[50], display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              } as any}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 8V21H3V8" stroke={colors.gray[600]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="1" y="3" width="22" height="5" rx="1" stroke={colors.gray[600]} strokeWidth="1.8"/>
                  <path d="M10 12H14" stroke={colors.gray[600]} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900], display: 'block' } as any}>Archive</span>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>Move to archive</span>
              </div>
            </div>
          </Pressable>
        )}

        {canCancel && (
          <Pressable
            onPress={() => { onCancel(moveId); onClose(); }}
            style={({ pressed }) => [ms.menuItem, pressed && { opacity: 0.7 }]}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 } as any}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: '#FEF3F2', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              } as any}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#F04438" strokeWidth="1.8"/>
                  <path d="M15 9L9 15M9 9L15 15" stroke="#F04438" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: '#F04438', display: 'block' } as any}>Cancel Request</span>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>This action cannot be undone</span>
              </div>
            </div>
          </Pressable>
        )}

        {!canCancel && !canArchive && (
          <div style={{ padding: 16 } as any}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400] } as any}>
              No actions available for this request
            </span>
          </div>
        )}

        {/* Close */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [{
            alignItems: 'center', paddingVertical: 14, marginTop: 4,
            borderTop: '1px solid #F2F4F7',
          } as any, pressed && { opacity: 0.7 }]}
        >
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[500] } as any}>Close</span>
          ) : null}
        </Pressable>
      </div>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Confirmation Modal
   ═══════════════════════════════════════════ */

const ConfirmCancelModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ visible, onClose, onConfirm }) => {
  if (!visible || Platform.OS !== 'web') return null;

  return (
    <View style={ms.menuOverlay}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={onClose} />
      <View style={{
        position: 'absolute', top: '50%', left: 24, right: 24,
        transform: [{ translateY: -120 }],
        backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
        ...(Platform.OS === 'web' ? { boxShadow: '0 8px 40px rgba(0,0,0,0.12)' } as any : {}),
      }}>
        {/* Icon */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: '#FEF3F2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          } as any}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4h-2V7h2v6z" fill="#F04438"/>
            </svg>
          </div>
        </View>

        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 18, fontWeight: 700,
            color: colors.gray[900], textAlign: 'center', display: 'block',
          } as any}>Cancel Request?</span>
        ) : null}

        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400,
            color: colors.gray[500], textAlign: 'center', display: 'block',
            marginTop: 8, lineHeight: '20px',
          } as any}>This action cannot be undone. Your request and all associated data will be permanently deleted.</span>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 } as any}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [{
              flex: 1, paddingVertical: 18, borderRadius: 16,
              alignItems: 'center', backgroundColor: '#EFF2F7',
            } as any, pressed && { opacity: 0.7 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 700, color: colors.gray[700] } as any}>Keep Request</span>
            ) : null}
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [{
              flex: 1, paddingVertical: 18, borderRadius: 16,
              alignItems: 'center', backgroundColor: '#F04438',
            } as any, pressed && { opacity: 0.7 }]}
          >
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 17, fontWeight: 700, color: '#FFFFFF' } as any}>Yes, Cancel</span>
            ) : null}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Helper: short city code
   ═══════════════════════════════════════════ */

const shortCity = (addr: string) => {
  const parts = addr.split(',');
  if (parts.length >= 2) return parts[0].trim().split(' ').slice(-1)[0];
  return addr.slice(0, 12);
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const MyMovesScreenClean: React.FC<MyMovesScreenCleanProps> = ({
  moves,
  onTabPress,
  onBack,
  onCreateRequest,
  onCancelMove,
  onArchiveMove,
  onSelectMove,
}) => {
  const [menuMoveId, setMenuMoveId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const activeMoves = moves.filter(m => m.status !== 'archived' && m.status !== 'cancelled');
  const pastMoves = moves.filter(m => m.status === 'archived' || m.status === 'cancelled' || m.status === 'completed');
  const menuMove = moves.find(m => m.id === menuMoveId);

  const handleCancel = (id: string) => {
    setMenuMoveId(null);
    setConfirmCancelId(id);
  };

  return (
    <SafeAreaView style={ms.safe}>
      <View style={{ flex: 1 }}>
        <StatusBarMock variant="dark" onTimeTap={onBack} />

        {/* Header */}
        <View style={ms.header}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 24, fontWeight: 700, color: colors.gray[900] } as any}>
              My Moves
            </span>
          ) : null}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Create new request button */}
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <Pressable
              onPress={onCreateRequest}
              style={({ pressed }) => [ms.createBtn, pressed && { opacity: 0.7 }]}
            >
              {Platform.OS === 'web' && (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: colors.primary[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  } as any}>
                    <PlusIcon />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.primary[600], display: 'block' } as any}>
                      New Move Request
                    </span>
                    <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400], display: 'block', marginTop: 2 } as any}>
                      Start planning another move
                    </span>
                  </div>
                </div>
              )}
            </Pressable>
          </View>

          {/* Active moves */}
          {activeMoves.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                  marginBottom: 12, display: 'block',
                } as any}>Active</span>
              ) : null}

              <View style={{ gap: 12 } as any}>
                {activeMoves.map(move => {
                  const cfg = STATUS_CONFIG[move.status];
                  return (
                    <Pressable
                      key={move.id}
                      onPress={() => onSelectMove?.(move.id)}
                      style={({ pressed }) => [ms.card, pressed && { opacity: 0.7 }]}
                    >
                      {/* Top row: status + more */}
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}>
                        <div style={{
                          display: 'inline-flex', flexDirection: 'row', alignItems: 'center', gap: 6,
                          backgroundColor: cfg.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
                        } as any}>
                          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.color } as any} />
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: cfg.color } as any}>
                            {cfg.label}
                          </span>
                        </div>
                        <Pressable onPress={(e) => { e.stopPropagation?.(); setMenuMoveId(move.id); }} hitSlop={12} style={({ pressed: p2 }) => [p2 && { opacity: 0.5 }]}>
                          {Platform.OS === 'web' && <MoreIcon />}
                        </Pressable>
                      </div>

                      {/* Route */}
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 } as any}>
                        <MapPinSmall color={colors.primary[500]} />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900] } as any}>
                          {shortCity(move.from)}
                        </span>
                        <ArrowRightIcon />
                        <MapPinSmall color="#F04438" />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: colors.gray[900] } as any}>
                          {shortCity(move.to)}
                        </span>
                      </div>

                      {/* Details chips */}
                      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' } as any}>
                        <div style={ms.chip as any}>
                          <CalendarSmall />
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: colors.gray[600], marginLeft: 6 } as any}>
                            {move.date}
                          </span>
                        </div>
                        <div style={ms.chip as any}>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: colors.gray[600] } as any}>
                            {move.planName}
                          </span>
                        </div>
                        <div style={ms.chip as any}>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: colors.gray[900] } as any}>
                            ${move.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Mover if assigned */}
                      {move.moverName && (
                        <div style={{
                          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
                          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.gray[100]}`,
                        } as any}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 14,
                            backgroundColor: colors.primary[50],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          } as any}>
                            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: colors.primary[500] } as any}>
                              {move.moverName[0]}
                            </span>
                          </div>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500, color: colors.gray[700], flex: 1 } as any}>
                            {move.moverName}
                          </span>
                          <ChevronRight />
                        </div>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Past moves */}
          {pastMoves.length > 0 && (
            <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
              {Platform.OS === 'web' ? (
                <span style={{
                  fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600,
                  color: colors.gray[400], textTransform: 'uppercase', letterSpacing: 0.8,
                  marginBottom: 12, display: 'block',
                } as any}>Past</span>
              ) : null}

              <View style={{ gap: 12 } as any}>
                {pastMoves.map(move => {
                  const cfg = STATUS_CONFIG[move.status];
                  return (
                    <Pressable
                      key={move.id}
                      onPress={() => onSelectMove?.(move.id)}
                      style={({ pressed }) => [ms.card, { opacity: 0.65 } as any, pressed && { opacity: 0.5 }]}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}>
                        <div style={{
                          display: 'inline-flex', flexDirection: 'row', alignItems: 'center', gap: 6,
                          backgroundColor: cfg.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
                        } as any}>
                          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: cfg.color } as any}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 } as any}>
                        <MapPinSmall color={colors.gray[400]} />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[600] } as any}>
                          {shortCity(move.from)}
                        </span>
                        <ArrowRightIcon />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 500, color: colors.gray[600] } as any}>
                          {shortCity(move.to)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', gap: 8, marginTop: 10 } as any}>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400] } as any}>
                          {move.date}
                        </span>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[300] } as any}>·</span>
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400] } as any}>
                          ${move.price.toLocaleString()}
                        </span>
                      </div>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Empty state */}
          {moves.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: colors.primary[50],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              } as any}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="13" height="9" rx="1.5" stroke={colors.primary[400]} strokeWidth="1.8"/>
                  <path d="M15 10H18L21 13V16H15V10Z" stroke={colors.primary[400]} strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="7" cy="18" r="2" stroke={colors.primary[400]} strokeWidth="1.8"/>
                  <circle cx="18" cy="18" r="2" stroke={colors.primary[400]} strokeWidth="1.8"/>
                </svg>
              </div>
              {Platform.OS === 'web' ? (
                <>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 600, color: colors.gray[900], textAlign: 'center' } as any}>
                    No moves yet
                  </span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 400, color: colors.gray[400], textAlign: 'center', marginTop: 6, lineHeight: '19px' } as any}>
                    Create your first move request to get started
                  </span>
                </>
              ) : null}
            </View>
          )}
        </ScrollView>

        <View style={ms.tabBarWrap}>
          <TabBar active="myMoves" onTabPress={onTabPress} variant="default" />
        </View>
      </View>

      {/* Action menu */}
      {menuMoveId && menuMove && (
        <ActionMenu
          moveId={menuMoveId}
          status={menuMove.status}
          onClose={() => setMenuMoveId(null)}
          onCancel={handleCancel}
          onArchive={(id) => { onArchiveMove?.(id); setMenuMoveId(null); }}
        />
      )}

      {/* Cancel confirmation */}
      <ConfirmCancelModal
        visible={!!confirmCancelId}
        onClose={() => setConfirmCancelId(null)}
        onConfirm={() => { if (confirmCancelId) onCancelMove?.(confirmCancelId); setConfirmCancelId(null); }}
      />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const ms = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  } as any,

  header: {
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },

  createBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? {
      border: `1.5px dashed ${colors.primary[200]}`,
    } : {
      borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary[200],
    }),
  } as any,

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  } as any,

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? { display: 'flex' } : {}),
  } as any,

  tabBarWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },

  menuOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
