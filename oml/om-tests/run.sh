#!/bin/bash
set -uvx
set -e
deno run --allow-all ./debug.mjs "$1"
