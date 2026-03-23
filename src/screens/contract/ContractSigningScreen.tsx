/**
 * AI Moving — Contract Signing Screen
 *
 * Full-screen modal that shows the generated contract and allows
 * both the mover and customer to sign electronically.
 *
 * Features:
 * - Editable client data (name, phone, email, address)
 * - Inventory / furniture list with add/remove
 * - Additional services & furniture with price
 * - Canvas-based signature pad
 * - Consent checkbox (legally required)
 * - Typed name confirmation
 * - Audit trail data capture (timestamp, device)
 *
 * Legally binding per CA UETA & ESIGN Act.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import type {
  SignedContract,
  ContractSignature,
  ContractParty,
  InventoryItem,
  AdditionalCharge,
} from './ContractGenerator';
import { regenerateContract } from './ContractGenerator';

const F = fontFamily.primary;

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

interface ContractSigningScreenProps {
  contract: SignedContract;
  signerRole: 'client' | 'mover';
  signerName: string;
  clientName: string;
  onSign: (moverSignature: ContractSignature, clientSignature: ContractSignature, updatedContract: SignedContract) => void;
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={colors.gray[700]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" stroke={colors.success[500]} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke={colors.success[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = ({ checked }: { checked: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="6" fill={checked ? colors.primary[500] : 'transparent'} stroke={checked ? colors.primary[500] : colors.gray[300]} strokeWidth="1.5"/>
    {checked && <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
  </svg>
);

const EraseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6" stroke={colors.gray[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const EditPenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={colors.primary[500]} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 15L12 9L18 15" stroke={colors.gray[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FurnitureIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 16V8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16M2 16H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V16Z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const ServiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={colors.primary[500]} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Helper: inline input
   ═══════════════════════════════════════════ */

const InlineInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type }) => (
  <div style={{ marginBottom: 10 } as any}>
    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[500], display: 'block', marginBottom: 3 } as any}>
      {label}
    </span>
    <input
      type={type || 'text'}
      value={value}
      onChange={(e: any) => onChange(e.target.value)}
      placeholder={placeholder || ''}
      style={{
        width: '100%', padding: '8px 10px', borderRadius: 8,
        border: `1px solid ${colors.gray[200]}`, fontFamily: F, fontSize: 13,
        color: colors.gray[900], outline: 'none', backgroundColor: '#FAFAFA',
        boxSizing: 'border-box',
      } as any}
    />
  </div>
);

/* ═══════════════════════════════════════════
   Signature Pad (Canvas)
   ═══════════════════════════════════════════ */

const SignaturePad: React.FC<{
  onSignatureChange: (dataUrl: string | null) => void;
}> = ({ onSignatureChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getCtx = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return null;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    return { c, ctx };
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: any) => {
    const r = getCtx();
    if (!r) return;
    isDrawing.current = true;
    const pos = getPos(e);
    r.ctx.beginPath();
    r.ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: any) => {
    if (!isDrawing.current) return;
    const r = getCtx();
    if (!r) return;
    e.preventDefault();
    const pos = getPos(e);
    r.ctx.lineWidth = 2.5;
    r.ctx.lineCap = 'round';
    r.ctx.lineJoin = 'round';
    r.ctx.strokeStyle = '#101828';
    r.ctx.lineTo(pos.x, pos.y);
    r.ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const endDraw = () => {
    isDrawing.current = false;
    const c = canvasRef.current;
    if (c && hasDrawn) {
      onSignatureChange(c.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const r = getCtx();
    if (!r) return;
    r.ctx.clearRect(0, 0, r.c.width, r.c.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  React.useEffect(() => {
    if (hasDrawn) {
      const c = canvasRef.current;
      if (c) onSignatureChange(c.toDataURL('image/png'));
    }
  }, [hasDrawn]);

  if (Platform.OS !== 'web') return null;

  return (
    <div style={{ position: 'relative' } as any}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } as any}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 } as any}>
          <PenIcon />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[700] } as any}>
            Draw your signature
          </span>
        </div>
        {hasDrawn && (
          <div
            onClick={clear}
            style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 8px', borderRadius: 8, backgroundColor: colors.gray[50] } as any}
          >
            <EraseIcon />
            <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[500] } as any}>Clear</span>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={350}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
        style={{
          width: '100%', height: 200, borderRadius: 12,
          border: `1.5px dashed ${hasDrawn ? colors.primary[300] : colors.gray[200]}`,
          backgroundColor: hasDrawn ? '#FAFCFF' : '#FAFAFA',
          cursor: 'crosshair', touchAction: 'none',
        } as any}
      />

      {!hasDrawn && (
        <div style={{ position: 'absolute', bottom: 30, left: 24, right: 24, borderBottom: `1px solid ${colors.gray[200]}` } as any}>
          <span style={{ fontFamily: F, fontSize: 11, color: colors.gray[300], position: 'absolute', right: 0, bottom: 4 } as any}>
            Sign here
          </span>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Collapsible Section
   ═══════════════════════════════════════════ */

const CollapsibleSection: React.FC<{
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, badge, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      marginBottom: 12, borderRadius: 12, border: `1px solid ${colors.gray[100]}`,
      overflow: 'hidden', backgroundColor: '#FFFFFF',
    } as any}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', padding: '12px 14px',
          cursor: 'pointer', backgroundColor: open ? colors.primary[25] : '#FAFAFA',
          gap: 8,
        } as any}
      >
        {icon}
        <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[800], flex: 1 } as any}>
          {title}
        </span>
        {badge && (
          <span style={{
            fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.primary[600],
            backgroundColor: colors.primary[50], padding: '2px 8px', borderRadius: 10,
          } as any}>{badge}</span>
        )}
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </div>
      {open && (
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${colors.gray[100]}` } as any}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ContractSigningScreen: React.FC<ContractSigningScreenProps> = ({
  contract: initialContract,
  signerRole,
  signerName,
  clientName,
  onSign,
  onBack,
}) => {
  // ── Local mutable state derived from contract ──
  const [clientData, setClientData] = useState<ContractParty>({ ...initialContract.client });
  const [inventory, setInventory] = useState<InventoryItem[]>(initialContract.moveDetails.inventory || []);
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>(initialContract.moveDetails.additionalCharges || []);

  // ── Editing modes ──
  const [editingClient, setEditingClient] = useState(false);

  // ── Add item modal ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'furniture' | 'service'>('furniture');
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addRoom, setAddRoom] = useState('');
  const [addQty, setAddQty] = useState('1');
  const [addSize, setAddSize] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // ── Signing state (mover) ──
  const [moverSignatureDataUrl, setMoverSignatureDataUrl] = useState<string | null>(null);
  const [moverTypedName, setMoverTypedName] = useState('');
  // ── Signing state (client) ──
  const [clientSignatureDataUrl, setClientSignatureDataUrl] = useState<string | null>(null);
  const [clientTypedName, setClientTypedName] = useState('');
  // ── Common ──
  const [consentChecked, setConsentChecked] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  // ── Compute current contract with all edits ──
  const buildUpdatedContract = useCallback((): SignedContract => {
    const updated: SignedContract = {
      ...initialContract,
      client: clientData,
      moveDetails: {
        ...initialContract.moveDetails,
        inventory,
        additionalCharges,
      },
    };
    return regenerateContract(updated);
  }, [initialContract, clientData, inventory, additionalCharges]);

  const [currentContract, setCurrentContract] = useState<SignedContract>(buildUpdatedContract);

  // Regenerate contract HTML when data changes
  useEffect(() => {
    setCurrentContract(buildUpdatedContract());
  }, [clientData, inventory, additionalCharges]);

  // ── Price calculation ──
  const basePrice = initialContract.moveDetails.totalPrice;
  const additionalTotal = additionalCharges.reduce((s, c) => s + c.price, 0);
  const grandTotal = basePrice + additionalTotal;

  const canSign =
    moverSignatureDataUrl && moverTypedName.trim().length >= 2 &&
    clientSignatureDataUrl && clientTypedName.trim().length >= 2 &&
    consentChecked && scrolledToBottom;

  const handleSign = () => {
    if (!canSign || !moverSignatureDataUrl || !clientSignatureDataUrl) return;
    const now = new Date().toISOString();
    const deviceInfo = typeof navigator !== 'undefined' ? navigator.userAgent : 'Mobile';
    const moverSig: ContractSignature = {
      signatureDataUrl: moverSignatureDataUrl,
      signedAt: now,
      deviceInfo,
      fullName: moverTypedName.trim(),
    };
    const clientSig: ContractSignature = {
      signatureDataUrl: clientSignatureDataUrl,
      signedAt: now,
      deviceInfo,
      fullName: clientTypedName.trim(),
    };
    onSign(moverSig, clientSig, currentContract);
  };

  const handleScroll = (e: any) => {
    if (Platform.OS === 'web') {
      const target = e.target || e.nativeEvent?.target;
      if (target) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        if (scrollHeight - scrollTop - clientHeight < 60) {
          setScrolledToBottom(true);
        }
      }
    }
  };

  // ── Inventory actions ──
  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const addAdditionalItem = () => {
    if (!addName.trim()) return;
    const price = parseFloat(addPrice) || 0;

    if (addType === 'furniture') {
      // Add to inventory
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        name: addName.trim(),
        quantity: parseInt(addQty) || 1,
        room: addRoom.trim() || 'Additional',
        tag: undefined,
      };
      setInventory(prev => [...prev, newItem]);
      // If has price, also add charge
      if (price > 0) {
        const charge: AdditionalCharge = {
          id: `ac-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          type: 'furniture',
          name: addName.trim(),
          price,
        };
        setAdditionalCharges(prev => [...prev, charge]);
      }
    } else {
      // Service — add as additional charge
      const charge: AdditionalCharge = {
        id: `ac-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        type: 'service',
        name: addName.trim(),
        price,
      };
      setAdditionalCharges(prev => [...prev, charge]);
    }

    // Reset form
    setAddName('');
    setAddPrice('');
    setAddRoom('');
    setAddQty('1');
    setAddSize('');
    setAddDescription('');
    setShowAddModal(false);
  };

  const removeAdditionalCharge = (id: string) => {
    setAdditionalCharges(prev => prev.filter(c => c.id !== id));
  };

  // ── Group inventory by room ──
  const inventoryByRoom: Record<string, InventoryItem[]> = {};
  inventory.forEach(item => {
    const room = item.room || 'Other';
    if (!inventoryByRoom[room]) inventoryByRoom[room] = [];
    inventoryByRoom[room].push(item);
  });

  if (Platform.OS !== 'web') return null;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Header */}
        <div style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          padding: '12px 16px',
        } as any}>
          <Pressable onPress={onBack} style={{ padding: 4 }}>
            {Platform.OS === 'web' && <BackIcon />}
          </Pressable>
          <div style={{ flex: 1, textAlign: 'center' } as any}>
            <span style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.3 } as any}>
              Moving Contract
            </span>
          </div>
          <div style={{ width: 28 } as any} />
        </div>

        {/* Legal badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '8px 16px', backgroundColor: colors.success[25],
          borderBottom: `1px solid ${colors.success[100]}`,
        } as any}>
          <ShieldIcon />
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.success[700] } as any}>
            Legally binding under California UETA & federal ESIGN Act
          </span>
        </div>

        {/* Scrollable body */}
        <div
          onScroll={handleScroll}
          style={{
            flex: 1, overflowY: 'auto', padding: '16px 16px 0',
            backgroundColor: '#F9FAFB',
          } as any}
        >

          {/* ═══ SECTION: Editable Client Data ═══ */}
          <CollapsibleSection
            title="Client Information"
            icon={<EditPenIcon />}
            badge={editingClient ? 'Editing' : undefined}
            defaultOpen={false}
          >
            {!editingClient ? (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 } as any}>
                  <div style={{ display: 'flex', gap: 6 } as any}>
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[500], width: 60 } as any}>Name:</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800] } as any}>{clientData.fullName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 } as any}>
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[500], width: 60 } as any}>Phone:</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800] } as any}>{clientData.phone}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 } as any}>
                    <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[500], width: 60 } as any}>Email:</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800] } as any}>{clientData.email}</span>
                  </div>
                  {clientData.address && (
                    <div style={{ display: 'flex', gap: 6 } as any}>
                      <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[500], width: 60 } as any}>Address:</span>
                      <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800] } as any}>{clientData.address}</span>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => setEditingClient(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                    borderRadius: 8, backgroundColor: colors.primary[50], cursor: 'pointer',
                  } as any}
                >
                  <EditPenIcon />
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.primary[600] } as any}>Edit Client Info</span>
                </div>
              </div>
            ) : (
              <div>
                <InlineInput label="Full Name" value={clientData.fullName} onChange={v => setClientData(prev => ({ ...prev, fullName: v }))} placeholder="Full legal name" />
                <InlineInput label="Phone" value={clientData.phone} onChange={v => setClientData(prev => ({ ...prev, phone: v }))} placeholder="+1 (555) 000-0000" type="tel" />
                <InlineInput label="Email" value={clientData.email} onChange={v => setClientData(prev => ({ ...prev, email: v }))} placeholder="email@example.com" type="email" />
                <InlineInput label="Address" value={clientData.address || ''} onChange={v => setClientData(prev => ({ ...prev, address: v }))} placeholder="Street address" />
                <div
                  onClick={() => setEditingClient(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, backgroundColor: colors.primary[500],
                    cursor: 'pointer', marginTop: 4,
                  } as any}
                >
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#FFFFFF' } as any}>Save Changes</span>
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* ═══ SECTION: Furniture / Inventory List ═══ */}
          <CollapsibleSection
            title="Inventory / Furniture"
            icon={<FurnitureIcon />}
            badge={`${inventory.reduce((s, i) => s + i.quantity, 0)} items`}
            defaultOpen={false}
          >
            {Object.entries(inventoryByRoom).map(([room, items]) => (
              <div key={room} style={{ marginBottom: 12 } as any}>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: colors.gray[600], display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 } as any}>
                  {room}
                </span>
                {items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', padding: '8px 10px',
                    backgroundColor: '#FAFAFA', borderRadius: 8, marginBottom: 4, gap: 8,
                  } as any}>
                    <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800], flex: 1 } as any}>
                      {item.name}
                    </span>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500], minWidth: 35, textAlign: 'center' } as any}>
                      x{item.quantity}
                    </span>
                    {item.tag && (
                      <span style={{
                        fontFamily: F, fontSize: 10, fontWeight: 600, color: colors.gray[600],
                        backgroundColor: item.tag === 'Fragile' ? '#FEF3F2' : item.tag === 'Large' ? '#EFF8FF' : '#FFF6ED',
                        padding: '2px 6px', borderRadius: 4,
                      } as any}>{item.tag}</span>
                    )}
                    <div onClick={() => removeInventoryItem(item.id)} style={{ cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' } as any}>
                      <TrashIcon />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {inventory.length === 0 && (
              <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], fontStyle: 'italic' } as any}>
                No inventory items added yet
              </span>
            )}
          </CollapsibleSection>

          {/* ═══ SECTION: Additional Services & Items ═══ */}
          <CollapsibleSection
            title="Additional Services"
            icon={<ServiceIcon />}
            badge={additionalCharges.length > 0 ? `+$${additionalTotal.toFixed(0)}` : undefined}
            defaultOpen={false}
          >
            {additionalCharges.map(ch => (
              <div key={ch.id} style={{
                display: 'flex', alignItems: 'center', padding: '8px 10px',
                backgroundColor: '#FAFAFA', borderRadius: 8, marginBottom: 4, gap: 8,
              } as any}>
                <span style={{
                  fontFamily: F, fontSize: 10, fontWeight: 600,
                  color: ch.type === 'furniture' ? colors.primary[600] : colors.primary[600],
                  backgroundColor: ch.type === 'furniture' ? colors.primary[50] : colors.primary[50],
                  padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
                } as any}>{ch.type}</span>
                <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[800], flex: 1 } as any}>
                  {ch.name}
                </span>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: colors.gray[800] } as any}>
                  ${ch.price.toFixed(2)}
                </span>
                <div onClick={() => removeAdditionalCharge(ch.id)} style={{ cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' } as any}>
                  <TrashIcon />
                </div>
              </div>
            ))}

            {additionalCharges.length === 0 && !showAddModal && (
              <span style={{ fontFamily: F, fontSize: 13, color: colors.gray[400], fontStyle: 'italic', display: 'block', marginBottom: 10 } as any}>
                No additional services or items
              </span>
            )}

            {/* Add button */}
            {!showAddModal && (
              <div
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 0', borderRadius: 10, backgroundColor: colors.primary[500],
                  cursor: 'pointer', marginTop: 8,
                } as any}
              >
                <PlusIcon />
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: '#FFFFFF' } as any}>
                  Add Item or Service
                </span>
              </div>
            )}

            {/* ── Add Modal (inline) ── */}
            {showAddModal && (
              <div style={{
                marginTop: 8, padding: 14, borderRadius: 12,
                border: `1.5px solid ${colors.primary[200]}`, backgroundColor: colors.primary[25],
              } as any}>
                <span style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: colors.gray[800], display: 'block', marginBottom: 12 } as any}>
                  Add Item or Service
                </span>

                {/* Type picker */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 } as any}>
                  {(['furniture', 'service'] as const).map(t => (
                    <div
                      key={t}
                      onClick={() => setAddType(t)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                        border: `1.5px solid ${addType === t ? colors.primary[400] : colors.gray[200]}`,
                        backgroundColor: addType === t ? colors.primary[50] : '#FFFFFF',
                      } as any}
                    >
                      {t === 'furniture' ? <FurnitureIcon /> : <ServiceIcon />}
                      <span style={{
                        fontFamily: F, fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                        color: addType === t ? colors.primary[700] : colors.gray[500],
                      } as any}>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Name */}
                <InlineInput
                  label={addType === 'furniture' ? 'Item Name' : 'Service Name'}
                  value={addName}
                  onChange={setAddName}
                  placeholder={addType === 'furniture' ? 'e.g. Grand Piano' : 'e.g. Packing Service'}
                />

                {/* Room + Qty + Size (furniture only) */}
                {addType === 'furniture' && (
                  <>
                    <div style={{ display: 'flex', gap: 8 } as any}>
                      <div style={{ flex: 2 } as any}>
                        <InlineInput label="Room" value={addRoom} onChange={setAddRoom} placeholder="e.g. Living Room" />
                      </div>
                      <div style={{ flex: 1 } as any}>
                        <InlineInput label="Qty" value={addQty} onChange={setAddQty} placeholder="1" type="number" />
                      </div>
                    </div>
                    <InlineInput label="Size (optional)" value={addSize} onChange={setAddSize} placeholder='e.g. 72"x36"x30"' />
                  </>
                )}

                {/* Description (service only) */}
                {addType === 'service' && (
                  <InlineInput label="Description (optional)" value={addDescription} onChange={setAddDescription} placeholder="e.g. Full packing of kitchen items" />
                )}

                {/* Price */}
                <InlineInput
                  label="Price ($)"
                  value={addPrice}
                  onChange={setAddPrice}
                  placeholder={addType === 'furniture' ? '0.00 (optional)' : '0.00'}
                  type="number"
                />

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 6 } as any}>
                  <div
                    onClick={() => { setShowAddModal(false); setAddName(''); setAddPrice(''); setAddRoom(''); setAddQty('1'); setAddSize(''); setAddDescription(''); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${colors.gray[200]}`, backgroundColor: '#FFFFFF',
                    } as any}
                  >
                    <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[600] } as any}>Cancel</span>
                  </div>
                  <div
                    onClick={addAdditionalItem}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                      backgroundColor: addName.trim() ? colors.primary[500] : colors.gray[200],
                    } as any}
                  >
                    <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: addName.trim() ? '#FFFFFF' : colors.gray[400] } as any}>Add</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price summary */}
            {additionalCharges.length > 0 && (
              <div style={{
                marginTop: 12, padding: '10px 12px', borderRadius: 8,
                backgroundColor: '#F0F9FF', border: `1px solid ${colors.primary[100]}`,
              } as any}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 } as any}>
                  <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500] } as any}>Base price:</span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.gray[700] } as any}>${basePrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 } as any}>
                  <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[500] } as any}>Additional:</span>
                  <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: colors.primary[600] } as any}>+${additionalTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${colors.primary[100]}`, paddingTop: 4 } as any}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: colors.gray[800] } as any}>Total:</span>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: colors.gray[900] } as any}>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CollapsibleSection>

          {/* ═══ CONTRACT HTML ═══ */}
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
            border: `1px solid ${colors.gray[100]}`, marginBottom: 16,
          } as any}>
            <div
              dangerouslySetInnerHTML={{ __html: currentContract.contractHtml }}
              style={{ marginBottom: 0 } as any}
            />
          </div>

          {/* Scroll prompt */}
          {!scrolledToBottom && (
            <div style={{
              textAlign: 'center', padding: '12px 0 8px',
              borderTop: `1px dashed ${colors.gray[200]}`,
            } as any}>
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: colors.gray[400] } as any}>
                Scroll down to review the full contract before signing
              </span>
            </div>
          )}

          {/* ── Signing area (only visible after scrolling) ── */}
          {scrolledToBottom && (
            <>
              {/* ── MOVER SIGNATURE ── */}
              <div style={{
                marginBottom: 12, backgroundColor: '#FFFFFF',
                borderRadius: 12, padding: 16, border: `1px solid ${colors.gray[100]}`,
              } as any}>
                <div style={{ textAlign: 'center', marginBottom: 16 } as any}>
                  <span style={{
                    fontFamily: F, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: colors.primary[600], display: 'block', marginBottom: 4,
                  } as any}>Service Provider</span>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.3 } as any}>
                    Mover Signature
                  </span>
                  <div style={{ marginTop: 4 } as any}>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400] } as any}>
                      Signing as: {signerName}
                    </span>
                  </div>
                </div>

                <SignaturePad onSignatureChange={setMoverSignatureDataUrl} />

                <div style={{ marginTop: 16 } as any}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[700], display: 'block', marginBottom: 6 } as any}>
                    Type your full legal name to confirm
                  </span>
                  <input
                    type="text"
                    value={moverTypedName}
                    onChange={(e: any) => setMoverTypedName(e.target.value)}
                    placeholder={signerName}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: `1.5px solid ${moverTypedName ? colors.primary[300] : colors.gray[200]}`,
                      fontFamily: F, fontSize: 15, fontWeight: 500, color: colors.gray[900],
                      outline: 'none', backgroundColor: '#FAFAFA', boxSizing: 'border-box',
                    } as any}
                  />
                </div>
              </div>

              {/* ── CLIENT SIGNATURE ── */}
              <div style={{
                marginBottom: 12, backgroundColor: '#FFFFFF',
                borderRadius: 12, padding: 16, border: `1px solid ${colors.gray[100]}`,
              } as any}>
                <div style={{ textAlign: 'center', marginBottom: 16 } as any}>
                  <span style={{
                    fontFamily: F, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: colors.primary[600], display: 'block', marginBottom: 4,
                  } as any}>Customer</span>
                  <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: colors.gray[900], letterSpacing: -0.3 } as any}>
                    Client Signature
                  </span>
                  <div style={{ marginTop: 4 } as any}>
                    <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400] } as any}>
                      Signing as: {clientName}
                    </span>
                  </div>
                </div>

                <SignaturePad onSignatureChange={setClientSignatureDataUrl} />

                <div style={{ marginTop: 16 } as any}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: colors.gray[700], display: 'block', marginBottom: 6 } as any}>
                    Type client's full legal name to confirm
                  </span>
                  <input
                    type="text"
                    value={clientTypedName}
                    onChange={(e: any) => setClientTypedName(e.target.value)}
                    placeholder={clientName}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 12,
                      border: `1.5px solid ${clientTypedName ? colors.primary[600] : colors.gray[200]}`,
                      fontFamily: F, fontSize: 15, fontWeight: 500, color: colors.gray[900],
                      outline: 'none', backgroundColor: '#FAFAFA', boxSizing: 'border-box',
                    } as any}
                  />
                </div>
              </div>

              {/* ── CONSENT & AUDIT TRAIL ── */}
              <div style={{
                marginBottom: 12, backgroundColor: '#FFFFFF',
                borderRadius: 12, padding: 16, border: `1px solid ${colors.gray[100]}`,
              } as any}>
                <div
                  onClick={() => setConsentChecked(!consentChecked)}
                  style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 10,
                    cursor: 'pointer', padding: '12px 14px',
                    borderRadius: 12, backgroundColor: consentChecked ? colors.primary[25] : '#F9FAFB',
                    border: `1px solid ${consentChecked ? colors.primary[200] : colors.gray[100]}`,
                  } as any}
                >
                  <div style={{ flexShrink: 0, marginTop: 1 } as any}>
                    <CheckIcon checked={consentChecked} />
                  </div>
                  <span style={{ fontFamily: F, fontSize: 13, lineHeight: '18px', color: colors.gray[700] } as any}>
                    Both parties agree to sign this contract electronically and understand that
                    electronic signatures have the same legal effect as handwritten signatures
                    under California law (Cal. Civ. Code § 1633.7) and the federal ESIGN Act.
                  </span>
                </div>

                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 10,
                  backgroundColor: '#F9FAFB', border: `1px solid ${colors.gray[100]}`,
                } as any}>
                  <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: colors.gray[500], display: 'block', marginBottom: 4 } as any}>
                    AUDIT TRAIL
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: colors.gray[400], lineHeight: '16px' } as any}>
                    Timestamp: {new Date().toISOString()}<br/>
                    Device: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 60) + '...' : 'Mobile'}<br/>
                    Contract: {currentContract.contractNumber}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Bottom spacer */}
          <div style={{ height: 20 } as any} />
        </div>

        {/* Bottom action bar */}
        <div style={{
          padding: '12px 16px 28px',
          borderTop: `1px solid ${colors.gray[100]}`,
          backgroundColor: '#FFFFFF',
        } as any}>
          <div
            onClick={canSign ? handleSign : undefined}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px 0', borderRadius: 16, cursor: canSign ? 'pointer' : 'default',
              backgroundColor: canSign ? colors.primary[500] : colors.gray[100],
              transition: 'all 0.2s',
            } as any}
          >
            <span style={{
              fontFamily: F, fontSize: 17, fontWeight: 700, letterSpacing: -0.2,
              color: canSign ? '#FFFFFF' : colors.gray[400],
            } as any}>
              {!scrolledToBottom
                ? 'Read contract to continue'
                : !moverSignatureDataUrl
                  ? 'Mover: draw signature above'
                  : !moverTypedName.trim()
                    ? 'Mover: type name to confirm'
                    : !clientSignatureDataUrl
                      ? 'Client: draw signature above'
                      : !clientTypedName.trim()
                        ? 'Client: type name to confirm'
                        : !consentChecked
                          ? 'Check the consent box'
                          : 'Sign Contract'}
            </span>
          </div>

          {!scrolledToBottom && (
            <div style={{ textAlign: 'center', marginTop: 8 } as any}>
              <span style={{ fontFamily: F, fontSize: 12, color: colors.gray[400] } as any}>
                Please read the entire contract before signing
              </span>
            </div>
          )}
        </div>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});
