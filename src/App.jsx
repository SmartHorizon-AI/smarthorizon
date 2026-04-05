import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";

const P = {
  black: "#0D0D0D",
  offblack: "#141414",
  red: "#FF0033",
  yellow: "#FFE000",
  white: "#F0EDE5",
  cream: "#E8E2D6",
  grey: "#333",
  greyLight: "#777",
  pink: "#FF6B9D",
  orange: "#FF6A00",
  cyan: "#00F0FF",
};

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

const BLOG_POSTS = [
  {
    id: 1, title: "WHY MOST AI PROJECTS FAIL BEFORE THEY START",
    date: "MAR 18, 2026", tag: "STRATEGY",
    excerpt: "Everyone wants AI. Nobody wants to define the problem first. Here's why your million-dollar initiative is DOA.",
    body: `The graveyard of failed AI projects isn't filled with bad algorithms. It's filled with bad problem statements.\n\nWe've seen it a hundred times: a C-suite exec reads a McKinsey report, calls an all-hands, and declares "We need AI." Six months and $2M later, a team of exhausted engineers has built a model that predicts... something nobody asked for.\n\nThe fix isn't more data scientists. It's more clarity.\n\n## THE PROBLEM STATEMENT TEST\n\nBefore you write a single line of code, answer these:\n\n1. What decision does this AI help a human make? If the answer is "none" — stop.\n2. What does the human do today without AI? If they do it fine — stop.\n3. What's the cost of being wrong? If you can't quantify it — stop.\n\n## THE SMARTHORIZON WAY\n\nWe don't start with models. We start with a napkin sketch of the problem. If we can't explain the AI solution to a bartender, we don't build it.\n\nThe companies winning with AI aren't the ones with the most GPUs. They're the ones with the clearest thinking.\n\n---\n\nDrop your problem in our box. We'll tell you if AI is even the right answer. Sometimes it's not. That honesty is the most valuable thing we offer.`,
  },
  {
    id: 2, title: "THE AI VENDOR PITCH IS DEAD. GOOD RIDDANCE.",
    date: "MAR 10, 2026", tag: "RANT",
    excerpt: "Slick demos. Fabricated ROI. Vaporware roadmaps. The era of buying AI like enterprise software is over.",
    body: `Remember when every vendor had an "AI-powered" badge? When the demo always worked perfectly and the POC always "showed promising results"?\n\nThat era is dying. And good riddance.\n\n## WHAT KILLED IT\n\n1. Executives got burned. The first wave of AI purchases looked like the first wave of blockchain purchases. Lots of sizzle, no steak.\n\n2. Open source caught up. Why pay $500K/year for a proprietary NLP engine when Hugging Face exists?\n\n3. The talent shifted. The best AI engineers don't want to work at SaaS companies. They want to build real things.\n\n## WHAT REPLACES IT\n\nProblem-first partnerships. Not vendor relationships — build relationships.\n\nYou bring the domain expertise. We bring the AI engineering. Together we build something that works, that you own, and that your team understands.\n\nNo 18-month contracts. No "strategic roadmap" decks. No bullshit.\n\n---\n\nThis is the SmartHorizon model. One problem. One solution. Full ownership transfer. That's it.`,
  },
  {
    id: 3, title: "BUILD VS. BUY? WRONG QUESTION.",
    date: "MAR 01, 2026", tag: "ENGINEERING",
    excerpt: "The debate assumed you had to pick one. In 2026, the move is co-build: your domain + our engineering, shipping together.",
    body: `Every CTO has been asked: "Should we build our AI in-house or buy a platform?"\n\nThe honest answer: neither, as traditionally defined.\n\n## WHY "BUILD" FAILS\n\nHiring a full AI team takes 6-12 months. Training them on your domain takes another 6. By the time they ship v1, the landscape has shifted three times.\n\n## WHY "BUY" FAILS\n\nYou get a generic platform that solves 70% of a problem you didn't define. Customization is "coming in Q3." Integration requires a systems integrator.\n\n## THE CO-BUILD MODEL\n\nHere's what works:\n\n- Your people define the problem, own the data, validate the output\n- Our people architect the solution, build the models, ship the code\n- Both teams work in the same repo, same sprint, same channel\n- You own everything — code, models, infrastructure, IP\n\nWe leave. You run it. That's the engagement.\n\n---\n\nTell us your problem. We'll tell you if co-build is right — and be honest when it's not.`,
  },
];

// ── Neural Mesh Canvas ──
function NeuralMesh() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef({ mx: -1, my: -1, nodes: [], pulses: [], sparks: [], frame: 0 });

  useEffect(() => {
    const cv = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const ctx = cv.getContext("2d");
    const S = stateRef.current;
    let raf;
    const RED = "#FF0033", YEL = "#FFE000", CYN = "#00F0FF", WHT = "#F0EDE5", PNK = "#FF6B9D";

    function resize() {
      const r = wrap.getBoundingClientRect();
      cv.width = r.width * 2;
      cv.height = r.height * 2;
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      S.mx = (e.clientX - r.left) / r.width * cv.width;
      S.my = (e.clientY - r.top) / r.height * cv.height;
    };
    const onLeave = () => { S.mx = -1; S.my = -1; };
    const onClick = (e) => {
      const r = wrap.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width * cv.width;
      const cy = (e.clientY - r.top) / r.height * cv.height;
      for (let i = 0; i < 14; i++) {
        S.sparks.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 1, color: [RED, YEL, CYN, PNK][i % 4] });
      }
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    wrap.addEventListener("click", onClick);

    // Init nodes
    const layers = [4, 7, 10, 14, 10, 8, 5, 3];
    S.nodes = [];
    layers.forEach((count, li) => {
      const lw = cv.width / (layers.length + 1);
      const lh = cv.height / (count + 1);
      for (let i = 0; i < count; i++) {
        S.nodes.push({
          x: lw * (li + 1), y: lh * (i + 1),
          ox: lw * (li + 1), oy: lh * (i + 1),
          r: 2.5 + Math.random() * 3.5, layer: li,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.018,
          energy: 0.3 + Math.random() * 0.7,
          connections: []
        });
      }
    });
    S.nodes.forEach((n) => {
      S.nodes.forEach((m, j) => {
        if (m.layer === n.layer + 1) {
          const dy = Math.abs(n.y - m.y);
          if (dy < cv.height / 3 && Math.random() < 0.45) n.connections.push(j);
        }
      });
    });

    function spawnPulse() {
      const src = S.nodes[Math.floor(Math.random() * S.nodes.length)];
      if (!src.connections.length) return;
      const ti = src.connections[Math.floor(Math.random() * src.connections.length)];
      S.pulses.push({ from: S.nodes.indexOf(src), to: ti, t: 0, speed: 0.006 + Math.random() * 0.014, color: [RED, YEL, CYN, PNK][Math.floor(Math.random() * 4)] });
    }

    function draw() {
      S.frame++;
      const w = cv.width, h = cv.height;
      ctx.fillStyle = "rgba(13,13,13,0.14)";
      ctx.fillRect(0, 0, w, h);

      // Grid
      if (S.frame % 4 === 0) {
        ctx.strokeStyle = "rgba(255,0,51,0.025)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      }

      // Mouse
      let mouseNode = null;
      if (S.mx > 0) {
        let minD = Infinity;
        S.nodes.forEach((n, i) => { const d = Math.hypot(n.x - S.mx, n.y - S.my); if (d < minD) { minD = d; mouseNode = i; } });
        ctx.beginPath(); ctx.arc(S.mx, S.my, 150, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(S.mx, S.my, 0, S.mx, S.my, 150);
        g.addColorStop(0, "rgba(255,0,51,0.07)"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fill();
      }

      // Connections
      S.nodes.forEach((n, i) => {
        n.connections.forEach(j => {
          const m = S.nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          const alpha = Math.max(0.02, 0.1 - d / 3000);
          const hot = mouseNode === i || mouseNode === j;
          ctx.beginPath(); ctx.moveTo(n.x, n.y);
          const cpx = (n.x + m.x) / 2 + Math.sin(S.frame * 0.005 + i) * 20;
          const cpy = (n.y + m.y) / 2 + Math.cos(S.frame * 0.007 + j) * 15;
          ctx.quadraticCurveTo(cpx, cpy, m.x, m.y);
          ctx.strokeStyle = hot ? `rgba(255,224,0,${alpha * 3})` : `rgba(240,237,229,${alpha})`;
          ctx.lineWidth = hot ? 1.5 : 0.5;
          ctx.stroke();
        });
      });

      // Pulses
      for (let pi = S.pulses.length - 1; pi >= 0; pi--) {
        const p = S.pulses[pi];
        p.t += p.speed;
        if (p.t >= 1) {
          const target = S.nodes[p.to];
          if (target.connections.length > 0 && Math.random() < 0.35) {
            const next = target.connections[Math.floor(Math.random() * target.connections.length)];
            S.pulses.push({ from: p.to, to: next, t: 0, speed: p.speed, color: p.color });
          }
          S.pulses.splice(pi, 1); continue;
        }
        const a = S.nodes[p.from], b = S.nodes[p.to];
        const cpx = (a.x + b.x) / 2 + Math.sin(S.frame * 0.005 + p.from) * 20;
        const cpy = (a.y + b.y) / 2 + Math.cos(S.frame * 0.007 + p.to) * 15;
        const t = p.t;
        const px = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cpx + t * t * b.x;
        const py = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cpy + t * t * b.y;
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2);
        const tg = ctx.createRadialGradient(px, py, 0, px, py, 12);
        tg.addColorStop(0, p.color + "30"); tg.addColorStop(1, "transparent");
        ctx.fillStyle = tg; ctx.fill();
      }

      // Nodes
      S.nodes.forEach((n, i) => {
        n.pulse += n.speed;
        n.x = n.ox + Math.sin(S.frame * 0.003 + i * 0.5) * 15;
        n.y = n.oy + Math.cos(S.frame * 0.004 + i * 0.7) * 10;
        if (S.mx > 0) {
          const d = Math.hypot(n.x - S.mx, n.y - S.my);
          if (d < 220) { n.x += (S.mx - n.x) * 0.015; n.y += (S.my - n.y) * 0.015; }
        }
        const pulse = Math.sin(n.pulse) * 0.3 + 0.7;
        const moused = mouseNode === i;
        const r = n.r * (moused ? 2.2 : 1) * pulse;
        if (moused || n.energy > 0.7) {
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
          const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
          ng.addColorStop(0, (moused ? YEL : RED) + "18"); ng.addColorStop(1, "transparent");
          ctx.fillStyle = ng; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = moused ? YEL : n.layer === 0 ? RED : n.layer >= 6 ? CYN : WHT;
        ctx.globalAlpha = 0.4 + pulse * 0.6; ctx.fill(); ctx.globalAlpha = 1;
      });

      // Sparks
      for (let si = S.sparks.length - 1; si >= 0; si--) {
        const s = S.sparks[si];
        s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= 0.018;
        if (s.life <= 0) { S.sparks.splice(si, 1); continue; }
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color; ctx.globalAlpha = s.life; ctx.fill(); ctx.globalAlpha = 1;
      }

      // Glitch
      if (Math.random() < 0.025) {
        const gy = Math.random() * h;
        ctx.fillStyle = "rgba(255,0,51,0.05)";
        ctx.fillRect(0, gy, w, 2 + Math.random() * 5);
      }
      if (Math.random() < 0.008) {
        const gy = Math.random() * h, gh = 8 + Math.random() * 25;
        const shift = (-8 + Math.random() * 16) * 2;
        try { const img = ctx.getImageData(0, gy, w, gh); ctx.putImageData(img, shift, gy); } catch (e) {}
      }

      if (S.frame % 7 === 0) spawnPulse();
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      wrap.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, cursor: "crosshair", zIndex: 1 }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

// ── Torn Edge ──
function TornEdge({ side = "bottom", color = P.black, height = 20 }) {
  const pts = side === "bottom"
    ? "0,0 0,8 3,12 7,6 12,14 18,4 24,11 30,7 36,15 42,5 48,13 54,8 58,16 64,4 70,12 76,9 82,17 88,6 94,14 100,3 100,0"
    : "0,20 0,12 5,8 10,14 16,6 22,16 28,4 34,12 40,8 46,15 52,5 58,13 64,9 70,17 76,6 82,14 88,8 94,12 100,17 100,20";
  return (
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{
      position: "absolute", [side]: -height + 1, left: 0, width: "100%", height, display: "block",
    }}><polygon points={pts} fill={color} /></svg>
  );
}

function Tape({ rotation = -3, top, left, right, color = P.yellow }) {
  return (
    <div style={{
      position: "absolute", top, left, right,
      width: 120, height: 28, background: color, opacity: 0.85,
      transform: `rotate(${rotation}deg)`, mixBlendMode: "multiply", zIndex: 5,
    }} />
  );
}

function Sticker({ children, color = P.red, rotation = 0, style = {} }) {
  return (
    <span style={{
      display: "inline-block", background: color,
      color: color === P.yellow ? P.black : P.white,
      fontFamily: "'Archivo Black', sans-serif", fontSize: "11px",
      letterSpacing: "2px", padding: "4px 14px",
      transform: `rotate(${rotation}deg)`, textTransform: "uppercase",
      whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
}

function Stamp({ text, color = P.red }) {
  return (
    <span style={{
      display: "inline-block", border: `3px solid ${color}`, color,
      fontFamily: "'Archivo Black', sans-serif", fontSize: "14px",
      letterSpacing: "4px", padding: "6px 18px",
      transform: "rotate(-4deg)", textTransform: "uppercase", opacity: 0.8,
    }}>{text}</span>
  );
}

// ── Nav ──
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" ? "home" : location.pathname.startsWith("/blog") ? "blog" : "home";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? P.black : "transparent",
      borderBottom: scrolled ? `3px solid ${P.red}` : "none",
      padding: "14px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "background 0.3s",
    }}>
      <div onClick={() => navigate("/")} style={{
        cursor: "pointer", fontFamily: "'Archivo Black', sans-serif",
        fontSize: "22px", color: P.white,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ background: P.red, color: P.white, padding: "2px 8px", transform: "skewX(-6deg)", display: "inline-block" }}>SMART</span>
        <span style={{ background: P.yellow, color: P.black, padding: "2px 8px", transform: "skewX(-6deg)", display: "inline-block" }}>HORIZON</span>
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {[["/", "home", "HOME"], ["/blog", "blog", "BLOG"]].map(([path, key, label]) => (
          <span key={key} onClick={() => navigate(path)} style={{
            fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "3px",
            color: page === key ? P.yellow : P.white,
            textDecoration: page === key ? "line-through" : "none",
            textDecorationColor: P.red, textDecorationThickness: "3px", cursor: "pointer",
          }}>{label}</span>
        ))}
        <span onClick={() => {
          navigate("/");
          setTimeout(() => document.getElementById("drop-zone")?.scrollIntoView({ behavior: "smooth" }), 100);
        }} style={{
          fontFamily: "'Archivo Black', sans-serif", fontSize: "12px", letterSpacing: "2px",
          background: P.red, color: P.white, padding: "10px 22px",
          transform: "skewX(-4deg)", display: "inline-block", cursor: "pointer", textTransform: "uppercase",
        }}>START BUILDING</span>
      </div>
    </nav>
  );
}

// ── Hero with Neural Mesh ──
function Hero() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);

  return (
    <section style={{
      minHeight: "100vh", background: P.black,
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "140px 40px 120px",
    }}>
      {/* LIVING NEURAL MESH BACKGROUND */}
      <NeuralMesh />

      {/* Dark overlay for text readability */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(135deg, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.4) 50%, rgba(13,13,13,0.65) 100%)",
        pointerEvents: "none",
      }} />

      {/* Vignette edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,13,13,0.8) 100%)",
        pointerEvents: "none",
      }} />

      {/* Tape decor */}
      <Tape rotation={-5} top="12%" right="8%" />
      <Tape rotation={8} top="70%" left="-20px" color={P.red} />

      {/* Stats monitor overlay */}
      <div style={{
        position: "absolute", top: 80, right: 32, zIndex: 10,
        fontFamily: "'Space Mono', monospace", fontSize: "10px",
        color: P.red, opacity: 0.4, letterSpacing: "1px",
        lineHeight: 2, textAlign: "right", pointerEvents: "none",
      }}>
        NEURAL MESH: ACTIVE<br />
        NODES: 61 | LAYERS: 8<br />
        OPPORTUNITIES DETECTED: ∞<br />
        WINDOW: CLOSING
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10, maxWidth: 850,
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(30px) rotate(-1deg)",
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Sticker rotation={-2}>AI Product Studio</Sticker>
          <Sticker color={P.yellow} rotation={1}>No BS Zone</Sticker>
        </div>

        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(48px, 9vw, 110px)",
          lineHeight: 0.9, color: P.white, letterSpacing: "-3px",
          textTransform: "uppercase", margin: "0 0 8px",
          textShadow: "0 2px 40px rgba(0,0,0,0.5)",
        }}>
          <span style={{ display: "block" }}>WHILE YOU'RE</span>
          <span style={{ display: "block" }}>THINKING,</span>
          <span style={{
            display: "inline-block", background: P.red,
            padding: "0 16px", transform: "skewX(-4deg)", color: P.white,
          }}>THEY'RE SHIPPING.</span>
        </h1>

        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(24px, 4vw, 44px)",
          lineHeight: 1.1, color: P.yellow, letterSpacing: "-1px",
          textTransform: "uppercase", transform: "rotate(-1deg)",
          margin: "16px 0 40px",
          textShadow: "0 2px 30px rgba(0,0,0,0.5)",
        }}>YOUR COMPETITORS ARE BUILDING AI.<br />WE MAKE SURE YOU BUILD IT BETTER.</h2>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px", lineHeight: 1.8, color: P.cream,
          maxWidth: 500, padding: "16px 0 16px 20px",
          borderLeft: `4px solid ${P.red}`,
          background: "rgba(13,13,13,0.6)",
          backdropFilter: "blur(4px)",
        }}>
          The AI window is open. Not forever.<br />
          Tell us what you want to build.<br />
          We'll respond in 48 hours with a plan<br />
          — or tell you if AI isn't the move.<br />
          <span style={{ color: P.yellow }}>No pitch decks. No BS. Just action.</span>
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("drop-zone")?.scrollIntoView({ behavior: "smooth" })} style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", letterSpacing: "2px",
            background: P.yellow, color: P.black, border: "none", padding: "18px 40px",
            transform: "skewX(-4deg)", cursor: "pointer", textTransform: "uppercase",
          }}>TELL US WHAT YOU'RE BUILDING ↓</button>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} style={{
            fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "2px",
            background: "rgba(13,13,13,0.6)", backdropFilter: "blur(4px)",
            color: P.white, border: `2px solid ${P.white}`, padding: "16px 32px",
            cursor: "pointer", textTransform: "uppercase",
          }}>HOW IT WORKS</button>
        </div>
      </div>

      <TornEdge side="bottom" color={P.cream} height={24} />
    </section>
  );
}

// ── Manifesto ──
function Manifesto() {
  const items = [
    "NO PITCH DECKS", "NO VENDOR LOCK-IN", "NO VAPORWARE",
    "BUILD BEFORE THEY DO", "YOUR IP, YOUR EDGE", "48HR RESPONSE",
    "CO-BUILD MODEL", "SHIP FASTER", "OWN EVERYTHING",
  ];
  return (
    <div style={{ background: P.red, padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{
        display: "inline-block", animation: "marquee 20s linear infinite",
        fontFamily: "'Archivo Black', sans-serif", fontSize: "14px",
        letterSpacing: "4px", color: P.white, textTransform: "uppercase",
      }}>
        {[...items, ...items].map((t, i) => (
          <span key={i}><span style={{ margin: "0 24px" }}>✕</span>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── How It Works ──
function HowItWorks() {
  const steps = [
    { num: "01", title: "TELL", desc: "Describe the opportunity. What could AI unlock for your business? Plain English. No RFP needed.", icon: "✉" },
    { num: "02", title: "SCOPE", desc: "We assess feasibility, market timing, and ROI. Honest answer in 48 hours — even if it's 'not yet.'", icon: "⚡" },
    { num: "03", title: "DESIGN", desc: "If it's a go, we architect together. Your domain expertise + our AI engineering = unfair advantage.", icon: "✂" },
    { num: "04", title: "SHIP", desc: "Co-build in shared repos. You own EVERYTHING — code, models, IP. We leave. You compete.", icon: "☠" },
  ];

  return (
    <section id="how" style={{ background: P.cream, padding: "100px 40px", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.4,
      }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Stamp text="THE PROCESS" color={P.red} />
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(36px, 6vw, 64px)", color: P.black,
          textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 0.95,
          margin: "20px 0 48px",
        }}>FOUR STEPS.<br /><span style={{ color: P.red }}>ZERO TO SHIPPED.</span></h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20,
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: P.white, border: `3px solid ${P.black}`,
              padding: "32px 24px", position: "relative",
              transform: `rotate(${[-1, 0.5, -0.5, 1][i]}deg)`,
              transition: "transform 0.2s", cursor: "default",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "rotate(0deg) scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = `rotate(${[-1, 0.5, -0.5, 1][i]}deg)`}
            >
              <div style={{
                position: "absolute", top: -12, right: 16,
                background: P.yellow, color: P.black,
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "12px", padding: "2px 10px", transform: "rotate(3deg)",
              }}>{s.num}</div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{
                fontFamily: "'Archivo Black', sans-serif", fontSize: "28px",
                color: P.red, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'Space Mono', monospace", fontSize: "12px",
                lineHeight: 1.7, color: P.grey,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <TornEdge side="bottom" color={P.black} height={24} />
    </section>
  );
}

// ── Capabilities ──
function Capabilities() {
  const items = [
    { title: "INTELLIGENT AGENTS", desc: "Autonomous systems that think, decide, and act. Your workforce, amplified.", color: P.red },
    { title: "PREDICTIVE MODELS", desc: "See around corners. Forecast demand, risk, churn — before competitors even notice.", color: P.yellow },
    { title: "NLP & KNOWLEDGE", desc: "RAG, search, knowledge graphs that unlock insights buried in YOUR data.", color: P.pink },
    { title: "COMPUTER VISION", desc: "See what others miss. Inspection, document processing, spatial intelligence.", color: P.orange },
    { title: "DECISION ENGINES", desc: "AI-powered scoring, routing, optimization. Operations that outthink the competition.", color: P.yellow },
    { title: "CUSTOM EVERYTHING", desc: "If it involves data and decisions, we build it. Your edge. No templates.", color: P.red },
  ];

  return (
    <section style={{ background: P.black, padding: "100px 40px", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.5,
      }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Sticker color={P.yellow} rotation={-2}>What We Build</Sticker>
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(32px, 5vw, 56px)", color: P.white,
          textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 0.95,
          margin: "20px 0 50px",
        }}>AI PRODUCTS.<br /><span style={{ color: P.greyLight }}>YOUR COMPETITIVE EDGE.</span></h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 3,
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              padding: "28px 24px", borderLeft: `5px solid ${item.color}`,
              background: "rgba(255,255,255,0.03)", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            >
              <h3 style={{
                fontFamily: "'Archivo Black', sans-serif", fontSize: "16px",
                letterSpacing: "2px", color: item.color, marginBottom: 6,
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'Space Mono', monospace", fontSize: "12px",
                lineHeight: 1.7, color: P.greyLight,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Drop Zone ──
function DropZone() {
  const [form, setForm] = useState({ name: "", company: "", email: "", opportunity: "" });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async () => {
    if (!form.opportunity.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "919a88cd-2b09-4221-8907-84f3b78edc20",
          subject: "New SmartHorizon Lead: " + (form.company || form.name || "Unknown"),
          from_name: form.name || "Website Visitor",
          name: form.name,
          company: form.company,
          email: form.email,
          opportunity: form.opportunity,
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else { alert("Something went wrong. Please try again."); setSubmitting(false); }
    } catch (err) {
      alert("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const inp = (field) => ({
    width: "100%", boxSizing: "border-box", padding: "14px 16px",
    background: P.white,
    border: `3px solid ${focused === field ? P.red : P.black}`,
    fontFamily: "'Space Mono', monospace", fontSize: "13px",
    color: P.black, outline: "none", transition: "border 0.2s",
  });

  if (done) {
    return (
      <section id="drop-zone" style={{
        padding: "100px 40px", background: P.cream,
        textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat", backgroundSize: "256px 256px",
          pointerEvents: "none", opacity: 0.4,
        }} />
        <div style={{
          maxWidth: 550, margin: "0 auto", border: `4px solid ${P.red}`,
          padding: "60px 40px", background: P.white,
          transform: "rotate(-0.5deg)", position: "relative", zIndex: 2,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h3 style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: 32, color: P.red,
            textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12,
          }}>LOCKED IN.</h3>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: 13,
            color: P.grey, lineHeight: 1.8,
          }}>
            We're scoping your opportunity now.<br />
            48 hours. You'll get a plan, a timeline,<br />
            and an honest take on whether AI is the right move.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="drop-zone" style={{ padding: "100px 40px", background: P.cream, position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.4,
      }} />
      <Tape rotation={6} top="30px" right="60px" />

      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Stamp text="START HERE" color={P.red} />
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(36px, 6vw, 56px)", color: P.black,
          textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 0.95,
          margin: "20px 0 8px",
        }}>WHAT'S THE<br />
          <span style={{
            background: P.red, color: P.white, padding: "0 12px",
            transform: "skewX(-3deg)", display: "inline-block",
          }}>OPPORTUNITY?</span>
        </h2>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: "13px",
          color: P.grey, lineHeight: 1.7, marginBottom: 32,
        }}>
          Tell us what you want to build, automate, or make smarter. We'll tell you how fast we can ship it.
        </p>

        <div style={{
          background: P.white, border: `3px solid ${P.black}`,
          padding: "32px 28px", transform: "rotate(-0.3deg)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input placeholder="YOUR NAME" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
              style={inp("name")} />
            <input placeholder="COMPANY" value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              onFocus={() => setFocused("company")} onBlur={() => setFocused(null)}
              style={inp("company")} />
          </div>
          <input placeholder="EMAIL" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            style={inp("email")} />
          <textarea
            placeholder="WHAT'S THE OPPORTUNITY? WHAT COULD AI UNLOCK FOR YOUR BUSINESS? WHAT WOULD YOU BUILD IF YOU HAD AN AI ENGINEERING TEAM TOMORROW?"
            value={form.opportunity}
            onChange={e => setForm({ ...form, opportunity: e.target.value })}
            onFocus={() => setFocused("opportunity")} onBlur={() => setFocused(null)}
            rows={5}
            style={{ ...inp("opportunity"), resize: "vertical", lineHeight: 1.7 }}
          />
          <button onClick={handleSubmit} disabled={submitting} style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: "15px",
            letterSpacing: "3px", background: submitting ? P.grey : form.opportunity.trim() ? P.red : P.greyLight,
            color: P.white, border: "none", padding: "18px 36px",
            transform: "skewX(-4deg)", cursor: submitting ? "wait" : form.opportunity.trim() ? "pointer" : "not-allowed",
            textTransform: "uppercase", alignSelf: "flex-start", transition: "background 0.2s",
          }}>{submitting ? "SENDING..." : "LET'S BUILD →"}</button>
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: "10px",
          color: P.greyLight, marginTop: 16, letterSpacing: "1px",
        }}>
          NO SPAM. NO NEWSLETTERS. NO "LET'S SCHEDULE A DISCOVERY CALL." JUST A DIRECT RESPONSE IN 48 HOURS.
        </p>
      </div>
      <TornEdge side="bottom" color={P.black} height={24} />
    </section>
  );
}

// ── Blog List ──
function BlogList() {
  const navigate = useNavigate();
  return (
    <section style={{
      minHeight: "100vh", padding: "140px 40px 80px",
      background: P.cream, position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.4,
      }} />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Stamp text="THE BLOG" color={P.red} />
        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: "clamp(36px, 7vw, 64px)", color: P.black,
          textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 0.95,
          margin: "20px 0 8px",
        }}>UNFILTERED<br /><span style={{ color: P.red }}>TAKES.</span></h1>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: "13px",
          color: P.grey, lineHeight: 1.7, marginBottom: 50,
        }}>No thought leadership. No synergies. Real talk about AI and the industry's blind spots.</p>

        {BLOG_POSTS.map((post, i) => (
          <article key={post.id} onClick={() => navigate(`/blog/${post.id}`)} style={{
            background: P.white, border: `3px solid ${P.black}`,
            padding: "32px 28px", marginBottom: 20, cursor: "pointer",
            transform: `rotate(${[-0.4, 0.3, -0.2][i]}deg)`,
            transition: "all 0.2s", position: "relative",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "rotate(0deg) scale(1.01)"; e.currentTarget.style.borderColor = P.red; }}
          onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${[-0.4, 0.3, -0.2][i]}deg)`; e.currentTarget.style.borderColor = P.black; }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <Sticker color={post.tag === "STRATEGY" ? P.red : post.tag === "RANT" ? P.orange : P.yellow}>{post.tag}</Sticker>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: P.greyLight }}>{post.date}</span>
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: "clamp(20px, 3vw, 28px)", color: P.black,
              textTransform: "uppercase", letterSpacing: "-0.5px", lineHeight: 1.05, marginBottom: 8,
            }}>{post.title}</h2>
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: "12px",
              lineHeight: 1.7, color: P.grey,
            }}>{post.excerpt}</p>
            <span style={{
              fontFamily: "'Archivo Black', sans-serif", fontSize: "12px",
              letterSpacing: "3px", color: P.red, marginTop: 12, display: "inline-block",
            }}>READ THIS →</span>
          </article>
        ))}
      </div>
    </section>
  );
}

// ── Blog Post ──
function BlogPostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === Number(id)) || BLOG_POSTS[0];
  const goBack = () => navigate("/blog");
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const renderBody = (text) => text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} style={{
      fontFamily: "'Archivo Black', sans-serif", fontSize: "22px", color: P.red,
      textTransform: "uppercase", letterSpacing: "2px", margin: "36px 0 12px",
      borderBottom: `3px solid ${P.red}`, paddingBottom: 8, display: "inline-block",
    }}>{line.replace("## ", "")}</h2>;
    if (line.startsWith("- ")) return <div key={i} style={{
      display: "flex", gap: 10, margin: "6px 0",
      fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: 1.7, color: P.grey,
    }}><span style={{ color: P.red, fontWeight: 700 }}>✕</span><span>{line.replace("- ", "")}</span></div>;
    if (line.match(/^\d+\./)) return <div key={i} style={{
      display: "flex", gap: 10, margin: "8px 0",
      fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: 1.7, color: P.grey,
    }}>
      <span style={{ background: P.red, color: P.white, fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", padding: "1px 8px", height: "fit-content" }}>
        {line.match(/^\d+/)[0]}
      </span>
      <span>{line.replace(/^\d+\.\s*/, "")}</span>
    </div>;
    if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: `3px solid ${P.black}`, margin: "36px 0" }} />;
    if (line.trim() === "") return <div key={i} style={{ height: 14 }} />;
    return <p key={i} style={{
      fontFamily: "'Space Mono', monospace", fontSize: "13px", lineHeight: 1.8, color: P.grey, margin: "4px 0",
    }}>{line}</p>;
  });

  return (
    <section style={{
      minHeight: "100vh", padding: "140px 40px 80px",
      background: P.cream, position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: 0, backgroundImage: NOISE_SVG,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.4,
      }} />
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <button onClick={goBack} style={{
          fontFamily: "'Archivo Black', sans-serif", fontSize: "12px", letterSpacing: "3px",
          color: P.red, background: "none", border: `2px solid ${P.red}`,
          padding: "8px 20px", cursor: "pointer", marginBottom: 32, textTransform: "uppercase",
        }}>← BACK</button>

        <div style={{
          background: P.white, border: `3px solid ${P.black}`,
          padding: "40px 32px", transform: "rotate(-0.2deg)",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <Sticker color={post.tag === "STRATEGY" ? P.red : post.tag === "RANT" ? P.orange : P.yellow}>{post.tag}</Sticker>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: P.greyLight }}>{post.date}</span>
          </div>
          <h1 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "clamp(28px, 5vw, 42px)", color: P.black,
            textTransform: "uppercase", letterSpacing: "-1px", lineHeight: 1, marginBottom: 32,
          }}>{post.title}</h1>
          <div style={{ borderTop: `3px solid ${P.black}`, paddingTop: 28 }}>
            {renderBody(post.body)}
          </div>
        </div>

        <div style={{ marginTop: 24, background: P.red, padding: "24px 28px", transform: "rotate(0.3deg)" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", color: P.white, lineHeight: 1.7 }}>
            Got an opportunity AI could unlock? <span onClick={() => navigate("/")} style={{
              color: P.yellow, cursor: "pointer", textDecoration: "underline", textDecorationThickness: "2px",
            }}>Tell us what you want to build</span> — 48hr response guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──
function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ background: P.black, padding: "48px 40px", borderTop: `4px solid ${P.red}` }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif", fontSize: "18px",
            color: P.white, display: "flex", gap: 6, marginBottom: 6,
          }}>
            <span style={{ background: P.red, padding: "0 6px", transform: "skewX(-4deg)", display: "inline-block" }}>SMART</span>
            <span style={{ background: P.yellow, color: P.black, padding: "0 6px", transform: "skewX(-4deg)", display: "inline-block" }}>HORIZON</span>
          </div>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: P.greyLight, letterSpacing: "3px", textTransform: "uppercase" }}>AI PRODUCTS. SHIPPED FAST. OWNED BY YOU.</p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["home", "/"], ["blog", "/blog"]].map(([label, path]) => (
            <span key={label} onClick={() => navigate(path)} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "2px",
              color: P.greyLight, cursor: "pointer", textTransform: "uppercase",
            }}>{label}</span>
          ))}
        </div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: P.greyLight, opacity: 0.4 }}>© 2026 SMARTHORIZON.AI</p>
      </div>
    </footer>
  );
}

// ── Scroll to top on route change ──
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
}

// ── Home Page ──
function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <HowItWorks />
      <Capabilities />
      <DropZone />
    </>
  );
}

// ── Main App ──
export default function PunkHorizon() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);

  return (
    <div style={{ background: P.cream, minHeight: "100vh" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: ${P.red}; color: ${P.white}; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${P.black}; }
        ::-webkit-scrollbar-thumb { background: ${P.red}; }
        input::placeholder, textarea::placeholder {
          color: ${P.greyLight}; font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <ScrollToTop />
      <Nav />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogPostView />} />
      </Routes>

      <Footer />
    </div>
  );
}
