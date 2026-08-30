import React from 'react';
import { BIS_STANDARDS } from '../data/bisDatabase';

interface CompareIsoModalProps {
  isCode: string | null;
  onClose: () => void;
  onAskAiComparison: (prompt: string) => void;
}

export const CompareIsoModal: React.FC<CompareIsoModalProps> = ({
  isCode,
  onClose,
  onAskAiComparison,
}) => {
  if (!isCode) return null;

  const standard =
    BIS_STANDARDS.find((s) => s.isCode.toLowerCase().includes(isCode.toLowerCase().split(':')[0])) ||
    BIS_STANDARDS[0];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#152031] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto chat-scroll">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#72de5c] text-lg">compare_arrows</span>
              <span className="font-mono-code text-[11px] text-[#72de5c] uppercase tracking-wider">
                International Harmonization Engine
              </span>
            </div>
            <h3 className="font-space text-lg font-bold text-[#d8e3fb]">
              {standard.isCode} vs International Standards (ISO / IEC)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7b8394] hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Indian Standard (IS) Box */}
          <div className="bg-[#111c2d] p-4 rounded-xl border border-[#d7790d]/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono-code text-xs font-bold text-[#ffb77a]">
                🇮🇳 Indian Standard
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-code bg-[#d7790d]/20 text-[#ffb77a]">
                National Code
              </span>
            </div>
            <h4 className="font-space text-sm font-bold text-[#d8e3fb]">
              {standard.isCode}
            </h4>
            <p className="font-hanken text-xs text-[#c6c6cc]">
              {standard.title}
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs font-hanken">
              <div className="text-[#ffb77a] font-mono-code font-bold">Key National Specifics:</div>
              <ul className="space-y-1 text-[#d8e3fb] text-[11px]">
                <li>• Formulated by BIS Technical Committee with Indian environmental factors.</li>
                <li>• Mandatory QCO certification status where notified by DPIIT/MeitY.</li>
                <li>• Includes specific local raw material and climatic durability thresholds.</li>
              </ul>
            </div>
          </div>

          {/* International Standard (ISO/IEC) Box */}
          <div className="bg-[#111c2d] p-4 rounded-xl border border-[#72de5c]/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono-code text-xs font-bold text-[#72de5c]">
                🌐 Global Standard
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono-code bg-[#72de5c]/20 text-[#72de5c]">
                Harmonized
              </span>
            </div>
            <h4 className="font-space text-sm font-bold text-[#d8e3fb]">
              {standard.isoEquivalence || 'ISO / IEC Equivalent'}
            </h4>
            <p className="font-hanken text-xs text-[#c6c6cc]">
              International Organization for Standardization / IEC Guidelines
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs font-hanken">
              <div className="text-[#72de5c] font-mono-code font-bold">Harmonization Context:</div>
              <p className="text-[11px] text-[#c6c6cc] leading-relaxed">
                {standard.isoComparisonNotes ||
                  'Technically equivalent testing methods with dual limit tolerances calibrated for tropical humidity and thermal extremes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Divergence Matrix */}
        <div className="bg-[#111c2d] p-4 rounded-xl border border-white/5 space-y-2">
          <h4 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
            Key Clause Divergence & Compliance Notes
          </h4>
          <div className="space-y-2 text-xs font-hanken text-[#d8e3fb]">
            <div className="p-2.5 rounded bg-[#1f2a3c] border border-white/5">
              <span className="font-mono-code font-bold text-[#ffb77a]">Pesticide & Chemical Limits:</span>
              <span className="ml-1 text-[#c6c6cc]">
                BIS standards typically enforce dedicated gas chromatography and mass spectrometry testing for tropical pesticide profiles.
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#1f2a3c] border border-white/5">
              <span className="font-mono-code font-bold text-[#72de5c]">Marking & Traceability:</span>
              <span className="ml-1 text-[#c6c6cc]">
                Mandatory display of CM/L licence number or R-Number plus QR code tracking on packaging for domestic Indian market.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              onClose();
              onAskAiComparison(`Provide a detailed clause-by-clause comparative analysis between ${standard.isCode} and ${standard.isoEquivalence || 'its ISO/IEC equivalent'}`);
            }}
            className="px-4 py-2 rounded-lg bg-[#1f2a3c] hover:bg-[#2a3548] text-[#72de5c] border border-[#72de5c]/30 font-space text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>Ask AI for Clause Matrix</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
