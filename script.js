/* ════════════════════════════════════════════
   Raajply – Cricket Bat IMPACT Logo Reveal
   Concept: Raajply bat SMASHES the logo into
   existence — plywood powering every swing!
════════════════════════════════════════════ */

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const cls  = (el, ...c) => el && el.classList.add(...c);
const rmcls= (el, ...c) => el && el.classList.remove(...c);

/* ── CANVAS VFX (wood chips + sparks) ── */
const canvas = $('vfx-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const WOOD = ['#c8853a','#a0603a','#d4a05a','#8B5E3C','#e8c090','#704530','#f0d090'];
const SPARKS= ['#e87c2b','#ffcc44','#ffffff','#ff6600'];

function burst(x, y, n = 120, type = 'wood') {
  for (let i = 0; i < n; i++) {
    const ang  = Math.random() * Math.PI * 2;
    const spd  = Math.random() * 18 + 3;
    const col  = type === 'wood'
      ? WOOD[Math.floor(Math.random() * WOOD.length)]
      : SPARKS[Math.floor(Math.random() * SPARKS.length)];
    particles.push({
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - (type === 'spark' ? 8 : 2),
      size: type === 'wood' ? Math.random() * 7 + 2 : Math.random() * 5 + 1,
      color: col,
      life: 1,
      decay: Math.random() * 0.018 + 0.008,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.15,
      type
    });
  }
}

function ambientSawdust() {
  // Continuous light sawdust from bottom
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: Math.random() * W,
      y: H + 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2 + 0.5),
      size: Math.random() * 4 + 1,
      color: WOOD[Math.floor(Math.random() * WOOD.length)],
      life: 1, decay: 0.005,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.06,
      type: 'wood'
    });
  }
}

let ambientTimer;
function startAmbient() {
  ambientTimer = setInterval(ambientSawdust, 60);
}
function stopAmbient() {
  clearInterval(ambientTimer);
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.4;  // gravity
    p.vx *= 0.98;
    p.angle += p.spin;
    p.life -= p.decay;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.life * (p.type === 'spark' ? 1 : 0.85);
    ctx.fillStyle = p.color;
    if (p.type === 'spark') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size * 1.8, p.size, p.size * 3.5);
    }
    ctx.restore();
  });
  requestAnimationFrame(drawParticles);
}

/* ── SHOCKWAVE RINGS ── */
function shockwave(x, y, count = 3) {
  const sc = $('shockwave-container');
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'ring' + (i === 0 ? ' white' : '');
      r.style.cssText = `left:${x}px; top:${y}px;
        width:${60 + i * 20}px; height:${60 + i * 20}px;
        animation-delay:${i * 0.08}s;`;
      sc.appendChild(r);
      setTimeout(() => r.remove(), 900);
    }, i * 80);
  }
}

/* ── FLASH ── */
let flashEl;
function flash(intensity = 0.9) {
  if (!flashEl) {
    flashEl = document.createElement('div');
    flashEl.id = 'flash-el';
    document.body.appendChild(flashEl);
  }
  flashEl.style.opacity = intensity;
  setTimeout(() => { flashEl.style.opacity = '0'; }, 80);
}

/* ── ANIMATE ELEMENT HELPER ── */
function anim(el, animClass, delayMs = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!el) { resolve(); return; }
      cls(el, animClass);
      el.addEventListener('animationend', resolve, { once: true });
      setTimeout(resolve, 3500);
    }, delayMs);
  });
}

/* ── GET SCREEN CENTER OF SVG ── */
function svgCenter() {
  const svg  = $('logo-svg');
  const rect = svg.getBoundingClientRect();
  return {
    x: rect.left + rect.width  * 0.5,       // cx=260 in 520-wide viewBox
    y: rect.top  + rect.height * 0.34        // roughly triangle centre
  };
}

/* ── RESET ── */
function reset() {
  const allAnimClasses = [
    'bat-entry','bat-swing','bat-exit',
    'anim-tri-slam','anim-outline-draw','anim-outline-out','anim-shine',
    'anim-crown-drop','anim-crown-draw','anim-gem','anim-oval',
    'anim-fly','anim-raaj','anim-fade','anim-word-draw','anim-word-fill','anim-divider'
  ];
  document.querySelectorAll('*').forEach(el => rmcls(el, ...allAnimClasses));

  // Hide all logo elements
  ['tri-fill','tri-outline','crown-g','oval-g',
   'rl-t','raaj-t','copy-t','ply-t','motto-t','wordmark','iso-t'].forEach(id => {
    const e = $(id);
    if (!e) return;
    e.style.opacity   = '0';
    e.style.transform = '';
  });

  // Reset specific transforms
  $('tri-fill').style.transform    = 'scale(0) rotate(-5deg)';
  $('oval-g').style.transform      = 'rotateY(90deg) scale(0.5)';
  $('crown-g').style.transform     = 'translateY(-80px)';
  $('tri-outline').style.strokeDashoffset = '1600';
  $('tri-outline').style.opacity   = '0';
  $('shine-rect').style.opacity    = '0';
  $('wordmark').style.strokeDashoffset = '3200';
  $('wordmark').style.fill         = 'none';
  $('wordmark').style.strokeWidth  = '1.5';
  $('divider').style.strokeDashoffset = '410';
  document.querySelectorAll('.gem').forEach(g => g.style.opacity = '0');

  // Re-add direction classes for text
  [
    ['rl-t',   'fly-down'],
    ['raaj-t', ''],
    ['copy-t', 'fly-right'],
    ['ply-t',  'fly-up'],
    ['motto-t','fly-down'],
    ['iso-t',  'fly-up'],
  ].forEach(([id, dir]) => {
    const e = $(id); if (!e || !dir) return;
    cls(e, dir);
  });

  // Reset bat
  const bat = $('bat-wrap');
  bat.style.transform = 'rotate(40deg) translateX(200px)';
  bat.style.opacity   = '0';
  document.querySelectorAll('.trail').forEach(t => t.style.opacity = '0');

  rmcls($('replay-btn'), 'show');
  particles = [];
}

/* ════════════════════════════════════════
   MAIN SEQUENCE
════════════════════════════════════════ */
async function run() {
  reset();
  stopAmbient();
  startAmbient();

  // Step 1: Bat slides into view from bottom-right
  await wait(300);
  cls($('bat-wrap'), 'bat-entry');
  await wait(600);

  // Step 2: BAT SWINGS — fast rotation
  document.querySelectorAll('.trail').forEach(t => cls(t, 'trail-show'));
  cls($('bat-wrap'), 'bat-swing');
  await wait(200);  // mid-swing

  // Step 3: IMPACT! (bat reaches ~center)
  const center = svgCenter();
  flash(1.0);
  shockwave(center.x, center.y, 4);
  burst(center.x, center.y, 160, 'wood');
  burst(center.x, center.y, 80,  'spark');
  // Rumble effect on scene
  $('scene').style.transition = 'none';
  $('scene').style.transform  = 'translate(-8px, -6px)';
  setTimeout(() => { $('scene').style.transform = 'translate(6px, 4px)'; },  60);
  setTimeout(() => { $('scene').style.transform = 'translate(-4px, 6px)'; }, 120);
  setTimeout(() => { $('scene').style.transform = 'translate(0,0)'; $('scene').style.transition=''; }, 200);

  await wait(160);

  // Step 4: Bat exits upward
  cls($('bat-wrap'), 'bat-exit');

  // Step 5: Triangle SLAMS into existence
  burst(center.x, center.y, 60, 'wood');
  $('tri-fill').style.opacity = '0';
  await anim($('tri-fill'), 'anim-tri-slam', 0);
  await wait(100);

  // Step 6: Glowing outline traces the triangle
  $('tri-outline').style.opacity = '1';
  cls($('tri-outline'), 'anim-outline-draw');
  // Shine sweep
  $('shine-rect').style.opacity = '1';
  cls($('shine-rect'), 'anim-shine');
  await wait(2000);
  cls($('tri-outline'), 'anim-outline-out');

  // Step 7: Crown drops from sky
  await anim($('crown-g'), 'anim-crown-drop', 0);
  cls($('crown-path'), 'anim-crown-draw');
  document.querySelectorAll('.gem').forEach((g, i) => {
    setTimeout(() => cls(g, 'anim-gem'), i * 100);
  });
  await wait(600);

  // Step 8: Oval badge spins in
  await anim($('oval-g'), 'anim-oval', 0);

  // Step 9: RL, then Raaj (bounce)
  await anim($('rl-t'), 'anim-fly', 0);
  await wait(100);
  cls($('raaj-t'), 'anim-raaj');
  await wait(500);

  // Step 10: © + Ply & Boards + Motto staggered
  cls($('copy-t'), 'anim-fly');
  await wait(150);
  cls($('ply-t'), 'anim-fly');
  await wait(200);
  cls($('motto-t'), 'anim-fly');
  await wait(600);

  // Step 11: SECOND FLASH before big wordmark (like celebrating a SIX!)
  flash(0.85);
  burst(center.x, center.y + 150, 80, 'spark');
  await wait(150);

  // Step 12: Raajply wordmark strokes in
  $('wordmark').style.opacity = '1';
  await anim($('wordmark'), 'anim-word-draw', 0);
  cls($('wordmark'), 'anim-word-fill');
  await wait(600);

  // Step 13: Divider + ISO
  cls($('divider'), 'anim-divider');
  await wait(400);
  cls($('iso-t'), 'anim-fade');
  await wait(600);

  // Done
  cls($('replay-btn'), 'show');
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded', () => {
  drawParticles();
  run();
  $('replay-btn').addEventListener('click', () => {
    rmcls($('replay-btn'), 'show');
    setTimeout(run, 300);
  });
});
