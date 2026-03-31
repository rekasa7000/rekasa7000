"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function detectBrowser(ua: string): string {
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
}

function detectOS(ua: string): string {
  if (ua.includes("Windows NT 10") || ua.includes("Windows NT 11")) return "Windows 10/11";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS X")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Unknown OS";
}

function pad(label: string, width = 20): string {
  return label.padEnd(width, ".");
}

export function VisitorScan() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<{ text: string; highlight?: boolean }[]>([]);
  const [cleared, setCleared] = useState(false);

  const dismiss = () => setVisible(false);

  useEffect(() => {
    if (sessionStorage.getItem("visitor-scanned")) return;
    sessionStorage.setItem("visitor-scanned", "1");

    setVisible(true);

    const ua = navigator.userAgent;
    const browser = detectBrowser(ua);
    const os = detectOS(ua);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const lang = navigator.language;
    const res = `${screen.width}×${screen.height}`;
    const cores = navigator.hardwareConcurrency ?? "?";

    const initialLines: { text: string; highlight?: boolean }[] = [
      { text: "> REKASA7000 SECURITY PROTOCOL v2.0" },
      { text: "> INITIATING VISITOR SCAN..." },
      { text: "> " },
      { text: `> ${pad("BROWSER")}${browser}` },
      { text: `> ${pad("OPERATING SYSTEM")}${os}` },
      { text: `> ${pad("TIMEZONE")}${tz}` },
      { text: `> ${pad("LOCAL TIME")}${localTime}` },
      { text: `> ${pad("LANGUAGE")}${lang}` },
      { text: `> ${pad("RESOLUTION")}${res}` },
      { text: `> ${pad("CPU CORES")}${cores}` },
      { text: "> " },
      { text: "> SCANNING NETWORK..." },
      { text: "> FETCHING LOCATION..." },
    ];

    let i = 0;
    const reveal = () => {
      if (i < initialLines.length) {
        const line = initialLines[i];
        setLines((prev) => [...prev, line]);
        i++;
        setTimeout(reveal, i < 3 ? 300 : 120);
      } else {
        // Fetch location
        fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .then((data) => {
            const city = data.city ?? "UNKNOWN";
            const country = data.country_name ?? "UNKNOWN";
            const isp = data.org ?? "UNKNOWN ISP";

            setLines((prev) => [
              ...prev,
              { text: `> ${pad("LOCATION")}${city}, ${country}` },
              { text: `> ${pad("NETWORK")}${isp.slice(0, 30)}` },
              { text: "> " },
              { text: "> ────────────────────────────────────" },
              { text: "> THREAT LEVEL..........NONE" },
              { text: "> CLEARANCE.............GRANTED", highlight: true },
              { text: "> ────────────────────────────────────" },
              { text: "> " },
              {
                text: `> WELCOME, ${browser.toUpperCase()} USER FROM ${city.toUpperCase()}.`,
                highlight: true,
              },
            ]);
            setCleared(true);
            setTimeout(() => setVisible(false), 3500);
          })
          .catch(() => {
            setLines((prev) => [
              ...prev,
              { text: "> LOCATION..........CLASSIFIED" },
              { text: "> " },
              { text: "> ────────────────────────────────────" },
              { text: "> THREAT LEVEL..........NONE" },
              { text: "> CLEARANCE.............GRANTED", highlight: true },
              { text: "> ────────────────────────────────────" },
              { text: "> " },
              { text: `> WELCOME, ${browser.toUpperCase()} USER.`, highlight: true },
            ]);
            setCleared(true);
            setTimeout(() => setVisible(false), 3500);
          });
      }
    };

    const timer = setTimeout(reveal, 400);

    const onKey = () => setVisible(false);
    window.addEventListener("keydown", onKey, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center cursor-pointer select-none"
          style={{ backgroundColor: "rgba(0,0,0,0.97)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={dismiss}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 3px)",
            }}
          />

          <div className="relative w-full max-w-xl px-8 py-6">
            {/* Header bar */}
            <div
              className="flex items-center gap-2 mb-4 pb-2 border-b text-xs tracking-widest"
              style={{ borderColor: "rgba(0,255,65,0.2)", color: "rgba(0,255,65,0.4)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
              <span className="ml-2">security_scan.sh — bash</span>
            </div>

            {/* Lines */}
            <div className="space-y-0.5 font-mono text-xs md:text-sm">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    color: line.highlight
                      ? "#00ff41"
                      : line.text.includes("────")
                        ? "rgba(0,255,65,0.3)"
                        : "rgba(0,255,65,0.7)",
                    textShadow: line.highlight ? "0 0 12px rgba(0,255,65,0.6)" : "none",
                    fontWeight: line.highlight ? "600" : "normal",
                  }}
                >
                  {line.text || "\u00a0"}
                </motion.div>
              ))}
            </div>

            {/* Dismiss hint */}
            {cleared && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-xs font-mono"
                style={{ color: "rgba(0,255,65,0.4)" }}
              >
                press any key or click to continue
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
