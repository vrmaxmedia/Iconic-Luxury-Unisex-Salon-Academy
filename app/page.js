
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* =====================================================================
   ICONIC LUXURY UNISEX SALON & ACADEMY — PAGE CONFIG
   Background intentionally transparent: add your own background image
   in the parent layout/body. Salon API chip labels must match route.js.
   ===================================================================== */
const CLIENT_CONFIG = {
  businessName: "Iconic Luxury Unisex Salon & Academy",
  subHeading: "Unisex Salon & Makeup Artist in Golghar, Gorakhpur",
  category: "Unisex Salon & Makeup Artist",
  description:
    "A unisex salon and makeup destination in Golghar, Gorakhpur.",
  city: "Golghar, Gorakhpur, Uttar Pradesh",
  areaLabel: "Golghar, Gorakhpur",
  fullAddress: "Golghar, near Mangalam Tower, Gorakhpur, Uttar Pradesh",
  logoUrl: "/logo.png",

  // CID opens the salon's Google Business Profile. Replace with the
  // direct Place ID review URL when the verified Place ID is available.
  googleReviewUrl: "https://maps.google.com/?cid=3748807842798407439",
  mapsDirectionUrl: "https://maps.google.com/?cid=3748807842798407439",
  mapSearch:
    "Iconic Luxury Unisex Salon & Academy, Golghar, near Mangalam Tower, Gorakhpur, Uttar Pradesh",

  // Contact/social buttons stay hidden until genuine details are added.
  phone: "",
  cleanPhone: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",

  agencyName: "VR Max AI",
  agencyWhatsapp: "918700660097",
  agencyPhoneDisplay: "+91 87006 60097",

  // Keep these labels exactly aligned with iconic-luxury-salon-route.js.
  chips: [
    { label: "Haircut & Styling", icon: "✂" },
    { label: "Hair Services", icon: "✧" },
    { label: "Makeup Services", icon: "◈" },
    { label: "Salon Ambience", icon: "⌂" },
    { label: "Staff Behaviour", icon: "♡" },
    { label: "Clean & Hygiene", icon: "✦" },
    { label: "Professional Service", icon: "◇" },
    { label: "Value for Money", icon: "₹" },
    { label: "Golghar Location", icon: "⌖" },
    { label: "Academy & Training", icon: "✎" },
  ],
};

const THEME = {
  surface: "#FFF8F6",
  primary: "#49312F",
  white: "#FFFFFF",
  muted: "#806B69",
  accent: "#C99A9D",
  border: "#EBD9D8",
};

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  CLIENT_CONFIG.mapSearch
)}&output=embed`;

const AGENCY_WA_LINK = `https://wa.me/${CLIENT_CONFIG.agencyWhatsapp}?text=${encodeURIComponent(
  "Hi VR Max AI, I want to know more about the AI Google Review system."
)}`;

const HAS_SOCIAL = Boolean(
  CLIENT_CONFIG.instagramUrl ||
    CLIENT_CONFIG.facebookUrl ||
    CLIENT_CONFIG.youtubeUrl
);

function useTypewriter(fullText, speed = 10) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!fullText) {
      setDisplayText("");
      setIsTyping(false);
      return undefined;
    }

    setDisplayText("");
    setIsTyping(true);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayText(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [fullText, speed]);

  return { displayText, isTyping };
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Use the fallback below when browser clipboard permission is unavailable.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch (error) {
    return false;
  }
}

function Icon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M20.4 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20l1.2-4.8a8.4 8.4 0 1 1 16.2-3.7Z" />
        <path d="M8.5 8.2c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2.1 2 .3.2.5.2.7-.1l.7-.8c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.1.7-1.8.7-.6 0-1.4-.2-2.4-.7-1.1-.5-2.2-1.4-3.1-2.4-.9-1-1.5-2.1-1.7-2.9-.2-.8 0-1.5.4-2Z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.7 2 2 0 0 1 5 3.5h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L8.8 11a16 16 0 0 0 4.2 4.2l1.4-1.3a2 2 0 0 1 2.1-.5c.7.3 1.5.5 2.3.6a2 2 0 0 1 2.2 2.5Z" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg {...common}>
        <path d="M20 10c0 6.5-8 12-8 12S4 16.5 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (name === "contact") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="4" />
        <path d="M2.5 21v-1.5A4.5 4.5 0 0 1 7 15h4a4.5 4.5 0 0 1 4.5 4.5V21M19 8v8M15 12h8" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M14 21v-8h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5H18V3.2c-.4-.1-1.4-.2-2.7-.2-2.8 0-4.8 1.7-4.8 4.9V10H7.5v3h3v8Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 7.5a2.5 2.5 0 0 1 2.5-2.5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5Z" />
      <path d="m8 10 4 3 4-3" />
    </svg>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [selectedChips, setSelectedChips] = useState(["All"]);
  const [language, setLanguage] = useState("ENGLISH");
  const [reviewDraft, setReviewDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const recentLengthsRef = useRef([]);
  const { displayText, isTyping } = useTypewriter(reviewDraft, 10);

  useEffect(() => {
    setMounted(true);
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  const generateAIReview = useCallback(async (chips, lang) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setCopied(false);
    setError("");
    setReviewDraft("");

    try {
      const payload = {
        businessName: CLIENT_CONFIG.businessName,
        category: CLIENT_CONFIG.category,
        description: CLIENT_CONFIG.description,
        city: CLIENT_CONFIG.city,
        selectedChips: chips.includes("All") ? [] : chips,
        language: lang,
        customerExperience: "",
        customInstruction: "",
        recentLengths: recentLengthsRef.current,
        nonce: Math.random().toString(36).slice(2, 12),
        timestamp: Date.now(),
        randomSeed: Math.floor(Math.random() * 100000),
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Review draft generation failed (${response.status}).`);
      }
      if (!data.review?.trim()) {
        throw new Error("The API returned an empty review draft.");
      }
      if (requestId !== requestIdRef.current) return;

      if (data.meta) {
        recentLengthsRef.current = [...recentLengthsRef.current, data.meta].slice(-6);
      }
      setReviewDraft(data.review.trim());
    } catch (requestError) {
      if (requestError.name === "AbortError") return;
      if (requestId === requestIdRef.current) {
        setError(requestError.message || "Unable to generate a review draft.");
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;
    generateAIReview(selectedChips, language);
    return () => abortControllerRef.current?.abort();
  }, [mounted, selectedChips, language, generateAIReview]);

  function handleChipToggle(label) {
    if (label === "All") {
      setSelectedChips(["All"]);
      return;
    }

    setSelectedChips((current) => {
      const active = current.filter((item) => item !== "All");
      const next = active.includes(label)
        ? active.filter((item) => item !== label)
        : active.length < 3
          ? [...active, label]
          : active;
      return next.length ? next : ["All"];
    });
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
  }

  async function handleCopyAndRedirect() {
    if (!reviewDraft || loading || isTyping) return;

    const copiedSuccessfully = await copyToClipboard(reviewDraft);
    if (!copiedSuccessfully) {
      setError("Could not copy the draft. Please select and copy it manually.");
      return;
    }

    setCopied(true);
    window.setTimeout(() => {
      window.location.href = CLIENT_CONFIG.googleReviewUrl;
    }, 550);
  }

  function handleSaveContact() {
    if (!CLIENT_CONFIG.phone) return;

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${CLIENT_CONFIG.businessName}\nORG:${CLIENT_CONFIG.businessName}\nTEL;TYPE=CELL:${CLIENT_CONFIG.phone}\nADR;TYPE=WORK:;;${CLIENT_CONFIG.fullAddress};;;;\nNOTE:${CLIENT_CONFIG.subHeading}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${CLIENT_CONFIG.businessName.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!mounted) {
    return <div className="salon-page-loading" aria-hidden="true" />;
  }

  const allSelected = selectedChips.includes("All");

  return (
    <main className="salon-review-viewport">
      <div className="salon-page-content">
        {/* Salon identity */}
        <header className="salon-brand-block">
          <div className="salon-logo-frame">
            <div
              className="salon-logo"
              style={{ backgroundImage: `url(${CLIENT_CONFIG.logoUrl})` }}
              role="img"
              aria-label={`${CLIENT_CONFIG.businessName} logo`}
            />
          </div>

          <div className="salon-brand-kicker">
            <span className="kicker-line" />
            <span>YOUR STYLE, YOUR EXPERIENCE</span>
            <span className="kicker-line" />
          </div>
          <h1 className="salon-brand-title">{CLIENT_CONFIG.businessName}</h1>
          <p className="salon-brand-subtitle">{CLIENT_CONFIG.subHeading}</p>
          <div className="salon-stars" aria-label="Share your five-star experience">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>★</span>
            ))}
          </div>
        </header>

        {/* Experience selection */}
        <section className="experience-section" aria-labelledby="experience-title">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">A LITTLE ABOUT YOUR VISIT</span>
              <h2 id="experience-title" className="section-title">
                What did you love?
              </h2>
            </div>
            <span className="selection-count">
              {allSelected ? "ALL" : `${selectedChips.length}/3`}
            </span>
          </div>
          <p className="section-description">
            Choose up to 3 things that describe your experience.
          </p>

          <div className="salon-chip-grid">
            <button
              type="button"
              onClick={() => handleChipToggle("All")}
              className={`salon-chip salon-chip-all ${allSelected ? "is-selected" : ""}`}
              aria-pressed={allSelected}
            >
              <span className="chip-icon">✦</span>
              <span className="chip-label">Overall Experience</span>
              <span className="chip-check">{allSelected ? "✓" : "+"}</span>
            </button>

            {CLIENT_CONFIG.chips.map((chip) => {
              const active = selectedChips.includes(chip.label);
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChipToggle(chip.label)}
                  className={`salon-chip ${active ? "is-selected" : ""}`}
                  aria-pressed={active}
                >
                  <span className="chip-icon">{chip.icon}</span>
                  <span className="chip-label">{chip.label}</span>
                  <span className="chip-check">{active ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Language selector */}
        <section className="language-section" aria-label="Review language">
          <div className="language-copy">
            <span className="language-heading">WRITE IN YOUR LANGUAGE</span>
            <span className="language-subtext">Select the language for your review</span>
          </div>
          <div className="language-switch" role="group" aria-label="Choose language">
            {["ENGLISH", "HINGLISH"].map((lang) => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`language-option ${active ? "is-active" : ""}`}
                  aria-pressed={active}
                >
                  {lang === "HINGLISH" ? "Hinglish" : "English"}
                </button>
              );
            })}
          </div>
        </section>

        {/* Generated review */}
        <section className="review-card" aria-label="Your AI review draft">
          <div className="review-card-top">
            <div className="review-card-label">
              <span className="review-label-spark">✦</span>
              <span>YOUR REVIEW DRAFT</span>
            </div>
            <button
              type="button"
              disabled={loading || isTyping}
              onClick={() => generateAIReview(selectedChips, language)}
              className="rewrite-button"
            >
              <span className="rewrite-symbol">↻</span> Rewrite
            </button>
          </div>

          <div className="review-display-zone" aria-live="polite">
            {loading ? (
              <div className="review-loading">
                <span className="loading-flower">✿</span>
                <span>Creating your review...</span>
              </div>
            ) : error ? (
              <div className="review-error-block">
                <p>{error}</p>
                <button type="button" onClick={() => generateAIReview(selectedChips, language)}>
                  Try again
                </button>
              </div>
            ) : reviewDraft ? (
              <p className="review-draft-text">
                {displayText}
                {isTyping && <span className="typing-cursor" />}
              </p>
            ) : (
              <p className="review-placeholder">
                Your personalised review will appear here.
              </p>
            )}
          </div>

          <div className="review-card-divider">
            <span />
            <i>✧</i>
            <span />
          </div>

          <button
            type="button"
            disabled={loading || isTyping || !reviewDraft}
            onClick={handleCopyAndRedirect}
            className="copy-google-button"
          >
            <span>{copied ? "Copied! Opening Google..." : "Copy & Open Google Reviews"}</span>
            <span className="button-arrow">↗</span>
          </button>
          <p className="review-note">Please read your review once before posting it.</p>
        </section>

        {/* Quick contact and social actions */}
        {(CLIENT_CONFIG.phone || HAS_SOCIAL || CLIENT_CONFIG.mapsDirectionUrl) && (
          <section className="quick-actions-card" aria-label="Salon quick links">
            <div className="quick-actions-heading">
              <span className="section-eyebrow">STAY CONNECTED</span>
              <h2>Visit & Connect</h2>
            </div>
            <div className="quick-actions-grid">
              {CLIENT_CONFIG.cleanPhone && (
                <a
                  href={`https://wa.me/${CLIENT_CONFIG.cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="quick-action"
                >
                  <span className="quick-action-icon"><Icon name="whatsapp" /></span>
                  <span>WhatsApp</span>
                </a>
              )}
              {CLIENT_CONFIG.phone && (
                <a href={`tel:${CLIENT_CONFIG.phone}`} className="quick-action">
                  <span className="quick-action-icon"><Icon name="phone" /></span>
                  <span>Call Salon</span>
                </a>
              )}
              {CLIENT_CONFIG.phone && (
                <button type="button" onClick={handleSaveContact} className="quick-action">
                  <span className="quick-action-icon"><Icon name="contact" /></span>
                  <span>Save Contact</span>
                </button>
              )}
              {CLIENT_CONFIG.mapsDirectionUrl && (
                <a
                  href={CLIENT_CONFIG.mapsDirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="quick-action"
                >
                  <span className="quick-action-icon"><Icon name="map" /></span>
                  <span>Directions</span>
                </a>
              )}
              {CLIENT_CONFIG.instagramUrl && (
                <a href={CLIENT_CONFIG.instagramUrl} target="_blank" rel="noreferrer" className="quick-action">
                  <span className="quick-action-icon"><Icon name="instagram" /></span>
                  <span>Instagram</span>
                </a>
              )}
              {CLIENT_CONFIG.facebookUrl && (
                <a href={CLIENT_CONFIG.facebookUrl} target="_blank" rel="noreferrer" className="quick-action">
                  <span className="quick-action-icon"><Icon name="facebook" /></span>
                  <span>Facebook</span>
                </a>
              )}
              {CLIENT_CONFIG.youtubeUrl && (
                <a href={CLIENT_CONFIG.youtubeUrl} target="_blank" rel="noreferrer" className="quick-action">
                  <span className="quick-action-icon"><Icon name="youtube" /></span>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Location card */}
        <section className="salon-map-card" aria-label="Salon location">
          <div className="map-card-heading">
            <div className="map-pin-mark"><Icon name="map" /></div>
            <div>
              <span className="section-eyebrow">COME SAY HELLO</span>
              <h2>Find Our Salon</h2>
            </div>
          </div>
          <p className="salon-address">{CLIENT_CONFIG.fullAddress}</p>
          <div className="salon-map-frame">
            <iframe
              title={`${CLIENT_CONFIG.businessName} map`}
              src={MAP_EMBED_URL}
              width="100%"
              height="190"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={CLIENT_CONFIG.mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className="map-directions-button"
          >
            Get Directions <span>↗</span>
          </a>
        </section>

        {/* Footer */}
        <footer className="salon-footer">
          <div className="footer-ornament">✧</div>
          <p>Thank you for choosing {CLIENT_CONFIG.businessName}</p>
          <div className="footer-credit">
            <span>Powered by</span>
            <strong>{CLIENT_CONFIG.agencyName}</strong>
            <span className="footer-separator">•</span>
            <a href={AGENCY_WA_LINK} target="_blank" rel="noreferrer">
              Get QR Review System
            </a>
          </div>
          <span className="footer-phone">{CLIENT_CONFIG.agencyPhoneDisplay}</span>
        </footer>
      </div>

      <style jsx global>{`
        :root {
          --salon-surface: ${THEME.surface};
          --salon-primary: ${THEME.primary};
          --salon-white: ${THEME.white};
          --salon-muted: ${THEME.muted};
          --salon-accent: ${THEME.accent};
          --salon-border: ${THEME.border};
        }

        .salon-page-loading {
          min-height: 100vh;
          background: transparent;
        }

        .salon-review-viewport {
          min-height: 100vh;
          width: 100%;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: transparent;
          color: var(--salon-primary);
          padding: 18px 15px 30px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .salon-page-content {
          width: 100%;
          max-width: 430px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          z-index: 1;
        }

        .salon-brand-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 12px 18px;
        }

        .salon-logo-frame {
          width: 116px;
          height: 116px;
          border-radius: 31px;
          padding: 5px;
          background: var(--salon-surface);
          border: 1px solid var(--salon-border);
          box-shadow: 0 12px 28px rgba(73, 49, 47, 0.13);
          margin-bottom: 17px;
        }

        .salon-logo {
          width: 100%;
          height: 100%;
          border-radius: 26px;
          background-color: var(--salon-surface);
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .salon-brand-kicker {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: var(--salon-muted);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 9px;
        }

        .kicker-line {
          width: 22px;
          height: 1px;
          background: var(--salon-accent);
        }

        .salon-brand-title {
          max-width: 390px;
          margin: 0;
          color: var(--salon-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 7vw, 31px);
          line-height: 1.13;
          font-weight: 700;
          letter-spacing: -0.65px;
        }

        .salon-brand-subtitle {
          margin: 8px 0 10px;
          color: var(--salon-muted);
          font-size: 12px;
          line-height: 1.5;
          letter-spacing: 0.2px;
        }

        .salon-stars {
          display: flex;
          gap: 5px;
          color: var(--salon-accent);
          font-size: 17px;
          line-height: 1;
        }

        .experience-section {
          width: 100%;
          padding: 20px 16px 17px;
          margin: 0 0 13px;
          box-sizing: border-box;
          background: rgba(255, 248, 246, 0.94);
          border: 1px solid var(--salon-border);
          border-radius: 25px;
          box-shadow: 0 10px 28px rgba(73, 49, 47, 0.08);
        }

        .section-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .section-eyebrow {
          display: block;
          color: var(--salon-accent);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 1.8px;
          line-height: 1.4;
        }

        .section-title {
          margin: 4px 0 0;
          color: var(--salon-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
        }

        .selection-count {
          min-width: 36px;
          height: 26px;
          padding: 0 8px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #F5E8E7;
          color: var(--salon-primary);
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.6px;
        }

        .section-description {
          margin: 7px 0 14px;
          color: var(--salon-muted);
          font-size: 11px;
          line-height: 1.5;
        }

        .salon-chip-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .salon-chip {
          min-height: 51px;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 9px 9px 11px;
          border: 1px solid var(--salon-border);
          border-radius: 13px;
          background: var(--salon-surface);
          color: var(--salon-muted);
          text-align: left;
          cursor: pointer;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .salon-chip:active {
          transform: scale(0.975);
        }

        .salon-chip-all {
          grid-column: 1 / -1;
          min-height: 45px;
        }

        .chip-icon {
          flex: 0 0 25px;
          width: 25px;
          height: 25px;
          display: inline-grid;
          place-items: center;
          border-radius: 9px;
          background: #F5E8E7;
          color: var(--salon-accent);
          font-size: 15px;
          font-weight: 700;
        }

        .chip-label {
          min-width: 0;
          flex: 1;
          font-size: 10px;
          line-height: 1.25;
          font-weight: 750;
        }

        .chip-check {
          flex: 0 0 19px;
          width: 19px;
          height: 19px;
          display: inline-grid;
          place-items: center;
          border: 1px solid var(--salon-border);
          border-radius: 50%;
          color: var(--salon-accent);
          font-size: 11px;
          font-weight: 800;
        }

        .salon-chip.is-selected {
          background: var(--salon-primary);
          border-color: var(--salon-primary);
          color: var(--salon-white);
          box-shadow: 0 5px 13px rgba(73, 49, 47, 0.16);
        }

        .salon-chip.is-selected .chip-icon {
          background: rgba(255, 255, 255, 0.13);
          color: #EAC8C8;
        }

        .salon-chip.is-selected .chip-check {
          border-color: rgba(255, 255, 255, 0.58);
          background: rgba(255, 255, 255, 0.14);
          color: var(--salon-white);
        }

        .language-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          padding: 14px 15px;
          margin-bottom: 13px;
          box-sizing: border-box;
          border: 1px solid var(--salon-border);
          border-radius: 18px;
          background: rgba(255, 248, 246, 0.94);
          box-shadow: 0 7px 19px rgba(73, 49, 47, 0.06);
        }

        .language-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .language-heading {
          color: var(--salon-primary);
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .language-subtext {
          color: var(--salon-muted);
          font-size: 9px;
        }

        .language-switch {
          flex: 0 0 auto;
          display: inline-flex;
          gap: 3px;
          padding: 3px;
          border: 1px solid var(--salon-border);
          border-radius: 999px;
          background: #F8EFED;
        }

        .language-option {
          min-height: 31px;
          padding: 0 12px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--salon-muted);
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .language-option.is-active {
          background: var(--salon-primary);
          color: var(--salon-white);
          box-shadow: 0 3px 8px rgba(73, 49, 47, 0.18);
        }

        .review-card {
          width: 100%;
          padding: 18px 17px 15px;
          margin-bottom: 14px;
          box-sizing: border-box;
          background: var(--salon-surface);
          border: 1px solid var(--salon-border);
          border-top: 4px solid var(--salon-accent);
          border-radius: 23px;
          box-shadow: 0 13px 30px rgba(73, 49, 47, 0.11);
          text-align: left;
        }

        .review-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .review-card-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--salon-muted);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.45px;
        }

        .review-label-spark {
          color: var(--salon-accent);
          font-size: 14px;
        }

        .rewrite-button {
          min-height: 31px;
          padding: 0 11px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid var(--salon-border);
          border-radius: 999px;
          background: #F7EBE9;
          color: var(--salon-primary);
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .rewrite-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .rewrite-symbol {
          color: var(--salon-accent);
          font-size: 15px;
        }

        .review-display-zone {
          min-height: 102px;
          display: flex;
          align-items: center;
          padding: 9px 2px 12px;
          box-sizing: border-box;
        }

        .review-loading {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          color: var(--salon-muted);
          font-size: 11px;
          font-style: italic;
        }

        .loading-flower {
          color: var(--salon-accent);
          font-size: 20px;
          animation: salonSpin 1.8s linear infinite;
        }

        @keyframes salonSpin {
          to { transform: rotate(360deg); }
        }

        .review-draft-text {
          width: 100%;
          margin: 0;
          color: var(--salon-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          line-height: 1.68;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .review-placeholder {
          width: 100%;
          margin: 0;
          color: var(--salon-muted);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          font-style: italic;
          text-align: center;
        }

        .review-error-block {
          width: 100%;
          color: #A13F48;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .review-error-block p {
          margin: 0 0 7px;
        }

        .review-error-block button {
          padding: 6px 13px;
          border: 1px solid var(--salon-border);
          border-radius: 999px;
          background: #F7EBE9;
          color: var(--salon-primary);
          font-size: 10px;
          font-weight: 800;
        }

        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 14px;
          margin-left: 3px;
          background: var(--salon-accent);
          vertical-align: middle;
          animation: salonBlink 0.7s infinite;
        }

        @keyframes salonBlink {
          50% { opacity: 0; }
        }

        .review-card-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin: 1px 0 12px;
          color: var(--salon-accent);
          font-size: 12px;
        }

        .review-card-divider span {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--salon-border), transparent);
        }

        .review-card-divider i {
          font-style: normal;
        }

        .copy-google-button {
          width: 100%;
          min-height: 49px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 13px;
          background: var(--salon-primary);
          color: var(--salon-white);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.15px;
          box-shadow: 0 7px 17px rgba(73, 49, 47, 0.23);
          cursor: pointer;
          transition: transform 0.16s ease, opacity 0.16s ease;
        }

        .copy-google-button:active:not(:disabled) {
          transform: scale(0.985);
        }

        .copy-google-button:disabled {
          opacity: 0.53;
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-arrow {
          color: #E8C5C5;
          font-size: 17px;
          line-height: 1;
        }

        .review-note {
          margin: 9px 0 0;
          color: var(--salon-muted);
          font-size: 9px;
          text-align: center;
        }

        .quick-actions-card,
        .salon-map-card {
          width: 100%;
          padding: 17px 16px;
          margin-bottom: 13px;
          box-sizing: border-box;
          border: 1px solid var(--salon-border);
          border-radius: 22px;
          background: rgba(255, 248, 246, 0.95);
          box-shadow: 0 9px 24px rgba(73, 49, 47, 0.08);
        }

        .quick-actions-heading {
          text-align: center;
          margin-bottom: 13px;
        }

        .quick-actions-heading h2,
        .map-card-heading h2 {
          margin: 4px 0 0;
          color: var(--salon-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          line-height: 1.2;
        }

        .quick-actions-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 17px 22px;
        }

        .quick-action {
          min-width: 62px;
          padding: 0;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border: 0;
          background: transparent;
          color: var(--salon-muted);
          font-size: 9px;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
        }

        .quick-action-icon {
          width: 46px;
          height: 46px;
          display: inline-grid;
          place-items: center;
          border: 1px solid var(--salon-border);
          border-radius: 15px;
          background: #F7EBE9;
          color: var(--salon-primary);
          transition: all 0.18s ease;
        }

        .quick-action-icon svg {
          width: 20px;
          height: 20px;
        }

        .quick-action:active .quick-action-icon {
          transform: scale(0.94);
          background: var(--salon-primary);
          color: var(--salon-white);
        }

        .map-card-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 9px;
        }

        .map-pin-mark {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #F5E7E6;
          color: var(--salon-primary);
        }

        .map-pin-mark svg {
          width: 19px;
          height: 19px;
        }

        .salon-address {
          margin: 0 0 12px;
          color: var(--salon-muted);
          font-size: 10.5px;
          line-height: 1.55;
        }

        .salon-map-frame {
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--salon-border);
          border-radius: 15px;
          background: #F7EBE9;
        }

        .salon-map-frame iframe {
          display: block;
        }

        .map-directions-button {
          min-height: 40px;
          margin-top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid var(--salon-border);
          border-radius: 12px;
          background: #F7EBE9;
          color: var(--salon-primary);
          font-size: 10px;
          font-weight: 850;
          text-decoration: none;
        }

        .map-directions-button span {
          color: var(--salon-accent);
          font-size: 15px;
        }

        .salon-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 6px 10px 2px;
          color: var(--salon-muted);
        }

        .footer-ornament {
          margin-bottom: 4px;
          color: var(--salon-accent);
          font-size: 20px;
        }

        .salon-footer > p {
          margin: 0 0 8px;
          color: var(--salon-primary);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 12px;
          font-style: italic;
        }

        .footer-credit {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 8px;
          letter-spacing: 0.15px;
        }

        .footer-credit strong,
        .footer-credit a {
          color: var(--salon-primary);
          font-weight: 850;
          text-decoration: none;
        }

        .footer-separator {
          color: var(--salon-accent);
        }

        .footer-phone {
          margin-top: 4px;
          color: var(--salon-muted);
          font-size: 8px;
          letter-spacing: 0.4px;
        }

        @media (max-width: 360px) {
          .salon-review-viewport {
            padding-right: 10px;
            padding-left: 10px;
          }

          .experience-section,
          .quick-actions-card,
          .salon-map-card {
            padding-right: 12px;
            padding-left: 12px;
          }

          .salon-chip {
            gap: 6px;
            padding-right: 7px;
            padding-left: 8px;
          }

          .chip-label {
            font-size: 9px;
          }

          .language-section {
            align-items: flex-start;
            flex-direction: column;
          }

          .language-switch {
            width: 100%;
          }

          .language-option {
            flex: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .salon-chip,
          .language-option,
          .copy-google-button,
          .quick-action-icon {
            transition: none;
          }

          .loading-flower,
          .typing-cursor {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
