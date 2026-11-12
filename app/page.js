"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

import photo1 from "../gallery/photo1.webp";
import photo2 from "../gallery/photo2.webp";
import photo3 from "../gallery/photo3.webp";
import photo4 from "../gallery/photo4.webp";
import photo5 from "../gallery/photo5.webp";
import photo6 from "../gallery/photo6.webp";
import photo7 from "../gallery/photo7.webp";
import photo8 from "../gallery/photo8.webp";
import photo9 from "../gallery/photo9.webp";
import photo10 from "../gallery/photo10.webp";
import photo11 from "../gallery/photo11.webp";
import photo12 from "../gallery/photo12.webp";

const GALLERY_IMAGES = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
];

const CLIENT_CONFIG = {
  clientId: "iconic_luxury_salon_01",
  businessName: "Iconic Luxury Unisex Salon & Academy",
  subHeading: "Unisex Salon & Makeup Artist in Golghar, Gorakhpur",
  category: "Unisex Salon & Makeup Artist",
  description: "A unisex salon and makeup destination in Golghar, Gorakhpur.",
  city: "Golghar, Gorakhpur, Uttar Pradesh",
  areaLabel: "Golghar, Gorakhpur",
  fullAddress: "Golghar, near Mangalam Tower, Gorakhpur, Uttar Pradesh",
  logoUrl: "/logo.png",

  // Direct Google review box link (Copy & Paste on Google button isi par khulta hai)
  googleReviewUrl: "https://g.page/r/CQ-PMvnecAY0EBM/review",
  mapsDirectionUrl: "https://maps.google.com/?cid=3748807842798407439",
  mapSearch:
    "Iconic Luxury Unisex Salon & Academy, Golghar, near Mangalam Tower, Gorakhpur, Uttar Pradesh",

  phone: "+919580997664",
  cleanPhone: "919580997664",

  // "Direct Call to Salon" button ka alag number
  directCallPhone: "+918881616948",

  // Instagram, Facebook aur Website buttons hamesha page par dikhte hain.
  // Abhi Facebook aur Website mein TESTING wale links hain.
  // Asli link aane par bas inhe replace kar dena.
  instagramUrl:
    "https://www.instagram.com/iconicluxuryunisexsalon?dlrf=MWVxYW4xZWsxYWY4eQ==",
  facebookUrl: "https://www.facebook.com/facebook", // <-- testing link, baad mein asli Facebook page ka link daalna
  websiteUrl: "https://www.google.com", // <-- testing link, baad mein asli Website ka link daalna
  youtubeUrl: "",
  whatsappChannelUrl: "",

  agencyName: "VR Max AI",
  agencyWhatsapp: "918700660097",
  agencyPhoneDisplay: "+91 87006 60097",

  // NOTE: chip labels route.js ke CHIPS se bilkul match hone chahiye ("All" ke alawa)
  chips: [
    { label: "All" },
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
  CLIENT_CONFIG.mapSearch
)}&output=embed`;

const AGENCY_WA_LINK = `https://wa.me/${
  CLIENT_CONFIG.agencyWhatsapp
}?text=${encodeURIComponent(
  "Hi VR Max AI, I want to get a QR review system for my business."
)}`;

/* =====================================================================
   AUTO THEME: public/bg.png ka dominant color nikaal kar poora palette
   (page bg, cards, chips, buttons, text) usi se bana deta hai.
   bg.png badlo -> saari coloring apne aap badal jayegi.
   ===================================================================== */
const BG_IMAGE_URL = "/bg.png";

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

const toHex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

const toTriplet = ([r, g, b]) => `${r}, ${g}, ${b}`;

function buildTheme(r, g, b, avgLuma) {
  const { h, s } = rgbToHsl(r, g, b);
  const isDark = avgLuma < 0.45;

  const primary = hslToRgb(h, clamp(s, 20, 45), 20);
  const muted = hslToRgb(h, clamp(s, 12, 25), 44);
  const accent = hslToRgb(h, clamp(s, 30, 55), 66);
  const border = hslToRgb(h, clamp(s, 25, 45), 88);
  const surface = hslToRgb(h, 60, 97);
  const soft = hslToRgb(h, 40, 94);
  const page = [r, g, b];

  return {
    "--c-page": toHex(page),
    "--c-primary": toHex(primary),
    "--c-primary-rgb": toTriplet(primary),
    "--c-muted": toHex(muted),
    "--c-accent": toHex(accent),
    "--c-border": toHex(border),
    "--c-surface": toHex(surface),
    "--c-surface-rgb": toTriplet(surface),
    "--c-soft": toHex(soft),
    // Seedha background ke upar jo text hai (title, subtitle, stars, hint)
    "--c-on-bg-title": isDark ? "#ffffff" : toHex(primary),
    "--c-on-bg-sub": isDark ? "rgba(255,255,255,0.88)" : toHex(muted),
    "--c-on-bg-accent": isDark ? "#ffffff" : toHex(accent),
    "--c-on-bg-shadow": isDark
      ? "rgba(0, 0, 0, 0.45)"
      : `rgba(${toTriplet(surface)}, 0.65)`,
  };
}

function extractThemeFromImage(url) {
  return new Promise((resolve) => {
    // window.Image use kiya hai kyunki upar next/image ka "Image" import hai
    const img = new window.Image();

    img.onload = () => {
      try {
        const size = 40;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let wr = 0;
        let wg = 0;
        let wb = 0;
        let wSum = 0;
        let luma = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 40) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const { s, l } = rgbToHsl(r, g, b);

          luma += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          count++;

          // Colourful aur beech ki brightness wale pixels ko zyada weight
          const weight = (s / 100) * (1 - Math.abs(l / 50 - 1)) + 0.02;
          wr += r * weight;
          wg += g * weight;
          wb += b * weight;
          wSum += weight;
        }

        if (!count || !wSum) return resolve(null);

        resolve(
          buildTheme(
            Math.round(wr / wSum),
            Math.round(wg / wSum),
            Math.round(wb / wSum),
            luma / count
          )
        );
      } catch (e) {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}

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

export default function UniversalReviewPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(["All"]);
  const firstRunRef = useRef(true);
  const [language, setLanguage] = useState("ENGLISH");
  const [reviewDraft, setReviewDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryTouchStartXRef = useRef(0);

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

  // bg.png se auto theme
  useEffect(() => {
    let cancelled = false;

    extractThemeFromImage(BG_IMAGE_URL).then((theme) => {
      if (cancelled || !theme) return;
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) =>
        root.style.setProperty(key, value)
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Gallery automatic sliding - every 3 seconds
  useEffect(() => {
    if (!mounted) return;

    const galleryTimer = window.setInterval(() => {
      setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    }, 3000);

    return () => window.clearInterval(galleryTimer);
  }, [mounted]);

  // Manual touch swipe
  function handleGalleryTouchStart(event) {
    galleryTouchStartXRef.current = event.changedTouches[0].clientX;
  }

  function handleGalleryTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const difference = galleryTouchStartXRef.current - touchEndX;

    if (Math.abs(difference) < 45) return;

    if (difference > 0) {
      // Swipe left: next image
      setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    } else {
      // Swipe right: previous image
      setGalleryIndex(
        (current) =>
          (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
      );
    }
  }

  function handleGalleryPrevious() {
    setGalleryIndex(
      (current) =>
        (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    );
  }

  function handleGalleryNext() {
    setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
  }

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
      const res = await fetch("/api/reviews", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          businessName: CLIENT_CONFIG.businessName,
          category: CLIENT_CONFIG.category,
          description: CLIENT_CONFIG.description,
          city: CLIENT_CONFIG.city,
          selectedChips: labels.includes("All") ? [] : labels,
          language: lang,
          customerExperience: "",
          customInstruction: "",
          recentLengths: recentLengthsRef.current,
          nonce: Math.random().toString(36).substring(2, 12),
          timestamp: Date.now(),
          randomSeed: Math.floor(Math.random() * 100000),
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

  function handleLanguageChange(lang) {
    if (lang === language) {
      generateAIReview(selectedLabels, lang);
      return;
    }

    setLanguage(lang);
  }

  async function handleCopyAndRedirect() {
    if (!reviewDraft || loading || isTyping) return;

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
          backgroundColor: "var(--c-page, #f3e3e1)",
        }}
      />
    );
  }

  return (
    <main className="soft-luxury-viewport">

      {/* Fixed Background Image */}
      <div className="fixed-bg"></div>

      <div className="main-content-flow">

        {/* Logo */}
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

        <div className="royal-shahi-divider">
          <span className="divider-line"></span>
          <span className="divider-gem">◆</span>
          <span className="divider-line"></span>
        </div>

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

        {/* Filter Chips */}
        <div className="floating-pills-cloud">
          {CLIENT_CONFIG.chips.map((chip) => {
            const active = selectedLabels.includes(chip.label);

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipChange(chip)}
                aria-pressed={active}
                className={`embossed-pill ${active ? "active" : ""}`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <p className="chip-hint">
          Tap up to 3 keywords for your review
        </p>

        {/* Language Selector */}
        <div className="capsule-lang-dock">
          {["ENGLISH", "HINGLISH"].map((lang) => {
            const active = language === lang;

            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                aria-pressed={active}
                className={`capsule-lang-btn ${active ? "active" : ""}`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Review Box */}
        <div className="signature-review-box">

          <div className="box-top-ribbon">
            <div className="label-badge">
              <span className="dot-ping"></span>
              YOUR REVIEW
            </div>

            <button
              type="button"
              disabled={loading || isTyping}
              onClick={() => generateAIReview(selectedLabels, language)}
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
                  Crafting authentic review...
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
            <span>◆</span>
          </div>

          <button
            type="button"
            disabled={loading || isTyping || !reviewDraft}
            onClick={handleCopyAndRedirect}
            className={`full-luxury-copy-btn ${copied ? "copied" : ""}`}
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

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="soft-action-grid">

            <div className="action-row-upper">

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CLIENT_CONFIG.cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc whatsapp-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="icon-tag">WhatsApp</span>
              </a>

              {/* Call Us */}
              <a
                href={`tel:${CLIENT_CONFIG.phone}`}
                className="soft-circle-action"
              >
                <div className="icon-disc call-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="icon-tag">Call Us</span>
              </a>

              {/* Save Contact */}
              <button
                type="button"
                onClick={handleSaveContact}
                className="soft-circle-action"
              >
                <div className="icon-disc contact-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <span className="icon-tag">Save Contact</span>
              </button>

              {/* Directions */}
              <a
                href={CLIENT_CONFIG.mapsDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc map-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="icon-tag">Directions</span>
              </a>

            </div>

            <div className="action-row-lower">

              {/* Instagram */}
              {CLIENT_CONFIG.instagramUrl && (
                <a
                  href={CLIENT_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc insta-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <span className="icon-tag">Instagram</span>
                </a>
              )}

              {/* Website */}
              {CLIENT_CONFIG.websiteUrl && (
                <a
                  href={CLIENT_CONFIG.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc contact-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Website</span>
                </a>
              )}

              {/* WhatsApp Channel */}
              {CLIENT_CONFIG.whatsappChannelUrl && (
                <a
                  href={CLIENT_CONFIG.whatsappChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc wa-channel-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span className="icon-tag">WA Channel</span>
                </a>
              )}

              {/* Facebook */}
              {CLIENT_CONFIG.facebookUrl && (
                <a
                  href={CLIENT_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc fb-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Facebook</span>
                </a>
              )}

              {/* YouTube */}
              {CLIENT_CONFIG.youtubeUrl && (
                <a
                  href={CLIENT_CONFIG.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc yt-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon
                        points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="icon-tag">YouTube</span>
                </a>
              )}

            </div>

            {/* Direct Call to Salon - Slim Premium Button */}
            <a
              href={`tel:${CLIENT_CONFIG.directCallPhone}`}
              className="direct-call-btn"
              aria-label="Direct call to salon"
            >
              <span className="direct-call-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span className="direct-call-text">Direct Call to Salon</span>
              <span className="direct-call-shine" aria-hidden="true"></span>
            </a>

          </div>
        </div>

        {/* =========================================
            PREMIUM SALON PHOTO GALLERY
            12 STATIC IMAGES - NO API / NO URL LIST
            ========================================= */}

        <section className="cafe-gallery-section" aria-label="Salon photo gallery">

          <div className="gallery-heading">
            <span className="gallery-eyebrow">
              A GLIMPSE OF ICONIC
            </span>

            <h2 className="gallery-title">
              Explore Our Salon
            </h2>

            <p className="gallery-subtitle">
              Styles, looks & moments worth sharing
            </p>
          </div>

          <div
            className="gallery-slider"
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
            onTouchCancel={() => {
              galleryTouchStartXRef.current = 0;
            }}
          >

            <div
              className="gallery-track"
              style={{
                transform: `translateX(-${galleryIndex * 100}%)`,
              }}
            >
              {GALLERY_IMAGES.map((image, index) => (
                <div
                  className="gallery-slide"
                  key={`iconic-gallery-${index + 1}`}
                >
                  <div className="gallery-image-frame">
                    <Image
                      src={image}
                      alt={`Iconic Luxury Unisex Salon gallery photo ${index + 1}`}
                      fill
                      sizes="(max-width: 410px) 100vw, 410px"
                      quality={90}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                      style={{
                        objectFit: "contain",
                        padding: "7px",
                        boxSizing: "border-box",
                        userSelect: "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Slide */}
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={handleGalleryPrevious}
              aria-label="Previous gallery photo"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Next Slide */}
            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={handleGalleryNext}
              aria-label="Next gallery photo"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

          </div>

          {/* Gallery indicators */}
          <div className="gallery-bottom-controls">

            <div className="gallery-dots" aria-label="Gallery slides">
              {GALLERY_IMAGES.map((_, index) => (
                <button
                  key={`gallery-dot-${index + 1}`}
                  type="button"
                  className={`gallery-dot ${
                    galleryIndex === index ? "active" : ""
                  }`}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={galleryIndex === index ? "true" : undefined}
                />
              ))}
            </div>

            <span className="gallery-counter">
              {String(galleryIndex + 1).padStart(2, "0")}
              <span className="gallery-counter-divider"> / </span>
              {String(GALLERY_IMAGES.length).padStart(2, "0")}
            </span>

          </div>
        </section>

        {/* Map Card */}
        <div className="embedded-map-card">

          <a
            href={CLIENT_CONFIG.mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className="map-card-header-link"
          >
            <div className="address-highlight-box">
              <p className="agency-clean-address">
                <strong>📍 Address:</strong>{" "}
                {CLIENT_CONFIG.fullAddress}
              </p>
            </div>

            <div className="map-card-header">
              <span>Visit Us • {CLIENT_CONFIG.areaLabel}</span>
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
            Get Directions on Google Maps &rarr;
          </a>
        </div>

        {/* Mini Footer */}
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

      <style jsx global>{`

        /* =========================================
           ICONIC LUXURY SALON
           Colors bg.png se auto-generate hote hain.
           Neeche ke values sirf fallback hain
           (image load hone se pehle / fail hone par).
           ========================================= */

        :root {
          --c-page: #f3e3e1;
          --c-primary: #49312f;
          --c-primary-rgb: 73, 49, 47;
          --c-muted: #806b69;
          --c-accent: #c99a9d;
          --c-border: #ebd9d8;
          --c-surface: #fff8f6;
          --c-surface-rgb: 255, 248, 246;
          --c-soft: #f5e8e7;
          --c-on-bg-title: #49312f;
          --c-on-bg-sub: #806b69;
          --c-on-bg-accent: #c99a9d;
          --c-on-bg-shadow: rgba(255, 248, 246, 0.65);
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: var(--c-page) !important;
          min-height: 100% !important;
          overflow-x: hidden !important;
          transition: background 0.4s ease;
        }

        /* =========================================
           FIXED FULL BACKGROUND
           ========================================= */

        .fixed-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;

          background-color: var(--c-page);
          background-image: url('/bg.png');
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;

          z-index: 0;
          pointer-events: none;
        }

        .soft-luxury-viewport {
          position: relative;
          isolation: isolate;
          z-index: 1;
          min-height: 100vh;
          min-height: 100dvh;
          background: transparent;
          padding: 10px 16px 24px;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: var(--c-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .brand-medallion-badge {
          margin-top: 2px;
          margin-bottom: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-circle-container {
          width: 112px;
          height: 112px;
          border-radius: 30px;
          background-color: #000000;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow:
            0 10px 25px rgba(var(--c-primary-rgb), 0.16),
            0 3px 9px rgba(var(--c-primary-rgb), 0.08);
          margin-bottom: 8px;
          animation: floatLogo 3.5s ease-in-out infinite;
          border: 3px solid var(--c-accent);
          transition: transform 0.2s ease;
        }

        .logo-circle-container:active {
          transform: scale(0.96);
        }

        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-circle-container { animation: none; }
        }

        .brand-main-title {
          font-family: Georgia, serif;
          font-size: 16.5px;
          line-height: 1.25;
          font-weight: 800;
          color: var(--c-on-bg-title);
          margin: 0 0 4px;
          letter-spacing: 0.3px;
          text-shadow: 0 1px 2px var(--c-on-bg-shadow);
        }

        .brand-serif-subtitle {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 12.5px;
          color: var(--c-on-bg-sub);
          margin: 0 0 4px;
          text-shadow: 0 1px 2px var(--c-on-bg-shadow);
        }

        .royal-shahi-divider {
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
            var(--c-on-bg-accent),
            transparent
          );
        }

        .divider-gem {
          color: var(--c-on-bg-accent);
          font-size: 8px;
        }

        .stars-cluster {
          display: flex;
          gap: 4px;
          color: var(--c-on-bg-accent);
          font-size: 14px;
          margin-bottom: 2px;
          text-shadow: 0 1px 2px var(--c-on-bg-shadow);
        }

        .chip-hint {
          text-align: center;
          font-size: 11px;
          color: var(--c-on-bg-sub);
          margin: 0 0 8px;
          letter-spacing: 0.3px;
          text-shadow: 0 1px 2px var(--c-on-bg-shadow);
        }

        .experience-tracker-title {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--c-on-bg-title);
          text-transform: uppercase;
          margin: 0 0 8px;
          text-shadow: 0 1px 2px var(--c-on-bg-shadow);
        }

        .floating-pills-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 5px;
          margin: 0 auto 8px;
          width: 100%;
        }

        /* =========================================
           PREMIUM 3D FILTER CHIPS
           ========================================= */

        .embossed-pill {
          position: relative;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 11.5px;

          background: var(--c-surface);
          background: linear-gradient(
            145deg,
            var(--c-surface) 0%,
            var(--c-soft) 100%
          );

          color: var(--c-muted);
          border: 1px solid var(--c-border);

          cursor: pointer;

          box-shadow:
            0 4px 7px rgba(var(--c-primary-rgb), 0.10),
            0 1px 2px rgba(var(--c-primary-rgb), 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.95),
            inset 0 -1px 1px rgba(var(--c-primary-rgb), 0.08);

          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease;
        }

        .embossed-pill:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 10px rgba(var(--c-primary-rgb), 0.13),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);
        }

        .embossed-pill:active {
          transform: translateY(2px) scale(0.98);
          box-shadow:
            0 1px 3px rgba(var(--c-primary-rgb), 0.12),
            inset 0 2px 4px rgba(var(--c-primary-rgb), 0.10);
        }

        /* Selected chip */
        .embossed-pill.active {
          background: var(--c-primary);
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-primary) 82%, #ffffff) 0%,
            var(--c-primary) 100%
          );

          color: #ffffff;
          border: 1px solid var(--c-primary);

          box-shadow:
            0 5px 10px rgba(var(--c-primary-rgb), 0.25),
            0 2px 3px rgba(var(--c-primary-rgb), 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.22),
            inset 0 -2px 2px rgba(0, 0, 0, 0.18);
        }

        .embossed-pill.active:active {
          transform: translateY(2px);
          box-shadow:
            0 1px 3px rgba(var(--c-primary-rgb), 0.20),
            inset 0 2px 4px rgba(0, 0, 0, 0.18);
        }

        /* =========================================
           PREMIUM 3D LANGUAGE SELECTOR
           ========================================= */

        .capsule-lang-dock {
          display: inline-flex;
          background: var(--c-surface);
          background: linear-gradient(
            145deg,
            var(--c-surface),
            var(--c-soft)
          );

          border-radius: 999px;
          padding: 4px;
          gap: 3px;
          margin: 0 auto 12px;

          box-shadow:
            0 5px 12px rgba(var(--c-primary-rgb), 0.11),
            inset 0 1px 2px rgba(255, 255, 255, 0.95);

          border: 1px solid var(--c-border);
        }

        .capsule-lang-btn {
          position: relative;
          padding: 6px 19px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 10px;
          font-weight: 700;
          color: var(--c-muted);
          cursor: pointer;

          transition:
            transform 0.16s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .capsule-lang-btn.active {
          background: var(--c-primary);
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-primary) 82%, #ffffff),
            var(--c-primary)
          );

          color: #ffffff;
          border-color: var(--c-primary);

          box-shadow:
            0 4px 8px rgba(var(--c-primary-rgb), 0.23),
            inset 0 1px 1px rgba(255, 255, 255, 0.20),
            inset 0 -2px 2px rgba(0, 0, 0, 0.15);
        }

        .capsule-lang-btn:active {
          transform: translateY(2px);
        }

        /* =========================================
           REVIEW CARD
           ========================================= */

        .signature-review-box {
          width: 100%;
          background: rgba(var(--c-surface-rgb), 0.95);
          border-radius: 24px;
          padding: 18px;
          box-sizing: border-box;

          box-shadow:
            0 10px 28px rgba(var(--c-primary-rgb), 0.13);

          margin-bottom: 16px;
          text-align: left;

          border: 1px solid var(--c-border);
          border-top: 4px solid var(--c-accent);

          color: var(--c-primary);
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
          color: var(--c-muted);
          text-transform: uppercase;
        }

        .dot-ping {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--c-accent);
        }

        /* =========================================
           PREMIUM 3D REWRITE BUTTON
           ========================================= */

        .top-rewrite-btn {
          position: relative;
          display: inline-flex;
          align-items: center;

          padding: 6px 13px;
          border-radius: 999px;

          background: var(--c-soft);
          background: linear-gradient(
            145deg,
            var(--c-surface) 0%,
            var(--c-soft) 100%
          );

          border: 1px solid var(--c-border);
          color: var(--c-primary);

          font-size: 10.5px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 3px 6px rgba(var(--c-primary-rgb), 0.10),
            inset 0 1px 1px rgba(255, 255, 255, 0.95),
            inset 0 -1px 2px rgba(var(--c-primary-rgb), 0.10);

          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            background 0.18s ease;
        }

        .top-rewrite-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 5px 9px rgba(var(--c-primary-rgb), 0.14),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);
        }

        .top-rewrite-btn:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow:
            0 1px 2px rgba(var(--c-primary-rgb), 0.12),
            inset 0 2px 3px rgba(var(--c-primary-rgb), 0.15);
        }

        .top-rewrite-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .review-display-zone {
          min-height: 132px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 2px 8px;
        }

        .loader-shimmer-wrap {
          color: var(--c-muted);
          font-size: 12px;
          font-style: italic;
        }

        .review-body-text {
          font-family: Georgia, serif;
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--c-primary);
          margin: 0;
          width: 100%;
          white-space: pre-wrap;
        }

        .review-placeholder {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: var(--c-muted);
          margin: 0;
        }

        .review-error {
          font-size: 12px;
          color: #a33a43;
          margin: 0;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 13px;
          background: var(--c-primary);
          margin-left: 3px;
          vertical-align: middle;
          animation: blink 0.7s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .card-ornament-center {
          text-align: center;
          color: var(--c-accent);
          font-size: 7px;
          margin: 6px 0 10px;
        }

        /* =========================================
           PREMIUM 3D MAIN COPY BUTTON
           ========================================= */

        .full-luxury-copy-btn {
          position: relative;
          overflow: hidden;

          width: 100%;
          height: 50px;
          border-radius: 999px;

          background: var(--c-primary);
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-primary) 80%, #ffffff) 0%,
            var(--c-primary) 48%,
            color-mix(in srgb, var(--c-primary) 85%, #000000) 100%
          );

          border: 1px solid var(--c-primary);
          color: #ffffff;

          font-size: 12px;
          font-weight: 750;
          cursor: pointer;

          box-shadow:
            0 7px 13px rgba(var(--c-primary-rgb), 0.24),
            0 3px 5px rgba(var(--c-primary-rgb), 0.16),
            inset 0 1px 1px rgba(255, 255, 255, 0.23),
            inset 0 -2px 3px rgba(0, 0, 0, 0.20);

          transition:
            transform 0.16s ease,
            background 0.18s ease,
            box-shadow 0.16s ease,
            opacity 0.18s ease;
        }

        .full-luxury-copy-btn:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 10px 17px rgba(var(--c-primary-rgb), 0.27),
            0 4px 7px rgba(var(--c-primary-rgb), 0.16),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }

        .full-luxury-copy-btn:active:not(:disabled) {
          transform: translateY(2px);

          box-shadow:
            0 2px 4px rgba(var(--c-primary-rgb), 0.20),
            inset 0 3px 5px rgba(0, 0, 0, 0.20);
        }

        .full-luxury-copy-btn.copied {
          filter: brightness(0.85);
        }

        .full-luxury-copy-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .card-disclaimer-note {
          font-size: 9.5px;
          color: var(--c-muted);
          text-align: center;
          margin: 8px 0 0;
          font-style: italic;
        }

        /* =========================================
           QUICK ACTIONS CARD
           ========================================= */

        .quick-actions-card {
          width: 100%;
          background: rgba(var(--c-surface-rgb), 0.93);
          border-radius: 22px;
          padding: 18px 12px;
          box-sizing: border-box;

          border: 1px solid var(--c-border);

          box-shadow:
            0 8px 23px rgba(var(--c-primary-rgb), 0.11),
            inset 0 1px 1px rgba(255, 255, 255, 0.85);

          margin-bottom: 16px;
        }

        .soft-action-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .action-row-upper {
          display: flex;
          justify-content: center;
          gap: 14px;
          width: 100%;
        }

        .action-row-lower {
          display: flex;
          justify-content: center;
          gap: 14px;
          width: 100%;
        }

        /* =========================================
           PREMIUM 3D ACTION BUTTONS
           ========================================= */

        .soft-circle-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 7px;

          text-decoration: none !important;
          color: var(--c-muted);

          background: transparent;
          border: none;

          cursor: pointer;
          padding: 3px 4px 5px;

          -webkit-tap-highlight-color: transparent;

          transition:
            transform 0.18s ease,
            color 0.18s ease;
        }

        .soft-circle-action:hover {
          transform: translateY(-3px);
        }

        .soft-circle-action:active {
          transform: translateY(2px) scale(0.97);
        }

        .soft-circle-action:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 4px;
          border-radius: 14px;
        }

        .icon-disc {
          position: relative;

          width: 54px;
          height: 54px;
          border-radius: 50%;

          background: var(--c-soft);
          background: linear-gradient(
            145deg,
            var(--c-surface) 0%,
            var(--c-soft) 100%
          );

          display: grid;
          place-items: center;

          border: 1px solid var(--c-border);

          box-shadow:
            0 7px 12px rgba(var(--c-primary-rgb), 0.13),
            0 2px 4px rgba(var(--c-primary-rgb), 0.08),
            inset 0 2px 3px rgba(255, 255, 255, 0.95),
            inset 0 -2px 3px rgba(var(--c-primary-rgb), 0.10);

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        /* Soft inner highlight */
        .icon-disc::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 7px;
          right: 7px;
          height: 35%;
          border-radius: 50%;

          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.45),
            rgba(255, 255, 255, 0)
          );

          pointer-events: none;
        }

        /* Icon depth */
        .icon-disc svg {
          position: relative;
          z-index: 1;

          width: 21px;
          height: 21px;

          stroke: var(--c-primary);
          stroke-width: 1.8;

          filter: drop-shadow(
            0 1px 0 rgba(255, 255, 255, 0.65)
          );

          transition:
            stroke 0.18s ease,
            transform 0.18s ease;
        }

        .soft-circle-action:hover .icon-disc {
          transform: translateY(-2px);

          box-shadow:
            0 10px 16px rgba(var(--c-primary-rgb), 0.16),
            0 3px 5px rgba(var(--c-primary-rgb), 0.09),
            inset 0 2px 3px rgba(255, 255, 255, 0.95);
        }

        .soft-circle-action:active .icon-disc {
          transform: translateY(2px);

          box-shadow:
            0 2px 4px rgba(var(--c-primary-rgb), 0.13),
            inset 0 3px 5px rgba(var(--c-primary-rgb), 0.14);
        }

        .icon-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--c-muted);
          line-height: 1.3;
          white-space: nowrap;
          transition: color 0.18s ease;
        }

        /* WhatsApp */
        .whatsapp-disc:hover {
          background: linear-gradient(145deg, #42e486, #1aaf58);
          border-color: #169c4d;
          box-shadow:
            0 7px 14px rgba(37, 211, 102, 0.25),
            inset 0 2px 3px rgba(255, 255, 255, 0.35);
        }

        .whatsapp-disc:hover svg {
          stroke: #ffffff;
        }

        /* Call */
        .call-disc:hover {
          background: linear-gradient(145deg, #45a4ff, #0874d1);
          border-color: #0868bd;
          box-shadow:
            0 7px 14px rgba(0, 122, 255, 0.22),
            inset 0 2px 3px rgba(255, 255, 255, 0.35);
        }

        .call-disc:hover svg {
          stroke: #ffffff;
        }

        /* Contact and Website */
        .contact-disc:hover {
          background: var(--c-primary);
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-primary) 80%, #ffffff),
            var(--c-primary)
          );
          border-color: var(--c-primary);
          box-shadow:
            0 7px 14px rgba(var(--c-primary-rgb), 0.23),
            inset 0 2px 3px rgba(255, 255, 255, 0.28);
        }

        .contact-disc:hover svg {
          stroke: #ffffff;
        }

        /* Directions */
        .map-disc:hover {
          background: linear-gradient(145deg, #ff776b, #e34539);
          border-color: #cf382e;
          box-shadow:
            0 7px 14px rgba(234, 67, 53, 0.22),
            inset 0 2px 3px rgba(255, 255, 255, 0.30);
        }

        .map-disc:hover svg {
          stroke: #ffffff;
        }

        /* Instagram */
        .insta-disc:hover {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285AEB 90%
          );

          border-color: #d6249f;

          box-shadow:
            0 7px 14px rgba(214, 36, 159, 0.20),
            inset 0 2px 3px rgba(255, 255, 255, 0.30);
        }

        .insta-disc:hover svg {
          stroke: #ffffff;
        }

        /* WhatsApp Channel */
        .wa-channel-disc:hover {
          background: linear-gradient(145deg, #42e486, #1aaf58);
          border-color: #169c4d;
        }

        .wa-channel-disc:hover svg {
          stroke: #ffffff;
        }

        /* Facebook */
        .fb-disc:hover {
          background: linear-gradient(145deg, #4095ff, #1877f2);
          border-color: #1266cf;
          box-shadow:
            0 7px 14px rgba(24, 119, 242, 0.22),
            inset 0 2px 3px rgba(255, 255, 255, 0.30);
        }

        .fb-disc:hover svg {
          stroke: #ffffff;
        }

        /* YouTube */
        .yt-disc:hover {
          background: linear-gradient(145deg, #ff4848, #cc0000);
          border-color: #b00000;
          box-shadow:
            0 7px 14px rgba(255, 0, 0, 0.20),
            inset 0 2px 3px rgba(255, 255, 255, 0.30);
        }

        .yt-disc:hover svg {
          stroke: #ffffff;
          color: #ffffff;
        }

        /* =========================================
           DIRECT CALL TO SALON - SLIM PREMIUM BUTTON
           Color landing page theme (--c-accent) se
           aata hai, isliye bg.png ke saath match karta hai.
           ========================================= */

        .direct-call-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;

          width: 72%;
          max-width: 250px;
          height: 42px;
          border-radius: 999px;
          box-sizing: border-box;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          text-decoration: none !important;
          cursor: pointer;
          margin-top: 2px;

          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-accent) 38%, #ffffff) 0%,
            color-mix(in srgb, var(--c-accent) 70%, #ffffff) 55%,
            var(--c-accent) 100%
          );

          border: 1px solid color-mix(in srgb, var(--c-accent) 75%, var(--c-primary));
          color: var(--c-primary);

          box-shadow:
            0 6px 12px rgba(var(--c-primary-rgb), 0.16),
            0 2px 4px rgba(var(--c-primary-rgb), 0.10),
            inset 0 1px 1px rgba(255, 255, 255, 0.80),
            inset 0 -2px 3px rgba(var(--c-primary-rgb), 0.12);

          -webkit-tap-highlight-color: transparent;

          transition:
            transform 0.16s ease,
            filter 0.18s ease,
            box-shadow 0.18s ease;
        }

        /* Upar ki glossy highlight */
        .direct-call-btn::before {
          content: "";
          position: absolute;
          top: 2px;
          left: 14px;
          right: 14px;
          height: 38%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.55),
            rgba(255, 255, 255, 0)
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Soft shining sweep effect */
        .direct-call-shine {
          position: absolute;
          top: -20%;
          left: -60%;
          width: 34%;
          height: 140%;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.60) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-20deg);
          animation: directCallShine 3.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes directCallShine {
          0% { left: -60%; }
          55%, 100% { left: 130%; }
        }

        .direct-call-icon {
          position: relative;
          z-index: 3;

          width: 24px;
          height: 24px;
          border-radius: 50%;

          display: grid;
          place-items: center;

          background: var(--c-primary);
          background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--c-primary) 82%, #ffffff),
            var(--c-primary)
          );
          color: #ffffff;

          box-shadow:
            0 2px 4px rgba(var(--c-primary-rgb), 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.28);
        }

        .direct-call-icon svg {
          width: 12px;
          height: 12px;
          stroke: currentColor;
          animation: directCallRing 2.4s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes directCallRing {
          0%, 60%, 100% { transform: rotate(0deg); }
          66% { transform: rotate(-14deg); }
          72% { transform: rotate(12deg); }
          78% { transform: rotate(-10deg); }
          84% { transform: rotate(8deg); }
          90% { transform: rotate(0deg); }
        }

        .direct-call-text {
          position: relative;
          z-index: 3;

          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--c-primary);
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.50);
        }

        .direct-call-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
          box-shadow:
            0 9px 15px rgba(var(--c-primary-rgb), 0.19),
            0 3px 5px rgba(var(--c-primary-rgb), 0.10),
            inset 0 1px 1px rgba(255, 255, 255, 0.85);
        }

        .direct-call-btn:active {
          transform: translateY(2px) scale(0.985);
          box-shadow:
            0 2px 4px rgba(var(--c-primary-rgb), 0.16),
            inset 0 2px 4px rgba(var(--c-primary-rgb), 0.14);
        }

        .direct-call-btn:focus-visible {
          outline: 2px solid var(--c-primary);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .direct-call-btn,
          .direct-call-shine,
          .direct-call-icon svg {
            animation: none !important;
          }
        }

        /* =========================================
           PREMIUM SALON GALLERY
           ========================================= */

        .cafe-gallery-section {
          width: 100%;
          box-sizing: border-box;
          padding: 17px 13px 14px;
          margin: 0 0 16px;

          background: rgba(var(--c-surface-rgb), 0.94);
          border: 1px solid var(--c-border);
          border-radius: 22px;

          box-shadow:
            0 9px 24px rgba(var(--c-primary-rgb), 0.11),
            inset 0 1px 1px rgba(255, 255, 255, 0.85);

          overflow: hidden;
        }

        .gallery-heading {
          text-align: center;
          margin: 0 0 13px;
        }

        .gallery-eyebrow {
          display: inline-block;
          color: var(--c-muted);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .gallery-title {
          font-family: Georgia, serif;
          color: var(--c-primary);
          font-size: 21px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 5px;
        }

        .gallery-subtitle {
          color: var(--c-muted);
          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
          line-height: 1.4;
          margin: 0;
        }

        .gallery-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 17px;
          background: var(--c-soft);

          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .gallery-track {
          display: flex;
          width: 100%;

          transition: transform 650ms cubic-bezier(
            0.22,
            1,
            0.36,
            1
          );

          will-change: transform;
        }

        .gallery-slide {
          flex: 0 0 100%;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }

        /*
          All photos use the same 4:3 frame.
          object-fit: contain keeps the complete image visible.
          Portrait and landscape images will not be cropped.
        */

        .gallery-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          min-height: 210px;
          max-height: 290px;

          overflow: hidden;
          border-radius: 17px;

          background: var(--c-soft);
          background: linear-gradient(
            145deg,
            var(--c-surface) 0%,
            var(--c-soft) 100%
          );

          border: 1px solid var(--c-border);

          box-shadow:
            0 4px 12px rgba(var(--c-primary-rgb), 0.09),
            inset 0 1px 2px rgba(255, 255, 255, 0.9);
        }

        .gallery-image-frame img {
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Subtle previous / next controls */

        .gallery-arrow {
          position: absolute;
          z-index: 2;
          top: 50%;
          transform: translateY(-50%);

          width: 34px;
          height: 34px;
          border-radius: 50%;

          display: grid;
          place-items: center;

          background: rgba(var(--c-surface-rgb), 0.91);
          color: var(--c-primary);
          border: 1px solid var(--c-border);

          box-shadow:
            0 3px 9px rgba(var(--c-primary-rgb), 0.18),
            inset 0 1px 1px rgba(255, 255, 255, 0.95);

          cursor: pointer;

          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;

          -webkit-tap-highlight-color: transparent;
        }

        .gallery-arrow-left {
          left: 8px;
        }

        .gallery-arrow-right {
          right: 8px;
        }

        .gallery-arrow:hover {
          background: #ffffff;
          box-shadow: 0 5px 12px rgba(var(--c-primary-rgb), 0.22);
        }

        .gallery-arrow:active {
          transform: translateY(-50%) scale(0.91);
        }

        .gallery-arrow:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 3px;
        }

        .gallery-bottom-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
          min-height: 12px;
        }

        .gallery-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .gallery-dot {
          appearance: none;
          -webkit-appearance: none;

          width: 6px;
          height: 6px;
          min-width: 6px;

          padding: 0;
          border: 0;
          border-radius: 999px;

          background: var(--c-border);
          cursor: pointer;

          transition:
            width 350ms ease,
            background 250ms ease,
            box-shadow 250ms ease;
        }

        .gallery-dot.active {
          width: 19px;
          background: var(--c-primary);
          box-shadow: 0 2px 5px rgba(var(--c-primary-rgb), 0.20);
        }

        .gallery-counter {
          color: var(--c-muted);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
          font-variant-numeric: tabular-nums;
        }

        .gallery-counter-divider {
          color: var(--c-accent);
          padding: 0 2px;
        }

        /* =========================================
           MAP CARD
           ========================================= */

        .embedded-map-card {
          width: 100%;
          background: rgba(var(--c-surface-rgb), 0.95);
          border-radius: 22px;
          padding: 14px 16px;
          box-sizing: border-box;

          border: 1px solid var(--c-border);

          box-shadow:
            0 7px 20px rgba(var(--c-primary-rgb), 0.09);

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
          color: var(--c-primary);

          margin-bottom: 8px;
        }

        .map-iframe-container {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--c-border);
          margin-bottom: 8px;
        }

        .map-directions-link {
          font-size: 11px;
          font-weight: 750;
          color: var(--c-muted);
          text-decoration: none;
          display: block;
          text-align: center;
          margin-bottom: 8px;
        }

        .address-highlight-box {
          background: var(--c-soft);
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid var(--c-border);
          margin-bottom: 8px;
        }

        .agency-clean-address {
          font-size: 10.5px;
          color: var(--c-muted);
          margin: 0;
          line-height: 1.4;
          text-align: center;
        }

        /* =========================================
           MINI FOOTER
           ========================================= */

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

          padding: 5px 12px;

          border: 1px solid var(--c-border);
          border-radius: 999px;
          background: rgba(var(--c-surface-rgb), 0.94);

          font-size: 8.5px;
          letter-spacing: 0.3px;
          color: var(--c-muted);
          line-height: 1.4;
        }

        .mini-footer-pill strong {
          color: var(--c-primary);
          font-weight: 700;
        }

        .mini-footer-dot {
          color: var(--c-accent);
        }

        .mini-footer-pill a {
          color: var(--c-primary);
          font-weight: 700;
          text-decoration: none;
        }

        /* =========================================
           RESPONSIVE GALLERY
           ========================================= */

        @media (max-width: 360px) {
          .cafe-gallery-section {
            padding: 14px 10px 12px;
          }

          .gallery-title {
            font-size: 19px;
          }

          .gallery-image-frame {
            min-height: 190px;
          }

          .gallery-arrow {
            width: 30px;
            height: 30px;
          }

          .gallery-dots {
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track {
            transition: none;
          }

          .gallery-dot,
          .gallery-arrow {
            transition: none;
          }
        }

        /* =========================================
           ACCESSIBILITY & MOBILE TOUCH
           ========================================= */

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--c-accent);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>
    </main>
  );
}
