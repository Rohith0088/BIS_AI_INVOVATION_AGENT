import React, { useState, useMemo } from 'react';
import { BIS_LABS } from '../data/bisDatabase';
import { TestingLab } from '../types';

interface LabLocatorViewProps {
  onOpenFeedback: () => void;
}

export const LabLocatorView: React.FC<LabLocatorViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLab, setSelectedLab] = useState<TestingLab | null>(null);

  const states = useMemo(() => {
    const s = new Set<string>();
    BIS_LABS.forEach((lab) => s.add(lab.state));
    return ['All', ...Array.from(s)];
  }, []);

  const filteredLabs = useMemo(() => {
    return BIS_LABS.filter((lab) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lab.productCategories.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchState = selectedState === 'All' || lab.state === selectedState;
      const matchType = selectedType === 'All' || lab.type === selectedType;

      return matchSearch && matchState && matchType;
    });
  }, [searchQuery, selectedState, selectedType]);

  return (
    <div className="flex-grow px-4 md:px-8 pt-6 pb-24 md:pb-12 max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#72de5c] text-lg">biotech</span>
          <span className="font-mono-code text-[11px] text-[#72de5c] uppercase tracking-wider">
            Testing Facilities & Assaying Centers
          </span>
        </div>
        <h2 className="font-space text-2xl md:text-3xl font-bold text-[#d8e3fb]">
          BIS Lab Finder & Directory
        </h2>
        <p className="text-[#c6c6cc] font-hanken text-sm">
          Search Central, Regional, Branch, and NABL Accredited BIS recognized laboratories for sample testing, calibration, and product qualification.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#152031] p-4 rounded-xl border border-white/10 space-y-3 shadow-md">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[#7b8394] text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by lab name, testing capability (e.g. RO water, concrete, toys, steel), or city..."
            className="w-full bg-[#111c2d] text-[#d8e3fb] font-hanken text-sm pl-11 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#72de5c] transition-colors placeholder:text-[#7b8394]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[#7b8394] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* State filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono-code text-[#7b8394]">State:</span>
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded-full text-xs font-space font-semibold transition-all ${
                  selectedState === st
                    ? 'bg-[#d7790d] text-[#141c2a]'
                    : 'bg-[#1f2a3c] text-[#c6c6cc] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5">
            {['All', 'Central', 'Regional', 'Recognized Private'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono-code transition-all ${
                  selectedType === t
                    ? 'bg-[#72de5c] text-[#141c2a] font-bold'
                    : 'bg-[#111c2d] text-[#7b8394] hover:text-white border border-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Laboratories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            onClick={() => setSelectedLab(lab)}
            className="bg-[#152031] hover:bg-[#1a273c] border border-white/10 hover:border-[#72de5c]/50 rounded-xl p-5 transition-all cursor-pointer space-y-3 shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                    lab.type === 'Central'
                      ? 'bg-[#d7790d]/20 text-[#ffb77a] border border-[#d7790d]/40'
                      : lab.type === 'Regional'
                      ? 'bg-[#72de5c]/20 text-[#72de5c] border border-[#72de5c]/40'
                      : 'bg-[#2a3548] text-[#bfc6da]'
                  }`}
                >
                  {lab.type} Lab
                </span>

                <span className="text-[11px] font-mono-code text-[#7b8394]">
                  NABL: {lab.nablAccreditationNo}
                </span>
              </div>

              <h3 className="font-space text-base font-bold text-[#d8e3fb] group-hover:text-[#72de5c] transition-colors line-clamp-2">
                {lab.name}
              </h3>

              <p className="text-xs text-[#c6c6cc] font-hanken line-clamp-2 mt-1">
                {lab.address}
              </p>

              {/* Product Categories */}
              <div className="pt-2.5 flex flex-wrap gap-1">
                {lab.productCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#111c2d] text-[10px] font-mono-code text-[#bfc6da] border border-white/5"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono-code text-[#ffb77a]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {lab.city}
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Capabilities</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Detail Modal */}
      {selectedLab && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#152031] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto chat-scroll shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#72de5c]/20 text-[#72de5c] border border-[#72de5c]/40 mb-1 inline-block">
                  {selectedLab.type} Lab ({selectedLab.code})
                </span>
                <h3 className="font-space text-lg font-bold text-[#d8e3fb]">
                  {selectedLab.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLab(null)}
                className="text-[#7b8394] hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Address and Contact Details */}
            <div className="bg-[#111c2d] p-4 rounded-xl space-y-2 border border-white/5 text-xs font-hanken">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#ffb77a] text-sm mt-0.5">location_on</span>
                <span className="text-[#d8e3fb]">{selectedLab.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#72de5c] text-sm">person</span>
                <span className="text-[#c6c6cc]">In-Charge: {selectedLab.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#bfc6da] text-sm">call</span>
                <span className="text-[#c6c6cc]">{selectedLab.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#bfc6da] text-sm">mail</span>
                <span className="text-[#c6c6cc]">{selectedLab.email}</span>
              </div>
            </div>

            {/* Capabilities List */}
            <div className="space-y-2">
              <h4 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
                Accredited Testing Capabilities
              </h4>
              <ul className="space-y-1.5 text-xs font-hanken">
                {selectedLab.capabilities.map((cap, i) => (
                  <li key={i} className="p-2 bg-[#1f2a3c] rounded-lg border border-white/5 text-[#d8e3fb] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#72de5c]">check</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accreditation Info */}
            <div className="p-3 bg-[#111c2d] rounded-xl border border-white/5 flex justify-between text-xs font-mono-code text-[#7b8394]">
              <span>NABL Certificate: {selectedLab.nablAccreditationNo}</span>
              <span>Validity: {selectedLab.validUntil}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLab(null)}
                className="px-4 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedLab.email}?subject=Inquiry regarding Testing under BIS Standards`}
                className="px-4 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>Send Sample Inquiry</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
