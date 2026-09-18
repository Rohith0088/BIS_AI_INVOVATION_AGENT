import React, { useState } from 'react';
import { AppMode, NavigationTab } from '../types';
import { BISLogo } from './BISLogo';

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
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-[#081425] border-b border-white/10 shadow-sm backdrop-blur-md flag-accent top-bar">
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
          className="flex items-center cursor-pointer group"
        >
          <BISLogo />
        </div>
      </div>

      <form
        className="global-search hidden lg:flex"
        onSubmit={(event) => {
          event.preventDefault();
          if (globalSearch.trim()) setCurrentTab('finder');
        }}
      >
        <span className="material-symbols-outlined text-[19px]">search</span>
        <input
          aria-label="Search standards and services"
          value={globalSearch}
          onChange={(event) => setGlobalSearch(event.target.value)}
          placeholder="Search standards, IS codes, services..."
        />
        <span className="global-search-scope">Civil &amp; Electro</span>
        <kbd>⌘K</kbd>
      </form>

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
        <div className="language-switcher hidden sm:flex" aria-label="Language selector">
          <button type="button" className="is-active">EN</button>
          <button type="button">हिन्दी</button>
        </div>
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
