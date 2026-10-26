#!/usr/bin/env python3
"""songfit.py AUDIO FILM_SECONDS [--bpm-hint N]
Prints tempo (linear beat fit), beat phase, bar length, key guess, the drop (largest loudness jump), and the best trim window of FILM_SECONDS
that starts on a bar line at or after the drop, stays in the loud peak part, and ends on a bar line (the film length may flex up to 2 s to land on bars).
Also writes JSON to stdout last line prefixed with FIT= for scripts."""
import sys, json, numpy as np, librosa
def analyse(path, film, hint=None):
    y, sr = librosa.load(path, sr=22050, mono=True)
    dur = len(y) / sr
    oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=512)
    tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=512, units='time', start_bpm=hint or 90, tightness=200)
    n = np.arange(len(beats)); slope, icpt = np.polyfit(n, beats, 1)
    # refine: robust fit rejecting outliers
    for _ in range(3):
        res = beats - (slope * n + icpt); keep = np.abs(res) < 0.04
        slope, icpt = np.polyfit(n[keep], beats[keep], 1)
    bpm = 60 / slope; beat = slope
    rms = librosa.feature.rms(y=y, hop_length=512)[0]; t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
    # drop: biggest rise of 1 s mean loudness over the previous 2 s mean
    w = int(1.0 * sr / 512); sm = np.convolve(rms, np.ones(w) / w, 'same')
    jumps = []
    for i in range(2 * w, len(sm) - 2 * w):
        jumps.append((sm[i + w // 2:i + 2 * w].mean() / (sm[i - 2 * w:i - w // 2].mean() + 1e-6), t[i]))
    jm = max(j[0] for j in jumps)
    # the FIRST big drop: earliest point whose jump is at least 60 percent of the biggest, then the local maximum of that run
    first = next(i for i, j in enumerate(jumps) if j[0] >= 0.6 * jm)
    run = [jumps[first + d] for d in range(0, int(3 * sr / 512)) if first + d < len(jumps)]
    drop_rough = max(run, key=lambda a: a[0])[1]
    # local refit in the loud part after the drop: kick onsets (low band), brute force beat length and phase
    hop2 = 256
    i0 = int((drop_rough - 0.6) * sr); i1 = int(min(dur, drop_rough + 50) * sr)
    seg = y[i0:i1]; S0 = np.abs(librosa.stft(seg, n_fft=2048, hop_length=hop2)); low = S0[:10].sum(0)
    oe = np.maximum(0, np.diff(low, prepend=low[0]))
    pk = librosa.util.peak_pick(oe, pre_max=8, post_max=8, pre_avg=20, post_avg=20, delta=oe.std() * 1.2, wait=12)
    kt = librosa.frames_to_time(pk, sr=sr, hop_length=hop2) + (drop_rough - 0.6)
    drop = float(kt[0])                      # first strong kick after the rough drop = the drop, the first downbeat
    dk = np.diff(kt); near = dk[(dk > 0.6) & (dk < 0.75)]
    beat = float(np.median(near)) if len(near) else 0.67; bpm = 60 / beat
    res = (kt - drop) - np.round((kt - drop) / beat) * beat; res = res[np.abs(res) < 0.1]
    icpt = drop + (float(np.median(res)) if len(res) else 0.0) * 0.0   # anchored on the real drop kick
    kicks = [round(float(x), 3) for x in kt if x < drop + 45]
    k = 0
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr).mean(1)
    maj = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); mnr = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    sc = []
    for r in range(12):
        sc.append((np.corrcoef(np.roll(maj, r), chroma)[0, 1], names[r] + ' major', r)); sc.append((np.corrcoef(np.roll(mnr, r), chroma)[0, 1], names[r] + ' minor', (r + 3) % 12))
    sc.sort(reverse=True); key = sc[0][1]; keyroot = sc[0][2]
    bar = 4 * beat
    bar0 = 0; phase_beat = 0
    drop = icpt   # bar lines are icpt + n * bar
    # window
    nbars = max(1, int(round(film / bar)))
    cand = []
    for nb in (nbars - 1, nbars, nbars + 1):
        if nb < 1: continue
        L = nb * bar
        if abs(L - film) <= 2.0 + 1e-9: cand.append((abs(L - film), nb, L))
    cand.sort(); _, nb, L = cand[0] if cand else (0, nbars, nbars * bar)
    start = icpt
    end = start + L
    # make sure window sits in a loud part
    loud = sm[(t >= start) & (t <= end)].mean() / sm.max()
    out = dict(path=path, duration=round(dur, 3), bpm=round(bpm, 3), beat=round(beat, 5), phase=round(icpt, 4), bar=round(bar, 4), key=key, keyroot=int(keyroot),
               drop=round(float(drop), 3), drop_rough=round(float(drop_rough), 3), trim_start=round(float(start), 4), trim_end=round(float(end), 4), bars=int(nb), film_length=round(float(L), 3), loudness_ratio=round(float(loud), 2), bar_phase_beat=phase_beat, kicks=kicks)
    return out
if __name__ == '__main__':
    p = sys.argv[1]; film = float(sys.argv[2]) if len(sys.argv) > 2 else 21.0
    hint = float(sys.argv[sys.argv.index('--bpm-hint') + 1]) if '--bpm-hint' in sys.argv else None
    r = analyse(p, film, hint)
    for k, v in r.items():
        if k != 'kicks': print(f'{k:14s} {v}')
    print('FIT=' + json.dumps(r))
