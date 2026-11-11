
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// =====================================================================
// CLIENT CONFIGURATION (Iconic Luxury Unisex Salon and Academy)
// =====================================================================

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJayhIUu9FkTkRD48y-d5wBjQ";

const CLIENT_CONFIG = {
  businessName: "Iconic Luxury Unisex Salon and Academy",
  subHeading: "Luxury Beauty · Style · Confidence",
  tagline: "LUXURY UNISEX SALON & MAKEUP ARTIST • GOLGHAR, GORAKHPUR",
  description:
    "A unisex salon and makeup destination located at Mangalam Tower, Golghar, Gorakhpur, offering salon, hairstyling and makeup services. The business also identifies as a beauty and salon academy.",
  city: "Golghar, Gorakhpur, Uttar Pradesh",
  areaLabel: "Golghar, Gorakhpur",
  fullAddress:
    "Mangalam Tower, Golghar, Gorakhpur, Uttar Pradesh 273001",
  phone: "+9109580997664",
  cleanPhone: "09580997664",
  logoUrl: "/logo.png",

  googleReviewUrl: GOOGLE_REVIEW_URL,
  mapsDirectionUrl:
    "https://www.google.com/maps/search/?api=1&query=Iconic+Luxury+Unisex+Salon+and+Academy+Mangalam+Tower+Golghar+Gorakhpur",

  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  websiteUrl: "",
  whatsappChannelUrl: "",

  agencyName: "VR Max AI",
  agencyWhatsapp: "918700660097",
  agencyPhoneDisplay: "+91 87006 60097",

  customInstruction:
    "Write a natural, honest Google Maps review for Iconic Luxury Unisex Salon and Academy in Golghar, Gorakhpur. The business is a unisex salon and makeup destination. Keep the review conversational and based only on the selected experience. Do not invent specific treatments, packages, products, prices, discounts, bridal bookings, training courses, certificates, results or staff names. Do not make medical or hair/skin outcome claims. Avoid promotional language and repetitive openings. Do not use full stops.",

  // IMPORTANT: These labels must exactly match route.js CHIPS.
  chips: [
    { label: "Haircut & Styling" },
    { label: "Hair Services" },
    { label: "Makeup Services" },
    { label: "Salon Ambience" },
    { label: "Staff Behaviour" },
    { label: "Clean & Hygiene" },
    { label: "Professional Service" },
    { label: "Value for Money" },
    { label: "Golghar Location" },
    { label: "Academy & Training" },
  ],
};

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `${CLIENT_CONFIG.businessName}, ${CLIENT_CONFIG.fullAddress}`
)}&output=embed`;

const AGENCY_WA_LINK = `https://wa.me/${CLIENT_CONFIG.agencyWhatsapp}?text=${encodeURIComponent(
  "Hi VR Max AI, I want to get a QR review system for my business."
)}`;

const HAS_SOCIAL = Boolean(
  CLIENT_CONFIG.instagramUrl ||
  CLIENT_CONFIG.facebookUrl ||
  CLIENT_CONFIG.youtubeUrl ||
  CLIENT_CONFIG.websiteUrl ||
  CLIENT_CONFIG.whatsappChannelUrl
);

// =====================================================================
// TYPEWRITER
// =====================================================================

function useTypewriter(fullText, totalMs = 2300) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!fullText) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    setDisplayText("");
    setIsTyping(true);

    const COMMA_PAUSE = 90;
    const commas = (fullText.match(/,/g) || []).length;
    const base = Math.min(
      26,
      Math.max(10, (totalMs - commas * COMMA_PAUSE) / fullText.length)
    );

    const times = [];
    let t = 0;

    for (let i = 0; i < fullText.length; i++) {
      t += base;
      times.push(t);
      if (fullText[i] === ",") t += COMMA_PAUSE;
    }

    const start = performance.now();
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      let n = 0;

      while (n < times.length && times[n] <= elapsed) n++;

      setDisplayText(fullText.slice(0, n));

      if (n >= fullText.length) {
        setIsTyping(false);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fullText, totalMs]);

  return { displayText, isTyping };
}

// =====================================================================
// COPY TO CLIPBOARD
// =====================================================================

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // Fallback below
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

// =====================================================================
// MAIN PAGE
// =====================================================================

export default function UniversalReviewPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(["All"]);
  const firstRunRef = useRef(true);

  const [language, setLanguage] = useState("ENGLISH");
  const [reviewDraft, setReviewDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const recentLengthsRef = useRef([]);

  const { displayText, isTyping } = useTypewriter(reviewDraft);

  useEffect(() => {
    setMounted(true);

    return () => {
      requestIdRef.current++;
      abortControllerRef.current?.abort();
    };
  }, []);

  // ===================================================================
  // AI REVIEW GENERATION
  // ===================================================================

  const generateAIReview = useCallback(async (labels, lang) => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setCopied(false);
    setError("");
    setReviewDraft("");

    try {
      const effectiveFocus = labels.join(" + ");

      const res = await fetch("/api/reviews", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          businessName: CLIENT_CONFIG.businessName,
          category: CLIENT_CONFIG.tagline,
          description: CLIENT_CONFIG.description,
          city: CLIENT_CONFIG.city,
          selectedService: effectiveFocus,
          selectedChips: labels,
          customInstruction: CLIENT_CONFIG.customInstruction,
          language: lang,
          nonce: Math.random().toString(36).substring(2, 12),
          timestamp: Date.now(),
          randomSeed: Math.floor(Math.random() * 100000),
          recentLengths: recentLengthsRef.current,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || `Draft generation failed (${res.status}).`
        );
      }

      if (!data.review?.trim()) {
        throw new Error("The API returned an empty draft.");
      }

      if (requestId !== requestIdRef.current) return;

      if (data.meta) {
        recentLengthsRef.current = [
          ...recentLengthsRef.current,
          data.meta,
        ].slice(-6);
      }

      setReviewDraft(data.review.trim());
    } catch (err) {
      if (err.name === "AbortError") return;

      if (requestId === requestIdRef.current) {
        setError(err.message || "Unable to generate a draft.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // ===================================================================
  // AUTO GENERATION
  // ===================================================================

  useEffect(() => {
    if (!mounted) return;

    const delay = firstRunRef.current ? 0 : 350;
    firstRunRef.current = false;

    const t = setTimeout(
      () => generateAIReview(selectedLabels, language),
      delay
    );

    return () => {
      clearTimeout(t);
      abortControllerRef.current?.abort();
    };
  }, [mounted, selectedLabels, language, generateAIReview]);

  // ===================================================================
  // CHIP SELECTION (MAXIMUM 3)
  // ===================================================================

  function handleChipChange(chipObj) {
    if (chipObj.label === "All") {
      if (
        selectedLabels.length === 1 &&
        selectedLabels[0] === "All"
      ) {
        generateAIReview(["All"], language);
      } else {
        setSelectedLabels(["All"]);
      }
      return;
    }

    let next = selectedLabels.filter((l) => l !== "All");

    if (next.includes(chipObj.label)) {
      next = next.filter((l) => l !== chipObj.label);
    } else {
      next = [...next, chipObj.label];

      if (next.length > 3) {
        next = next.slice(-3);
      }
    }

    setSelectedLabels(next.length ? next : ["All"]);
  }

  // ===================================================================
  // LANGUAGE
  // ===================================================================

  function handleLanguageChange(lang) {
    if (lang === language) {
      generateAIReview(selectedLabels, lang);
      return;
    }

    setLanguage(lang);
  }

  // ===================================================================
  // COPY AND REDIRECT
  // ===================================================================

  async function handleCopyAndRedirect() {
    if (!reviewDraft || loading || isTyping) return;

    if (CLIENT_CONFIG.googleReviewUrl.includes("PASTE_PLACE_ID_HERE")) {
      setError("Google Review link has not been configured yet.");
      return;
    }

    const ok = await copyToClipboard(reviewDraft);

    if (!ok) {
      setError(
        "Could not copy the draft. Please select and copy it manually."
      );
      return;
    }

    setCopied(true);

    setTimeout(() => {
      window.location.href = CLIENT_CONFIG.googleReviewUrl;
    }, 550);
  }

  // ===================================================================
  // SAVE CONTACT
  // ===================================================================

  function handleSaveContact() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CLIENT_CONFIG.businessName}
ORG:${CLIENT_CONFIG.businessName}
TEL;TYPE=CELL:${CLIENT_CONFIG.phone}
ADR;TYPE=WORK:;;${CLIENT_CONFIG.fullAddress};;;;
NOTE:${CLIENT_CONFIG.subHeading}
END:VCARD`;

    const blob = new Blob([vcard], {
      type: "text/vcard;charset=utf-8;",
    });

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
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f3ed",
        }}
      />
    );
  }

  return (
    <main className="salon-luxury-viewport">
      {/* BACKGROUND IMAGE: place image at public/bg.png */}
      <div className="fixed-bg"></div>

      <div className="background-soft-overlay"></div>

      <div className="main-content-flow">

        {/* LOGO */}
        <div className="brand-medallion-badge">
          <div
            className="logo-circle-container"
            style={{
              backgroundImage: `url(${CLIENT_CONFIG.logoUrl})`,
            }}
            role="img"
            aria-label={`${CLIENT_CONFIG.businessName} logo`}
          ></div>

          <h1 className="brand-main-title">
            {CLIENT_CONFIG.businessName}
          </h1>
        </div>

        <p className="brand-serif-subtitle">
          {CLIENT_CONFIG.subHeading}
        </p>

        {/* DIVIDER */}
        <div className="royal-salon-divider">
          <span className="divider-line"></span>
          <span className="divider-gem">✦</span>
          <span className="divider-line"></span>
        </div>

        {/* STARS */}
        <div className="stars-cluster" aria-hidden="true">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <p className="experience-tracker-title">
          SHARE YOUR EXPERIENCE
        </p>

        {/* FILTER CHIPS */}
        <div className="floating-pills-cloud">
          <button
            type="button"
            onClick={() => handleChipChange({ label: "All" })}
            className={`embossed-pill ${
              selectedLabels.includes("All") ? "active" : ""
            }`}
          >
            All
          </button>

          {CLIENT_CONFIG.chips.map((chip) => {
            const active = selectedLabels.includes(chip.label);

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipChange(chip)}
                className={`embossed-pill ${active ? "active" : ""}`}
              >
                {chip.label}
                {active && " ✓"}
              </button>
            );
          })}
        </div>

        <p className="chip-hint">
          Tap up to 3 points for your review
        </p>

        {/* LANGUAGE SELECTOR */}
        <div className="capsule-lang-dock">
          {["ENGLISH", "HINGLISH"].map((lang) => {
            const active = language === lang;

            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`capsule-lang-btn ${
                  active ? "active" : ""
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* REVIEW BOX */}
        <div className="signature-review-box">
          <div className="box-top-ribbon">
            <div className="label-badge">
              <span className="dot-ping"></span>
              YOUR REVIEW
            </div>

            <button
              type="button"
              disabled={loading || isTyping}
              onClick={() =>
                generateAIReview(selectedLabels, language)
              }
              className="top-rewrite-btn"
            >
              <span>Rewrite</span>
            </button>
          </div>

          <div className="review-display-zone">
            {loading ? (
              <div className="loader-shimmer-wrap">
                <span className="sparkle-icon">✦</span>
                <span className="shimmer-text">
                  Crafting your review...
                </span>
              </div>
            ) : error ? (
              <p className="review-error">{error}</p>
            ) : reviewDraft ? (
              <p className="review-body-text">
                {displayText}
                {isTyping && (
                  <span className="typewriter-cursor"></span>
                )}
              </p>
            ) : (
              <p className="review-placeholder">
                Your review draft will appear here.
              </p>
            )}
          </div>

          <div className="card-ornament-center">
            <span>✦</span>
          </div>

          <button
            type="button"
            disabled={loading || isTyping || !reviewDraft}
            onClick={handleCopyAndRedirect}
            className={`full-luxury-copy-btn ${
              copied ? "copied" : ""
            }`}
          >
            <span>
              {copied
                ? "Copied! Opening Google..."
                : "Copy & Paste on Google"}
            </span>
          </button>

          <p className="card-disclaimer-note">
            Please review the wording before posting.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions-card">
          <div className="soft-action-grid">

            <div className="action-row-upper">

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${CLIENT_CONFIG.cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc whatsapp-disc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="icon-tag">WhatsApp</span>
              </a>

              {/* CALL */}
              <a
                href={`tel:${CLIENT_CONFIG.phone}`}
                className="soft-circle-action"
              >
                <div className="icon-disc call-disc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="icon-tag">Call Us</span>
              </a>

              {/* SAVE CONTACT */}
              <button
                type="button"
                onClick={handleSaveContact}
                className="soft-circle-action"
              >
                <div className="icon-disc contact-disc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <span className="icon-tag">Save Contact</span>
              </button>

              {/* DIRECTIONS */}
              <a
                href={CLIENT_CONFIG.mapsDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc map-disc">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="icon-tag">Directions</span>
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div
              className="action-row-lower"
              style={HAS_SOCIAL ? undefined : { display: "none" }}
            >
              {CLIENT_CONFIG.instagramUrl && (
                <a
                  href={CLIENT_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc insta-disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <span className="icon-tag">Instagram</span>
                </a>
              )}

              {CLIENT_CONFIG.websiteUrl && (
                <a
                  href={CLIENT_CONFIG.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc web-disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Website</span>
                </a>
              )}

              {CLIENT_CONFIG.whatsappChannelUrl && (
                <a
                  href={CLIENT_CONFIG.whatsappChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc wa-channel-disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span className="icon-tag">WA Channel</span>
                </a>
              )}

              {CLIENT_CONFIG.facebookUrl && (
                <a
                  href={CLIENT_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc fb-disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Facebook</span>
                </a>
              )}

              {CLIENT_CONFIG.youtubeUrl && (
                <a
                  href={CLIENT_CONFIG.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc yt-disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="icon-tag">YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* MAP CARD */}
        <div className="embedded-map-card">
          <a
            href={CLIENT_CONFIG.mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className="map-card-header-link"
          >
            <div className="address-highlight-box">
              <p className="agency-clean-address">
                <strong>Location:</strong> {CLIENT_CONFIG.fullAddress}
              </p>
            </div>

            <div className="map-card-header">
              <span>Visit Us · {CLIENT_CONFIG.areaLabel}</span>
            </div>
          </a>

          <div className="map-iframe-container">
            <iframe
              title={`${CLIENT_CONFIG.businessName} Location`}
              src={MAP_EMBED_URL}
              width="100%"
              height="170"
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
            className="map-directions-link"
          >
            Get Directions on Google Maps →
          </a>
        </div>

        {/* FOOTER */}
        <footer className="mini-footer">
          <span className="mini-footer-pill">
            Powered by <strong>{CLIENT_CONFIG.agencyName}</strong>
            <span className="mini-footer-dot">•</span>
            Get QR:
            <a
              href={AGENCY_WA_LINK}
              target="_blank"
              rel="noreferrer"
            >
              {CLIENT_CONFIG.agencyPhoneDisplay}
            </a>
          </span>
        </footer>
      </div>

      {/* =================================================================
          SALON LUXURY THEME
          Ivory + Champagne Gold + Burgundy + Soft Rose
          Background image path: /bg.png
         ================================================================= */}

      <style jsx global>{`
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          min-height: 100% !important;
          background: #f8f3ed !important;
        }

        * {
          box-sizing: border-box;
        }

        .salon-luxury-viewport {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          background: #f8f3ed;
          padding: 10px 16px 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          color: #49352f;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        /* BACKGROUND IMAGE */
        .fixed-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          background-image: url("/bg.png");
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          z-index: -2;
          pointer-events: none;
        }

        .background-soft-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(255, 250, 243, 0.14) 0%,
            rgba(255, 250, 243, 0.2) 45%,
            rgba(255, 250, 243, 0.35) 100%
          );
        }

        .main-content-flow {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 410px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* BRAND */
        .brand-medallion-badge {
          margin-top: 2px;
          margin-bottom: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-circle-container {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          background-color: #fffaf3;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow:
            0 10px 26px rgba(75, 36, 43, 0.16),
            0 3px 9px rgba(75, 36, 43, 0.08);
          margin-bottom: 8px;
          animation: floatLogo 3.5s ease-in-out infinite;
          border: 3px solid #c9a66b;
          transition: transform 0.2s ease;
        }

        .logo-circle-container:active {
          transform: scale(0.96);
        }

        @keyframes floatLogo {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-circle-container {
            animation: none;
          }
        }

        .brand-main-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          line-height: 1.2;
          font-weight: 800;
          color: #692b3b;
          margin: 0 0 4px;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
        }

        .brand-serif-subtitle {
          font-family: Georgia, "Times New Roman", serif;
          font-style: italic;
          font-size: 12.5px;
          color: #a17b49;
          margin: 0 0 4px;
          letter-spacing: 0.3px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }

        /* DIVIDER */
        .royal-salon-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 85%;
          margin: 4px auto 8px;
          gap: 10px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #c5a36c,
            transparent
          );
        }

        .divider-gem {
          color: #b58a50;
          font-size: 11px;
        }

        .stars-cluster {
          display: flex;
          gap: 4px;
          color: #bd965b;
          font-size: 15px;
          margin-bottom: 3px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
        }

        .experience-tracker-title {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #70504a;
          text-transform: uppercase;
          margin: 0 0 8px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }

        /* CHIPS */
        .floating-pills-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin: 0 auto 7px;
          width: 100%;
        }

        .embossed-pill {
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255, 251, 246, 0.94);
          color: #70534d;
          border: 1px solid #e5d4bd;
          cursor: pointer;
          box-shadow: 0 2px 7px rgba(73, 42, 38, 0.07);
          transition:
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.16s ease;
        }

        .embossed-pill:active {
          transform: scale(0.97);
        }

        .embossed-pill.active {
          background: #702b3b;
          color: #ffffff;
          border-color: #702b3b;
          box-shadow: 0 4px 12px rgba(112, 43, 59, 0.2);
        }

        .chip-hint {
          text-align: center;
          font-size: 10.5px;
          color: #927a6b;
          margin: 0 0 10px;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }

        /* LANGUAGE */
        .capsule-lang-dock {
          display: inline-flex;
          background: rgba(255, 251, 246, 0.95);
          border-radius: 999px;
          padding: 3px;
          gap: 2px;
          margin: 0 auto 13px;
          box-shadow: 0 3px 10px rgba(73, 42, 38, 0.08);
          border: 1px solid #e5d4bd;
        }

        .capsule-lang-btn {
          padding: 6px 18px;
          border-radius: 999px;
          border: none;
          background: transparent;
          font-size: 10px;
          font-weight: 750;
          color: #8a7568;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .capsule-lang-btn.active {
          background: #702b3b;
          color: #ffffff;
          box-shadow: 0 3px 8px rgba(112, 43, 59, 0.18);
        }

        /* REVIEW CARD */
        .signature-review-box {
          width: 100%;
          background: rgba(255, 252, 247, 0.97);
          border-radius: 24px;
          padding: 18px;
          box-sizing: border-box;
          box-shadow:
            0 10px 28px rgba(73, 42, 38, 0.1),
            0 2px 7px rgba(73, 42, 38, 0.04);
          margin-bottom: 16px;
          text-align: left;
          border: 1px solid rgba(221, 199, 169, 0.8);
          border-top: 4px solid #a77b49;
          color: #49352f;
        }

        .box-top-ribbon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .label-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 1.8px;
          color: #9b897a;
          text-transform: uppercase;
        }

        .dot-ping {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a77b49;
          box-shadow: 0 0 0 3px rgba(167, 123, 73, 0.12);
        }

        .top-rewrite-btn {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 999px;
          background: #f8f0e7;
          border: 1px solid #e6d5bf;
          color: #702b3b;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .top-rewrite-btn:active {
          transform: scale(0.95);
        }

        .review-display-zone {
          min-height: 132px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 2px 8px;
        }

        .loader-shimmer-wrap {
          color: #a77b49;
          font-size: 12px;
          font-style: italic;
        }

        .sparkle-icon {
          margin-right: 4px;
        }

        .review-body-text {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14.5px;
          line-height: 1.65;
          color: #49352f;
          margin: 0;
          width: 100%;
          white-space: pre-wrap;
        }

        .review-placeholder {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          font-style: italic;
          color: #aa9a8c;
          margin: 0;
        }

        .review-error {
          font-size: 12px;
          line-height: 1.5;
          color: #a23d4d;
          margin: 0;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 13px;
          background: #8b4352;
          margin-left: 3px;
          vertical-align: middle;
          animation: blink 0.7s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .card-ornament-center {
          text-align: center;
          color: #c5a36c;
          font-size: 10px;
          margin: 6px 0 10px;
        }

        .full-luxury-copy-btn {
          width: 100%;
          height: 50px;
          border-radius: 999px;
          background: linear-gradient(100deg, #702b3b 0%, #8d3d4b 100%);
          border: 1px solid #702b3b;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(112, 43, 59, 0.2);
          transition:
            transform 0.15s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .full-luxury-copy-btn.copied {
          background: #5e6d4c;
          border-color: #5e6d4c;
          box-shadow: 0 5px 14px rgba(94, 109, 76, 0.2);
        }

        .full-luxury-copy-btn:disabled {
          opacity: 0.58;
          cursor: not-allowed;
        }

        .full-luxury-copy-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .card-disclaimer-note {
          font-size: 9.5px;
          color: #a3978a;
          text-align: center;
          margin: 8px 0 0;
          font-style: italic;
        }

        /* QUICK ACTIONS */
        .quick-actions-card {
          width: 100%;
          background: rgba(255, 252, 247, 0.96);
          border-radius: 22px;
          padding: 18px 12px;
          box-sizing: border-box;
          border: 1px solid #e8d9c7;
          box-shadow: 0 8px 22px rgba(73, 42, 38, 0.08);
          margin-bottom: 16px;
        }

        .soft-action-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .action-row-upper,
        .action-row-lower {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 14px;
          width: 100%;
        }

        .soft-circle-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-decoration: none !important;
          color: #70534d;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s ease;
        }

        .soft-circle-action:active {
          transform: scale(0.92);
        }

        .icon-disc {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f0e7;
          display: grid;
          place-items: center;
          box-shadow: 0 3px 9px rgba(73, 42, 38, 0.08);
          border: 1px solid #e6d5bf;
          transition: all 0.2s ease;
        }

        .icon-disc svg {
          width: 20px;
          height: 20px;
          stroke: #80515a;
          transition: stroke 0.2s ease;
        }

        .whatsapp-disc:hover {
          background: #25d366;
          border-color: #25d366;
        }

        .whatsapp-disc:hover svg {
          stroke: #ffffff;
        }

        .call-disc:hover {
          background: #007aff;
          border-color: #007aff;
        }

        .call-disc:hover svg {
          stroke: #ffffff;
        }

        .contact-disc:hover {
          background: #80515a;
          border-color: #80515a;
        }

        .contact-disc:hover svg {
          stroke: #ffffff;
        }

        .map-disc:hover {
          background: #ea4335;
          border-color: #ea4335;
        }

        .map-disc:hover svg {
          stroke: #ffffff;
        }

        .insta-disc:hover {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          border-color: transparent;
        }

        .insta-disc:hover svg {
          stroke: #ffffff;
        }

        .wa-channel-disc:hover {
          background: #25d366;
          border-color: #25d366;
        }

        .wa-channel-disc:hover svg {
          stroke: #ffffff;
        }

        .fb-disc:hover {
          background: #1877f2;
          border-color: #1877f2;
        }

        .fb-disc:hover svg {
          stroke: #ffffff;
        }

        .yt-disc:hover {
          background: #ff0000;
          border-color: #ff0000;
        }

        .yt-disc:hover svg {
          stroke: #ffffff;
        }

        .icon-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: #70534d;
        }

        /* MAP CARD */
        .embedded-map-card {
          width: 100%;
          background: rgba(255, 252, 247, 0.97);
          border-radius: 22px;
          padding: 14px 16px;
          box-sizing: border-box;
          border: 1px solid #e8d9c7;
          box-shadow: 0 7px 20px rgba(73, 42, 38, 0.07);
          margin-bottom: 12px;
          text-align: left;
        }

        .map-card-header-link {
          text-decoration: none;
        }

        .map-card-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #80515a;
          margin-bottom: 8px;
        }

        .map-iframe-container {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e6d5bf;
          margin-bottom: 8px;
        }

        .map-directions-link {
          font-size: 11px;
          font-weight: 750;
          color: #a17b49;
          text-decoration: none;
          display: block;
          text-align: center;
          margin-bottom: 8px;
        }

        .address-highlight-box {
          background: #f8f0e7;
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid #e6d5bf;
          margin-bottom: 8px;
        }

        .agency-clean-address {
          font-size: 10.5px;
          color: #655047;
          margin: 0;
          line-height: 1.5;
          text-align: center;
        }

        /* FOOTER */
        .mini-footer {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 2px;
        }

        .mini-footer-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
          padding: 6px 13px;
          border: 1px solid #e6d5bf;
          border-radius: 999px;
          background: rgba(255, 252, 247, 0.96);
          font-size: 8.5px;
          letter-spacing: 0.3px;
          color: #9b897a;
          line-height: 1.4;
          box-shadow: 0 3px 9px rgba(73, 42, 38, 0.05);
        }

        .mini-footer-pill strong {
          color: #702b3b;
          font-weight: 800;
        }

        .mini-footer-dot {
          color: #bd965b;
        }

        .mini-footer-pill a {
          color: #80515a;
          font-weight: 800;
          text-decoration: none;
        }

        /* SMALL SCREEN */
        @media (max-width: 360px) {
          .salon-luxury-viewport {
            padding-left: 11px;
            padding-right: 11px;
          }

          .brand-main-title {
            font-size: 21px;
          }

          .embossed-pill {
            padding: 5px 10px;
            font-size: 10.5px;
          }

          .action-row-upper,
          .action-row-lower {
            gap: 11px;
          }
        }
      `}</style>
    </main>
  );
}
