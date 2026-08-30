import React, { useState, useMemo, useEffect } from 'react';
import { StandardItem } from '../types';
import { BIS_STANDARDS } from '../data/bisDatabase';
import { parseStandardsCsv, STANDARDS_CSV } from '../data/standardsCsv';

interface StandardFinderViewProps {
  onSelectStandard: (standard: StandardItem) => void;
  onOpenCompare: (isCode: string) => void;
  onOpenExcerpt: (isCode: string) => void;
  onToggleSave: (standard: StandardItem) => void;
  isSaved: (id: string) => boolean;
}

export const StandardFinderView: React.FC<StandardFinderViewProps> = ({
  onSelectStandard,
  onOpenCompare,
  onOpenExcerpt,
  onToggleSave,
  isSaved,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [apiIsoCodes, setApiIsoCodes] = useState<StandardItem[]>([]);
  const [remoteSearchStandards, setRemoteSearchStandards] = useState<StandardItem[]>([]);

  // Fetch IS codes from API (extracted from datasets)
  useEffect(() => {
    const fetchIsoCodes = async () => {
      try {
        const response = await fetch('/api/is-codes');
        const data = await response.json();
        if (data.codes) {
          const converted: StandardItem[] = data.codes.map((item: any, idx: number) => ({
            id: `iso-${item.code}`,
            isCode: item.code,
            year: item.year || new Date().getFullYear().toString(),
            title: `${item.code} - Standard from BIS Dataset`,
            category: item.category || 'Standards / Dataset',
            department: item.department || 'BIS',
            isMandatoryQCO: false,
            summary: `Standard code extracted from BIS official datasets. Source: ${item.source || 'BIS Database'}`,
            scope: 'Dataset reference record',
            keyClauses: [],
            isoEquivalence: '',
            isoComparisonNotes: '',
            sampleTestParameters: [],
            pdfExcerptSnippet: `Source file: ${item.source}`,
            viewsCount: 0,
            lastUpdated: 'Dataset',
          }));
          setApiIsoCodes(converted);
        }
      } catch (err) {
        console.warn('Failed to fetch IS codes from API:', err);
      }
    };

    fetchIsoCodes();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setRemoteSearchStandards([]);
      return;
    }

    const controller = new AbortController();
    const searchIsoCodes = async () => {
      try {
        const response = await fetch(`/api/is-codes/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = await response.json();
        const converted: StandardItem[] = (data.codes || []).map((item: any) => ({
          id: `iso-${item.code}`,
          isCode: item.code,
          year: item.year || 'Not specified',
          title: `${item.code} - BIS standard record`,
          category: item.category || 'Standards / Dataset',
          department: item.department || 'BIS',
          isMandatoryQCO: Boolean(item.isMandatoryQCO),
          summary: `IS number found in the BIS dataset. Source: ${item.source || 'BIS Database'}`,
          scope: 'Dataset reference record',
          keyClauses: [],
          isoEquivalence: '',
          isoComparisonNotes: '',
          sampleTestParameters: [],
          pdfExcerptSnippet: item.source ? `Source file: ${item.source}` : undefined,
          viewsCount: 0,
          lastUpdated: 'Dataset',
        }));
        setRemoteSearchStandards(converted);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.warn('Failed to search IS codes from API:', error);
        }
      }
    };

    void searchIsoCodes();
    return () => controller.abort();
  }, [searchQuery]);

  const csvStandards = useMemo(() => parseStandardsCsv(STANDARDS_CSV) as StandardItem[], []);
  const sourceStandards = useMemo(() => {
    const combined = [...BIS_STANDARDS, ...apiIsoCodes];
    return combined.length > 0 ? combined : csvStandards;
  }, [apiIsoCodes]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    sourceStandards.forEach((s) => {
      set.add(s.category.split('/')[0].trim());
    });
    return ['All', ...Array.from(set)];
  }, [sourceStandards]);

  const filteredStandards = useMemo(() => {
    const standardsToFilter = searchQuery.trim().length >= 2 && remoteSearchStandards.length > 0
      ? remoteSearchStandards
      : sourceStandards;

    return standardsToFilter.filter((s) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        s.isCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' ||
        s.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchMandatory = !mandatoryOnly || s.isMandatoryQCO;

      return matchSearch && matchCategory && matchMandatory;
    });
  }, [searchQuery, selectedCategory, mandatoryOnly, sourceStandards, remoteSearchStandards]);

  const selectedByCode = useMemo(() => {
    const normalized = codeInput.trim().toLowerCase();
    if (!normalized) return null;
    return sourceStandards.find((s) => s.isCode.toLowerCase().includes(normalized)) ?? null;
  }, [codeInput, sourceStandards]);

  return (
    <div className="flex-grow px-4 md:px-8 lg:px-10 pt-8 pb-24 md:pb-12 max-w-[1280px] mx-auto w-full space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb77a] text-lg">manage_search</span>
          <span className="eyebrow">
            Standards register / discovery
          </span>
        </div>
        <h2 className="font-space text-2xl md:text-3xl font-bold text-[#d8e3fb]">
          Standard Finder
        </h2>
        <p className="text-[#c6c6cc] font-hanken text-sm">
          Search the prototype index by IS code, product, technical keyword, or responsible division. Open a record to review scope and cited clauses.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="enterprise-panel p-4 rounded-xl space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#7b8394] text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IS code, product, keyword, or division..."
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

          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#7b8394] text-xl">pin</span>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Type IS / ISO number"
              className="w-full bg-[#111c2d] text-[#d8e3fb] font-mono-code text-sm pl-11 pr-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#ffb77a] transition-colors placeholder:text-[#7b8394]"
            />
          </div>
        </div>

        {selectedByCode && (
          <div className="rounded-xl border border-[#72de5c]/30 bg-[#13221b] p-4">
            <div className="text-[10px] font-mono-code uppercase tracking-[0.16em] text-[#72de5c]">Matched standard</div>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-mono-code text-[#ffb77a] font-bold">{selectedByCode.isCode}</div>
                <div className="text-sm font-semibold text-[#d8e3fb]">{selectedByCode.title}</div>
              </div>
              <button
                onClick={() => onSelectStandard(selectedByCode)}
                className="px-3 py-2 rounded-lg bg-[#d7790d] text-[#141c2a] text-xs font-space font-bold"
              >
                View detail
              </button>
            </div>
          </div>
        )}

        {/* Category Pills & Mandatory Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-space font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#d7790d] text-[#141c2a] shadow-sm'
                    : 'bg-[#1f2a3c] text-[#c6c6cc] hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-[#111c2d] text-[#d7790d] focus:ring-[#d7790d]"
            />
            <span className="font-space text-xs text-[#ffb77a] font-bold">
              Mandatory QCO Only
            </span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex flex-wrap justify-between gap-2 items-center px-1 text-xs font-mono-code text-[#7b8394]">
        <span>Showing {filteredStandards.length} indexed records</span>
        <span>Local prototype register / BIS evidence review required</span>
      </div>

      {/* Standards List */}
      <div className="space-y-4">
        {filteredStandards.map((std) => {
          const saved = isSaved(std.id);
          return (
            <div
              key={std.id}
              className="bg-[#111c2d] hover:bg-[#17253a] border border-white/10 rounded-lg p-5 transition-all shadow-sm group relative overflow-hidden"
            >
              {/* Mandatory banner stripe */}
              {std.isMandatoryQCO && (
                <div className="absolute top-0 right-0 bg-[#d7790d] text-[#141c2a] text-[9px] font-mono-code font-bold px-3 py-0.5 rounded-bl-lg shadow-sm">
                  MANDATORY QCO
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono-code text-base font-bold text-[#ffb77a] group-hover:text-white transition-colors">
                      {std.isCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#1f2a3c] text-[#bfc6da] border border-white/5">
                      {std.department}
                    </span>
                    {std.isoEquivalence && (
                      <span className="text-[11px] font-mono-code text-[#72de5c]">
                        ≈ {std.isoEquivalence.split('/')[0]}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectStandard(std)}
                    className="font-space text-base font-bold text-[#d8e3fb] hover:text-[#ffb77a] transition-colors cursor-pointer"
                  >
                    {std.title}
                  </h3>

                  <p className="font-hanken text-xs md:text-sm text-[#c6c6cc] leading-relaxed line-clamp-2">
                    {std.summary}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] font-mono-code text-[#8f9bad]">
                    <span><strong className="text-[#bfc6da]">Scope:</strong> {std.category.split('/')[0].trim()}</span>
                    <span><strong className="text-[#bfc6da]">Updated:</strong> {std.lastUpdated || 'Not recorded'}</span>
                  </div>

                  {/* Sample clauses chips */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {std.keyClauses.slice(0, 3).map((cl, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#111c2d] border border-white/5 text-[10px] font-mono-code text-[#bfc6da]"
                      >
                        {cl.clauseNumber}: {cl.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex md:flex-col items-center gap-2 flex-shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 justify-end">
                  <button
                    onClick={() => onSelectStandard(std)}
                    className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] text-xs font-space font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>View Clauses</span>
                  </button>

                  <button
                    onClick={() => onOpenCompare(std.isCode)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#ffb77a] text-[#ffb77a] hover:bg-[#ffb77a]/10 text-xs font-space font-semibold transition-all flex items-center justify-center gap-1"
                    title="Compare with ISO equivalent"
                  >
                    <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
                    <span className="hidden md:inline">Compare</span>
                  </button>

                  <button
                    onClick={() => onToggleSave(std)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      saved
                        ? 'border-[#ffb77a] text-[#ffb77a] bg-[#ffb77a]/10'
                        : 'border-white/10 text-[#7b8394] hover:text-white hover:bg-white/5'
                    }`}
                    title={saved ? 'Remove bookmark' : 'Bookmark standard'}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredStandards.length === 0 && (
          <div className="text-center py-12 bg-[#111c2d] rounded-lg border border-white/10 space-y-3">
            <span className="material-symbols-outlined text-[#7b8394] text-4xl">search_off</span>
            <h4 className="font-space text-lg text-[#d8e3fb] font-bold">No standards matched your search</h4>
            <p className="text-xs text-[#c6c6cc] font-hanken max-w-sm mx-auto">
              Try searching with broader terms like "water", "concrete", "steel", "toy", "switch", or clear the mandatory filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMandatoryOnly(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#d7790d] text-[#141c2a] font-space text-xs font-bold shadow-md hover:bg-[#ffb77a]"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
