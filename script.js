const pad = document.querySelector("#pad");
const cursor = document.querySelector("#cursor");
const hint = document.querySelector("#hint");
const status = document.querySelector("#status");

const settings = {
  historySize: 7,
  minNote: 130,
  maxNote: 780,
  maxSpeed: 1.4
};

const state = {
  pointerId: null,
  history: [],
  synth: null,
  filter: null
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setupAudio() {
  state.filter = new Tone.Filter(500, "lowpass").toDestination();
  state.synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.04, decay: 0.1, sustain: 0.8, release: 0.25 }
  }).connect(state.filter);
  state.synth.volume.value = -22;
}

function remember(event) {
  state.history.push({ x: event.clientX, y: event.clientY, time: event.timeStamp });
  if (state.history.length > settings.historySize) state.history.shift();
}

function averageSpeed() {
  if (state.history.length < 2) return 0;

  let distance = 0;
  let elapsed = 0;
  for (let i = 1; i < state.history.length; i++) {
    const previous = state.history[i - 1];
    const current = state.history[i];
    distance += Math.hypot(current.x - previous.x, current.y - previous.y);
    elapsed += Math.max(1, current.time - previous.time);
  }
  return distance / elapsed;
}

function updateSound(event) {
  const bounds = pad.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
  const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  const movement = clamp(averageSpeed() / settings.maxSpeed, 0, 1);

  // Recent movement controls brightness and volume.
  state.synth.frequency.rampTo(settings.minNote + (1 - y) * (settings.maxNote - settings.minNote), 0.05);
  state.filter.frequency.rampTo(350 + movement * 3200, 0.08);
  state.synth.volume.rampTo(-22 + movement * 15, 0.08);

  cursor.style.left = `${x * 100}%`;
  cursor.style.top = `${y * 100}%`;
}

async function startPlaying(event) {
  if (state.pointerId !== null) return;
  state.pointerId = event.pointerId;
  pad.setPointerCapture(event.pointerId);
  state.history = [];
  remember(event);

  await Tone.start();
  if (state.pointerId !== event.pointerId) return;
  if (!state.synth) setupAudio();
  state.synth.triggerAttack(settings.minNote);
  updateSound(event);
  cursor.style.display = "block";
  hint.style.display = "none";
  status.textContent = "Playing";
}

function movePointer(event) {
  if (event.pointerId !== state.pointerId || !state.synth) return;
  remember(event);
  updateSound(event);
}

function stopPlaying(event) {
  if (event.pointerId !== state.pointerId) return;
  state.pointerId = null;
  state.history = [];
  if (state.synth) state.synth.triggerRelease();
  cursor.style.display = "none";
  hint.style.display = "block";
  status.textContent = "Ready";
}

pad.addEventListener("pointerdown", startPlaying);
pad.addEventListener("pointermove", movePointer);
pad.addEventListener("pointerup", stopPlaying);
