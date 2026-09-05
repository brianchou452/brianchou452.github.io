#!/usr/bin/env bash
set -euo pipefail

readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e"
readonly USER_ID="$(id -u)"
readonly GROUP_ID="$(id -g)"

docker run --rm --init --ipc=host \
  --user "${USER_ID}:${GROUP_ID}" \
  --env CI=1 \
  --env COREPACK_HOME=/tmp/corepack \
  --env XDG_CACHE_HOME=/tmp/cache \
  --mount "type=bind,src=${ROOT_DIR},dst=/work" \
  --tmpfs "/work/node_modules:rw,exec,uid=${USER_ID},gid=${GROUP_ID},mode=0755" \
  --workdir /work \
  "${PLAYWRIGHT_IMAGE}" \
  bash -lc '
    corepack pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store
    corepack pnpm build
    rm -f .astro/preview.json .astro/preview.log
    corepack pnpm test:e2e:run
  '
