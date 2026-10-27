const pad = document.querySelector("#pad");
const status = document.querySelector("#status");
let synth;

async function startPlaying() {
  await Tone.start();
  if (!synth) synth = new Tone.Synth().toDestination();
  synth.triggerAttack(220);
  status.textContent = "Playing";
}

function stopPlaying() {
  if (synth) synth.triggerRelease();
  status.textContent = "Ready";
}

pad.addEventListener("pointerdown", startPlaying);
pad.addEventListener("pointerup", stopPlaying);
