import os, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(os.getcwd())
TARGETS = [ROOT / "apps" / "web" / "src", ROOT / "packages" / "ui" / "src"]

# Tailwind color prefixes we care about, with optional alpha (e.g. bg-white/10, text-red-600)
TOKEN_RE = re.compile(
    r"\b(bg|text|border|from|via|to|ring|shadow|caret|accent|fill|stroke|outline|decoration|divide|placeholder|shadow)-(?:(?:black|white|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{3,4})?(?:/[\d.]+)?)\b",
    re.I,
)

def extract_classname_blocks(text):
    # match className="..." or className={`...`} or className={clsx("...", ...)}
    # but keep it simple: grab className attribute contents up to closing quote
    return re.findall(r'className\s*=\s*\{?(?:`([^`]*)`|"([^"]*)"|\'([^\']*)\')\}?', text)

results = defaultdict(list)  # file -> list of (line_no, token, context)

def contexts(blocks):
    parts = []
    for b in blocks:
        for sub in b:
            if sub:
                parts.append(sub)
    return parts

for target in TARGETS:
    for p in target.rglob("*.tsx"):
        text = p.read_text(encoding="utf-8", errors="ignore")
        blocks = contexts(extract_classname_blocks(text))
        for line_no, line in enumerate(text.splitlines(), 1):
            blocks_line = contexts(extract_classname_blocks(line))
            for blk in blocks_line:
                for tok in TOKEN_RE.findall(blk):
                    # token is tuple of prefix? re.findall with one group returns prefix
                    # But we need full token not just prefix. Use re.finditer instead
                    pass

# Use re.finditer instead
for target in TARGETS:
    for p in target.rglob("*.tsx"):
        text = p.read_text(encoding="utf-8", errors="ignore")
        seen = set()
        for line_no, line in enumerate(text.splitlines(), 1):
            blocks = contexts(extract_classname_blocks(line))
            for blk in blocks:
                for m in TOKEN_RE.finditer(blk):
                    tok = m.group(0)
                    if (p, line_no, tok) in seen:
                        continue
                    seen.add((p, line_no, tok))
                    results[tok].append(f"{p.relative_to(ROOT).as_posix()}:{line_no}")

# Group by color family
families = defaultdict(set)
for tok in sorted(results.keys()):
    core = tok.split("-")[1]
    core = re.sub(r"/.*", "", core)
    families[core].add(tok)

print("=== Atlas default-colour audit ===\n")
for core in sorted(families.keys()):
    toks = sorted(families[core])
    print(f"[{core}] tokens ({len(toks)}):")
    for t in toks:
        locs = results[t]
        print(f"  {t} -> {len(locs)} occurrences (first: {locs[0]})")
    print()

print("\n=== Files still using inline native form controls ===")
for target in TARGETS:
    for p in target.rglob("*.tsx"):
        text = p.read_text(encoding="utf-8", errors="ignore")
        hits = re.findall(r'<(input|textarea|select)\b', text, re.I)
        if hits:
            print(f"{p.relative_to(ROOT).as_posix()}: {len(hits)}")
