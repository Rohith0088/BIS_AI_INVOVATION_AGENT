import React from 'react';
import { NavigationTab } from '../types';

interface NavigationDrawerProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenLicenceVerifier: () => void;
  savedCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  onClose,
  onOpenLicenceVerifier,
  savedCount,
}) => {
  const menuItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: string | number;
  }[] = [
    { id: 'home', label: 'Dashboard', icon: 'home' },
    { id: 'assistant', label: 'BIS Bot', icon: 'smart_toy' },
    { id: 'finder', label: 'Standard Finder', icon: 'search' },
    { id: 'services', label: 'Service & Schemes Guide', icon: 'description' },
    { id: 'labs', label: 'Lab Locator', icon: 'biotech' },
    { id: 'saved', label: 'My Saved Standards', icon: 'bookmark', badge: savedCount > 0 ? savedCount : undefined },
    { id: 'profile', label: 'Profile & Access', icon: 'person' },
    { id: 'history', label: 'History & Logs', icon: 'history' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity"
        />
      )}

      {/* Drawer Container (Desktop Sidebar + Mobile Drawer) */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-72 bg-[#0d192b] border-r border-white/10 shadow-2xl flex flex-col p-4 z-50 md:z-40 transition-transform duration-300 ease-in-out flag-accent ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/10">
          <div>
            <h2 className="font-space text-base font-bold text-[#d8e3fb] tracking-tight">
              BIS Sahayak
            </h2>
            <p className="text-[11px] font-mono-code text-[#7b8394] mt-1">
              Standards and service access
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-[#c6c6cc] hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 chat-scroll">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-lg font-hanken text-sm font-medium transition-all text-left w-full group ${
                  isActive
                    ? 'bg-[#d7790d] text-[#141c2a] font-bold shadow-[0_0_15px_rgba(215,121,13,0.25)]'
                    : 'text-[#c6c6cc] hover:bg-[#2a3548]/50 hover:text-[#d8e3fb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold ${
                      isActive
                        ? 'bg-[#141c2a] text-[#ffdcc2]'
                        : 'bg-[#2a3548] text-[#ffb77a]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Utility Tool: Licence Verifier Button */}
          <div className="my-2 pt-2 border-t border-white/5">
            <button
              onClick={() => {
                onOpenLicenceVerifier();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1f2a3c] hover:bg-[#2a3548] text-[#ffb77a] border border-[#d7790d]/30 font-space text-xs font-bold transition-all shadow-sm group"
            >
              <span className="material-symbols-outlined text-[20px] text-[#72de5c] group-hover:rotate-12 transition-transform">
                verified_user
              </span>
              <span>Verify CM/L or R-Number</span>
            </button>
          </div>
        </div>

        {/* Footer Support Buttons */}
        <div className="mt-auto pt-3 border-t border-white/10 space-y-1.5">
          <button
            onClick={() => {
              setCurrentTab('feedback');
              onClose();
            }}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-colors w-full font-hanken ${
              currentTab === 'feedback'
                ? 'bg-[#2a3548] text-[#d8e3fb]'
                : 'text-[#c6c6cc] hover:bg-[#2a3548]/30 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">comment</span>
            <span>Feedback & Grievance</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('support');
              onClose();
            }}
            className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-colors w-full font-hanken ${
              currentTab === 'support'
                ? 'bg-[#2a3548] text-[#d8e3fb]'
                : 'text-[#c6c6cc] hover:bg-[#2a3548]/30 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Help & BIS Care App</span>
          </button>
        </div>
      </aside>
    </>
  );
};
