import React from 'react';
import { StandardItem, NavigationTab } from '../types';

interface SavedStandardsViewProps {
  savedStandards: StandardItem[];
  onSelectStandard: (standard: StandardItem) => void;
  onRemoveSave: (standard: StandardItem) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SavedStandardsView: React.FC<SavedStandardsViewProps> = ({
  savedStandards,
  onSelectStandard,
  onRemoveSave,
  onNavigate,
}) => {
  return (
    <div className="flex-grow px-4 md:px-8 pt-6 pb-24 md:pb-12 max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb77a] text-lg">bookmark</span>
          <span className="font-mono-code text-[11px] text-[#ffb77a] uppercase tracking-wider">
            Personal Quality Library
          </span>
        </div>
        <h2 className="font-space text-2xl md:text-3xl font-bold text-[#d8e3fb]">
          My Saved Standards ({savedStandards.length})
        </h2>
        <p className="text-[#c6c6cc] font-hanken text-sm">
          Quick access to bookmarked Indian Standards, cited clauses, and regulatory specifications.
        </p>
      </div>

      {/* Standards List */}
      {savedStandards.length > 0 ? (
        <div className="space-y-3">
          {savedStandards.map((std) => (
            <div
              key={std.id}
              className="bg-[#152031] hover:bg-[#1a273c] border border-white/10 rounded-xl p-4 md:p-5 transition-all shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-sm md:text-base font-bold text-[#ffb77a]">
                    {std.isCode}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#7b8394] bg-[#111c2d] px-2 py-0.5 rounded border border-white/5">
                    {std.category}
                  </span>
                </div>
                <h3
                  onClick={() => onSelectStandard(std)}
                  className="font-space text-sm md:text-base font-bold text-[#d8e3fb] hover:text-[#ffb77a] cursor-pointer transition-colors"
                >
                  {std.title}
                </h3>
                <p className="text-xs text-[#c6c6cc] font-hanken line-clamp-1">
                  {std.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                <button
                  onClick={() => onSelectStandard(std)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] text-xs font-space font-bold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  <span>View</span>
                </button>
                <button
                  onClick={() => onRemoveSave(std)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-red-400 text-[#7b8394] hover:text-red-400 transition-colors"
                  title="Remove from bookmarks"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#152031] rounded-2xl border border-white/10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#1f2a3c] flex items-center justify-center mx-auto text-[#ffb77a] shadow-inner">
            <span className="material-symbols-outlined text-3xl">bookmark_border</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-space text-lg text-[#d8e3fb] font-bold">
              No saved standards yet
            </h4>
            <p className="text-xs text-[#c6c6cc] font-hanken max-w-sm mx-auto">
              Browse the Standard Finder or ask the AI Assistant and bookmark standards to access them here anytime.
            </p>
          </div>
          <button
            onClick={() => onNavigate('finder')}
            className="px-4 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md"
          >
            Explore Standards
          </button>
        </div>
      )}
    </div>
  );
};
