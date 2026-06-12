#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INPUT="$PROJECT_DIR/public/PS5-startup.mp4"
OUTPUT="$PROJECT_DIR/public/PS5-startup-4k.mp4"

if [[ ! -f "$INPUT" ]]; then
  echo "Input file not found: $INPUT" >&2
  exit 1
fi

ffmpeg -y -i "$INPUT" \
  -vf "scale=3840:2160:flags=lanczos:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2,hqdn3d=1.0:1.0:3.0:3.0,unsharp=5:5:0.35:3:3:0.0" \
  -c:v libx264 \
  -preset slow \
  -profile:v high \
  -level:v 5.1 \
  -pix_fmt yuv420p \
  -b:v 35M \
  -maxrate 45M \
  -bufsize 70M \
  -c:a copy \
  -movflags +faststart \
  "$OUTPUT"

echo "4K upscale complete: $OUTPUT"
