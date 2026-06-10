// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.borderBottomColor = 'rgba(0, 229, 255, 0.35)';
    navbar.style.background = 'rgba(5, 10, 15, 0.97)';
  } else {
    navbar.style.borderBottomColor = 'rgba(0, 229, 255, 0.15)';
    navbar.style.background = 'rgba(5, 10, 15, 0.85)';
  }
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const step = target / 120;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}
window.addEventListener('load', () => setTimeout(animateCounters, 500));

// ===== HOW IT WORKS SCROLL ANIMATIONS =====
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });

document.querySelectorAll('.workflow-step').forEach(s => stepObserver.observe(s));

const lineObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting)
      document.querySelector('.workflow-line-fill').classList.add('animated');
  });
}, { threshold: 0.1 });

const howSection = document.getElementById('how-it-works');
if (howSection) lineObserver.observe(howSection);

// ===== SIMULATION =====

const sliders = [
  { id: 'speedSlider',  out: 'speedVal'  },
  { id: 'impactSlider', out: 'impactVal' },
  { id: 'passSlider',   out: 'passVal'   },
];
sliders.forEach(({ id, out }) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    document.getElementById(out).textContent = el.value;
    updateSeverity();
  });
});

document.querySelectorAll('.option-buttons').forEach(group => {
  group.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSeverity();
    });
  });
});

function updateSeverity() {
  const speed  = parseInt(document.getElementById('speedSlider').value);
  const impact = parseInt(document.getElementById('impactSlider').value);
  const weather = document.querySelector('#weatherOpts .opt-btn.active')?.dataset.val || 'Clear';
  let score = (speed / 200 * 50) + (impact / 100 * 40);
  if (weather === 'Rain' || weather === 'Fog' || weather === 'Night') score += 10;
  score = Math.min(score, 100);

  document.getElementById('sevFill').style.width = score + '%';
  const label = score > 75 ? 'CRITICAL' : score > 50 ? 'SEVERE' : score > 25 ? 'MODERATE' : 'MINOR';
  const colors = { CRITICAL: '#ff1e3c', SEVERE: '#ff6b00', MODERATE: '#ffcc00', MINOR: '#00ff64' };
  const sevLabel = document.getElementById('sevLabel');
  sevLabel.textContent = label;
  sevLabel.style.color = colors[label];
}
updateSeverity();

const logMessages = [
  { delay: 0,    color: 'red',    msg: '🚨 ACCIDENT DETECTED — High-impact collision registered' },
  { delay: 800,  color: 'cyan',   msg: '📡 GPS SYNCHRONIZED — Location locked: MG Road, Sector 4' },
  { delay: 1600, color: 'orange', msg: '🧠 SEVERITY ANALYSIS — AI engine processing crash data...' },
  { delay: 2400, color: 'orange', msg: '⚠️  RESULT: Critical injury probability 78% — Fire risk LOW' },
  { delay: 3200, color: 'red',    msg: '🏥 HOSPITAL NOTIFIED — City General Hospital alerted (2.1 km)' },
  { delay: 4000, color: 'cyan',   msg: '🚑 AMBULANCE DISPATCHED — Unit A12 en route — ETA: 4 mins' },
  { delay: 4800, color: 'cyan',   msg: '🚔 POLICE ALERTED — Unit #14 mobilized' },
  { delay: 5600, color: 'green',  msg: '📱 FAMILY NOTIFIED — 2 emergency contacts alerted via SMS' },
  { delay: 6400, color: 'green',  msg: '📍 RESCUE TRACKING ACTIVE — Live coordination initiated' },
];

let timerInterval = null;
let simRunning = false;

function addLog(color, msg) {
  const logs = document.getElementById('simLogs');
  const idle = logs.querySelector('.log-idle');
  if (idle) idle.remove();
  const now = new Date();
  const time = now.toTimeString().slice(0,8);
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <div class="log-dot ${color}"></div>
    <div class="log-content">
      <span class="log-msg">${msg}</span>
      <span class="log-time">${time}</span>
    </div>`;
  logs.prepend(entry);
}

function startTimer() {
  let seconds = 3600;
  const el = document.getElementById('timerVal');
  timerInterval = setInterval(() => {
    seconds--;
    const m = Math.floor(seconds / 60).toString().padStart(2,'0');
    const s = (seconds % 60).toString().padStart(2,'0');
    el.textContent = `${m}:${s}`;
    if (seconds <= 0) clearInterval(timerInterval);
  }, 1000);
}

document.getElementById('simBtn').addEventListener('click', () => {
  if (simRunning) return;
  simRunning = true;

  const btn = document.getElementById('simBtn');
  btn.classList.add('running');
  btn.querySelector('.sim-btn-text').textContent = 'SIMULATION RUNNING...';

  const sevLabel = document.getElementById('sevLabel').textContent;
  const highSeverity = sevLabel === 'CRITICAL' || sevLabel === 'SEVERE';

  document.body.classList.add('flash-red');
  setTimeout(() => document.body.classList.remove('flash-red'), 1000);

  document.getElementById('mapStatus').textContent = '🔴 LIVE';
  document.getElementById('mapStatus').classList.add('active');
  document.getElementById('mapOverlay').classList.add('hidden');

  setTimeout(() => {
    document.getElementById('mapAccident').classList.add('visible');
    document.getElementById('responseRadius').classList.add('visible');
  }, 500);

  setTimeout(() => {
    document.getElementById('markerHospital').classList.add('visible');
    document.getElementById('markerPolice').classList.add('visible');
  }, 1500);

  setTimeout(() => {
    document.getElementById('markerAmbulance').classList.add('visible');
    document.getElementById('routeAmbulance').setAttribute('d',
      'M 390 80 Q 360 160 300 200 Q 270 215 240 220');
    setTimeout(() => {
      document.getElementById('routeAmbulance').classList.add('animated');
    }, 100);
  }, 3000);

  setTimeout(() => {
    document.getElementById('routePolice').setAttribute('d',
      'M 70 70 Q 120 130 180 180 Q 210 200 240 220');
    setTimeout(() => {
      document.getElementById('routePolice').classList.add('animated');
    }, 100);
  }, 3800);

  setTimeout(() => {
    if (highSeverity) {
      document.getElementById('markerFire').classList.add('visible');
      document.getElementById('routeFire').setAttribute('d',
        'M 65 330 Q 120 290 180 260 Q 210 240 240 220');
      setTimeout(() => {
        document.getElementById('routeFire').classList.add('animated');
      }, 100);
      addLog('red', '🚒 FIRE STATION ALERTED — Fuel leakage risk detected — Unit F3 dispatched');
    }
  }, 4500);

  setTimeout(() => {
    document.getElementById('notifyPopup').classList.add('visible');
  }, 5800);

  startTimer();

  logMessages.forEach(({ delay, color, msg }) => {
    setTimeout(() => addLog(color, msg), delay);
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  simRunning = false;
  clearInterval(timerInterval);

  document.getElementById('simBtn').classList.remove('running');
  document.getElementById('simBtn').querySelector('.sim-btn-text').textContent = 'SIMULATE ACCIDENT';
  document.getElementById('mapStatus').textContent = 'STANDBY';
  document.getElementById('mapStatus').classList.remove('active');
  document.getElementById('mapOverlay').classList.remove('hidden');
  document.getElementById('mapAccident').classList.remove('visible');
  document.getElementById('responseRadius').classList.remove('visible');
  document.getElementById('markerHospital').classList.remove('visible');
  document.getElementById('markerAmbulance').classList.remove('visible');
  document.getElementById('markerPolice').classList.remove('visible');
  document.getElementById('markerFire').classList.remove('visible');

  ['routeAmbulance','routePolice','routeFire'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('animated');
    el.setAttribute('d','');
  });

  document.getElementById('notifyPopup').classList.remove('visible');
  document.getElementById('timerVal').textContent = '60:00';
  document.getElementById('simLogs').innerHTML = `
    <div class="log-idle">
      <i class="fa-solid fa-circle-dot"></i>
      System ready. Awaiting simulation trigger...
    </div>`;
});

// ===== EMERGENCY MODE =====

let emActive = false;
let emTimerInterval = null;
let emSeconds = 0;

function activateEmergency() {
  emActive = true;

  const emOverlay = document.getElementById('emergencyOverlay');
  const emBanner  = document.getElementById('emergencyBanner');
  const emModalBg = document.getElementById('emergencyModalBg');

  emOverlay.classList.add('active');

  setTimeout(() => {
    emBanner.classList.add('active');
  }, 600);

  setTimeout(() => {
    emOverlay.classList.remove('active');
    setTimeout(() => {
      emModalBg.classList.add('active');
      startEmTimer();
    }, 400);
  }, 2800);

  document.body.classList.add('flash-red');
  setTimeout(() => document.body.classList.remove('flash-red'), 900);

  setTimeout(() => {
    document.getElementById('simulation')
      .scrollIntoView({ behavior: 'smooth' });
  }, 3600);
}

function startEmTimer() {
  emSeconds = 0;
  clearInterval(emTimerInterval);
  emTimerInterval = setInterval(() => {
    emSeconds++;
    const m = Math.floor(emSeconds / 60).toString().padStart(2, '0');
    const s = (emSeconds % 60).toString().padStart(2, '0');
    const el = document.getElementById('emTimer');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

function deactivateEmergency() {
  emActive = false;
  document.getElementById('emergencyModalBg').classList.remove('active');
  document.getElementById('emergencyBanner').classList.remove('active');
  clearInterval(emTimerInterval);
  showToast('⛔ Emergency Mode Deactivated');
}

function showToast(msg, color = 'cyan') {
  const emToast = document.getElementById('emToast');
  emToast.textContent = msg;
  emToast.style.borderColor = color === 'red'
    ? 'rgba(255,30,60,0.4)' : 'rgba(0,229,255,0.3)';
  emToast.style.color = color === 'red'
    ? 'var(--accent-red)' : 'var(--accent-cyan)';
  emToast.classList.add('show');
  setTimeout(() => emToast.classList.remove('show'), 2800);
}

function callService(name) {
  showToast(`📡 Alerting ${name}...`, 'cyan');
}

function triggerEmSim() {
  document.getElementById('emergencyModalBg').classList.remove('active');
  showToast('⚡ Auto-simulation triggered!', 'red');
  setTimeout(() => {
    document.getElementById('simulation')
      .scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const simBtn = document.getElementById('simBtn');
      if (simBtn && !simBtn.classList.contains('running')) simBtn.click();
    }, 800);
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.nav-emergency-btn')
    .addEventListener('click', activateEmergency);

  document.getElementById('emDismiss')
    .addEventListener('click', () => {
      document.getElementById('emergencyOverlay').classList.remove('active');
      setTimeout(() => {
        document.getElementById('emergencyModalBg').classList.add('active');
        startEmTimer();
      }, 400);
    });

  document.getElementById('emModalClose')
    .addEventListener('click', () => {
      document.getElementById('emergencyModalBg').classList.remove('active');
    });

  document.getElementById('emDeactivate')
    .addEventListener('click', deactivateEmergency);

  document.getElementById('ebClose')
    .addEventListener('click', () => {
      document.getElementById('emergencyBanner').classList.remove('active');
    });

  document.getElementById('emergencyModalBg')
    .addEventListener('click', (e) => {
      if (e.target === document.getElementById('emergencyModalBg')) {
        document.getElementById('emergencyModalBg').classList.remove('active');
      }
    });

});

// ===== NAVBAR SMOOTH SCROLL =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});