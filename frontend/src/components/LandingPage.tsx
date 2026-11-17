import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  CloudSun,
  Droplets,
  Leaf,
  Menu,
  MessageCircle,
  Mic,
  Plus,
  Quote,
  Sprout,
  X,
} from "lucide-react";
import AuthDialog from "@/components/AuthDialog";
import { AuthProvider, useAuth } from "@/components/auth";
import { landingCopy } from "@/components/landing-copy";
import {
  LanguageContext,
  getStoredLanguage,
  siteLanguages,
  storeLanguage,
  translate,
  useLanguage,
  type SiteLanguage,
} from "@/lib/siteLanguage";
import heroImg from "@/assets/farming-landscape.jpg";
import fieldImg from "@/assets/field-work.webp";
import { people } from "@/lib/people";
import { toolImages } from "@/lib/toolImages";

/* Cartoon guide + tool illustration shown for each About item. */
const aboutArt = [
  { person: people.grain, tool: "/schemes" },
  { person: people.wave, tool: "/weather" },
  { person: people.plant, tool: "/crop-health" },
  { person: people.grandma, tool: "/mandi" },
];
/* One character per sample question. */
const questionPeople = [people.grain, people.boy, people.wave, people.grandma, people.plant, people.girl];


/* ---------- small hooks ---------- */

function useWeatherNow() {
  const [data, setData] = useState<{ temp: number; rain: number | null } | null>(null);
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

/** Adds the "in" class to every [data-reveal] element when it scrolls into view. */
function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.classList.add("js");
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (typeof IntersectionObserver === "undefined") {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setValue(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1200, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);
  return <span ref={ref}>{value}</span>;
}

/* ---------- page ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div data-reveal className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function Landing() {
  const { language, setLanguage } = useLanguage();
  const c = landingCopy[language];
  const { user, configured, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openItem, setOpenItem] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const weather = useWeatherNow();
  useReveal(rootRef);

  useEffect(() => {
    let frame = 0;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (!reduce && heroImgRef.current && y < 900) {
          heroImgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.08)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const openFeature = useCallback(
    (path: string) => {
      setMenuOpen(false);
      if (configured && !user) {
        window.localStorage.setItem("kishanSaathiRedirectAfterLogin", path);
        setAuthOpen(true);
        return;
      }
      window.location.assign(path);
    },
    [configured, user],
  );

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const marquee = [...c.tools, ...c.tools];

  return (
    <div className={language === "en" ? "ld" : "ld ld-deva"} ref={rootRef}>
      <header className={`ld-nav ${scrolled ? "is-scrolled" : ""}`}>
        <a className="ld-brand" href="/" aria-label="Kishan Saathi">
          <span className="ld-logo">
            <Leaf aria-hidden="true" />
          </span>
          <span>Kishan Saathi</span>
        </a>
        <nav className={`ld-links ${menuOpen ? "is-open" : ""}`} aria-label="Main">
          <button type="button" onClick={() => scrollTo("home")}>{c.nav.home}</button>
          <button type="button" onClick={() => scrollTo("tools")}>{c.nav.tools}</button>
          <button type="button" onClick={() => scrollTo("about")}>{c.nav.about}</button>
          <button type="button" onClick={() => scrollTo("ask")}>{c.nav.questions}</button>
          <button type="button" onClick={() => scrollTo("faq")}>{c.nav.faq}</button>
        </nav>
        <div className="ld-nav-actions">
          <select
            aria-label="Language"
            value={language}
            onChange={(e) => {
              const next = e.target.value as SiteLanguage;
              setLanguage(next);
              storeLanguage(next);
            }}
          >
            {siteLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          {user ? (
            <button type="button" className="ld-btn ld-btn-ghost" onClick={() => void signOutUser()}>
              Logout
            </button>
          ) : (
            <button type="button" className="ld-btn ld-btn-ghost" onClick={() => setAuthOpen(true)}>
              {c.login}
            </button>
          )}
          <button type="button" className="ld-btn ld-btn-lime" onClick={() => openFeature(user ? "/dashboard" : "/assistant")}>
            {c.getStarted}
          </button>
          <button
            type="button"
            className="ld-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          const target = window.localStorage.getItem("kishanSaathiRedirectAfterLogin") || "/dashboard";
          window.localStorage.removeItem("kishanSaathiRedirectAfterLogin");
          window.location.assign(target);
        }}
      />

      {/* HERO */}
      <section className="ld-hero" id="home">
        <img ref={heroImgRef} className="ld-hero-img" src={heroImg} alt="" fetchPriority="high" />
        <div className="ld-hero-shade" />
        <div className="ld-hero-body">
          <h1>
            <span className="ld-line"><span>{c.hero.a}</span></span>
            <span className="ld-line"><span><em>{c.hero.b}</em></span></span>
          </h1>
          <p className="ld-hero-sub">{c.hero.sub}</p>
          <div className="ld-hero-cta">
            <button type="button" className="ld-btn ld-btn-lime ld-btn-lg" onClick={() => openFeature("/assistant")}>
              {c.hero.cta1} <ArrowUpRight aria-hidden="true" />
            </button>
            <button type="button" className="ld-btn ld-btn-outline ld-btn-lg" onClick={() => scrollTo("tools")}>
              {c.hero.cta2}
            </button>
          </div>
        </div>
        <div className="ld-hero-bar">
          <button type="button" className="ld-scroll" onClick={() => scrollTo("tools")}>
            {c.hero.scroll} <ChevronDown aria-hidden="true" />
          </button>
          <div className="ld-hero-pills">
            <span>{c.hero.pill1}</span>
            <span className="ld-pill-lime"><Sprout aria-hidden="true" /> {c.hero.pill2}</span>
          </div>
        </div>
      </section>

      {/* TOOLS MARQUEE */}
      <section className="ld-marquee" id="tools" aria-label={c.nav.tools}>
        <div className="ld-marquee-track">
          {marquee.map((tool, i) => (
            <button
              type="button"
              key={`${tool.path}-${i}`}
              onClick={() => openFeature(tool.path)}
              aria-hidden={i >= c.tools.length ? true : undefined}
              tabIndex={i >= c.tools.length ? -1 : 0}
            >
              <img src={toolImages[tool.path]} alt="" loading="lazy" /> {tool.name}
            </button>
          ))}
        </div>
      </section>

      {/* ABOUT + ACCORDION */}
      <section className="ld-section" id="about">
        <Reveal>
          <span className="ld-tag">{c.about.tag}</span>
          <div className="ld-head">
            <h2>
              {c.about.a} <em>{c.about.b}</em>
            </h2>
            <p>{c.about.desc}</p>
          </div>
        </Reveal>
        <div className="ld-about">
          <Reveal className="ld-acc" delay={80}>
            {c.about.items.map((item, i) => (
              <div key={item.title} className={`ld-acc-item ${openItem === i ? "is-open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={openItem === i}
                  onClick={() => setOpenItem(i)}
                >
                  <span className="ld-acc-icon"><Sprout aria-hidden="true" /></span>
                  <span>{item.title}</span>
                  <Plus aria-hidden="true" className="ld-acc-plus" />
                </button>
                <div className="ld-acc-panel">
                  <div>
                    <p>{item.text}</p>
                    <button type="button" className="ld-link" onClick={() => openFeature(item.path)}>
                      {c.about.open} <ArrowUpRight aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal className="ld-about-img" delay={160}>
            <span className="ld-blob b1" aria-hidden="true" />
            <span className="ld-blob b2" aria-hidden="true" />
            {aboutArt.map((art, i) => (
              <div
                key={art.tool}
                className={`ld-about-slide ${openItem === i ? "is-on" : ""}`}
                data-tool={art.tool.replace(/^\//, "")}
              >
                <img className="ld-about-tool" src={toolImages[art.tool]} alt="" loading="lazy" />
                <img className="ld-about-person" src={art.person} alt="" loading="lazy" />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SPOTLIGHT with floating cards */}
      <section className="ld-section ld-spot-wrap">
        <Reveal className="ld-spot">
          <img src={heroImg} alt="" loading="lazy" style={{ objectPosition: "60% 45%" }} />
          <div className="ld-spot-shade" />
          <div className="ld-spot-cards">
            <div className="ld-card ld-float">
              <CloudSun aria-hidden="true" className="ld-card-icon" />
              <b className="ld-temp">
                {weather.data ? `${weather.data.temp}°C` : weather.failed ? "—" : c.spot.loading}
              </b>
              <small>{c.spot.weather}</small>
              {weather.data?.rain != null && (
                <div className="ld-rain">
                  <Droplets aria-hidden="true" /> {c.spot.rain}: {weather.data.rain}%
                </div>
              )}
              <button type="button" className="ld-link" onClick={() => openFeature("/weather")}>
                {c.spot.openWeather} <ArrowUpRight aria-hidden="true" />
              </button>
            </div>
            <div className="ld-card ld-float ld-float-2">
              <div className="ld-card-title"><MessageCircle aria-hidden="true" /> {c.spot.askTitle}</div>
              {c.spot.askChips.map((chip) => (
                <button type="button" className="ld-chip" key={chip} onClick={() => openFeature("/assistant")}>
                  {chip}
                </button>
              ))}
              <button type="button" className="ld-btn ld-btn-green ld-btn-sm" onClick={() => openFeature("/assistant")}>
                {c.spot.askCta} <ArrowUpRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="ld-spot-loc"><Leaf aria-hidden="true" /> {c.spot.near}</div>
        </Reveal>

        <div className="ld-stats">
          {c.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="ld-stat">
              <b>
                {s.value === null ? (
                  <>
                    <Mic aria-hidden="true" /> {s.word}
                  </>
                ) : (
                  <>
                    <Counter to={s.value} />
                    {s.value > 1 ? "+" : ""}
                  </>
                )}
              </b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section className="ld-section ld-strip-sec">
        <Reveal>
          <span className="ld-tag">{c.carousel.tag}</span>
          <div className="ld-head">
            <h2>
              {c.carousel.a} <em>{c.carousel.b}</em>
            </h2>
            <p>{c.carousel.desc}</p>
          </div>
        </Reveal>
        <div className="ld-toolgrid">
          {c.tools.map((tool, i) => (
            <Reveal key={tool.path} delay={i * 70} className="ld-toolcard-wrap">
              <button type="button" className="ld-toolcard" onClick={() => openFeature(tool.path)}>
                <span className="ld-toolcard-art">
                  <img src={toolImages[tool.path]} alt="" loading="lazy" />
                </span>
                <strong>{tool.name}</strong>
                <span className="ld-toolcard-tag">{tool.tag}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="ld-section" id="ask">
        <Reveal>
          <span className="ld-tag">{c.questions.tag}</span>
          <div className="ld-head">
            <h2>
              {c.questions.a} <em>{c.questions.b}</em>
            </h2>
            <p>{c.questions.desc}</p>
          </div>
        </Reveal>
        <div className="ld-q-grid">
          {c.questions.items.map((q, i) => (
            <Reveal key={q} delay={(i % 3) * 100} className={`ld-q ld-q-${i % 6}`}>
              <div className="ld-q-text">
                <Quote aria-hidden="true" />
                <p>{q}</p>
                <button type="button" className="ld-link" onClick={() => openFeature("/assistant")}>
                  {c.questions.ask} <ArrowUpRight aria-hidden="true" />
                </button>
              </div>
              <div className="ld-q-img">
                <img src={questionPeople[i % questionPeople.length]} alt="" loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="ld-section ld-faq" id="faq">
        <Reveal className="ld-faq-head">
          <span className="ld-tag">{c.faq.tag}</span>
          <h2>
            {c.faq.a} <em>{c.faq.b}</em>
          </h2>
          <p>{c.faq.desc}</p>
        </Reveal>
        <Reveal className="ld-faq-list" delay={80}>
          {c.faq.items.map((f, i) => (
            <div key={f.q} className={`ld-faq-item ${openFaq === i ? "is-open" : ""}`}>
              <button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="ld-faq-plus" aria-hidden="true"><Plus /></span>
              </button>
              <div className="ld-acc-panel">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* CTA + FOOTER */}
      <section className="ld-end">
        <div className="ld-end-bg" style={{ backgroundImage: `url(${fieldImg})` }} />
        <Reveal className="ld-end-cta">
          <h2>
            {c.cta.a} <em>{c.cta.b}</em>
          </h2>
          <p>{c.cta.desc}</p>
          <button type="button" className="ld-btn ld-btn-green ld-btn-lg" onClick={() => openFeature("/assistant")}>
            {c.cta.button} <ArrowUpRight aria-hidden="true" />
          </button>
        </Reveal>
        <footer className="ld-footer">
          <div className="ld-footer-brand">
            <a className="ld-brand" href="/">
              <span className="ld-logo"><Leaf aria-hidden="true" /></span>
              <span>Kishan Saathi</span>
            </a>
            <p>{c.footer.desc}</p>
          </div>
          <div>
            <h3>{c.footer.quick}</h3>
            <button type="button" onClick={() => scrollTo("home")}>{c.nav.home}</button>
            <button type="button" onClick={() => scrollTo("about")}>{c.nav.about}</button>
            <button type="button" onClick={() => scrollTo("faq")}>{c.nav.faq}</button>
          </div>
          <div>
            <h3>{c.footer.toolsTitle}</h3>
            {c.tools.slice(0, 4).map((tool) => (
              <button type="button" key={tool.path} onClick={() => openFeature(tool.path)}>
                {tool.name}
              </button>
            ))}
          </div>
          <div>
            <h3>{c.footer.important}</h3>
            <p className="ld-disclaimer">{c.footer.disclaimer}</p>
          </div>
          <p className="ld-copy">© 2026 Kishan Saathi · {c.footer.rights}</p>
        </footer>
      </section>
    </div>
  );
}

export default function LandingPage() {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  useEffect(() => setLanguage(getStoredLanguage()), []);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: (key) => translate(language, key) }}
    >
      <AuthProvider>
        <Landing />
      </AuthProvider>
    </LanguageContext.Provider>
  );
}
