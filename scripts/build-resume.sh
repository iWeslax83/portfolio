#!/usr/bin/env bash
# Builds public/resume.pdf from resume.tex. The PDF is committed because
# Vercel has no TeX; rerun this whenever resume.tex changes.
set -euo pipefail

cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

pdflatex -interaction=nonstopmode -halt-on-error -output-directory "$TMP" resume.tex
mkdir -p public
cp "$TMP/resume.pdf" public/resume.pdf
echo "Wrote public/resume.pdf"
