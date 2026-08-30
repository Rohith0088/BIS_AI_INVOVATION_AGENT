import React, { useState } from 'react';
import { BIS_SCHEMES } from '../data/bisDatabase';
import { CertificationScheme } from '../types';

interface ServiceGuideViewProps {
  userProfile: { name: string; email: string; organisation: string; role: string; region: string };
  isProfileComplete: boolean;
  onOpenLicenceVerifier: () => void;
  onOpenFeedback: () => void;
}

export const ServiceGuideView: React.FC<ServiceGuideViewProps> = ({
  userProfile,
  isProfileComplete,
  onOpenLicenceVerifier,
  onOpenFeedback,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<CertificationScheme>(BIS_SCHEMES[0]);

  return (
    <div className="flex-grow px-4 md:px-8 lg:px-10 pt-8 pb-24 md:pb-12 max-w-[1280px] mx-auto w-full space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb77a] text-lg">verified_user</span>
          <span className="eyebrow">
            Service navigator / official routes
          </span>
        </div>
        <h2 className="font-space text-2xl md:text-3xl font-bold text-[#d8e3fb]">
          BIS Service & Certification Guide
        </h2>
        <p className="text-[#c6c6cc] font-hanken text-sm">
          Compare BIS routes, prepare the right documents, and continue through the official portal. Final eligibility and approval remain with BIS.
        </p>
      </div>

      {/* Scheme Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {BIS_SCHEMES.map((scheme) => {
          const isSelected = selectedScheme.id === scheme.id;
          return (
            <button
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-[#1f2a3c] border-[#ffb77a] shadow-[0_0_15px_rgba(215,121,13,0.2)]'
                  : 'bg-[#152031] border-white/10 hover:border-white/20 hover:bg-[#1a273c]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold ${
                    isSelected
                      ? 'bg-[#d7790d] text-[#141c2a]'
                      : 'bg-[#2a3548] text-[#ffb77a]'
                  }`}
                >
                  {scheme.badge}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[#72de5c] text-sm">
                    check_circle
                  </span>
                )}
              </div>
              <h4 className="font-space text-xs sm:text-sm font-bold text-[#d8e3fb] line-clamp-1 mt-1">
                {scheme.markName}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Scheme Detail Card */}
      <div className="enterprise-panel rounded-xl p-6 space-y-6 relative overflow-hidden">
        {/* Top Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono-code font-bold bg-[#d7790d]/20 text-[#ffb77a] border border-[#d7790d]/40">
                {selectedScheme.badge}
              </span>
              <span className="text-xs font-mono-code text-[#72de5c] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Est. Timeline: {selectedScheme.estimatedTimeline}
              </span>
            </div>
            <h3 className="font-space text-xl md:text-2xl font-bold text-[#d8e3fb]">
              {selectedScheme.title}
            </h3>
            <p className="text-xs text-[#7b8394] font-mono-code mt-0.5">
              Official Mark: <span className="text-[#ffb77a]">{selectedScheme.markName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenLicenceVerifier}
              className="px-3.5 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-[#72de5c]">verified</span>
              <span>Verify Licence</span>
            </button>
            <button
              type="button"
              disabled={!isProfileComplete}
              className={`px-4 py-2 rounded-lg font-space text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isProfileComplete
                  ? 'bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a]'
                  : 'bg-[#2a3548] text-[#7b8394] cursor-not-allowed'
              }`}
              title={isProfileComplete ? 'Apply for certification' : 'Complete your profile before applying'}
            >
              <span>Apply for certification</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#72de5c]/25 bg-[#13221b] p-4 text-sm text-[#d8e3fb]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono-code uppercase tracking-[0.16em] text-[#72de5c]">Applicant status</div>
              <div className="mt-1 font-semibold">{isProfileComplete ? 'Profile complete — application can proceed' : 'Profile incomplete — complete your profile to apply'}</div>
            </div>
            <div className="rounded-full bg-[#0f1d1d] px-2 py-1 text-[10px] font-mono-code text-[#72de5c]">
              {isProfileComplete ? 'Ready' : 'Pending'}
            </div>
          </div>
          <div className="mt-3 text-xs text-[#c6c6cc]">
            {userProfile.name ? `${userProfile.name} • ${userProfile.organisation || 'Organisation not set'}` : 'Please complete the profile details to enable certification applications.'}
          </div>
        </div>

        {/* Overview & Audience */}
        <div className="space-y-3">
          <p className="font-hanken text-sm text-[#d8e3fb] leading-relaxed">
            {selectedScheme.fullDesc}
          </p>

          <div className="flex items-start gap-2 p-3.5 bg-[#f2a65a]/[0.07] border border-[#f2a65a]/25 rounded-lg text-xs text-[#d8c5ad]">
            <span className="material-symbols-outlined text-[#f2a65a] text-base">info</span>
            <span>This guide is for preparation and navigation. Check the current BIS notification and portal instructions before submitting an application.</span>
          </div>

          <div className="p-3.5 bg-[#111c2d] rounded-xl border border-white/5 space-y-1">
            <h5 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
              Target Beneficiaries & Applicability
            </h5>
            <p className="font-hanken text-xs text-[#c6c6cc]">
              {selectedScheme.targetAudience}
            </p>
          </div>
        </div>

        {/* Step-by-Step Workflow */}
        <div className="space-y-3">
          <h4 className="font-space text-sm font-bold text-[#d8e3fb] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#72de5c]">linear_scale</span>
            Application & Certification Workflow
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedScheme.processSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-[#1f2a3c]/80 p-4 rounded-xl border border-white/5 flex gap-3.5 items-start"
              >
                <div className="w-7 h-7 rounded-full bg-[#d7790d] text-[#141c2a] font-space font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {step.stepNumber}
                </div>
                <div>
                  <h5 className="font-space text-xs font-bold text-[#d8e3fb] mb-1">
                    {step.title}
                  </h5>
                  <p className="font-hanken text-xs text-[#c6c6cc] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="space-y-3">
          <h4 className="font-space text-sm font-bold text-[#d8e3fb] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#ffb77a]">fact_check</span>
            Required Documentation Checklist
          </h4>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedScheme.requiredDocuments.map((doc, i) => (
              <li
                key={i}
                className="p-3 bg-[#111c2d] rounded-lg border border-white/5 flex items-start gap-2 text-xs font-hanken text-[#d8e3fb]"
              >
                <span className="material-symbols-outlined text-sm text-[#72de5c] mt-0.5 flex-shrink-0">
                  check_circle
                </span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Applicable Standards & Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#111c2d] p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-space text-xs font-bold text-[#ffb77a] uppercase tracking-wider">
              Example Product Standards
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {selectedScheme.applicableStandardsExample.map((std, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-[#1f2a3c] border border-white/10 text-xs font-mono-code text-[#bfc6da]"
                >
                  {std}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#111c2d] p-4 rounded-xl border border-white/5 space-y-2">
            <h5 className="font-space text-xs font-bold text-[#72de5c] uppercase tracking-wider">
              Certification Benefits
            </h5>
            <ul className="space-y-1 text-xs font-hanken text-[#c6c6cc]">
              {selectedScheme.keyBenefits.map((ben, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-[#72de5c]">•</span>
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
