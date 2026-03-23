/**
 * AI Moving — Contract Generator
 *
 * Generates a legally binding Moving Services Agreement
 * compliant with California UETA (Civil Code §§ 1633.1–1633.17)
 * and the federal ESIGN Act.
 *
 * Required data for legal enforceability:
 * - Full legal names of both parties
 * - Contact info (email, phone)
 * - Service details (addresses, date, pricing)
 * - Timestamp of signature
 * - IP address / device info (audit trail)
 * - Explicit consent to electronic transaction
 */

export interface ContractParty {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  room?: string;
  tag?: 'Large' | 'Fragile' | 'Heavy';
}

export interface AdditionalCharge {
  id: string;
  type: 'furniture' | 'service';
  name: string;
  price: number;
}

export interface ContractMoveDetails {
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  planName: string;
  totalPrice: number;
  depositPaid: number;
  truckSize: string;
  crewSize: number;
  estimatedDuration?: string;
  itemsCount?: number;
  specialItems?: string[];
  inventory?: InventoryItem[];
  additionalCharges?: AdditionalCharge[];
}

export interface ContractSignature {
  signatureDataUrl: string; // base64 PNG of drawn signature
  signedAt: string;         // ISO 8601 timestamp
  ipAddress?: string;
  deviceInfo?: string;
  fullName: string;         // typed confirmation of name
}

export interface SignedContract {
  id: string;
  contractNumber: string;
  generatedAt: string;
  client: ContractParty;
  mover: ContractParty & { companyName: string; license?: string; insurancePolicy?: string };
  moveDetails: ContractMoveDetails;
  clientSignature?: ContractSignature;
  moverSignature?: ContractSignature;
  status: 'pending' | 'client_signed' | 'fully_signed' | 'voided';
  contractHtml: string;
}

/* ─── helpers ─── */

const genId = () => `CNT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const fmtCurrency = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
};

/* ─── build inventory table HTML ─── */

function buildInventoryHtml(inventory: InventoryItem[]): string {
  if (!inventory.length) return '';

  // Group items by room
  const byRoom: Record<string, InventoryItem[]> = {};
  inventory.forEach(item => {
    const room = item.room || 'Other';
    if (!byRoom[room]) byRoom[room] = [];
    byRoom[room].push(item);
  });

  let html = `
  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">INVENTORY OF ITEMS</div>
  <div style="margin-bottom: 16px; padding-left: 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <thead>
        <tr style="background: #F9FAFB;">
          <th style="text-align: left; padding: 8px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467;">Item</th>
          <th style="text-align: center; padding: 8px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467; width: 50px;">Qty</th>
          <th style="text-align: left; padding: 8px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467; width: 80px;">Note</th>
        </tr>
      </thead>
      <tbody>`;

  Object.entries(byRoom).forEach(([room, items]) => {
    html += `
        <tr>
          <td colspan="3" style="padding: 8px 10px 4px; font-weight: 700; font-size: 12px; color: #344054; background: #F9FAFB;">${room}</td>
        </tr>`;
    items.forEach(item => {
      html += `
        <tr>
          <td style="padding: 6px 10px 6px 20px; border-bottom: 1px solid #F2F4F7; color: #344054;">${item.name}</td>
          <td style="padding: 6px 10px; border-bottom: 1px solid #F2F4F7; text-align: center; color: #344054;">${item.quantity}</td>
          <td style="padding: 6px 10px; border-bottom: 1px solid #F2F4F7; color: #667085; font-size: 11px;">${item.tag || '—'}</td>
        </tr>`;
    });
  });

  html += `
      </tbody>
    </table>
    <div style="margin-top: 6px; font-size: 11px; color: #98A2B3;">
      Total items: ${inventory.reduce((sum, i) => sum + i.quantity, 0)}
    </div>
  </div>`;

  return html;
}

/* ─── build additional charges HTML ─── */

function buildAdditionalChargesHtml(charges: AdditionalCharge[]): string {
  if (!charges.length) return '';

  let html = `
  <div style="font-weight: 700; font-size: 13px; margin-bottom: 6px; margin-top: 8px; color: #182230;">Additional Items & Services</div>
  <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;">
    <thead>
      <tr style="background: #F9FAFB;">
        <th style="text-align: left; padding: 6px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467;">Description</th>
        <th style="text-align: center; padding: 6px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467; width: 70px;">Type</th>
        <th style="text-align: right; padding: 6px 10px; border-bottom: 1px solid #EAECF0; font-weight: 600; color: #475467; width: 80px;">Price</th>
      </tr>
    </thead>
    <tbody>`;

  charges.forEach(ch => {
    html += `
      <tr>
        <td style="padding: 6px 10px; border-bottom: 1px solid #F2F4F7; color: #344054;">${ch.name}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #F2F4F7; text-align: center; color: #667085; font-size: 11px; text-transform: capitalize;">${ch.type}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #F2F4F7; text-align: right; font-weight: 600; color: #344054;">${fmtCurrency(ch.price)}</td>
      </tr>`;
  });

  const total = charges.reduce((s, c) => s + c.price, 0);
  html += `
      <tr>
        <td colspan="2" style="padding: 6px 10px; font-weight: 600; color: #344054; text-align: right;">Subtotal:</td>
        <td style="padding: 6px 10px; font-weight: 700; color: #182230; text-align: right;">${fmtCurrency(total)}</td>
      </tr>
    </tbody>
  </table>`;

  return html;
}

/* ─── contract text ─── */

export function generateContractHtml(
  client: ContractParty,
  mover: ContractParty & { companyName: string; license?: string; insurancePolicy?: string },
  move: ContractMoveDetails,
  contractNumber: string,
  date: string,
): string {
  const additionalTotal = (move.additionalCharges || []).reduce((s, c) => s + c.price, 0);
  const grandTotal = move.totalPrice + additionalTotal;
  const balanceDue = grandTotal - move.depositPaid;

  return `
<div style="font-family: Inter, system-ui, sans-serif; color: #101828; line-height: 1.6; font-size: 13px;">

  <div style="text-align: center; margin-bottom: 24px;">
    <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.5px;">MOVING SERVICES AGREEMENT</div>
    <div style="font-size: 12px; color: #667085; margin-top: 4px;">Contract #${contractNumber}</div>
    <div style="font-size: 12px; color: #667085;">Date: ${fmtDate(date)}</div>
    <div style="font-size: 11px; color: #98A2B3; margin-top: 2px;">State of California</div>
  </div>

  <div style="font-size: 13px; margin-bottom: 16px;">
    This Moving Services Agreement ("Agreement") is entered into as of <strong>${fmtDate(date)}</strong>,
    by and between:
  </div>

  <div style="display: flex; gap: 16px; margin-bottom: 20px;">
    <div style="flex: 1; background: #F9FAFB; border-radius: 10px; padding: 12px;">
      <div style="font-size: 11px; font-weight: 600; color: #667085; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Service Provider ("Mover")</div>
      <div style="font-weight: 600;">${mover.companyName}</div>
      <div>${mover.fullName}</div>
      <div style="font-size: 12px; color: #475467;">${mover.phone}</div>
      <div style="font-size: 12px; color: #475467;">${mover.email}</div>
      ${mover.license ? `<div style="font-size: 12px; color: #475467;">License: ${mover.license}</div>` : ''}
      ${mover.insurancePolicy ? `<div style="font-size: 12px; color: #475467;">Insurance: ${mover.insurancePolicy}</div>` : ''}
    </div>
    <div style="flex: 1; background: #F9FAFB; border-radius: 10px; padding: 12px;">
      <div style="font-size: 11px; font-weight: 600; color: #667085; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Client ("Customer")</div>
      <div style="font-weight: 600;">${client.fullName}</div>
      <div style="font-size: 12px; color: #475467;">${client.phone}</div>
      <div style="font-size: 12px; color: #475467;">${client.email}</div>
      ${client.address ? `<div style="font-size: 12px; color: #475467;">${client.address}</div>` : ''}
    </div>
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">1. SCOPE OF SERVICES</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    The Mover agrees to provide residential moving services as described below:
    <ul style="margin: 8px 0; padding-left: 16px;">
      <li><strong>Origin:</strong> ${move.fromAddress}</li>
      <li><strong>Destination:</strong> ${move.toAddress}</li>
      <li><strong>Scheduled Date:</strong> ${move.moveDate}</li>
      <li><strong>Service Plan:</strong> ${move.planName}</li>
      <li><strong>Truck Size:</strong> ${move.truckSize}</li>
      <li><strong>Crew Size:</strong> ${move.crewSize} movers</li>
      ${move.estimatedDuration ? `<li><strong>Est. Duration:</strong> ${move.estimatedDuration}</li>` : ''}
      ${move.itemsCount ? `<li><strong>Items:</strong> Approx. ${move.itemsCount} items</li>` : ''}
    </ul>
    Services include: loading, transportation, unloading, basic furniture disassembly/reassembly,
    use of moving blankets and padding, floor and doorway protection.
  </div>

  ${move.inventory && move.inventory.length > 0 ? buildInventoryHtml(move.inventory) : ''}

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">2. PRICING & PAYMENT</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    <div style="background: #F9FAFB; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Base Service Price:</span><strong>${fmtCurrency(move.totalPrice)}</strong>
      </div>
      ${additionalTotal > 0 ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Additional Items & Services:</span><strong>+${fmtCurrency(additionalTotal)}</strong>
      </div>` : ''}
      ${move.additionalCharges && move.additionalCharges.length > 0 ? buildAdditionalChargesHtml(move.additionalCharges) : ''}
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;${additionalTotal > 0 ? ' border-top: 1px solid #EAECF0; padding-top: 4px;' : ''}">
        <span style="font-weight: 600;">Total Price:</span><strong>${fmtCurrency(grandTotal)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Deposit Paid:</span><strong>${fmtCurrency(move.depositPaid)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; border-top: 1px solid #EAECF0; padding-top: 4px;">
        <span style="font-weight: 600;">Balance Due on Completion:</span><strong>${fmtCurrency(balanceDue)}</strong>
      </div>
    </div>
    Payment of the remaining balance is due upon completion of services. Accepted methods:
    credit/debit card, electronic transfer, or cash.
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">3. LIABILITY & INSURANCE</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    <strong>a) Basic Valuation Protection (Included):</strong> The Mover provides basic liability coverage
    at $0.60 per pound per article, as required under California Public Utilities Commission (CPUC) regulations.<br/><br/>
    <strong>b) Full Value Protection (Optional):</strong> Customer may purchase Full Value Protection at an
    additional cost, under which the Mover is liable for the replacement value of lost or damaged items.<br/><br/>
    <strong>c) High-Value Items:</strong> Items valued over $100 per pound must be declared on the inventory list.
    Undeclared high-value items may not be covered.
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">4. CANCELLATION POLICY</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    <ul style="margin: 4px 0; padding-left: 16px;">
      <li>Cancellation 48+ hours before scheduled move: Full deposit refund</li>
      <li>Cancellation 24–48 hours before: 50% deposit refund</li>
      <li>Cancellation less than 24 hours before: No refund</li>
      <li>Rescheduling: Free if done 48+ hours in advance; subject to availability</li>
    </ul>
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">5. CLAIMS & DISPUTES</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    Any claim for loss or damage must be filed in writing within 9 months of delivery.
    The Mover shall acknowledge receipt within 30 days and resolve within 120 days.
    Disputes shall be resolved through binding arbitration in accordance with California Code
    of Civil Procedure §§ 1280–1294.2, conducted in the county of origin.
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">6. CUSTOMER RESPONSIBILITIES</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    The Customer agrees to:
    <ul style="margin: 4px 0; padding-left: 16px;">
      <li>Provide accurate information about items to be moved</li>
      <li>Ensure clear access paths at both origin and destination</li>
      <li>Disclose any items requiring special handling</li>
      <li>Be present or designate an authorized representative at both locations</li>
      <li>Secure all valuables, medications, and important documents personally</li>
    </ul>
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">7. GOVERNING LAW</div>
  <div style="margin-bottom: 16px; padding-left: 12px;">
    This Agreement shall be governed by and construed in accordance with the laws of the
    State of California. Electronic signatures on this Agreement are legally binding per
    the California Uniform Electronic Transactions Act (Cal. Civ. Code §§ 1633.1–1633.17)
    and the federal Electronic Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. §§ 7001–7031).
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">8. ELECTRONIC SIGNATURE DISCLOSURE</div>
  <div style="margin-bottom: 16px; padding-left: 12px; background: #FFFAEB; border: 1px solid #FEF0C7; border-radius: 8px; padding: 12px;">
    By signing this Agreement electronically, both parties acknowledge and agree that:
    <ul style="margin: 8px 0; padding-left: 16px;">
      <li>They consent to conduct this transaction electronically</li>
      <li>Their electronic signature has the same legal effect as a handwritten signature</li>
      <li>They have had the opportunity to review all terms of this Agreement</li>
      <li>They may request a paper copy of this Agreement at any time</li>
      <li>They may withdraw consent to electronic transactions for future communications by contacting the other party in writing</li>
      <li>A copy of the signed agreement will be provided to both parties electronically</li>
    </ul>
  </div>

  <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #182230;">9. ENTIRE AGREEMENT</div>
  <div style="margin-bottom: 24px; padding-left: 12px;">
    This Agreement constitutes the entire agreement between the parties regarding the
    moving services described herein. Any amendments must be made in writing and signed
    by both parties. If any provision is found unenforceable, the remaining provisions
    shall continue in full force and effect.
  </div>

</div>`.trim();
}

/* ─── create contract ─── */

export function createContract(
  client: ContractParty,
  mover: ContractParty & { companyName: string; license?: string; insurancePolicy?: string },
  moveDetails: ContractMoveDetails,
): SignedContract {
  const id = genId();
  const now = new Date().toISOString();

  return {
    id,
    contractNumber: id,
    generatedAt: now,
    client,
    mover,
    moveDetails,
    status: 'pending',
    contractHtml: generateContractHtml(client, mover, moveDetails, id, now),
  };
}

/* ─── regenerate contract HTML after edits ─── */

export function regenerateContract(contract: SignedContract): SignedContract {
  return {
    ...contract,
    contractHtml: generateContractHtml(
      contract.client,
      contract.mover,
      contract.moveDetails,
      contract.contractNumber,
      contract.generatedAt,
    ),
  };
}
