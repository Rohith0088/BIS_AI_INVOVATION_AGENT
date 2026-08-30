import React from 'react';
import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  Download,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  role: string;
  region: string;
  accessType: string;
}

interface ProfilePageProps {
  user: UserProfile;
  onBackToDashboard: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onBackToDashboard, onUpdateProfile }) => {
  const [profile, setProfile] = React.useState<UserProfile>(user);

  React.useEffect(() => {
    setProfile(user);
  }, [user]);

  const recentActivities = [
    'Verified product safety requirement for packaged drinking water.',
    'Saved Indian Standard IS 14543:2016 for compliance review.',
    'Reviewed BIS licensing guidance for manufacturing process registration.',
  ];

  const preferences = ['Consumer mode', 'Hindi support', 'Email alerts', 'Compliance updates'];

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-[#172033] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono-code uppercase tracking-[0.22em] text-[#b45309]">Account</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-900">Profile and access</h1>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Return to dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4bf7d] via-[#f8e1bb] to-[#dfeafc] text-xl font-semibold text-[#1a4f9c] shadow-inner ring-1 ring-slate-200">
                  {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'AA'}
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">{profile.name || 'Your name'}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                    <BriefcaseBusiness className="h-4 w-4 text-[#1a4f9c]" />
                    {profile.role || 'Add your role'}
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#d9f4e6] bg-[#edfdf4] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#238b57]">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified profile
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-mono-code uppercase tracking-[0.16em]">Role</span>
                  <Building2 className="h-4 w-4 text-[#1a4f9c]" />
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{profile.role || 'Your role'}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-mono-code uppercase tracking-[0.16em]">Region</span>
                  <MapPin className="h-4 w-4 text-[#238b57]" />
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{profile.region || 'Your region'}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-mono-code uppercase tracking-[0.16em]">Member since</span>
                  <CalendarRange className="h-4 w-4 text-[#b45309]" />
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900">2023</div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-[#f8fafc] p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Account overview</div>
                <button type="button" className="text-sm font-medium text-[#1a4f9c] hover:text-[#173d7d]">Edit profile</button>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ['Email', profile.email],
                  ['Phone', profile.phone],
                  ['Organisation', profile.organisation],
                  ['Access type', profile.accessType],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-medium text-slate-800">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-[#f8fafc] p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Edit profile</div>
                <button
                  type="button"
                  onClick={() => onUpdateProfile(profile)}
                  className="rounded-full bg-[#1a4f9c] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#173d7d]"
                >
                  Save changes
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-slate-600">
                  <span className="mb-2 block">Full name</span>
                  <input
                    value={profile.name}
                    placeholder="Enter your full name"
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  <span className="mb-2 block">Email</span>
                  <input
                    value={profile.email}
                    placeholder="Enter your email"
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  <span className="mb-2 block">Phone</span>
                  <input
                    value={profile.phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  <span className="mb-2 block">Region</span>
                  <input
                    value={profile.region}
                    placeholder="Enter your region"
                    onChange={(e) => setProfile((prev) => ({ ...prev, region: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-slate-600 md:col-span-2">
                  <span className="mb-2 block">Organisation</span>
                  <input
                    value={profile.organisation}
                    placeholder="Enter your organisation"
                    onChange={(e) => setProfile((prev) => ({ ...prev, organisation: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
                <label className="block text-sm text-slate-600 md:col-span-2">
                  <span className="mb-2 block">Role</span>
                  <input
                    value={profile.role}
                    placeholder="Enter your role"
                    onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-[#1a4f9c] focus:outline-none"
                  />
                </label>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Trust signal</div>
                <ShieldCheck className="h-5 w-5 text-[#238b57]" />
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-900">Profile verified</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">Identity and organisational details have been validated for BIS guidance access and service workflows.</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Preferences</div>
                <Sparkles className="h-5 w-5 text-[#b45309]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <span key={pref} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-slate-500">Recent activity</div>
                <TrendingUp className="h-5 w-5 text-[#1a4f9c]" />
              </div>
              <div className="mt-4 space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity} className="flex gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="mt-1 rounded-full bg-white p-1.5 text-[#1a4f9c] shadow-sm ring-1 ring-slate-200">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eff6ff] p-3 text-[#1a4f9c] ring-1 ring-slate-200">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono-code uppercase tracking-[0.16em] text-slate-500">Service alerts</div>
              <div className="mt-1 text-base font-medium text-slate-800">Two updates require review before final certification filing.</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Download summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
