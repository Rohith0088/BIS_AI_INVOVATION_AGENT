import React, { useState, useEffect } from 'react';
import { AppMode, NavigationTab, StandardItem } from './types';
import { BIS_STANDARDS } from './data/bisDatabase';
import { TopAppBar } from './components/TopAppBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { AssistantChatView } from './components/AssistantChatView';
import { StandardFinderView } from './components/StandardFinderView';
import { ServiceGuideView } from './components/ServiceGuideView';
import { SavedStandardsView } from './components/SavedStandardsView';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ProfilePage, UserProfile } from './components/ProfilePage';
import { StandardDetailModal } from './components/StandardDetailModal';
import { CompareIsoModal } from './components/CompareIsoModal';
import { ExcerptViewerModal } from './components/ExcerptViewerModal';
import { FeedbackSupportModal } from './components/FeedbackSupportModal';
import StitchApp from './StitchApp';
import { supabase } from './lib/supabase';

function LegacyApp() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [appMode, setAppMode] = useState<AppMode>('consumer');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('bis_auth') ?? 'false');
    } catch (error) {
      console.warn('Auth localStorage read error:', error);
      return false;
    }
  });
  const [screen, setScreen] = useState<'landing' | 'login' | 'signup' | 'profile' | 'app'>(() => {
    try {
      return JSON.parse(localStorage.getItem('bis_auth') ?? 'false') ? 'app' : 'landing';
    } catch (error) {
      console.warn('Screen state localStorage read error:', error);
      return 'landing';
    }
  });
  const [authError, setAuthError] = useState<string>('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('bis_user_profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch (error) {
      console.warn('Profile localStorage read error:', error);
    }

    return {
      name: '',
      email: '',
      phone: '',
      organisation: '',
      role: '',
      region: '',
      accessType: 'Enterprise portal',
      profileImage: '',
    };
  });

  // Modals & Sub-views
  const [selectedStandard, setSelectedStandard] = useState<StandardItem | null>(null);
  const [compareISCode, setCompareISCode] = useState<string | null>(null);
  const [excerptISCode, setExcerptISCode] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');

  // Saved Bookmarks with LocalStorage persistence
  const [savedStandards, setSavedStandards] = useState<StandardItem[]>(() => {
    try {
      const saved = localStorage.getItem('bis_saved_standards');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return [BIS_STANDARDS[0], BIS_STANDARDS[1]]; // Initial defaults
  });

  useEffect(() => {
    try {
      localStorage.setItem('bis_saved_standards', JSON.stringify(savedStandards));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [savedStandards]);

  useEffect(() => {
    try {
      localStorage.setItem('bis_user_profile', JSON.stringify(userProfile));
    } catch (error) {
      console.warn('User profile save error:', error);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('bis_auth', JSON.stringify(isAuthenticated));
    } catch (error) {
      console.warn('Auth save error:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && screen !== 'landing' && screen !== 'login' && screen !== 'signup') {
      setScreen('login');
    }
  }, [isAuthenticated, screen]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const syncOAuthUser = async (oauthUser: { email?: string; user_metadata?: Record<string, unknown> }) => {
      if (!oauthUser.email) {
        return;
      }

      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: oauthUser.email,
          name: oauthUser.user_metadata?.full_name || oauthUser.user_metadata?.name || '',
          avatarUrl: oauthUser.user_metadata?.avatar_url || oauthUser.user_metadata?.picture || '',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to connect the Google account.');
      }

      setUserProfile((current) => ({ ...current, ...data.user }));
      setIsAuthenticated(true);
      setScreen('app');
      setCurrentTab('home');
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        void syncOAuthUser(data.session.user).catch((error) => setAuthError(error instanceof Error ? error.message : 'Unable to connect the Google account.'));
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void syncOAuthUser(session.user).catch((error) => setAuthError(error instanceof Error ? error.message : 'Unable to connect the Google account.'));
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleToggleSave = (standard: StandardItem) => {
    setSavedStandards((prev) => {
      const exists = prev.some((s) => s.id === standard.id);
      if (exists) {
        return prev.filter((s) => s.id !== standard.id);
      } else {
        return [...prev, standard];
      }
    });
  };

  const isSaved = (id: string) => savedStandards.some((s) => s.id === id);

  const handleStartAssistantWithPrompt = (prompt: string) => {
    setAssistantPrompt(prompt);
    setCurrentTab('assistant');
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!updatedProfile.id) {
      throw new Error('Your account is not ready to save profile details.');
    }

    const response = await fetch(`/api/users/${updatedProfile.id}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Unable to save profile.');
    }
    setUserProfile(data.user);
  };

  const handleLogout = () => {
    void fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setScreen('landing');
    setCurrentTab('home');
    setIsDrawerOpen(false);
    try {
      localStorage.removeItem('bis_auth');
      localStorage.removeItem('bis_user_profile');
    } catch (error) {
      console.warn('Logout localStorage clear error:', error);
    }
  };

  const isProfileComplete = Boolean(
    userProfile.name &&
    userProfile.email &&
    userProfile.phone &&
    userProfile.organisation &&
    userProfile.role &&
    userProfile.region
  );

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed.');
      }

      const nextProfile = {
        id: data.user?.id,
        name: data.user?.name || userProfile.name,
        email: data.user?.email || email,
        phone: userProfile.phone,
        organisation: data.user?.organisation || userProfile.organisation,
        role: data.user?.role || userProfile.role,
        region: data.user?.region || userProfile.region,
        accessType: data.user?.accessType || userProfile.accessType,
        profileImage: userProfile.profileImage || '',
      };

      setUserProfile(nextProfile);
      setIsAuthenticated(true);
      setCurrentTab('home');
      setScreen('app');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to log in.');
      setIsAuthenticated(false);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignup = async ({ email, password, name, organisation, role, region }: {
    email: string;
    name: string;
    organisation: string;
    role: string;
    region: string;
    password: string;
  }) => {
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, organisation, role, region }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Signup failed.');
      }

      const nextProfile = {
        id: data.user?.id,
        name,
        email,
        phone: userProfile.phone,
        organisation,
        role,
        region,
        accessType: userProfile.accessType,
      };

      setUserProfile(nextProfile);
      setIsAuthenticated(true);
      setCurrentTab('home');
      setScreen('app');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign up.');
      setIsAuthenticated(false);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  if (screen === 'landing') {
    return (
      <LandingPage
        onOpenLogin={() => setScreen('login')}
        onOpenSignup={() => setScreen('signup')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginPage
        mode="login"
        onLogin={handleLogin}
        onSignup={() => {
          setAuthError('');
          setScreen('signup');
        }}
        onBackToLanding={() => setScreen('landing')}
        error={authError}
        isSubmitting={isSubmittingAuth}
        onGoogleLogin={async () => {
          if (!supabase) {
            setAuthError('Google sign-in is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return;
          }
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: import.meta.env.VITE_APP_URL || window.location.origin } });
          if (error) setAuthError(error.message);
        }}
      />
    );
  }

  if (screen === 'signup') {
    return (
      <LoginPage
        mode="signup"
        onSignup={handleSignup}
        onLogin={() => {
          setAuthError('');
          setScreen('login');
        }}
        onBackToLanding={() => setScreen('landing')}
        error={authError}
        isSubmitting={isSubmittingAuth}
        onGoogleLogin={async () => {
          if (!supabase) {
            setAuthError('Google sign-in is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
            return;
          }
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: import.meta.env.VITE_APP_URL || window.location.origin } });
          if (error) setAuthError(error.message);
        }}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <ProfilePage
        user={userProfile}
        onBackToDashboard={() => {
          setScreen('app');
          setCurrentTab('home');
        }}
        onUpdateProfile={handleProfileUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen app-shell bg-[#081425]/95 text-[#d8e3fb] flex flex-col font-hanken">
      {/* Top Application Bar */}
      <TopAppBar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'profile') {
            setScreen('profile');
          }
        }}
        appMode={appMode}
        setAppMode={setAppMode}
        onOpenMenu={() => setIsDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Framework Layout (Sidebar + Center Content) */}
      <div className="flex-1 flex pt-16 h-full relative">
        {/* Navigation Sidebar / Drawer */}
        <NavigationDrawer
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'profile') {
              setScreen('profile');
            }
            if (tab !== 'profile') {
              setScreen('app');
            }
          }}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          savedCount={savedStandards.length}
        />

        {/* Content View Router */}
        <div className="flex-1 md:pl-[230px] flex flex-col min-h-[calc(100vh-4rem)] page-stage">
          <div key={currentTab} className="page-transition flex-1">
          {currentTab === 'profile' && (
            <ProfilePage
              user={userProfile}
              onBackToDashboard={() => {
                setCurrentTab('home');
                setScreen('app');
              }}
              onUpdateProfile={handleProfileUpdate}
            />
          )}

          {currentTab === 'home' && (
            <DashboardView
              appMode={appMode}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectStandard={(std) => setSelectedStandard(std)}
              onStartAssistantWithPrompt={handleStartAssistantWithPrompt}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantChatView
              appMode={appMode}
              userId={userProfile.id}
              initialPrompt={assistantPrompt}
              onOpenStandardModal={(std) => setSelectedStandard(std)}
              onOpenCompareModal={(isCode) => setCompareISCode(isCode)}
              onOpenExcerptModal={(isCode) => setExcerptISCode(isCode)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}

          {currentTab === 'finder' && (
            <StandardFinderView
              onSelectStandard={(std) => setSelectedStandard(std)}
              onOpenCompare={(isCode) => setCompareISCode(isCode)}
              onOpenExcerpt={(isCode) => setExcerptISCode(isCode)}
              onToggleSave={handleToggleSave}
              isSaved={isSaved}
            />
          )}

          {currentTab === 'services' && (
            <ServiceGuideView
              userProfile={userProfile}
              isProfileComplete={isProfileComplete}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}


          {currentTab === 'saved' && (
            <SavedStandardsView
              savedStandards={savedStandards}
              onSelectStandard={(std) => setSelectedStandard(std)}
              onRemoveSave={handleToggleSave}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {(currentTab === 'history' || currentTab === 'feedback' || currentTab === 'support') && (
            <div className="flex-grow px-4 md:px-8 pt-6 pb-24 md:pb-12 max-w-3xl mx-auto w-full space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h2 className="font-space text-2xl font-bold text-[#d8e3fb]">
                  {currentTab === 'history' ? 'Activity & Inquiry History' : 'Support & Grievance'}
                </h2>
                <p className="text-xs text-[#c6c6cc]">
                  National Standards & Enforcement Desk under Bureau of Indian Standards
                </p>
              </div>

              <div className="bg-[#152031] p-6 rounded-2xl border border-white/10 space-y-4 text-xs font-hanken">
                <div className="p-4 bg-[#111c2d] rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-space font-bold text-[#ffb77a]">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>BIS CARE Helpline & Official App</span>
                  </div>
                  <p className="text-[#c6c6cc] leading-relaxed">
                    Download the official <strong>BIS CARE</strong> mobile application on Android and iOS to verify Hallmarking HUID, ISI CM/L licence numbers, CRS registrations, and register grievances in real-time.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-[#d7790d] hover:bg-[#ffb77a] text-[#141c2a] font-space text-xs font-bold transition-all shadow-md"
                  >
                    Open BIS CARE
                  </button>
                  <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="px-4 py-2 rounded-lg bg-[#2f3a4c] hover:bg-[#3f4757] text-[#d8e3fb] font-space text-xs font-bold transition-all"
                  >
                    File a Complaint
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Modals */}
      {selectedStandard && (
        <StandardDetailModal
          standard={selectedStandard}
          onClose={() => setSelectedStandard(null)}
          onOpenCompare={(isCode) => setCompareISCode(isCode)}
          onOpenExcerpt={(isCode) => setExcerptISCode(isCode)}
          onToggleSave={handleToggleSave}
          isSaved={isSaved(selectedStandard.id)}
          onAskAiAboutStandard={handleStartAssistantWithPrompt}
        />
      )}


      {compareISCode && (
        <CompareIsoModal
          isCode={compareISCode}
          onClose={() => setCompareISCode(null)}
          onAskAiComparison={handleStartAssistantWithPrompt}
        />
      )}

      {excerptISCode && (
        <ExcerptViewerModal
          isCode={excerptISCode}
          onClose={() => setExcerptISCode(null)}
        />
      )}

      {isFeedbackOpen && (
        <FeedbackSupportModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}
    </div>
  );
}

export default StitchApp;
