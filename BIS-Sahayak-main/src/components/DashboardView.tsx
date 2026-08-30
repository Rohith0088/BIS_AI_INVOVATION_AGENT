import React from 'react';
import { AppMode, NavigationTab, StandardItem } from '../types';
import { BIS_STANDARDS } from '../data/bisDatabase';

interface DashboardViewProps {
  appMode: AppMode;
  onNavigate: (tab: NavigationTab) => void;
  onSelectStandard: (standard: StandardItem) => void;
  onStartAssistantWithPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appMode,
  onNavigate,
  onSelectStandard,
  onStartAssistantWithPrompt,
}) => {
  const recentStandards = BIS_STANDARDS.slice(0, 4);

  return (
    <main className="flex-grow px-4 md:px-8 lg:px-10 pt-8 pb-24 md:pb-12 space-y-8 max-w-[1280px] mx-auto w-full animate-fadeIn">
      {/* Welcome Header */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 flag-accent pl-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#72de5c] animate-pulse"></span>
            <span className="eyebrow">
              {appMode === 'industry' ? 'Industry services' : 'Consumer services'}
            </span>
          </div>
          <h2 className="font-space text-2xl md:text-3xl font-bold text-[#d8e3fb] tracking-tight">
            {appMode === 'industry' ? 'Industry standards and compliance' : 'Consumer standards and services'}
          </h2>
          <p className="text-[#9ca8ba] font-hanken text-sm md:text-base max-w-2xl">
            Access standards information, certification guidance, testing facilities, and BIS service routes in one place.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#9ca8ba] bg-[#111c2d]/70 border border-white/10 rounded-lg px-3 py-2 w-fit">
          <span className="material-symbols-outlined text-[#72de5c] text-base">database</span>
          <span><strong className="text-[#d8e3fb]">Knowledge services</strong><br />Prototype index updated 28 Aug 2026</span>
        </div>
      </section>

      {/* AI Assistant Entry Point (Exact match for the highlighted hero card) */}
      <section
        onClick={() => onNavigate('assistant')}
        className="bg-[#17253a] rounded-xl p-5 md:p-7 border border-[#72de5c]/25 ai-glow relative overflow-hidden group cursor-pointer transition-all hover:border-[#72de5c]/60 hover:bg-[#1b2d43]"
      >
        {/* Ambient Glow */}
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-[#72de5c]/10 rounded-full blur-2xl group-hover:bg-[#72de5c]/25 transition-all"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-[#2f3a4c] rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(114,222,92,0.2)] flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[#72de5c] text-2xl">smart_toy</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-space text-base md:text-lg font-bold text-[#d8e3fb] mb-0.5">
                Ask about a standard or BIS service
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#72de5c]/20 text-[#72de5c] border border-[#72de5c]/30">
                Assisted information service
              </span>
            </div>
            <p className="text-[#c6c6cc] font-hanken text-xs md:text-sm leading-relaxed">
              Describe a product, clause, or service in your own words. Review the cited sources and use the official route for final decisions.
            </p>
          </div>
          <span className="material-symbols-outlined text-[#c6c6cc] group-hover:text-[#72de5c] group-hover:translate-x-1 transition-all">
            arrow_forward
          </span>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Standard Finder Card */}
        <div
          onClick={() => onNavigate('finder')}
          className="bg-[#111c2d] rounded-lg p-4 md:p-5 border border-white/10 hover:border-[#ffb77a]/50 transition-all cursor-pointer group flex flex-col justify-between min-h-36 hover:bg-[#17253a]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-[#2f3a4c] rounded-md inline-block shadow-inner">
              <span className="material-symbols-outlined text-[#ffb77a]">search</span>
            </div>
            <span className="material-symbols-outlined text-[#c6c6cc] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sm">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="font-space text-sm md:text-base font-semibold text-[#d8e3fb] group-hover:text-[#ffb77a] transition-colors">
              Standard Finder
            </h4>
            <span className="text-[11px] font-mono-code text-[#7b8394]">
              Search standards and clauses
            </span>
          </div>
        </div>

        {/* Service Guide Card */}
        <div
          onClick={() => onNavigate('services')}
          className="bg-[#111c2d] rounded-lg p-4 md:p-5 border border-white/10 hover:border-[#ffb77a]/50 transition-all cursor-pointer group flex flex-col justify-between min-h-36 hover:bg-[#17253a]"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-[#2f3a4c] rounded-md inline-block shadow-inner">
              <span className="material-symbols-outlined text-[#ffb77a]">description</span>
            </div>
            <span className="material-symbols-outlined text-[#c6c6cc] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sm">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="font-space text-sm md:text-base font-semibold text-[#d8e3fb] group-hover:text-[#ffb77a] transition-colors">
              Service Guide
            </h4>
            <span className="text-[11px] font-mono-code text-[#7b8394]">
              Certification and BIS services
            </span>
          </div>
        </div>

        {/* Lab Finder (Full Width on Mobile) */}
        <div
          onClick={() => onNavigate('labs')}
          className="sm:col-span-2 lg:col-span-1 bg-[#111c2d] rounded-lg p-4 md:p-5 border border-white/10 hover:border-[#ffb77a]/50 transition-all cursor-pointer group flex flex-row items-center justify-between hover:bg-[#17253a]"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2f3a4c] rounded-md shadow-inner">
              <span className="material-symbols-outlined text-[#ffb77a]">biotech</span>
            </div>
            <div>
              <h4 className="font-space text-sm md:text-base font-semibold text-[#d8e3fb] group-hover:text-[#ffb77a] transition-colors">
                Lab Finder
              </h4>
              <p className="text-xs text-[#c6c6cc] font-hanken">
                Find recognized testing facilities by capability and location
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c6c6cc] group-hover:text-[#ffb77a] group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </div>
      </section>

      {/* Knowledge Base Stats Banner */}
      <section className="bg-[#111c2d] rounded-xl p-4 md:p-5 border border-white/5 shadow-inner">
        <h3 className="font-space text-xs text-[#c6c6cc] uppercase tracking-wider font-bold mb-3 flex items-center justify-between">
          <span>Knowledge Base Status</span>
          <span className="text-[10px] font-mono-code text-[#72de5c] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#72de5c]"></span>
            Online
          </span>
        </h3>
        <div className="flex justify-between items-center text-center md:text-left">
          <div className="flex-1">
            <p className="font-mono-code text-[#d8e3fb] text-lg md:text-xl font-bold">
              {BIS_STANDARDS.length}
            </p>
            <p className="text-[11px] text-[#c6c6cc] font-hanken">
              Indexed demo records
            </p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex-1 px-2">
            <p className="font-mono-code text-[#72de5c] text-lg md:text-xl font-bold">
              Source-led
            </p>
            <p className="text-[11px] text-[#c6c6cc] font-hanken">
              Response approach
            </p>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex-1">
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#ffb77a]">
              <span className="material-symbols-outlined text-sm animate-spin" style={{ animationDuration: '8s' }}>
                sync
              </span>
              <span className="font-mono-code text-xs md:text-sm font-bold">Live</span>
            </div>
            <p className="text-[11px] text-[#c6c6cc] font-hanken">
              Prototype status
            </p>
          </div>
        </div>
      </section>

      {/* Quick Launch Suggestions */}
      <section className="space-y-2">
        <h3 className="font-space text-xs text-[#c6c6cc] uppercase tracking-wider font-bold">
          Quick Inquiries
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStartAssistantWithPrompt('What are the standard requirements for packaged drinking water in India?')}
            className="px-3 py-1.5 rounded-full bg-[#152031] hover:bg-[#1f2a3c] border border-white/10 hover:border-[#ffb77a] text-xs font-hanken text-[#d8e3fb] transition-all flex items-center gap-1.5 text-left"
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffb77a]">water_drop</span>
            <span>Packaged Water IS 14543</span>
          </button>
          <button
            onClick={() => onStartAssistantWithPrompt('What are the mandatory quality control requirements for toys under IS 9873?')}
            className="px-3 py-1.5 rounded-full bg-[#152031] hover:bg-[#1f2a3c] border border-white/10 hover:border-[#ffb77a] text-xs font-hanken text-[#d8e3fb] transition-all flex items-center gap-1.5 text-left"
          >
            <span className="material-symbols-outlined text-[14px] text-[#72de5c]">toys</span>
            <span>Toy Safety QCO</span>
          </button>
          <button
            onClick={() => onStartAssistantWithPrompt('What concrete grade and mix design rules are specified in IS 456:2000?')}
            className="px-3 py-1.5 rounded-full bg-[#152031] hover:bg-[#1f2a3c] border border-white/10 hover:border-[#ffb77a] text-xs font-hanken text-[#d8e3fb] transition-all flex items-center gap-1.5 text-left"
          >
            <span className="material-symbols-outlined text-[14px] text-[#bfc6da]">foundation</span>
            <span>Concrete IS 456</span>
          </button>
        </div>
      </section>

      {/* Recent Activity / Saved Standards */}
      <section className="space-y-3">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h3 className="font-space text-xs text-[#c6c6cc] uppercase tracking-wider font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#ffb77a]">history</span>
            <span>Recent Activity</span>
          </h3>
          <button
            onClick={() => onNavigate('finder')}
            className="text-xs text-[#bfc6da] hover:text-[#ffb77a] font-space font-semibold transition-colors"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {recentStandards.map((std, idx) => (
            <div
              key={std.id}
              onClick={() => onSelectStandard(std)}
              className="relative bg-[#152031] rounded-lg p-3.5 md:p-4 border border-white/5 flex gap-3 items-center cursor-pointer hover:bg-[#1f2a3c] transition-all group overflow-hidden"
            >
              {/* Colored left accent stripe */}
              <div
                className={`w-1 absolute left-0 top-0 bottom-0 ${
                  idx === 0 ? 'bg-[#d7790d]' : idx === 1 ? 'bg-[#72de5c]' : 'bg-[#bfc6da]'
                }`}
              />

              <div className="flex-grow pl-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-mono-code text-xs md:text-sm font-bold text-[#d8e3fb] group-hover:text-[#ffb77a] transition-colors">
                    {std.isCode}
                  </h4>
                  {std.isMandatoryQCO && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-code bg-[#d7790d]/20 text-[#ffb77a] border border-[#d7790d]/40">
                      QCO Mandatory
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#c6c6cc] line-clamp-1 font-hanken">
                  {std.title}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-[#7b8394] font-mono-code">
                  {std.lastUpdated || 'Recently'}
                </span>
                <span className="material-symbols-outlined text-[#7b8394] group-hover:text-white group-hover:translate-x-0.5 transition-all text-sm">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
