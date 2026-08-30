import React, { useState } from 'react';
import { BIS_STANDARDS } from '../data/bisDatabase';

interface ExcerptViewerModalProps {
  isCode: string | null;
  onClose: () => void;
}

export const ExcerptViewerModal: React.FC<ExcerptViewerModalProps> = ({
  isCode,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isCode) return null;

  const standard =
    BIS_STANDARDS.find((s) => s.isCode.toLowerCase().includes(isCode.toLowerCase().split(':')[0])) ||
    BIS_STANDARDS[0];

  const handleCopy = () => {
    const text = `${standard.isCode} - ${standard.title}\n\nScope:\n${standard.scope}\n\nKey Clauses:\n${standard.keyClauses
      .map((c) => `${c.clauseNumber}: ${c.title} - ${c.summary}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#152031] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb77a] text-lg">description</span>
              <span className="font-mono-code text-[11px] text-[#ffb77a] uppercase tracking-wider">
                Official Document Excerpt
              </span>
            </div>
            <h3 className="font-space text-lg font-bold text-[#d8e3fb]">
              {standard.isCode} Technical Summary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7b8394] hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Printable/Copyable Document Sheet */}
        <div className="flex-1 overflow-y-auto chat-scroll bg-[#081425] p-6 rounded-xl border border-white/10 space-y-4 font-hanken text-xs text-[#d8e3fb]">
          {/* Official Gazette Style Header */}
          <div className="text-center pb-3 border-b border-white/10 space-y-1">
            <h4 className="font-space text-sm font-bold text-[#ffb77a] uppercase tracking-wider">
              BUREAU OF INDIAN STANDARDS
            </h4>
            <p className="font-mono-code text-[10px] text-[#7b8394]">
              Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002
            </p>
            <div className="font-mono-code text-xs font-bold text-[#d8e3fb] pt-1">
              INDIAN STANDARD: {standard.isCode}
            </div>
            <div className="text-[11px] font-semibold text-[#bfc6da]">{standard.title}</div>
          </div>

          {/* Section: Scope */}
          <div className="space-y-1">
            <h5 className="font-space text-xs font-bold text-[#72de5c] uppercase">
              1. SCOPE AND APPLICATION
            </h5>
            <p className="text-[#c6c6cc] leading-relaxed pl-2 border-l-2 border-white/10">
              {standard.scope}
            </p>
          </div>

          {/* Section: Key Clauses */}
          <div className="space-y-2">
            <h5 className="font-space text-xs font-bold text-[#72de5c] uppercase">
              2. ESSENTIAL SPECIFICATION CLAUSES
            </h5>
            <div className="space-y-2 pl-2 border-l-2 border-white/10">
              {standard.keyClauses.map((c, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="font-mono-code font-bold text-[#ffb77a]">
                    {c.clauseNumber} — {c.title}
                  </div>
                  <p className="text-[#c6c6cc] leading-relaxed">{c.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Lab Parameters */}
          {standard.sampleTestParameters && (
            <div className="space-y-1">
              <h5 className="font-space text-xs font-bold text-[#72de5c] uppercase">
                3. VERIFICATION & TEST PARAMETERS
              </h5>
              <ul className="list-disc pl-6 space-y-0.5 text-[#c6c6cc]">
                {standard.sampleTestParameters.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Verification Watermark */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono-code text-[#7b8394]">
            <span>Authenticated via BIS Sahayak Engine</span>
            <span>Ref: {standard.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-[#1f2a3c] hover:bg-[#2a3548] text-[#d8e3fb] font-space text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Excerpt</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
