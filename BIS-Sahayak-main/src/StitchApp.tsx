import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  FileText,
  Home,
  Languages,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Send,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { BIS_STANDARDS } from "./data/bisDatabase";
import { StandardItem } from "./types";
import { BISLogo } from "./components/BISLogo";
import { supabase } from "./lib/supabase";

type Screen = "landing" | "login" | "register" | "app";
type View = "dashboard" | "assistant" | "finder" | "profile";
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
};
type ChatConversation = {
  id: string;
  title: string;
  updated_at: string;
  user_name?: string;
};

const faq = [
  "Which standard applies to electric fans?",
  "How do I get ISI certification?",
  "What is BIS certification?",
  "What is the difference between IS and ISO?",
  "How can I find a BIS testing laboratory?",
  "Is BIS certification mandatory for my product?",
];

export default function StitchApp() {
  const [screen, setScreen] = useState<Screen>(() => {
    const isAuthenticated = localStorage.getItem("bis_auth") === "true";
    const hasProfile = Boolean(localStorage.getItem("bis_user_profile"));
    return isAuthenticated && hasProfile ? "app" : "landing";
  });
  const [view, setView] = useState<View>(() => {
    const savedView = localStorage.getItem("bis_active_view");
    return savedView === "finder" || savedView === "assistant" || savedView === "profile"
      ? savedView
      : "dashboard";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("bis_user_profile");
      if (savedProfile) return JSON.parse(savedProfile);
    } catch (error) {
      console.warn("Unable to restore saved profile:", error);
    }

    return {
      id: undefined as number | undefined,
      name: "",
      email: "",
      phone: "",
      organisation: "",
      role: "",
      region: "",
      profileImage: "",
    };
  });
  const [prompt, setPrompt] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("bis_active_view", view);
  }, [view]);

  useEffect(() => {
    if (!supabase) return;

    const syncOAuthUser = async (oauthUser: {
      email?: string;
      user_metadata?: Record<string, unknown>;
    }) => {
      if (!oauthUser.email) return;
      const response = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: oauthUser.email,
          name:
            oauthUser.user_metadata?.full_name ||
            oauthUser.user_metadata?.name ||
            "",
          avatarUrl:
            oauthUser.user_metadata?.avatar_url ||
            oauthUser.user_metadata?.picture ||
            "",
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to connect Google account.");
      const nextProfile = { ...profile, ...result.user };
      setProfile(nextProfile);
      localStorage.setItem("bis_auth", "true");
      localStorage.setItem("bis_user_profile", JSON.stringify(nextProfile));
      setScreen("app");
      setView("dashboard");
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const oauthWasRequested = sessionStorage.getItem("bis_google_oauth_pending") === "true";
        if (session?.user && oauthWasRequested) {
          sessionStorage.removeItem("bis_google_oauth_pending");
          void syncOAuthUser(session.user).catch((error) =>
            setAuthError(
              error instanceof Error
                ? error.message
                : "Unable to connect Google account.",
            ),
          );
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setAuthError("Google sign-in is not configured.");
      return;
    }
    sessionStorage.setItem("bis_google_oauth_pending", "true");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_APP_URL || window.location.origin,
      },
    });
    if (error) {
      sessionStorage.removeItem("bis_google_oauth_pending");
      setAuthError(error.message);
    }
  };

  const openApp = (nextView: View) => {
    const isAuthenticated =
      localStorage.getItem("bis_auth") === "true" &&
      Boolean(localStorage.getItem("bis_user_profile"));
    if (!isAuthenticated) {
      setScreen("login");
      setAuthError("Please sign in to access BIS Sahayak features.");
      return;
    }
    setView(nextView);
    setScreen("app");
    setMenuOpen(false);
  };

  async function authenticate(
    mode: "login" | "register",
    data: Record<string, string>,
  ) {
    setLoading(true);
    setAuthError("");
    try {
      const response = await fetch(
        `/api/auth/${mode === "login" ? "login" : "signup"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to complete request.");
      const next = result.user || data;
      setProfile((current) => ({ ...current, ...next }));
      localStorage.setItem("bis_auth", "true");
      localStorage.setItem(
        "bis_user_profile",
        JSON.stringify({ ...profile, ...next }),
      );
      setScreen("app");
      setView("dashboard");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Unable to complete request.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (screen === "landing")
    return (
      <Landing
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
        onAsk={() => setScreen("login")}
      />
    );
  if (screen === "login" || screen === "register")
    return (
      <Auth
        mode={screen}
        error={authError}
        loading={loading}
        onBack={() => setScreen("landing")}
        onSwitch={() => setScreen(screen === "login" ? "register" : "login")}
        onGoogleLogin={handleGoogleLogin}
        onSubmit={(data) => void authenticate(screen, data)}
      />
    );

  return (
    <AppShell
      profile={profile}
      view={view}
      setView={openApp}
      menuOpen={menuOpen}
      setMenuOpen={setMenuOpen}
      onLogout={() => {
        void fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("bis_auth");
        localStorage.removeItem("bis_user_profile");
        sessionStorage.removeItem("bis_google_oauth_pending");
        void supabase?.auth.signOut();
        setScreen("landing");
      }}
    >
      {view === "dashboard" && (
        <Dashboard
          onNavigate={openApp}
          onAsk={(text) => {
            setPrompt(text);
            openApp("assistant");
          }}
        />
      )}
      {view === "assistant" && (
        <Assistant prompt={prompt} setPrompt={setPrompt} userId={profile.id} />
      )}
      {view === "finder" && <Finder />}
      {view === "profile" && (
        <Profile profile={profile} setProfile={setProfile} />
      )}
    </AppShell>
  );
}

function BrandHeader({
  onLogin,
  onRegister,
}: {
  onLogin?: () => void;
  onRegister?: () => void;
}) {
  return (
    <header className="stitch-public-header">
      <BISLogo />
      <nav>
        <button
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Home
        </button>
        <button
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          About
        </button>
        <button
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Features
        </button>
        <button
          onClick={() =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Resources
        </button>
        <button
          onClick={() =>
            document
              .getElementById("footer")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Contact
        </button>
      </nav>
      <div className="header-actions">
        <button className="button-ghost" onClick={onLogin}>
          Sign In
        </button>
        <button className="button-primary" onClick={onRegister}>
          Get Started <ArrowRight size={15} />
        </button>
      </div>
    </header>
  );
}

function Landing({
  onLogin,
  onRegister,
  onAsk,
}: {
  onLogin: () => void;
  onRegister: () => void;
  onAsk: () => void;
}) {
  return (
    <div className="stitch-public">
      <BrandHeader onLogin={onLogin} onRegister={onRegister} />
      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              Bureau of Indian Standards · Statutory Portal
            </span>
            <h1>
              Indian Standards,
              <br />
              <strong>Simplified with AI.</strong>
            </h1>
            <p>
              Get accurate answers, find relevant standards, and understand BIS
              certification, all in one place with real-time statutory
              grounding.
            </p>
            <div className="hero-actions">
              <button className="button-primary large" onClick={onAsk}>
                Ask BIS Sahayak <ArrowRight size={17} />
              </button>
              <button className="button-secondary large" onClick={onRegister}>
                <Search size={17} /> Find a Standard
              </button>
            </div>
            <div className="trust-row">
              <Trust
                icon={<Check size={16} />}
                title="Reliable Information"
                text="Direct Gazette parity"
              />
              <Trust
                icon={<Check size={16} />}
                title="Evidence Based"
                text="Strict clause citations"
              />
              <Trust
                icon={<Languages size={16} />}
                title="Multilingual Support"
                text="English, Hindi & Regional"
              />
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-building">
              <div className="building-lines" />
              <div className="building-caption">
                <FileText size={18} />
                <div>
                  <b>Manak Bhawan · New Delhi</b>
                  <small>Headquarters of Indian Standardization</small>
                </div>
                <span className="status-badge">ACTIVE</span>
              </div>
            </div>
            <div className="floating-standard">
              <span>STANDARD CODE</span>
              <b>IS 1234:2024</b>
              <small>Electrical Equipment</small>
            </div>
          </div>
        </section>
        <section className="quick-search">
          <Search size={19} />
          <span>
            Try asking: “Which standard applies to ceiling fans?” or “IS 10500
            drinking water”
          </span>
          <button className="button-primary" onClick={onAsk}>
            Search AI <Sparkles size={15} />
          </button>
        </section>
        <section id="features" className="feature-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Core capabilities</span>
              <h2>How BIS Sahayak Helps You</h2>
            </div>
            <p>
              Designed for quality auditors, manufacturers, compliance managers,
              and everyday consumers seeking certified safety.
            </p>
          </div>
          <div className="feature-grid">
            <Feature
              icon={<Search />}
              title="Find Standards"
              text="Search by product, IS code, or keyword with smart discovery."
            />
            <Feature
              icon={<Sparkles />}
              title="AI Assistant"
              text="Get clear, evidence-backed answers from BIS sources."
            />
            <Feature
              icon={<FileText />}
              title="Certification Guidance"
              text="Understand schemes and certification processes."
            />
            <Feature
              icon={<Search />}
              title="Compliance Briefs"
              text="Review practical, standards-based guidance from the BIS workspace."
            />
          </div>
        </section>
        <section className="proof-section">
          <div>
            <span className="eyebrow">Institutional parity</span>
            <h2>Trusted by Compliance Officers Across the Nation</h2>
            <p>
              Synchronized with BIS sources and the national gazette repository.
              Every answer references exact clauses.
            </p>
            <div className="metric-row">
              <Metric value="22.4K+" label="Standards Indexed" />
              <Metric value="99.8%" label="Clause Verification" />
              <Metric value="&lt; 1.2s" label="Query Latency" />
            </div>
          </div>
          <div className="audit-card">
            <div className="audit-header">
              <span className="live-dot" /> Live Audit Trace: IS 302-2-80:2017{" "}
              <span>MANDATORY CRS</span>
            </div>
            <p>
              “Electric fans and regulators shall be marked with rated voltage
              or voltage range, nature of supply, rated power input in watts,
              and the manufacturer&apos;s name or trademark.”
            </p>
            <div className="audit-score">
              88% <small>Compliance readiness</small>
            </div>
          </div>
        </section>
      </main>
      <footer id="footer" className="stitch-footer">
        <BISLogo />
        <span>Standards Directory</span>
        <span>Government Portals</span>
        <span>Statutory Helpline</span>
      </footer>
    </div>
  );
}

function Auth({
  mode,
  onBack,
  onSwitch,
  onGoogleLogin,
  onSubmit,
  error,
  loading,
}: {
  mode: "login" | "register";
  onBack: () => void;
  onSwitch: () => void;
  onGoogleLogin: () => void;
  onSubmit: (data: Record<string, string>) => void;
  error: string;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    organisation: "",
    role: "",
    region: "",
  });
  const update = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === "register" && form.password !== form.confirm) return;
    onSubmit(form);
  };
  return (
    <div className="stitch-auth-page">
      <div className="auth-topline">
        <button onClick={onBack}>
          <ArrowRight size={15} className="rotate-back" /> Back to overview
        </button>
      </div>
      <div className="auth-trust">
        <span className="live-dot" /> BIS Sahayak Secure Access Portal <i /> SSO
        & Regulatory Credentials
        <br />
        <small>
          ✓ STQC Compliant · ISO/IEC 27001 Certified · NIC Cloud Hosted
        </small>
      </div>
      <main className="auth-card">
        <BISLogo />
        <h1>{mode === "login" ? "Welcome Back" : "Create an Account"}</h1>
        <p>
          {mode === "login"
            ? "Sign in to continue to BIS Sahayak"
            : "Join BIS Sahayak to get started"}
        </p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <Field
              label="Full name"
              value={form.name}
              onChange={(value) => update("name", value)}
              placeholder="Enter your full name"
            />
          )}
          {mode === "register" && (
            <div className="field-grid">
              <Field
                label="Organisation"
                value={form.organisation}
                onChange={(value) => update("organisation", value)}
                placeholder="Company or firm"
              />
              <Field
                label="Role"
                value={form.role}
                onChange={(value) => update("role", value)}
                placeholder="Manufacturer / Auditor"
              />
            </div>
          )}
          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={(value) => update("email", value)}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(value) => update("password", value)}
            placeholder="Enter your password"
          />
          {mode === "register" && (
            <Field
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={(value) => update("confirm", value)}
              placeholder="Confirm your password"
            />
          )}{" "}
          {error && <div className="form-error">{error}</div>}
          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <button type="button">Forgot password?</button>
          </div>
          <button className="button-primary submit-button" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>
        <div className="auth-divider">OR</div>
        <button className="google-button" type="button" onClick={onGoogleLogin}>
          G <span>Continue with Google</span>
        </button>
        <p className="switch-auth">
          {mode === "login"
            ? "Don’t have an account?"
            : "Already have an account?"}{" "}
          <button onClick={onSwitch}>
            {mode === "login" ? "Create account" : "Sign In"}
          </button>
        </p>
      </main>
      <footer className="auth-footer">
        About　·　 Privacy Policy　·　 Terms of Service　·　 Help Desk　·　
        Standard Verification
        <br />
        <small>
          Bureau of Indian Standards · Manak Bhavan, New Delhi 110002
        </small>
      </footer>
    </div>
  );
}

function AppShell({
  profile,
  view,
  setView,
  menuOpen,
  setMenuOpen,
  onLogout,
  children,
}: {
  profile: { name: string; profileImage?: string };
  view: View;
  setView: (view: View) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const nav: [View, string, React.ReactNode][] = [
    ["dashboard", "Dashboard", <Home size={16} />],
    ["assistant", "AI Assistant", <Sparkles size={16} />],
    ["finder", "Standard Finder", <Search size={16} />],
    ["profile", "Profile", <Settings size={16} />],
  ];
  return (
    <div className="stitch-app">
      <header className="app-topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={20} />
        </button>
        <BISLogo />
        <form
          className="app-search"
          onSubmit={(event) => {
            event.preventDefault();
            setView("finder");
          }}
        >
          <Search size={16} />
          <input placeholder="Search standards, IS codes, services..." />
          <span>Civil & Electro</span>
          <kbd>⌘K</kbd>
        </form>
        <div className="topbar-tools">
          <button>EN⌄</button>
          <Bell size={17} />
          <button className="avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name || "Profile"}
                className="avatar-image"
              />
            ) : (
              profile.name?.slice(0, 1).toUpperCase() || "R"
            )}
          </button>
          <span className="user-name">{profile.name || "Rajesh Sharma"}</span>
        </div>
      </header>
      <aside className={`app-sidebar ${menuOpen ? "open" : ""}`}>
        <BISLogo />
        <nav>
          {nav.map(([id, label, icon]) => (
            <button
              key={id}
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
            >
              {icon}
              <span>{label}</span>
              {id === "assistant" && <small>CORE</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button>
            <MessageSquare size={15} /> Help & BIS Portal
          </button>
          <button>
            <Settings size={15} /> Settings & Feedback
          </button>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <main className="app-content">
        <div key={view} className="stitch-page-enter">
          {children}
        </div>
      </main>
      <nav className="mobile-nav">
        {nav.slice(0, 4).map(([id, label, icon]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Dashboard({
  onNavigate,
  onAsk,
}: {
  onNavigate: (view: View) => void;
  onAsk: (text: string) => void;
}) {
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">Dashboard · AI for Indian Standards</span>
          <h1>What would you like to do today?</h1>
          <p>Research standards and BIS services from one trusted workspace.</p>
        </div>
      </div>
      <div className="action-grid">
        <Action
          icon={<Sparkles />}
          title="Ask BIS Sahayak"
          text="Get evidence-backed AI answers"
          onClick={() => onNavigate("assistant")}
        />
        <Action
          icon={<Search />}
          title="Find a Standard"
          text="Search IS codes and products"
          onClick={() => onNavigate("finder")}
        />
      </div>
      <section className="workspace-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Common searches</span>
            <h2>Start with a question</h2>
          </div>
        </div>
        <div className="question-row">
          {faq.slice(0, 5).map((item) => (
            <button key={item} onClick={() => onAsk(item)}>
              {item}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </section>
      <section className="workspace-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Recent activity</span>
            <h2>Continue your work</h2>
          </div>
        </div>
        <div className="activity-list">
          <div className="activity-empty">No recent activity yet.</div>
        </div>
      </section>
    </div>
  );
}

function Assistant({
  prompt,
  setPrompt,
  userId,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  userId?: number;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [sessionSearch, setSessionSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const conversationIdRef = useRef("");

  const loadConversation = async (conversationId: string) => {
    if (!userId) return;
    const response = await fetch(`/api/chat/messages/${conversationId}?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error("Unable to load conversation.");
    const data = await response.json();
    setMessages((data.messages || []).map((message: { sender: "user" | "assistant"; message_text: string; cited_clauses?: { clause: string }[] }) => ({
      role: message.sender,
      text: message.message_text,
      sources: message.cited_clauses?.map((item) => item.clause),
    })));
  };

  const loadConversations = async () => {
    if (!userId) return;
    const response = await fetch(`/api/chat/conversations?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error("Unable to load recent conversations.");
    const data = await response.json();
    const nextConversations = Array.isArray(data.conversations) ? data.conversations : [];
    setConversations(nextConversations);
    const storedId = sessionStorage.getItem(`bis_active_conversation_${userId}`);
    const activeId = nextConversations.some((conversation: ChatConversation) => conversation.id === storedId)
      ? storedId
      : nextConversations[0]?.id;
    if (activeId) {
      conversationIdRef.current = activeId;
      sessionStorage.setItem(`bis_active_conversation_${userId}`, activeId);
      await loadConversation(activeId);
    }
  };

  useEffect(() => {
    if (!userId) return;
    void loadConversations().catch((error) => console.warn("Unable to load saved conversations:", error));
  }, [userId]);

  const startNewConversation = () => {
    const nextId = crypto.randomUUID();
    conversationIdRef.current = nextId;
    if (userId) sessionStorage.setItem(`bis_active_conversation_${userId}`, nextId);
    setMessages([]);
    setPrompt("");
  };

  const selectConversation = (conversationId: string) => {
    conversationIdRef.current = conversationId;
    if (userId) sessionStorage.setItem(`bis_active_conversation_${userId}`, conversationId);
    void loadConversation(conversationId).catch((error) => console.warn("Unable to load selected conversation:", error));
  };

  const saveMessage = async (sender: "user" | "assistant", text: string, citedClauses?: unknown) => {
    if (!userId) return;
    const response = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: conversationIdRef.current,
        userId,
        sender,
        messageText: text,
        mode: "consumer",
        citedClauses,
      }),
    });
    if (!response.ok) throw new Error("Unable to save chat message.");
  };

  const send = async (text = prompt) => {
    const value = text.trim();
    if (!value || loading) return;
    if (!conversationIdRef.current) {
      conversationIdRef.current = crypto.randomUUID();
      if (userId) sessionStorage.setItem(`bis_active_conversation_${userId}`, conversationIdRef.current);
    }
    setPrompt("");
    setMessages((items) => [...items, { role: "user", text: value }]);
    void saveMessage("user", value)
      .then(() => loadConversations())
      .catch((error) => console.warn("Unable to save user message:", error));
    setLoading(true);
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: value,
          mode: "consumer",
          history: messages,
        }),
      });
      const data = await response.json();
      const answer = data.text || data.answer || "No response received.";
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text: answer,
          sources: data.citedClauses?.map(
            (item: { clause: string }) => item.clause,
          ),
        },
      ]);
      await saveMessage("assistant", answer, data.citedClauses);
      await loadConversations();
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text: "The assistant could not complete this request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="assistant-page">
      <aside className="conversation-rail">
        <button className="button-primary" onClick={startNewConversation}>
          + New Chat
        </button>
        <div className="session-search">
          <Search size={14} />
          <input
            placeholder="Search sessions..."
            value={sessionSearch}
            onChange={(event) => setSessionSearch(event.target.value)}
          />
        </div>
        <span className="eyebrow">Recent conversations</span>
        {conversations
          .filter((conversation) => conversation.title.toLowerCase().includes(sessionSearch.trim().toLowerCase()))
          .map((conversation) => (
            <button
              className="conversation-item"
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
            >
              <MessageSquare size={14} />
              {conversation.title}
              <small>{new Date(conversation.updated_at).toLocaleDateString()}</small>
            </button>
          ))}
        {conversations.length === 0 && (
          <div className="activity-empty">Your saved conversations will appear here.</div>
        )}
      </aside>
      <section className="chat-panel">
        <header>
          <div>
            <h1>BIS Sahayak</h1>
            <p>
              AI for Indian Standards · Ask about certification, compliance, or
              BIS services.
            </p>
          </div>
          <button onClick={startNewConversation}>
            <X size={17} />
          </button>
        </header>
        <div className="chat-stream">
          {messages.length === 0 && !loading ? (
            <div className="chat-empty">
              <Sparkles size={48} />
              <h2>Hello! I&apos;m BIS Sahayak</h2>
              <p>
                Ask me anything about Indian Standards, certification, or BIS
                services.
              </p>
              <span>Try asking</span>
              <div>
                {faq.map((item) => (
                  <button key={item} onClick={() => void send(item)}>
                    {item}
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span>{message.text}</span>
                {message.sources && (
                  <small>Sources · {message.sources.join(" · ")}</small>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="typing">
              Searching BIS sources · Reviewing relevant standards · Preparing
              evidence-backed answer...
            </div>
          )}
        </div>
        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask BIS Sahayak..."
          />
          <button disabled={loading}>
            <Send size={17} />
          </button>
        </form>
        <small className="chat-disclaimer">
          BIS Sahayak provides information based on available BIS sources.
          Verify important details from official publications.
        </small>
      </section>
    </div>
  );
}

function finderRecordToStandard(row: any): StandardItem {
  const payload = row.record_payload && typeof row.record_payload === "object"
    ? row.record_payload
    : {};
  const keyClauses = Array.isArray(payload.keyClauses)
    ? payload.keyClauses.map((clause: any, index: number) =>
        typeof clause === "string"
          ? { clauseNumber: `Clause ${index + 1}`, title: clause, summary: clause }
          : clause,
      )
    : [];

  return {
    id: `finder-${row.id || row.is_code}`,
    isCode: row.is_code,
    year: row.year || payload.year || "Not specified",
    title: row.title || payload.title || `${row.is_code} - BIS standard record`,
    productName: row.product_name || payload.productName || payload.product_name || "",
    category: row.category || payload.category || "BIS Standards",
    department: row.department || payload.department || "BIS",
    isMandatoryQCO: Boolean(row.is_mandatory_qco ?? payload.isMandatoryQCO),
    summary: row.summary || payload.summary || "Standard information available.",
    scope: row.scope || payload.scope || "Scope details are not available in the indexed record.",
    keyClauses,
    isoEquivalence: payload.isoEquivalence || "",
    isoComparisonNotes: payload.isoComparisonNotes || "",
    sampleTestParameters: payload.sampleTestParameters || [],
    pdfExcerptSnippet: payload.pdfExcerptSnippet,
    viewsCount: payload.viewsCount || 0,
    lastUpdated: row.updated_at || payload.lastUpdated || "Dataset",
  };
}

function Finder() {
  const [query, setQuery] = useState("");
  const [standards, setStandards] = useState<StandardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFinderIndex = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const rows: any[] = [];
        const pageSize = 1000;
        for (let start = 0; ; start += pageSize) {
          const { data, error } = await supabase
            .from("standard_finder_index")
            .select("*")
            .order("is_code", { ascending: true })
            .range(start, start + pageSize - 1);

          if (error) throw error;
          rows.push(...(data || []));
          if (!data || data.length < pageSize) break;
        }

        if (!cancelled) {
          setStandards(rows.map(finderRecordToStandard));
          setLoadError("");
        }
      } catch (error) {
        console.warn("Failed to load the Supabase Standard Finder index:", error);
        if (!cancelled) {
          setStandards(BIS_STANDARDS);
          setLoadError("Showing the local catalog because the Supabase index could not be loaded.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadFinderIndex();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return standards;

    return standards.filter((standard) => [
      standard.isCode,
      standard.productName || "",
      standard.title,
      standard.category,
      standard.department,
      standard.summary,
      standard.scope,
    ].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [query, standards]);

  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">Standards directory</span>
          <h1>Standard Finder</h1>
          <p>
            Find Indian Standards by product, IS code, keyword, or category.
          </p>
        </div>
        <span className="database-chip">
          <span className="live-dot" /> 22,000+ indexed codes
        </span>
      </div>
      <div className="finder-toolbar">
        <div className="large-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search standards, products, IS codes..."
          />
          <kbd>⌘K</kbd>
        </div>
        <select>
          <option>All divisions</option>
          <option>Electrical Engineering</option>
          <option>Food & Agriculture</option>
          <option>Civil Engineering</option>
        </select>
        <select>
          <option>All statuses</option>
          <option>Mandatory QCO</option>
          <option>Active</option>
        </select>
      </div>
      <div className="result-count">
        {isLoading ? "Loading indexed records..." : `Showing ${results.length} of ${standards.length} indexed records`}
      </div>
      {loadError && <p className="result-count">{loadError}</p>}
      <div className="standard-list">
        {results.map((standard) => (
          <article key={standard.id}>
            <div>
              <span className="code-chip">{standard.isCode}</span>
              <span className="meta-chip">{standard.department}</span>
              <h2>{standard.title}</h2>
              {standard.productName && <p className="standard-product">Product: {standard.productName}</p>}
              <p>{standard.summary}</p>
              <p>{standard.scope}</p>
              <small>
                {standard.category} · {standard.year || "Current"} · Active
              </small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Profile({
  profile,
  setProfile,
}: {
  profile: {
    name: string;
    email: string;
    phone: string;
    organisation: string;
    role: string;
    region: string;
    profileImage?: string;
  };
  setProfile: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      organisation: string;
      role: string;
      region: string;
      profileImage?: string;
    }>
  >;
}) {
  return (
    <div className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Profile</h1>
          <p>Manage personal information and preferences.</p>
        </div>
      </div>
      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name || "Profile"}
                className="avatar-image"
              />
            ) : (
              profile.name?.slice(0, 1) || "R"
            )}
          </div>
          <h2>{profile.name || "Your name"}</h2>
          <span>{profile.role || "Add your role"}</span>
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["organisation", "Organisation"],
            ["role", "Role"],
            ["region", "Region"],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={profile[key as keyof typeof profile]}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
        </section>
        <section className="profile-card">
          <span className="eyebrow">Preferences</span>
          <h2>Workspace preferences</h2>
          {[
            "English language",
            "Email notifications",
            "Compliance updates",
            "Evidence-first answers",
          ].map((item) => (
            <div className="preference-row" key={item}>
              {item}
              <input type="checkbox" defaultChecked />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="form-field">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
function Trust({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="trust-icon">{icon}</span>
      <span>
        <b>{title}</b>
        <small>{text}</small>
      </span>
    </div>
  );
}
function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <ArrowRight size={15} />
    </article>
  );
}
function Action({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="action-card" onClick={onClick}>
      <span>{icon}</span>
      <strong>{title}</strong>
      <small>{text}</small>
      <ArrowRight size={15} />
    </button>
  );
}
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b>{value}</b>
      <small>{label}</small>
    </div>
  );
}
