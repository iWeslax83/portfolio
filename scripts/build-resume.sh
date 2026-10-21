#!/usr/bin/env bash
# Builds public/resume.pdf from resume.tex. The PDF is committed because
# Vercel has no TeX; rerun this whenever resume.tex changes.
set -euo pipefail

cd "$(dirname "$0")/.."

for f in fullpage.sty english.ldf; do
  if [ -z "$(kpsewhich "$f" 2>/dev/null)" ]; then
    echo "Missing TeX file $f. Install: texlive-fullpage texlive-babel-english" >&2
    exit 1
  fi
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

pdflatex -interaction=nonstopmode -halt-on-error -output-directory "$TMP" resume.tex
mkdir -p public
cp "$TMP/resume.pdf" public/resume.pdf
sha256sum resume.tex | cut -d" " -f1 > src/data/resume-source.sha256
echo "Wrote public/resume.pdf and src/data/resume-source.sha256"
