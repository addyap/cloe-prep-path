"""
Records speech with Kokoro (https://huggingface.co/hexgrad/Kokoro-82M), a free
voice model that runs on this computer. scripts/generate-audio.ts starts this
and sends it one exercise per line of stdin as JSON:

  {"lines": [{"text": "...", "voice": "af_heart"}, ...], "out": "path/to/file.mp3", "speed": 1}

It writes the MP3 and answers with one line of JSON: for each input line, where
it starts in the recording and the time each word was spoken:

  {"lines": [{"offset": 0.0, "tokens": [["Hello", 0.25, 0.6], ...]}, ...]}

Set up with `bun run audio:setup` (see README).
"""
import json
import os
import subprocess
import sys
import tempfile
import warnings

warnings.filterwarnings("ignore")
# Answers go to stdout; anything the libraries print goes to stderr instead.
answers, sys.stdout = sys.stdout, sys.stderr

import espeakng_loader

# espeak (used for words Kokoro doesn't know) can't read its data from a long
# path; Homebrew's copy lives at a short one.
BREW_ESPEAK = "/opt/homebrew/opt/espeak-ng"
if os.path.isdir(BREW_ESPEAK):
    espeakng_loader.get_data_path = lambda: f"{BREW_ESPEAK}/share/espeak-ng-data"
    espeakng_loader.get_library_path = lambda: f"{BREW_ESPEAK}/lib/libespeak-ng.dylib"

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SAMPLE_RATE = 24000
# A short pause between dialogue lines, as in a real conversation.
PAUSE = np.zeros(int(SAMPLE_RATE * 0.35), dtype=np.float32)

pipelines = {}


def pipeline(voice):
    # Voice ids start with their accent: "a" American, "b" British.
    lang = voice[0]
    if lang not in pipelines:
        pipelines[lang] = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
    return pipelines[lang]


def record(job):
    parts, lines, offset = [], [], 0.0
    speed = job.get("speed", 1)
    for i, line in enumerate(job["lines"]):
        if i > 0:
            parts.append(PAUSE)
            offset += len(PAUSE) / SAMPLE_RATE
        tokens, start = [], offset
        # Kokoro splits long text into chunks; each chunk's times start from 0.
        for result in pipeline(line["voice"])(line["text"], voice=line["voice"], speed=speed):
            audio = result.audio.numpy()
            for t in result.tokens or []:
                if t.start_ts is not None and t.end_ts is not None:
                    tokens.append([t.text, round(offset + t.start_ts, 3), round(offset + t.end_ts, 3)])
            parts.append(audio)
            offset += len(audio) / SAMPLE_RATE
        lines.append({"offset": round(start, 3), "tokens": tokens})

    with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
        sf.write(wav.name, np.concatenate(parts), SAMPLE_RATE)
        # 64 kbps mono: clear speech at about 0.5 MB a minute.
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav.name, "-ac", "1", "-b:a", "64k", job["out"]],
            check=True,
        )
    return {"lines": lines}


for request in sys.stdin:
    if request.strip():
        print(json.dumps(record(json.loads(request))), file=answers, flush=True)
