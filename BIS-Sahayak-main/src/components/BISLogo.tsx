import React from 'react';

interface BISLogoProps {
  compact?: boolean;
  className?: string;
}

export const BISLogo: React.FC<BISLogoProps> = ({ compact = false, className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg aria-label="BIS Sahayak logo" className={compact ? 'h-8 w-8' : 'h-9 w-[158px]'} fill="none" viewBox={compact ? '0 0 64 64' : '0 0 280 64'} xmlns="http://www.w3.org/2000/svg">
      <g transform={compact ? 'translate(7, 7)' : 'translate(4, 7)'}>
        <path d="M25 0L50 40H0L25 0Z" fill="#0B4F8A" />
        <circle cx="25" cy="27" r="5.5" fill="#FFFFFF" />
        <rect x="4" y="43" width="42" height="2.8" rx="1.4" fill="#0B4F8A" />
        <rect x="9" y="47.5" width="32" height="2.4" rx="1.2" fill="#0B4F8A" />
      </g>
      {!compact && (
        <>
          <text x="64" y="31" fill="#10233F" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="700">BIS Sahayak</text>
          <text x="64.5" y="47" fill="#64748B" fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="500">Your Partner in Standards</text>
        </>
      )}
    </svg>
  </div>
);
