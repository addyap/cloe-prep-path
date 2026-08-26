import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

/**
 * Meridian — the signature hero.
 * Four living light-strands (the four CLOE skills) rise through six CEFR rungs
 * (A1 → C2) and braid into a single ignited point: the certificate.
 *
 * The stage is a committed dark "night-to-dawn" world in both site themes.
 * The canvas is decorative (aria-hidden); the headline is real SSR text.
 * Honours prefers-reduced-motion — the animation resolves to its final frame.
 */

const SERIF = '"Fraunces","Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif';
const MONO = '"Space Mono",ui-monospace,"SF Mono",Menlo,monospace';

// four skill hues, cool → warm, resolving toward the terracotta flame
const SKILLS = [
  { name: "Listening", c: [63, 111, 134] as const },
  { name: "Reading", c: [74, 154, 151] as const },
  { name: "Writing", c: [207, 154, 78] as const },
  { name: "Speaking", c: [208, 106, 60] as const },
];

export function MeridianHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  // pointer bias (-1..1) and per-strand hover brightness targets, held in refs
  // so the animation loop never triggers React re-renders.
  const pointer = useRef({ x: 0, y: 0 });
  const bright = useRef(SKILLS.map(() => ({ v: 0, t: 0 })));

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let W = 0,
      H = 0,
      DPR = 1;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const ease = (x: number) => 1 - Math.pow(1 - x, 3);

    // one strand's point at param t (0 = base, 1 = summit)
    const pt = (i: number, t: number, time: number): [number, number] => {
      const spread = Math.min(W * 0.34, 320);
      const baseX = W * 0.62 + (i - 1.5) * (spread / 3);
      const baseY = H * 0.94;
      const sumX = W * 0.62 + pointer.current.x * 26 * (1 - t); // cursor lean, strongest at base
      const sumY = H * 0.24;
      const x0 = baseX + (sumX - baseX) * t;
      const y0 = baseY + (sumY - baseY) * t;
      const amp = (34 + i * 7) * Math.pow(1 - t, 1.5);
      const w =
        Math.sin(t * 3.1 + time * 0.0011 + i * 1.7) * amp +
        Math.sin(t * 6.2 - time * 0.0007 + i) * amp * 0.4;
      return [x0 + w, y0];
    };

    const labels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const t0 = performance.now();
    const DUR = 2600;
    let sealE = 0;
    let raf = 0;

    const frame = (now: number) => {
      const el = now - t0;
      const prog = reduce ? 1 : Math.min(el / DUR, 1);
      const time = now;

      ctx.clearRect(0, 0, W, H);

      // ---- CEFR rungs ----
      const rungP = reduce ? 1 : ease(Math.min(el / 1500, 1));
      for (let r = 0; r < 6; r++) {
        const ry = H * 0.9 - r * ((H * 0.62) / 5);
        const appear = Math.max(0, Math.min(1, rungP * 6 - r));
        if (appear <= 0) continue;
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `rgba(180,205,214,${0.16 * appear})`;
        ctx.lineWidth = 1;
        const x1 = W * 0.34,
          x2 = W * 0.9;
        ctx.beginPath();
        ctx.moveTo(x1, ry);
        ctx.lineTo(x1 + (x2 - x1) * appear, ry);
        ctx.stroke();
        ctx.font = `11px ${MONO}`;
        ctx.fillStyle = `rgba(200,220,228,${0.5 * appear})`;
        ctx.fillText(labels[r], x1 - 26, ry + 4);
      }

      ctx.globalCompositeOperation = "lighter";

      // ---- strands ----
      const N = 46;
      for (let i = 0; i < SKILLS.length; i++) {
        const b = bright.current[i];
        b.v += (b.t - b.v) * 0.08;
        const grow = reduce
          ? 1
          : ease(Math.min(Math.max((el - 200 - i * 160) / 1500, 0), 1));
        if (grow <= 0) continue;
        const [r, g, bl] = SKILLS[i].c;
        const passes: Array<[number, number]> = [
          [9, 0.06],
          [4, 0.16],
          [1.6, 0.55],
        ];
        for (const [lw, al] of passes) {
          ctx.lineWidth = lw * (1 + b.v * 0.6);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${(al + b.v * 0.25) * (0.5 + 0.5 * grow)})`;
          ctx.beginPath();
          for (let s = 0; s <= N; s++) {
            const t = (s / N) * grow;
            const [x, y] = pt(i, t, time);
            s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // ---- "you" mote travelling the braid ----
      const moteT = reduce ? 1 : Math.min(Math.max((el - 1500) / 900, 0), 1);
      if (moteT > 0) {
        const et = ease(moteT);
        const braid = (tt: number): [number, number] => {
          let ax = 0,
            ay = 0;
          for (let i = 0; i < SKILLS.length; i++) {
            const [x, y] = pt(i, tt, time);
            ax += x;
            ay += y;
          }
          return [ax / SKILLS.length, ay / SKILLS.length];
        };
        for (let k = 6; k >= 0; k--) {
          const [ax, ay] = braid(Math.max(0, et - k * 0.03));
          ctx.beginPath();
          ctx.fillStyle = `rgba(240,180,120,${0.1 * (1 - k / 7)})`;
          ctx.arc(ax, ay, 7 - k * 0.6, 0, 7);
          ctx.fill();
        }
        const [mx, my] = braid(et);
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,210,160,0.95)";
        ctx.arc(mx, my, 3.4, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,160,90,0.35)";
        ctx.arc(mx, my, 9, 0, 7);
        ctx.fill();
        if (moteT >= 1) sealE = Math.min(sealE + 0.03, 1);
      }

      // ---- summit seal ----
      const sx = W * 0.62 + pointer.current.x * 4;
      const sy = H * 0.24;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.002);
      const e = reduce ? 1 : sealE;
      if (e > 0) {
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 120 * (0.6 + 0.4 * e));
        grd.addColorStop(0, `rgba(255,200,150,${0.55 * e})`);
        grd.addColorStop(0.4, `rgba(224,130,70,${0.28 * e})`);
        grd.addColorStop(1, "rgba(224,130,70,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(sx - 160, sy - 160, 320, 320);
        ctx.strokeStyle = `rgba(255,210,160,${(0.5 + 0.3 * pulse) * e})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(sx, sy, 26 + pulse * 3, 0, 7);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,190,130,${0.25 * e})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 40 + pulse * 5, 0, 7);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,235,210,${0.9 * e})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 5.5, 0, 7);
        ctx.fill();
      }

      // ---- ambient motes ----
      if (!reduce && prog > 0.8) {
        for (let m = 0; m < 14; m++) {
          const seed = m * 97.13;
          const my = H - ((time * 0.012 + seed * 30) % (H * 0.8));
          const mx =
            W * 0.4 + ((seed * 53) % (W * 0.5)) + Math.sin(time * 0.0006 + seed) * 14;
          ctx.beginPath();
          ctx.fillStyle = `rgba(210,225,230,${0.05 + 0.05 * Math.sin(time * 0.001 + seed)})`;
          ctx.arc(mx, my, 1.1, 0, 7);
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    if (reduce) requestAnimationFrame(frame); // one settled frame

    const onMove = (ev: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointer.current.x = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.current.y = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const setBright = (i: number, on: boolean) => {
    bright.current.forEach((b, j) => (b.t = on ? (j === i ? 1 : -0.6) : 0));
  };

  return (
    <div
      ref={stageRef}
      className="mh-stage relative isolate overflow-hidden h-[100svh] min-h-[600px] max-h-[880px] text-[#f4efe6]"
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="mh-grain" aria-hidden />
      <div className="mh-vign" aria-hidden />

      {/* stage nav */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 md:px-14 py-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold">
          <span className="mh-seal" aria-hidden />
          CLOE&nbsp;Prep
        </Link>
        <nav aria-label="Main" className="flex items-center gap-5 sm:gap-7 text-sm">
          <Link to="/pricing" className="hidden sm:block text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full bg-accent px-4 py-2 font-semibold text-accent-foreground shadow-[0_6px_22px_-6px_rgba(197,106,55,0.7)] hover:brightness-105 transition"
          >
            Get started
          </Link>
        </nav>
      </div>

      {/* hero copy */}
      <div className="mh-copy absolute z-10 left-5 sm:left-8 md:left-14 bottom-[clamp(64px,13vh,120px)] max-w-[min(640px,84vw)]">
        <p
          className="mh-rise mh-d1 flex items-center gap-3 text-[12px] uppercase tracking-[0.28em] text-[#eaa16f] mb-4"
          style={{ fontFamily: MONO }}
        >
          <span className="h-px w-8 bg-[#eaa16f]/70" /> The CLOE English Certification
        </p>
        <h1
          className="mh-rise mh-d2 m-0 text-[#f7f2ea] font-medium tracking-[-0.02em] leading-[0.96] text-[clamp(46px,8.5vw,104px)] text-balance"
          style={{ fontFamily: SERIF }}
        >
          Rise to
          <br />
          <em className="not-italic font-normal" style={{ fontStyle: "italic", color: "#f0b184" }}>
            CLOE&#8209;ready.
          </em>
        </h1>
        <p className="mh-rise mh-d3 mt-6 max-w-[34em] text-[clamp(15px,1.7vw,19px)] leading-[1.55] text-[#eeebe4]/80">
          Four skills &mdash; listening, reading, writing, speaking &mdash; braided into a single
          climb from the level you&rsquo;re at to the day you pass.
        </p>
        <div className="mh-rise mh-d4 mt-8 flex flex-wrap items-center gap-3.5">
          <Link
            to="/dashboard"
            className="mh-cta group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-[0_14px_40px_-12px_rgba(197,106,55,0.85)]"
          >
            Start climbing
            <span className="mh-arr transition-transform group-hover:translate-x-1.5">&rarr;</span>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-6 py-3.5 font-semibold text-[#f4efe6] hover:border-white/60 hover:bg-white/10 transition"
          >
            Watch a level
          </Link>
        </div>
      </div>

      {/* skill legend — hover to isolate a strand */}
      <div className="mh-rise mh-d3 absolute z-10 right-5 sm:right-8 md:right-14 bottom-[clamp(64px,13vh,120px)] hidden md:flex flex-col items-end gap-2.5 text-right">
        <span className="mb-1 text-[10.5px] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: MONO }}>
          The four strands
        </span>
        {SKILLS.map((s, i) => (
          <button
            key={s.name}
            type="button"
            className="mh-chip group flex flex-row-reverse items-center gap-2.5 text-sm text-white/70 hover:text-white"
            onPointerEnter={() => setBright(i, true)}
            onPointerLeave={() => setBright(i, false)}
            onFocus={() => setBright(i, true)}
            onBlur={() => setBright(i, false)}
            aria-label={`Highlight the ${s.name} strand`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-150"
              style={{
                background: `rgb(${s.c[0]},${s.c[1]},${s.c[2]})`,
                boxShadow: `0 0 12px rgb(${s.c[0]},${s.c[1]},${s.c[2]})`,
              }}
            />
            {s.name}
          </button>
        ))}
      </div>

      {/* scroll cue */}
      <div
        className="mh-rise mh-d5 absolute z-10 left-1/2 bottom-5 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/50"
        style={{ fontFamily: MONO }}
      >
        Scroll
        <span className="mh-rail" />
      </div>
    </div>
  );
}
