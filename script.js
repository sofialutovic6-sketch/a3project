const pad = document.querySelector("#pad");
const cursor = document.querySelector("#cursor");
const status = document.querySelector("#status");
let synth;
let activePointer = null;

async function startPlaying(event) {
  activePointer = event.pointerId;
  pad.setPointerCapture(event.pointerId);
  await Tone.start();
  if (activePointer !== event.pointerId) return;
  if (!synth) synth = new Tone.Synth().toDestination();
  synth.triggerAttack(220);
  movePointer(event);
  cursor.style.display = "block";
  status.textContent = "Playing";
}

function movePointer(event) {
  if (activePointer !== event.pointerId || !synth) return;
  const bounds = pad.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  synth.frequency.rampTo(130 + (1 - y) * 650, 0.05);
  cursor.style.left = `${x * 100}%`;
  cursor.style.top = `${y * 100}%`;
}

function stopPlaying(event) {
  if (activePointer !== event.pointerId) return;
  activePointer = null;
  if (synth) synth.triggerRelease();
  cursor.style.display = "none";
  status.textContent = "Ready";
}

pad.addEventListener("pointerdown", startPlaying);
pad.addEventListener("pointermove", movePointer);
pad.addEventListener("pointerup", stopPlaying);
