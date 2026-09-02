import React, { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';

interface LoginPageProps {
  mode: 'login' | 'signup';
  onLogin?: (loginData: { email: string; password: string }) => Promise<void> | void;
  onSignup?: (signupData: { email: string; password: string; name: string; organisation: string; role: string; region: string }) => Promise<void> | void;
  onBackToLanding: () => void;
  error?: string;
  isSubmitting?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ mode, onLogin, onSignup, onBackToLanding, error, isSubmitting }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [role, setRole] = useState('');
  const [region, setRegion] = useState('');

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-[#172033] md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.05)] lg:flex-row">
        <div className="relative flex-1 bg-[#f8fafc] p-6 md:p-10 lg:p-12">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to overview
          </button>

          <div className="mt-8 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#e88a05] shadow-[0_10px_20px_rgba(232,138,5,0.22)]">
              <div className="absolute inset-x-0 bottom-0 h-3 bg-[#238b57]" />
              <div className="absolute left-2 top-2 h-7 w-7 rounded-[4px] bg-white flex items-center justify-center text-[11px] font-bold text-[#b45309]">IS</div>
            </div>
            <div>
              <div className="text-[10px] font-mono-code uppercase tracking-[0.2em] text-[#b45309]">Bureau of Indian Standards</div>
              <div className="text-xl font-semibold text-slate-900">Secure access portal</div>
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-[#238b57]" />
              Verified access requirements
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-full bg-[#eafaf1] p-1"><ShieldCheck className="h-3.5 w-3.5 text-[#238b57]" /></div>
                <div>Multi-factor aware enterprise access for standards and certification workflows.</div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-full bg-[#fff2e4] p-1"><LockKeyhole className="h-3.5 w-3.5 text-[#b45309]" /></div>
                <div>Protected access to user sessions, service history, and signed compliance review data.</div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-full bg-[#eef3ff] p-1"><UserRound className="h-3.5 w-3.5 text-[#1a4f9c]" /></div>
                <div>Role-based access for industry, consumer, and BIS support workflows.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col justify-center bg-white p-6 md:p-10 lg:p-12">
          <div className="mb-8">
            <div className="text-[11px] font-mono-code uppercase tracking-[0.22em] text-[#b45309]">{mode === 'login' ? 'Sign in' : 'Sign up'}</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create your BIS profile'}</h2>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (mode === 'signup') {
                await onSignup?.({ email, password, name, organisation, role, region });
              } else {
                await onLogin?.({ email, password });
              }
            }}
          >
            {mode === 'signup' && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Organisation</span>
                    <input
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                      placeholder="Company or firm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                      placeholder="Manufacturer / Buyer / Auditor"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Region</span>
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                    placeholder="State or city"
                  />
                </label>
              </>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1a4f9c] focus-within:bg-white">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-[#1a4f9c] focus-within:bg-white">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
            </label>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1a4f9c] focus:ring-[#1a4f9c]" />
                Keep me signed in
              </label>
              <button type="button" className="font-medium text-[#1a4f9c] hover:text-[#173d7d]">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e88a05] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(232,138,5,0.22)] transition hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in to BIS Sahayak' : 'Create BIS account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => (
                mode === 'login'
                  ? onSignup?.({ email: '', password: '', name: '', organisation: '', role: '', region: '' })
                  : onLogin?.({ email: '', password: '' })
              )}
              className="font-semibold text-[#1a4f9c] hover:text-[#173d7d]"
            >
              {mode === 'login' ? 'Request access' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
