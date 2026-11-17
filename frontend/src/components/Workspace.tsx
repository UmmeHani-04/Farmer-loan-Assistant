import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import {
  Bot,
  CalendarDays,
  CloudSun,
  Home,
  Landmark,
  Leaf,
  LogOut,
  Menu,
  ShoppingBasket,
  UserCircle,
  WalletCards,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/components/auth";
import AdvancedFeatures from "@/components/AdvancedFeatures";
import LoanEligibilityChecker from "@/components/LoanEligibilityChecker";
import EmiCalculator from "@/components/EmiCalculator";
import MandiPrices from "@/components/MandiPrices";
import WeatherSection from "@/components/WeatherSection";
import VoiceInput from "@/components/VoiceInput";
import {
  useLanguage,
  LanguageContext,
  getStoredLanguage,
  storeLanguage,
  translate,
  type SiteLanguage,
} from "@/lib/siteLanguage";
import { useContext } from "react";
import landscape from "@/assets/farming-landscape.jpg";
import { toolImages } from "@/lib/toolImages";
import { pagePerson, people } from "@/lib/people";

const API_URL = import.meta.env["VITE_CHAT_API_URL"] || "http://localhost:8000";

const navItems = [
  { to: "/dashboard", labelKey: "dashboard", icon: Home },
  { to: "/assistant", labelKey: "aiAssistant", icon: Bot },
  { to: "/crop-calendar", labelKey: "cropCalendar", icon: CalendarDays },
  { to: "/crop-health", labelKey: "cropDisease", icon: Leaf },
  { to: "/schemes", labelKey: "governmentSchemes", icon: Landmark },
  { to: "/weather", labelKey: "weatherAlerts", icon: CloudSun },
  { to: "/mandi", labelKey: "mandiPrices", icon: ShoppingBasket },
  { to: "/emi-calculator", labelKey: "emiCalculator", icon: WalletCards },
  { to: "/loan-eligibility", labelKey: "loanChecker", icon: Landmark },
  { to: "/profile", labelKey: "myProfile", icon: UserCircle },
] as const;

function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => setLanguage(getStoredLanguage()), []);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: (key) => translate(language, key) }}
    >
      <AuthProvider>{children}</AuthProvider>
    </LanguageContext.Provider>
  );
}

function WorkspaceChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, configured, loading, signOutUser } = useAuth();
  const languageContext = useContext(LanguageContext);
  const language = languageContext?.language || "en";
  const t =
    languageContext?.t || ((key: Parameters<typeof translate>[1]) => translate(language, key));
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "";

  useEffect(() => {
    if (!loading && configured && !user) void navigate({ to: "/" });
  }, [configured, loading, navigate, user]);

  return (
    <div className="workspace">
      <button
        className="workspace-menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        {open ? <X /> : <Menu />}
      </button>
      <aside className={`workspace-sidebar ${open ? "is-open" : ""}`}>
        <Link to="/dashboard" className="workspace-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Leaf aria-hidden="true" />
          </span>
          <span>
            Kishan <b>Saathi</b>
            <small>Your farming partner</small>
          </span>
        </Link>
        <nav aria-label="Farmer workspace navigation">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon aria-hidden="true" /> {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="workspace-sidebar-footer">
          <Link to="/">
            <Home aria-hidden="true" /> {t("publicWebsite")}
          </Link>
          <button type="button" onClick={() => void signOutUser()}>
            <LogOut aria-hidden="true" /> {t("logout")}
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span className="eyebrow">KISHAN SAATHI</span>
            {loading ? (
              <span className="workspace-title-skeleton" aria-label="Loading profile" />
            ) : (
              <h1>
                {t("welcomeBack")}
                {firstName ? `, ${firstName}` : ""}
              </h1>
            )}
          </div>
          <div className="workspace-user">
            <select
              aria-label="Language"
              value={language}
              onChange={(event) => {
                const nextLanguage = event.target.value as SiteLanguage;
                languageContext?.setLanguage(nextLanguage);
                storeLanguage(nextLanguage);
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
            <UserCircle aria-hidden="true" />
          </div>
        </header>
        <div className="workspace-content">{children}</div>
      </main>
    </div>
  );
}

export function WorkspacePage({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceChrome>{children}</WorkspaceChrome>
    </WorkspaceProvider>
  );
}

export function DashboardPage() {
  return (
    <WorkspacePage>
      <DashboardContent />
    </WorkspacePage>
  );
}

type WeatherNow = { temp: number; rain: number | null };

/** Live temperature for the dashboard card (Open-Meteo, no key needed). Fails quietly. */
function useWeatherNow() {
  const [data, setData] = useState<WeatherNow | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function load(lat: number, lon: number) {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          "&current=temperature_2m&daily=precipitation_probability_max&forecast_days=1&timezone=auto";
        const res = await fetch(url);
        if (!res.ok) throw new Error("weather");
        const json = await res.json();
        if (cancelled) return;
        setData({
          temp: Math.round(json.current.temperature_2m),
          rain: json.daily?.precipitation_probability_max?.[0] ?? null,
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    // Central India as a fallback when location is not shared.
    const fallback = () => void load(21.15, 79.09);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => void load(pos.coords.latitude, pos.coords.longitude),
        fallback,
        { timeout: 6000, maximumAge: 600000 },
      );
    } else fallback();
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, failed };
}

function DashboardContent() {
  const shortcuts = navItems.slice(1, 8);
  const { t } = useLanguage();
  const weather = useWeatherNow();
  return (
    <>
      <section
        className="workspace-hero"
        style={{ "--hero-img": `url(${landscape})` } as CSSProperties}
      >
        <div>
          <span className="eyebrow">{t("yourFarmAtAGlance")}</span>
          <h2>{t("dashboardHeroTitle")}</h2>
          <p>{t("dashboardHeroDescription")}</p>
        </div>
        <Link to="/weather" className="workspace-hero-action">
          <CloudSun /> {t("checkWeather")}
        </Link>
      </section>
      <div className="dashboard-grid">
        <Link to="/weather" className="dashboard-summary-card" style={{ "--i": 0 } as CSSProperties}>
          <CloudSun />
          <span>{t("weatherOverview")}</span>
          {weather.data ? (
            <div className="weather-now">
              <b>{weather.data.temp}°C</b>
              {weather.data.rain !== null && <i>💧 {weather.data.rain}%</i>}
            </div>
          ) : weather.failed ? (
            <strong>{t("planAroundWeather")}</strong>
          ) : (
            <span className="skeleton-line" aria-hidden="true" />
          )}
          <small>{t("seeForecast")}</small>
        </Link>
        <Link to="/crop-calendar" className="dashboard-summary-card" style={{ "--i": 1 } as CSSProperties}>
          <CalendarDays />
          <span>{t("cropActivity")}</span>
          <strong>{t("stayCropPlan")}</strong>
          <small>{t("trackTask")}</small>
        </Link>
        <Link to="/mandi" className="dashboard-summary-card" style={{ "--i": 2 } as CSSProperties}>
          <ShoppingBasket />
          <span>{t("marketWatch")}</span>
          <strong>{t("checkMandiPrices")}</strong>
          <small>{t("compareMarkets")}</small>
        </Link>
      </div>
      <div className="workspace-section-heading">
        <div>
          <span className="eyebrow">{t("quickAccess")}</span>
          <h2>{t("farmSmarter")}</h2>
        </div>
      </div>
      <div className="dashboard-feature-grid">
        {shortcuts.map(({ to, labelKey, icon: Icon }, index) => (
          <Link
            className="dashboard-feature-card"
            to={to}
            key={to}
            style={{ "--i": index + 3 } as CSSProperties}
          >
            {toolImages[to] ? (
              <span className="tool-art">
                <img src={toolImages[to]} alt="" loading="lazy" />
              </span>
            ) : (
              <Icon />
            )}
            <strong>{t(labelKey)}</strong>
            <span>
              {t("openTool")} <b>→</b>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function FeaturePage({
  title,
  description,
  titleKey,
  descriptionKey,
  path,
  children,
}: {
  title: string;
  description: string;
  titleKey?: Parameters<typeof translate>[1] | undefined;
  descriptionKey?: Parameters<typeof translate>[1] | undefined;
  path?: string | undefined;
  children: ReactNode;
}) {
  return (
    <WorkspacePage>
      <FeatureContent
        title={title}
        description={description}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        path={path}
      >
        {children}
      </FeatureContent>
    </WorkspacePage>
  );
}

const toneByPath: Record<string, string> = {
  "/assistant": "tone-green",
  "/crop-calendar": "tone-sun",
  "/crop-health": "tone-mint",
  "/schemes": "tone-sky",
  "/weather": "tone-sky",
  "/mandi": "tone-peach",
  "/emi-calculator": "tone-lilac",
  "/loan-eligibility": "tone-sky",
  "/profile": "tone-green",
};

function FeatureContent({
  title,
  description,
  titleKey,
  descriptionKey,
  path,
  children,
}: {
  title: string;
  description: string;
  titleKey?: Parameters<typeof translate>[1] | undefined;
  descriptionKey?: Parameters<typeof translate>[1] | undefined;
  path?: string | undefined;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const art = path ? toolImages[path] : undefined;
  const person = path ? pagePerson[path] : undefined;
  return (
    <>
      <section
        className={`tool-banner ${(path && toneByPath[path]) || "tone-green"}`}
        data-tool={path ? path.replace(/^\//, "") : undefined}
      >
        <div className="tool-banner-text">
          <span className="eyebrow">{t("farmingTool")}</span>
          <h2>{titleKey ? t(titleKey) : title}</h2>
          <p>{descriptionKey ? t(descriptionKey) : description}</p>
        </div>
        {(art || person) && (
          <div className="tool-banner-art" aria-hidden="true">
            {art && <img className="tool-banner-illus" src={art} alt="" decoding="async" />}
            {person && <img className="tool-banner-person" src={person} alt="" decoding="async" />}
          </div>
        )}
      </section>
      <div className="tool-body">{children}</div>
    </>
  );
}

export function CalendarPage() {
  return (
    <FeaturePage
      path="/crop-calendar"
      title="Smart Crop Calendar"
      description="Plan every stage of your farming journey from sowing to harvest."
      titleKey="smartCropCalendarTitle"
      descriptionKey="smartCropCalendarDescription"
    >
      <AdvancedFeatures mode="calendar" />
    </FeaturePage>
  );
}
export function DiseasePage() {
  return (
    <FeaturePage
      path="/crop-health"
      title="AI Crop Disease Detection"
      description="Upload a crop image for preliminary AI-powered health guidance."
      titleKey="cropDiseaseTitle"
      descriptionKey="cropDiseaseDescription"
    >
      <AdvancedFeatures mode="disease" />
    </FeaturePage>
  );
}
export function SchemesPage() {
  return (
    <FeaturePage
      path="/schemes"
      title="Government Scheme Finder"
      description="Discover official schemes and benefits that may be relevant to your farm."
      titleKey="governmentSchemesTitle"
      descriptionKey="governmentSchemesDescription"
    >
      <AdvancedFeatures mode="schemes" />
    </FeaturePage>
  );
}
export function WeatherPage() {
  return (
    <FeaturePage
      path="/weather"
      title="Smart Weather Alerts"
      description="Search your location for practical weather insights and farming alerts."
      titleKey="weatherAlertsTitle"
      descriptionKey="weatherAlertsDescription"
    >
      <WeatherSection />
    </FeaturePage>
  );
}
export function MandiPage() {
  return (
    <FeaturePage
      path="/mandi"
      title="Mandi Prices"
      description="Compare current market prices and make informed selling decisions."
      titleKey="mandiPageTitle"
      descriptionKey="mandiPageDescription"
    >
      <MandiPrices />
    </FeaturePage>
  );
}
export function EmiPage() {
  return (
    <FeaturePage
      path="/emi-calculator"
      title="EMI Calculator"
      description="Estimate your monthly farm-loan repayment before you apply."
      titleKey="emiPageTitle"
      descriptionKey="emiPageDescription"
    >
      <EmiCalculator />
    </FeaturePage>
  );
}

export function LoanEligibilityPage() {
  return (
    <FeaturePage
      path="/loan-eligibility"
      title="Loan Eligibility"
      description="Check which agricultural schemes may match your farm details."
    >
      <LoanEligibilityChecker />
    </FeaturePage>
  );
}

export function ProfilePage() {
  return (
    <FeaturePage
      path="/profile"
      title="My Profile"
      description="Manage your account information and language preference."
      titleKey="profileTitle"
      descriptionKey="profileDescription"
    >
      <ProfileContent />
    </FeaturePage>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  return (
    <div className="profile-card">
      <span className="profile-avatar" aria-hidden="true">
        {(user?.displayName || user?.email || "K").trim().charAt(0).toUpperCase()}
      </span>
      <h3>{user?.displayName || "Kishan Saathi farmer"}</h3>
      <p>{user?.email || "Signed-in farmer account"}</p>
      <small>Your account is protected by Firebase Authentication.</small>
    </div>
  );
}

export function AssistantPage() {
  return (
    <FeaturePage
      path="/assistant"
      title="AI Farming Assistant"
      description="Ask practical questions about crops, loans, schemes and farming decisions."
      titleKey="assistantPageTitle"
      descriptionKey="assistantPageDescription"
    >
      <AssistantContent />
    </FeaturePage>
  );
}

type ChatMessage = { role: "user" | "assistant"; content: string; failed?: boolean };

function AssistantContent() {
  const { user, configured, getIdToken } = useAuth();
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const storageKey = `kisan-chat:${user?.uid ?? "guest"}`;
  const [restored, setRestored] = useState(false);

  // Restore this person's earlier conversation after a refresh (stored only in this browser).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      setMessages(
        Array.isArray(parsed)
          ? parsed
              .filter(
                (m): m is ChatMessage =>
                  !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
              )
              .slice(-40)
          : [],
      );
    } catch {
      setMessages([]);
    }
    setRestored(true);
  }, [storageKey]);

  // Save the conversation; failed turns are not worth keeping.
  useEffect(() => {
    if (!restored) return;
    try {
      const keep = messages.filter((m) => !m.failed).slice(-40);
      if (keep.length) window.localStorage.setItem(storageKey, JSON.stringify(keep));
      else window.localStorage.removeItem(storageKey);
    } catch {
      /* storage may be unavailable (private mode); the chat still works for this visit */
    }
  }, [messages, restored, storageKey]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(event: FormEvent) {
    event.preventDefault();
    const message = question.trim();
    if (!message || loading) return;
    setQuestion("");
    setLoading(true);
    // Earlier successful turns give the assistant context; failed turns are left out.
    const history = messages
      .filter((m) => !m.failed)
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 45_000);
    const fail = (text: string) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "user") next[next.length - 1] = { ...last, failed: true };
        return [...next, { role: "assistant", content: text, failed: true }];
      });
    try {
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history, language }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The assistant could not answer right now.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "" }]);
    } catch (error) {
      if (controller.signal.aborted) {
        fail("The answer is taking too long. Please check your internet and try again.");
      } else if (error instanceof TypeError) {
        fail("Could not connect to the assistant. Please check your internet and try again.");
      } else {
        fail(error instanceof Error ? error.message : "Could not connect to the assistant.");
      }
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  }

  const avatar = <img className="chat-avatar" src={people.girl} alt="" decoding="async" />;
  return (
    <div className="workspace-chat-card">
      {configured && !user ? (
        <p>{t("loginToContinue")}</p>
      ) : (
        <>
          <div className="workspace-chat-log" ref={logRef} role="log" aria-live="polite">
            <div className="workspace-chat-row">
              {avatar}
              <div className="workspace-chat-response">{t("assistantQuestion")}</div>
            </div>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div className="workspace-chat-row is-user" key={i}>
                  <div className="workspace-chat-response user-bubble">{m.content}</div>
                </div>
              ) : (
                <div className="workspace-chat-row" key={i}>
                  {avatar}
                  <div className={`workspace-chat-response${m.failed ? " is-error" : ""}`}>
                    {m.content}
                  </div>
                </div>
              ),
            )}
            {loading && (
              <div className="workspace-chat-row">
                {avatar}
                <div className="workspace-chat-response typing" aria-label="Thinking">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={ask} className="workspace-chat-form">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t("typeQuestion")}
            />
            <VoiceInput value={question} onChange={setQuestion} />
            <button disabled={loading}>{loading ? "..." : t("sendQuestion")}</button>
          </form>
          {messages.length > 0 && (
            <button type="button" className="workspace-chat-clear" onClick={() => setMessages([])} disabled={loading}>
              {t("clearChat")}
            </button>
          )}
        </>
      )}
    </div>
  );
}
