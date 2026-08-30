import React from 'react';
import { StandardItem } from '../types';

interface StandardDetailModalProps {
  standard: StandardItem | null;
  onClose: () => void;
  onOpenCompare: (isCode: string) => void;
  onOpenExcerpt: (isCode: string) => void;
  onToggleSave: (standard: StandardItem) => void;
  isSaved: boolean;
  onAskAiAboutStandard: (prompt: string) => void;
}

export const StandardDetailModal: React.FC<StandardDetailModalProps> = ({
  standard,
  onClose,
  onOpenCompare,
  onOpenExcerpt,
  onToggleSave,
  isSaved,
  onAskAiAboutStandard,
}) => {
  if (!standard) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#152031] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 bg-[#111c2d] flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-code text-lg font-bold text-[#ffb77a]">
                {standard.isCode}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#1f2a3c] text-[#bfc6da] border border-white/5">
                {standard.department}
              </span>
              {standard.isMandatoryQCO && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#d7790d]/20 text-[#ffb77a] border border-[#d7790d]/40">
                  Mandatory QCO
                </span>
              )}
            </div>
            <h3 className="font-space text-lg md:text-xl font-bold text-[#d8e3fb]">
              {standard.title}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleSave(standard)}
              className={`p-2 rounded-lg border transition-all ${
                isSaved
                  ? 'border-[#ffb77a] text-[#ffb77a] bg-[#ffb77a]/10'
                  : 'border-white/10 text-[#7b8394] hover:text-white hover:bg-white/5'
              }`}
              title={isSaved ? 'Remove bookmark' : 'Bookmark standard'}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#7b8394] hover:text-white rounded-lg hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto chat-scroll p-5 md:p-6 space-y-6">
          {/* Scope and Purpose */}
          <div className="space-y-2">
            <h4 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
              Standard Scope & Application
            </h4>
            <p className="font-hanken text-sm text-[#d8e3fb] leading-relaxed bg-[#111c2d] p-4 rounded-xl border border-white/5">
              {standard.scope}
            </p>
          </div>

          {/* Key Clauses & Technical Requirements */}
          <div className="space-y-3">
            <h4 className="font-space text-xs font-bold text-[#72de5c] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">menu_book</span>
              Key Prescribed Clauses & Tolerances
            </h4>
            <div className="space-y-2">
              {standard.keyClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="bg-[#1f2a3c] p-3.5 rounded-xl border border-white/5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-code text-xs font-bold text-[#ffb77a]">
                      {clause.clauseNumber} • {clause.title}
                    </span>
                    {clause.mandatory && (
                      <span className="text-[10px] font-mono-code text-[#72de5c] bg-[#72de5c]/10 px-1.5 py-0.2 rounded">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="font-hanken text-xs text-[#c6c6cc] leading-relaxed">
                    {clause.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Laboratory Test Parameters */}
          {standard.sampleTestParameters && (
            <div className="space-y-2">
              <h4 className="font-space text-xs font-bold text-[#bfc6da] uppercase tracking-wider">
                Prescribed Laboratory Test Parameters
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {standard.sampleTestParameters.map((param, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-[#111c2d] border border-white/5 text-xs font-mono-code text-[#d8e3fb]"
                  >
                    • {param}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ISO Equivalence & Harmonization */}
          {standard.isoEquivalence && (
            <div className="bg-[#111c2d] p-4 rounded-xl border border-white/5 space-y-2">
              <h4 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
                International Standard Harmonization (ISO/IEC)
              </h4>
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#72de5c]">
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                <span>Equivalent: {standard.isoEquivalence}</span>
              </div>
              <p className="font-hanken text-xs text-[#c6c6cc] leading-relaxed">
                {standard.isoComparisonNotes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 md:p-5 border-t border-white/10 bg-[#111c2d] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onAskAiAboutStandard(`Explain the mandatory compliance clauses, testing requirements, and tolerance limits for ${standard.isCode}`);
            }}
            className="px-4 py-2 rounded-lg bg-[#1f2a3c] hover:bg-[#2a3548] text-[#72de5c] border border-[#72de5c]/30 font-space text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>Ask AI about {standard.isCode}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCompare(standard.isCode);
              }}
              className="px-3.5 py-2 rounded-lg border border-white/10 hover:border-[#ffb77a] text-[#ffb77a] font-space text-xs font-bold transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Compare with ISO</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenExcerpt(standard.isCode);
              }}
              className="px-4 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download Excerpt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
