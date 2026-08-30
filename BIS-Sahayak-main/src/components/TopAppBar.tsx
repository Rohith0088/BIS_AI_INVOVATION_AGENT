import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { AppMode, NavigationTab } from '../types';

interface TopAppBarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  onOpenMenu: () => void;
  onLogout: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  setCurrentTab,
  appMode,
  setAppMode,
  onOpenMenu,
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#081425] border-b border-white/10 shadow-sm backdrop-blur-md flag-accent">
      {/* Left side: Menu Trigger + Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="text-[#c6c6cc] hover:bg-[#2f3a4c]/20 p-2 rounded-full transition-colors active:scale-95 flex items-center justify-center"
          title="Open Menu"
          aria-label="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-lg bg-[#e88a05] flex items-center justify-center shadow-[0_4px_10px_rgba(217,119,6,0.25)] overflow-hidden">
            <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-md border-2 border-white/35 rotate-6" />
            <div className="relative w-6 h-7 rounded-[3px] bg-white flex flex-col items-center justify-center shadow-sm">
              <span className="font-mono-code text-[9px] leading-none font-bold text-[#b45309]">IS</span>
              <span className="w-3 h-px bg-[#b45309] mt-1" />
              <FileCheck2 className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#238b57] text-white p-[2px] stroke-[3]" />
            </div>
          </div>
          <div>
            <h1 className="font-space text-lg md:text-xl font-bold text-[#bfc6da] tracking-tight group-hover:text-white transition-colors">
              BIS Sahayak
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono-code text-[#ffb77a] tracking-widest uppercase">
              Bureau of Indian Standards
            </span>
          </div>
        </div>
      </div>

      {/* Center Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center h-full">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-3 py-1.5 rounded-lg font-space text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border-b-2 ${
            currentTab === 'home'
              ? 'text-[#ffb77a] border-[#d7790d] bg-[#2f3a4c]/20'
              : 'text-[#c6c6cc] border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Home
        </button>
        <button
          onClick={() => setCurrentTab('assistant')}
          className={`px-3 py-1.5 rounded-lg font-space text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border-b-2 ${
            currentTab === 'assistant'
              ? 'text-[#72de5c] border-[#72de5c] bg-[#72de5c]/10'
              : 'text-[#c6c6cc] border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          Assistant
        </button>
        <button
          onClick={() => setCurrentTab('finder')}
          className={`px-3 py-1.5 rounded-lg font-space text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border-b-2 ${
            currentTab === 'finder'
              ? 'text-[#ffb77a] border-[#d7790d] bg-[#2f3a4c]/20'
              : 'text-[#c6c6cc] border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          Finder
        </button>
        <button
          onClick={() => setCurrentTab('services')}
          className={`px-3 py-1.5 rounded-lg font-space text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border-b-2 ${
            currentTab === 'services'
              ? 'text-[#ffb77a] border-[#d7790d] bg-[#2f3a4c]/20'
              : 'text-[#c6c6cc] border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          Services
        </button>
        <button
          onClick={() => setCurrentTab('labs')}
          className={`px-3 py-1.5 rounded-lg font-space text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all border-b-2 ${
            currentTab === 'labs'
              ? 'text-[#ffb77a] border-[#d7790d] bg-[#2f3a4c]/20'
              : 'text-[#c6c6cc] border-transparent hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">biotech</span>
          Labs
        </button>
      </nav>

      {/* Right side: Mode Toggle (Consumer / Industry) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentTab('profile')}
          className={`hidden md:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all ${
            currentTab === 'profile'
              ? 'bg-[#d7790d] text-[#141c2a]'
              : 'border border-white/10 bg-[#1f2a3c] text-[#d8e3fb] hover:border-[#3b4d68]'
          }`}
        >
          Profile
        </button>
        <div className="hidden sm:flex items-center gap-2 mr-2 text-[10px] font-mono-code text-[#7b8394] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#72de5c]" />
          Knowledge services online
        </div>
        <div className="flex items-center bg-[#1f2a3c] rounded-lg p-1 border border-white/10 shadow-inner">
          <button
            onClick={() => setAppMode('consumer')}
            className={`px-3 py-1 rounded-full font-space text-xs font-bold transition-all ${
              appMode === 'consumer'
                ? 'bg-[#d7790d] text-[#141c2a] shadow-sm scale-100'
                : 'text-[#c6c6cc] hover:text-[#d8e3fb]'
            }`}
          >
            Consumer
          </button>
          <button
            onClick={() => setAppMode('industry')}
            className={`px-3 py-1 rounded-full font-space text-xs font-bold transition-all ${
              appMode === 'industry'
                ? 'bg-[#d7790d] text-[#141c2a] shadow-sm scale-100'
                : 'text-[#c6c6cc] hover:text-[#d8e3fb]'
            }`}
          >
            Industry
          </button>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="ml-2 inline-flex items-center gap-2 rounded-full border border-[#ffb77a]/40 bg-[#1f2a3c] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#ffb77a] transition hover:border-[#d7790d] hover:bg-[#2f3a4c]"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Logout
        </button>
      </div>
    </header>
  );
};
