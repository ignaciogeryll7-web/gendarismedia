# Gendaris carousel engine

Used by the daily Gendaris Carousel scheduled task (30 hari plan, from 20 Nov 2026).

Look: soft drifting mesh gradients in Gendaris greens with grain, mixed fonts inside one carousel (TYPE mix is the default).

Run: node render.js DAY [slides] then python3 sfx.py DAY N for each slide. Needs Node 22 with playwright and Chromium, ffmpeg, Python 3 with numpy, fonts Inter, Inter Display and JetBrains Mono installed.

assets/badges must hold the official Google Play and App Store badge files. While it only holds PLACEHOLDER.txt the task posts nothing.
