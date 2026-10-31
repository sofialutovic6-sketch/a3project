# Drift

Live page: https://sofialutovic6-sketch.github.io/a3project/

Drift is a small pointer-controlled instrument built with vanilla JavaScript and Tone.js.

## How to play

Press and drag inside the sound area with a mouse, trackpad, touch screen, or pen. Moving upward raises the pitch. Moving faster makes the sound brighter and louder. Release to stop. There are no keyboard controls.

## How it works

The program keeps the seven most recent pointer positions and timestamps. It calculates the average distance travelled per millisecond across those events. This speed changes a Tone.js low-pass filter and the synthesizer volume. The pointer's vertical position changes pitch.

Sound starts after a pointer press so the browser can unlock audio. The instrument uses one Tone.js synthesizer and filter, with no other libraries.
