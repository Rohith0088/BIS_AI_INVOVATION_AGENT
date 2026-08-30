import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, BookOpenText, Building2 } from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenSignup }) => {
  const trustPoints = [
    'Standards and clauses mapped to product scope',
    'Certification and service guidance for BIS users',
    'Evidence-based answers with official source references',
  ];

  const quickCards = [
    { title: 'Consumer support', value: 'ISI & product safety', icon: ShieldCheck },
    { title: 'Industry guidance', value: 'Certification and testing', icon: Building2 },
    { title: 'Standards discovery', value: 'IS codes and clauses', icon: BookOpenText },
  ];

  const processSteps = [
    'Create your profile and register your organisation',
    'Search standards or enter the ISI/ISO code to inspect details',
    'Verify licence status and apply for certification after profile completion',
  ];

  const faqItems = [
    'How do I verify an ISI or HUID number?',
    'Can I apply for BIS certification without completing my profile?',
    'How do I connect a product standard to a scheme or lab?',
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-7 md:px-8">
        <header className="flex items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#e88a05] shadow-[0_10px_20px_rgba(232,138,5,0.24)]">
              <div className="absolute inset-x-0 bottom-0 h-3 bg-[#238b57]" />
              <div className="absolute left-2 top-2 h-6 w-6 rounded-[4px] bg-white flex items-center justify-center text-[10px] font-bold text-[#b45309]">IS</div>
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase tracking-[0.22em] text-[#b45309]">Bureau of Indian Standards</div>
              <div className="text-lg font-semibold tracking-tight text-slate-900">BIS Sahayak</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onOpenSignup}
              className="rounded-full bg-[#e88a05] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(232,138,5,0.20)] transition hover:bg-[#d97706]"
            >
              Sign up
            </button>
          </div>
        </header>

        <main className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d5a9] bg-[#fff2e4] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#b45309]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official knowledge and service access
            </div>

            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
              Standards clarity for industry and consumers.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              BIS Sahayak helps users identify relevant Indian Standards, understand certification routes, find testing facilities, and navigate BIS services with evidence-backed guidance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onOpenSignup}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a4f9c] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_35px_rgba(26,79,156,0.18)] transition hover:bg-[#173d7d]"
              >
                Join BIS portal
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Existing user sign in
              </button>
            </div>

            <div className="mt-8 space-y-3">
              {trustPoints.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#e9f7ee] p-1">
                    <CheckCircle2 className="h-4 w-4 text-[#238b57]" />
                  </div>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[32px] border border-slate-200 bg-[#f8fafc] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[10px] font-mono-code uppercase tracking-[0.2em] text-slate-500">Workspace</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">BIS Intelligence</div>
                </div>
                <div className="rounded-full bg-[#e9f7ee] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#238b57]">
                  live
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {quickCards.map(({ title, value, icon: Icon }) => (
                  <div key={title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-[#b45309] shadow-sm ring-1 ring-slate-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.15em] text-slate-500">{title}</div>
                        <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[#f6f8fb] p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono-code uppercase tracking-[0.16em] text-slate-500">Latest query</div>
                  <div className="flex items-center gap-1 text-[10px] font-medium text-[#238b57]">
                    <span className="h-2 w-2 rounded-full bg-[#238b57]" />
                    verified
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-700">“Which Indian Standard applies to my packaged drinking water product?”</div>
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="font-mono-code text-[11px] uppercase tracking-[0.12em] text-[#1a4f9c]">IS 14543:2016</div>
                  <div className="mt-2 text-sm text-slate-700">Candidate standard identified with review of technical scope and requirement mapping.</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Process</div>
                <div className="mt-3 space-y-2">
                  {processSteps.map((step, index) => (
                    <div key={step} className="flex gap-3 text-sm text-slate-700">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf1] text-[11px] font-semibold text-[#238b57]">{index + 1}</div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">FAQs</div>
                <div className="mt-3 space-y-2">
                  {faqItems.map((item) => (
                    <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};
