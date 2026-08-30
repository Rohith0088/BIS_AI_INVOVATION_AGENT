import React, { useState } from 'react';

interface FeedbackSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'feedback' | 'complaint' | 'support';
}

export const FeedbackSupportModal: React.FC<FeedbackSupportModalProps> = ({
  isOpen,
  onClose,
  initialType = 'complaint',
}) => {
  const [complaintType, setComplaintType] = useState<'fake_mark' | 'hallmark_purity' | 'quality_defect' | 'general'>(
    'fake_mark'
  );
  const [licenceOrHuid, setLicenceOrHuid] = useState('');
  const [productName, setProductName] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `BIS-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(id);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#152031] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto chat-scroll">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#d7790d]/20 border border-[#d7790d]/40 flex items-center justify-center text-[#ffb77a]">
              <span className="material-symbols-outlined text-[22px]">gavel</span>
            </div>
            <div>
              <h3 className="font-space text-lg font-bold text-[#d8e3fb]">
                Consumer Grievance & Feedback Portal
              </h3>
              <p className="text-[11px] font-mono-code text-[#7b8394]">
                Report misuse of ISI Mark, Hallmark HUID, or defective products
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7b8394] hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#72de5c]/20 border border-[#72de5c]/40 flex items-center justify-center mx-auto text-[#72de5c]">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-space text-lg font-bold text-[#d8e3fb]">
                Grievance Registered Successfully
              </h4>
              <p className="font-mono-code text-xs text-[#ffb77a]">
                Tracking Token: <span className="font-bold">{ticketId}</span>
              </p>
              <p className="text-xs text-[#c6c6cc] font-hanken pt-2 max-w-sm mx-auto">
                Your report has been logged with the Bureau of Indian Standards Enforcement & Quality Assurance Department. You can also track this in the BIS CARE mobile app.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-hanken">
            <div className="space-y-1.5">
              <label className="font-space text-xs font-bold text-[#c6c6cc] uppercase tracking-wider block">
                Grievance Category
              </label>
              <select
                value={complaintType}
                onChange={(e: any) => setComplaintType(e.target.value)}
                className="w-full bg-[#111c2d] text-[#d8e3fb] font-hanken text-xs p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#72de5c]"
              >
                <option value="fake_mark">Misuse / Fake Standard ISI Mark or CM/L</option>
                <option value="hallmark_purity">Gold/Silver Hallmarking Purity Dispute / Fake HUID</option>
                <option value="quality_defect">Defective Product under Mandatory QCO (e.g. Toys, Water, Plugs)</option>
                <option value="general">General Suggestion or Feedback on Standard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-space text-xs font-bold text-[#c6c6cc] uppercase tracking-wider block">
                Product or Standard Name
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Packaged Drinking Water Bottle, 22K Gold Bangle, Electric Plug"
                className="w-full bg-[#111c2d] text-[#d8e3fb] font-hanken text-xs p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#72de5c]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-space text-xs font-bold text-[#c6c6cc] uppercase tracking-wider block">
                Licence Number / HUID / CM/L (If visible)
              </label>
              <input
                type="text"
                value={licenceOrHuid}
                onChange={(e) => setLicenceOrHuid(e.target.value)}
                placeholder="e.g. CM/L-1454305 or 6-digit HUID code"
                className="w-full bg-[#111c2d] text-[#d8e3fb] font-mono-code text-xs p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#72de5c] uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-space text-xs font-bold text-[#c6c6cc] uppercase tracking-wider block">
                Details & Specific Observations
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe vendor name, purchase location, missing markings, or test failure..."
                className="w-full bg-[#111c2d] text-[#d8e3fb] font-hanken text-xs p-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#72de5c] resize-none"
              />
            </div>

            <div className="p-3 bg-[#111c2d] rounded-lg border border-white/5 text-[11px] text-[#7b8394] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#72de5c]">shield</span>
              <span>All consumer reports are strictly confidential under the BIS Act, 2016.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
