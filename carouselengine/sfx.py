"""Synthesises quiet UI sound effects for one slide from events.json and muxes them with the frames.
Key: C major pentatonic. Every headline word gets a soft marimba note, cards get a block thump,
small items a tick, the closing pill a chime, and a soft whoosh starts every exit."""
import sys, json, subprocess, os
import numpy as np

SR = 44100
T = 5.0
day, n = sys.argv[1], int(sys.argv[2])
base = os.path.dirname(os.path.abspath(__file__))
import os
out = f"{base}/out/{os.environ.get('OUTTAG','day')}{day}"
ev = json.load(open(f"{out}/events{n}.json"))

PENTA = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99]
buf = np.zeros(int(SR * (T + 0.2)), dtype=np.float64)
rng = np.random.default_rng(int(day) * 100 + n)

def add(t, sig, gain):
    i = int(t * SR)
    if i < 0 or i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain

def tone(freq, dur, decay, harm=(1.0, 0.25, 0.08)):
    x = np.arange(int(SR * dur)) / SR
    s = sum(h * np.sin(2 * np.pi * freq * (k + 1) * x) for k, h in enumerate(harm))
    env = np.exp(-x * decay) * np.minimum(1, x / 0.004)
    return s * env

def noise_filt(dur, lo, hi):
    x = rng.standard_normal(int(SR * dur))
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))

# words: pentatonic walk, soft marimba
wi = 0
walk = [0, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 5]
for e in sorted(ev, key=lambda e: e["t"]):
    t = e["t"] + 0.06
    k = e["s"]
    if k == "w":
        f = PENTA[walk[wi % len(walk)]]
        wi += 1
        add(t, tone(f, 0.45, 9.0), 0.085)
    elif k == "card":
        thump = tone(130, 0.22, 16, (1.0, 0.1)) * 1.0
        x = np.arange(int(SR * 0.22)) / SR
        sweep = np.sin(2 * np.pi * (180 * x - 300 * x * x)) * np.exp(-x * 18)
        add(t, thump * 0.5 + sweep * 0.5, 0.30)
        add(t, tone(PENTA[(wi + 2) % len(PENTA)] / 2, 0.5, 8, (1, 0.3)), 0.06)
    elif k == "tick":
        f = PENTA[(wi + 4) % len(PENTA)] * 2
        wi += 1
        add(t, tone(f, 0.18, 22, (1, 0.2)), 0.07)
    elif k == "chime":
        for i, f in enumerate([523.25, 659.25, 783.99]):
            add(t + i * 0.09, tone(f, 0.9, 4.5, (1, 0.3, 0.1)), 0.10)

# exit whoosh at the start of the out phase
wh = noise_filt(0.42, 500, 5000)
x = np.arange(len(wh)) / SR
env = np.sin(np.pi * np.clip(x / 0.42, 0, 1)) ** 2
add(T - 0.62, wh * env, 0.07)

peak = np.max(np.abs(buf)) or 1
buf = buf / peak * 0.7
# fade last 60 ms
nfade = int(SR * 0.06)
buf[len(buf) - nfade:] *= np.linspace(1, 0, nfade)
pcm = (buf[: int(SR * T)] * 32767).astype(np.int16)
import wave
wp = f"{out}/sfx{n}.wav"
with wave.open(wp, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

fr = f"{out}/frames{n}"
silent = f"{out}/slide{n}.silent.mp4"
final = f"{out}/slide{n}.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "24", "-i", f"{fr}/f%04d.jpg", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17", "-preset", "medium", "-movflags", "+faststart", silent], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", wp, "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", final], check=True)
print("ok", day, n)
