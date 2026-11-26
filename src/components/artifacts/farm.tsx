"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CloudRain,
  Flame,
  Lock,
  Moon,
  Rocket,
  RotateCcw,
  ShoppingBasket,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Wrench,
  X,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { BADGES, CROPS, UPGRADES } from "./farm-game/data";
import { createGame, type GameApi } from "./farm-game/engine";
import { CHAPTERS, SPEAKER_NAME } from "./farm-game/story";
import type { Hud } from "./farm-game/types";

/**
 * Carlos's space farm. Grow crops on a small island floating in space, fill the rocket's order
 * before its timer runs out, and keep slugs, UFOs and meteors off the field.
 * The game itself lives in ./farm-game; this file is the panel around the canvas.
 */

const icon = (name: string) => ({
  backgroundImage: `url(/images/farm/${name}.webp)`,
});

export function Farm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<GameApi | null>(null);
  const toastId = useRef(0);
  const [hud, setHud] = useState<Hud | null>(null);
  const [shop, setShop] = useState(false);
  const [journal, setJournal] = useState(false);
  // the chapter on screen; `replay` means it was opened from the journal and unlocks nothing
  const [story, setStory] = useState<{
    chapter: number;
    line: number;
    replay: boolean;
  } | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const game = createGame(canvas, wrap, {
      onHud: setHud,
      onToast: (text) => {
        toastId.current += 1;
        setToast({ id: toastId.current, text });
      },
      onShop: () => setShop(true),
      onStory: (chapter) => setStory({ chapter, line: 0, replay: false }),
    });
    api.current = game;
    return () => {
      game.destroy();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setPaused(shop || journal || !!story);
  }, [shop, journal, story]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const reset = () => {
    if (
      window.confirm(
        "Start over? Your launches, coins and upgrades will be cleared.",
      )
    )
      api.current?.reset();
  };

  const endStory = () => {
    if (story && !story.replay) api.current?.storyDone();
    setStory(null);
  };
  const nextLine = () => {
    if (!story) return;
    if (story.line + 1 >= CHAPTERS[story.chapter].lines.length) endStory();
    else setStory({ ...story, line: story.line + 1 });
  };
  const line = story ? CHAPTERS[story.chapter].lines[story.line] : null;
  const overlay = shop || journal || !!story;

  const order = hud?.order;
  const urgent = !!order && order.total > 0 && order.time < 15;

  return (
    <div className="farm-root">
      <div className="farm-top">
        {hud && (
          <>
            <div className="farm-stats">
              <span className="chip farm-chip" data-active="true" title="Coins">
                <span className="farm-coin" aria-hidden="true" /> {hud.coins}
              </span>
              <span
                className="chip farm-chip"
                title="Crops in your basket"
                data-full={hud.bag >= hud.cap}
              >
                <ShoppingBasket className="w-3.5 h-3.5" /> {hud.bag}/{hud.cap}
              </span>
              <span className="chip farm-chip" title="Rockets launched">
                <Rocket className="w-3.5 h-3.5" /> {hud.launches}
              </span>
              {hud.streak > 1 && (
                <span
                  className="chip farm-chip"
                  title="On-time launches in a row: each one adds 10% to your coins"
                >
                  <Flame
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--accent)" }}
                  />{" "}
                  ×{hud.streak}
                </span>
              )}
              <span
                className="chip farm-chip"
                title={hud.night ? "Night" : "Day"}
              >
                {hud.shower ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : hud.rain ? (
                  <CloudRain className="w-3.5 h-3.5" />
                ) : hud.night ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}
                {hud.day}
              </span>
            </div>
            <div className="farm-tools">
              <button
                className="farm-tool"
                onClick={() => setJournal(true)}
                aria-label="Story so far"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                className="farm-tool"
                onClick={() => setShop(true)}
                aria-label="Upgrades"
              >
                <Wrench className="w-4 h-4" />
              </button>
              <button
                className="farm-tool"
                onClick={() => api.current?.setMuted(!hud.muted)}
                aria-label={hud.muted ? "Turn sound on" : "Turn sound off"}
              >
                {hud.muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <button
                className="farm-tool"
                onClick={reset}
                aria-label="Start over"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="farm-order" data-urgent={urgent}>
        {hud && order ? (
          <>
            <span className="meta-label farm-order-label">
              <Rocket className="w-3.5 h-3.5" /> Order
            </span>
            <div className="farm-order-items">
              {order.items.map((item) => (
                <span
                  key={item.id}
                  className="farm-want"
                  data-done={item.got >= item.need}
                  data-have={item.have > 0}
                >
                  <span
                    className="farm-ico"
                    style={icon(`${item.id}-ripe`)}
                    aria-hidden="true"
                  />
                  {item.got >= item.need ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span>
                      {item.got}/{item.need}
                    </span>
                  )}
                </span>
              ))}
            </div>
            {order.total > 0 ? (
              <span
                className="farm-timer"
                aria-label={`${Math.ceil(order.time)} seconds left`}
              >
                <span className="farm-timer-bar">
                  <span
                    style={{
                      width: `${Math.max(0, (order.time / order.total) * 100)}%`,
                    }}
                  />
                </span>
                <span className="farm-timer-num">
                  {Math.max(0, Math.ceil(order.time))}s
                </span>
              </span>
            ) : (
              <span className="farm-timer-num farm-timer-free">no timer</span>
            )}
          </>
        ) : (
          <span className="meta-label farm-order-label">
            <Rocket className="w-3.5 h-3.5" />{" "}
            {hud
              ? `Rocket back in ${Math.max(1, Math.ceil(hud.eta))}s`
              : "Loading"}
          </span>
        )}
      </div>

      <div ref={wrapRef} className="farm-stage">
        <canvas
          ref={canvasRef}
          className="farm-canvas"
          aria-label="The farm. Tap a tile to send Carlos there."
        />
        {hud?.intro && !overlay && (
          <button
            className="farm-nova"
            data-ready={hud.power >= 100}
            onClick={() => api.current?.nova()}
            aria-label={
              hud.power >= 100
                ? "Use star power"
                : `Star power ${Math.floor(hud.power)}%`
            }
            style={{ "--p": `${hud.power}%` } as React.CSSProperties}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        )}
        {toast && (
          <div key={toast.id} className="farm-toast" role="status">
            {toast.text}
          </div>
        )}
        {hud?.intro && hud.hint && !overlay && (
          <p className="farm-hint" aria-live="polite">
            {hud.hint}
          </p>
        )}

        {hud && !hud.intro && (
          <div
            className="farm-shop farm-intro"
            role="dialog"
            aria-label="How to play"
          >
            <p className="font-display text-2xl mb-1">
              Carlos&apos;s space farm
            </p>
            <p className="font-accent mb-4" style={{ opacity: 0.8 }}>
              Grow it, load it, launch it.
            </p>
            <ul className="farm-rules">
              <li>
                <span
                  className="farm-ico"
                  style={icon("sprout")}
                  aria-hidden="true"
                />
                Tap the field to plant. Drag to do a whole row.
              </li>
              <li>
                <span
                  className="farm-ico"
                  style={icon("carrot-ripe")}
                  aria-hidden="true"
                />
                Harvest when crops sparkle, and water the thirsty ones.
              </li>
              <li>
                <Rocket className="w-5 h-5" />
                Load the rocket&apos;s order before its timer ends.
              </li>
              <li>
                <Sparkles className="w-5 h-5" />
                Chase off slugs and UFOs, dodge meteors, fish in the pond.
              </li>
            </ul>
            <button className="farm-play" onClick={() => api.current?.start()}>
              Play
            </button>
          </div>
        )}

        {story && line && (
          <div
            className="farm-story"
            role="dialog"
            aria-label={`Chapter ${story.chapter + 1}`}
            onClick={nextLine}
          >
            <div className="farm-story-box" data-who={line.who}>
              <p className="meta-label farm-story-chapter">
                Chapter {story.chapter + 1} · {CHAPTERS[story.chapter].title}
              </p>
              <div className="farm-story-row">
                {line.who === "carlos" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="farm-face"
                    src={`/images/carlos/${line.pose ?? "sitting"}.webp`}
                    alt=""
                  />
                )}
                {line.who === "radio" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="farm-face farm-face-radio"
                    src="/logo.svg"
                    alt=""
                  />
                )}
                {line.who === "queen" && (
                  <span
                    className="farm-face farm-face-queen"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 flex-1">
                  {SPEAKER_NAME[line.who] && (
                    <p className="farm-story-name">{SPEAKER_NAME[line.who]}</p>
                  )}
                  <p
                    key={`${story.chapter}-${story.line}`}
                    className="farm-story-text"
                  >
                    {line.text}
                  </p>
                </div>
              </div>
              <div className="farm-story-foot">
                <button
                  className="farm-story-skip"
                  onClick={(e) => {
                    e.stopPropagation();
                    endStory();
                  }}
                >
                  Skip
                </button>
                <span className="farm-story-next">
                  {story.line + 1}/{CHAPTERS[story.chapter].lines.length}{" "}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {journal && hud && (
          <div className="farm-shop" role="dialog" aria-label="Story so far">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xl">The story so far</span>
              <button
                className="farm-x"
                onClick={() => setJournal(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {CHAPTERS.map((ch, i) =>
                i < hud.chapter ? (
                  <button
                    key={ch.title}
                    className="farm-row farm-chapter"
                    onClick={() => {
                      setJournal(false);
                      setStory({ chapter: i, line: 0, replay: true });
                    }}
                  >
                    <span className="farm-chapter-num">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold">
                        {ch.title}
                      </span>
                      <span className="block text-xs" style={{ opacity: 0.75 }}>
                        {ch.summary}
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 flex-none" />
                  </button>
                ) : (
                  <div
                    key={ch.title}
                    className="farm-row farm-chapter"
                    style={{ opacity: 0.5 }}
                  >
                    <span className="farm-chapter-num">
                      <Lock className="w-3 h-3" />
                    </span>
                    <span className="text-sm">
                      Chapter {i + 1} unlocks at launch {ch.at}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {shop && hud && (
          <div className="farm-shop" role="dialog" aria-label="Upgrades">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xl">Upgrades</span>
              <button
                className="farm-x"
                onClick={() => setShop(false)}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p
              className="text-xs mb-3 flex items-center gap-1.5"
              style={{ opacity: 0.8 }}
            >
              <span className="farm-coin" aria-hidden="true" /> {hud.coins}{" "}
              coins. The game is paused.
            </p>
            <div className="space-y-2">
              {UPGRADES.map((u) => {
                const level = hud.up[u.id];
                const cost = u.costs[level];
                return (
                  <div key={u.id} className="farm-row">
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold">
                        {u.name}
                      </span>
                      <span className="block text-xs" style={{ opacity: 0.75 }}>
                        {u.desc}
                      </span>
                      <span
                        className="farm-pips"
                        aria-label={`Level ${level} of ${u.costs.length}`}
                      >
                        {u.costs.map((_, i) => (
                          <i key={i} data-on={i < level} />
                        ))}
                      </span>
                    </span>
                    {cost === undefined ? (
                      <span className="text-xs font-semibold">Max</span>
                    ) : (
                      <button
                        className="farm-buy"
                        disabled={hud.coins < cost}
                        onClick={() => api.current?.buy(u.id)}
                      >
                        {cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="meta-label mt-4 mb-2">
              Badges {BADGES.filter((_, i) => hud.badges & (1 << i)).length}/
              {BADGES.length}
            </p>
            <div className="farm-badges">
              {BADGES.map((b, i) => (
                <span
                  key={b.name}
                  className="farm-badge"
                  data-on={!!(hud.badges & (1 << i))}
                  title={b.desc}
                >
                  {b.name}
                  <small>{b.desc}</small>
                </span>
              ))}
            </div>
            {hud.best > 1 && (
              <p className="text-xs mt-3" style={{ opacity: 0.75 }}>
                Best streak: {hud.best} on-time launches.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="farm-seeds" role="radiogroup" aria-label="Seed to plant">
        {hud &&
          CROPS.map((c) => {
            const locked = c.unlock > hud.launches;
            return (
              <button
                key={c.id}
                role="radio"
                aria-checked={hud.selected === c.id}
                className="farm-seed"
                data-active={hud.selected === c.id}
                disabled={locked}
                onClick={() => api.current?.select(c.id)}
                title={
                  locked
                    ? `Unlocks at launch ${c.unlock}`
                    : `${c.name}: ripe in ${c.grow}s, sells for ${c.sell}`
                }
              >
                <span
                  className="farm-ico"
                  style={icon(`${c.id}-ripe`)}
                  aria-hidden="true"
                />
                <span className="farm-seed-text">
                  <span className="farm-seed-name">{c.name}</span>
                  <span className="farm-seed-cost">
                    {locked ? (
                      <>
                        <Lock className="w-3 h-3" /> launch {c.unlock}
                      </>
                    ) : c.cost === 0 ? (
                      "free"
                    ) : (
                      <>
                        <span className="farm-coin" aria-hidden="true" />{" "}
                        {c.cost}
                      </>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
