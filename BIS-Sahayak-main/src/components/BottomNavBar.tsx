import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavBarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#152031] border-t border-white/10 shadow-lg rounded-t-xl md:hidden pb-safe">
      {/* Home Button */}
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all w-16 ${
          currentTab === 'home'
            ? 'bg-[#d7790d] text-[#141c2a] scale-95 shadow-md'
            : 'text-[#c6c6cc] hover:text-[#bfc6da]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="font-space text-[10px] mt-0.5 font-bold">Home</span>
      </button>

      {/* Assistant Button */}
      <button
        onClick={() => setCurrentTab('assistant')}
        className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all w-16 relative ${
          currentTab === 'assistant'
            ? 'bg-[#d7790d] text-[#141c2a] scale-95 shadow-md'
            : 'text-[#c6c6cc] hover:text-[#bfc6da]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: currentTab === 'assistant' ? "'FILL' 1" : "'FILL' 0" }}
        >
          smart_toy
        </span>
        <span className="font-space text-[10px] mt-0.5 font-bold">Assistant</span>
        {/* Active green pulsing dot when assistant is ready */}
        {currentTab === 'assistant' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#72de5c] rounded-full border-2 border-[#152031] shadow-[0_0_8px_#72de5c]" />
        )}
      </button>

      {/* Finder Button */}
      <button
        onClick={() => setCurrentTab('finder')}
        className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all w-16 ${
          currentTab === 'finder'
            ? 'bg-[#d7790d] text-[#141c2a] scale-95 shadow-md'
            : 'text-[#c6c6cc] hover:text-[#bfc6da]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: currentTab === 'finder' ? "'FILL' 1" : "'FILL' 0" }}
        >
          search
        </span>
        <span className="font-space text-[10px] mt-0.5 font-bold">Finder</span>
      </button>

      {/* Services Button */}
      <button
        onClick={() => setCurrentTab('services')}
        className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all w-16 ${
          currentTab === 'services'
            ? 'bg-[#d7790d] text-[#141c2a] scale-95 shadow-md'
            : 'text-[#c6c6cc] hover:text-[#bfc6da]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: currentTab === 'services' ? "'FILL' 1" : "'FILL' 0" }}
        >
          grid_view
        </span>
        <span className="font-space text-[10px] mt-0.5 font-bold">Services</span>
      </button>
    </nav>
  );
};
