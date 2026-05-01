#!/usr/bin/env bash
# Build all Go WASM packages and stage them under public/wasm/.
# Each subdirectory of go/wasm/ is compiled to public/wasm/<name>.wasm.
# Also copies wasm_exec.js from the local Go installation into public/.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WASM_SRC_DIR="$ROOT/go/wasm"
WASM_OUT_DIR="$ROOT/public/wasm"

mkdir -p "$WASM_OUT_DIR"

# Copy the Go WASM runtime shim. Go 1.24+ moved it under lib/wasm/.
GOROOT="$(go env GOROOT)"
if [[ -f "$GOROOT/lib/wasm/wasm_exec.js" ]]; then
  cp "$GOROOT/lib/wasm/wasm_exec.js" "$ROOT/public/wasm_exec.js"
elif [[ -f "$GOROOT/misc/wasm/wasm_exec.js" ]]; then
  cp "$GOROOT/misc/wasm/wasm_exec.js" "$ROOT/public/wasm_exec.js"
else
  echo "error: could not find wasm_exec.js under $GOROOT" >&2
  exit 1
fi

# Build each package under go/wasm/* into public/wasm/<name>.wasm.
shopt -s nullglob
built=0
for pkg in "$WASM_SRC_DIR"/*/; do
  name="$(basename "$pkg")"
  echo "building $name..."
  (cd "$ROOT/go" && GOOS=js GOARCH=wasm go build -o "$WASM_OUT_DIR/$name.wasm" "./wasm/$name")
  built=$((built + 1))
done

if [[ $built -eq 0 ]]; then
  echo "no packages found under go/wasm/ — skipping wasm build"
else
  echo "built $built wasm package(s)"
fi
