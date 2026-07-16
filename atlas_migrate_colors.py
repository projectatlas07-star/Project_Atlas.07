import os, re
from pathlib import Path

ROOT = Path(os.getcwd())
TARGETS = [ROOT / "apps" / "web" / "src", ROOT / "packages" / "ui" / "src"]

# Files with dark/explicitly-dark UI where white should be preserved
SKIP_WHITE_FILES = {
    "apps/web/src/app/(auth)/login/page.tsx",
    "apps/web/src/app/landing/page.tsx",
    "apps/web/src/app/landing/layout.tsx",
    "apps/web/src/app/offline.tsx",
    "apps/web/src/app/unauthorized.tsx",
    "apps/web/src/app/error.tsx",
    "apps/web/src/components/landing/CommandPalette.tsx",
    "apps/web/src/components/Sidebar.tsx",
    "apps/web/src/components/TopNavigation.tsx",
    "apps/web/src/components/landing/Header.tsx",
    "apps/web/src/components/landing/Hero.tsx",
    "apps/web/src/components/landing/Footer.tsx",
    "apps/web/src/components/landing/Features.tsx",
    "apps/web/src/components/landing/Pricing.tsx",
    "apps/web/src/components/landing/CTA.tsx",
    "apps/web/src/components/landing/Testimonials.tsx",
    "apps/web/src/app/admin/system-health/page.tsx",
}

# Token replacement map.
# Many mapping entries are generic.
TOKEN_MAP = {
    "bg-white": "bg-[var(--surface)]",
    "text-white": "text-[var(--foreground)]",
    "bg-gray-50": "bg-[var(--background-alt)]",
    "bg-gray-100": "bg-[var(--neutral-gray-100)]",
    "bg-gray-200": "bg-[var(--neutral-gray-200)]",
    "bg-gray-300": "bg-[var(--neutral-gray-300)]",
    "bg-gray-400": "bg-[var(--neutral-gray-400)]",
    "bg-gray-500": "bg-[var(--neutral-gray-500)]",
    "bg-gray-600": "bg-[var(--neutral-gray-600)]",
    "bg-gray-700": "bg-[var(--neutral-gray-700)]",
    "bg-gray-800": "bg-[var(--neutral-gray-800)]",
    "bg-gray-900": "bg-[var(--neutral-gray-900)]",
    "text-gray-50": "text-[var(--neutral-gray-50)]",
    "text-gray-100": "text-[var(--neutral-gray-100)]",
    "text-gray-200": "text-[var(--neutral-gray-200)]",
    "text-gray-300": "text-[var(--neutral-gray-300)]",
    "text-gray-400": "text-[var(--neutral-gray-400)]",
    "text-gray-500": "text-[var(--neutral-gray-500)]",
    "text-gray-600": "text-[var(--neutral-gray-600)]",
    "text-gray-700": "text-[var(--neutral-gray-700)]",
    "text-gray-800": "text-[var(--neutral-gray-800)]",
    "text-gray-900": "text-[var(--foreground)]",
    "border-gray-50": "border-[var(--neutral-gray-50)]",
    "border-gray-100": "border-[var(--neutral-gray-100)]",
    "border-gray-200": "border-[var(--neutral-gray-200)]",
    "border-gray-300": "border-[var(--neutral-gray-300)]",
    "border-gray-400": "border-[var(--neutral-gray-400)]",
    "border-gray-500": "border-[var(--neutral-gray-500)]",
    "border-gray-600": "border-[var(--neutral-gray-600)]",
    "border-gray-700": "border-[var(--neutral-gray-700)]",
    "border-gray-800": "border-[var(--neutral-gray-800)]",
    "border-gray-900": "border-[var(--neutral-gray-900)]",
    "placeholder-gray-500": "placeholder:text-[var(--neutral-gray-500)]",
    "text-blue-600": "text-[var(--color-info)]",
    "bg-blue-100": "bg-[var(--color-info)]/10",
    "bg-blue-600": "bg-[var(--color-info)]",
    "hover:bg-blue-700": "hover:bg-[var(--color-info)]",
    "text-green-600": "text-[var(--color-success)]",
    "text-green-700": "text-[var(--color-success)]",
    "bg-green-100": "bg-[var(--color-success)]/10",
    "bg-green-500": "bg-[var(--color-success)]",
    "bg-green-500/10": "bg-[var(--color-success)]/10",
    "bg-green-500/20": "bg-[var(--color-success)]/20",
    "border-green-500/30": "border-[var(--color-success)]/30",
    "bg-green-600": "bg-[var(--color-success)]",
    "hover:bg-green-700": "hover:bg-[var(--color-success)]",
    "text-red-600": "text-[var(--color-error)]",
    "text-red-700": "text-[var(--color-error)]",
    "text-red-800": "text-[var(--color-error)]",
    "text-red-900": "text-[var(--color-error)]",
    "bg-red-100": "bg-[var(--color-error)]/10",
    "bg-red-500": "bg-[var(--color-error)]",
    "bg-red-500/20": "bg-[var(--color-error)]/20",
    "border-red-200": "border-[var(--color-error)]/30",
    "border-red-500": "border-[var(--color-error)]",
    "border-red-500/50": "border-[var(--color-error)]/50",
    "text-red-500": "text-[var(--color-error)]",
    "text-red-200": "text-[var(--color-error)]",
    "bg-red": "bg-[var(--color-error)]",
    "hover:bg-red-700": "hover:bg-[var(--color-error)]",
    "text-yellow-600": "text-[var(--color-warning)]",
    "text-yellow-700": "text-[var(--color-warning)]",
    "text-yellow-800": "text-[var(--color-warning)]",
    "text-yellow-900": "text-[var(--color-warning)]",
    "bg-yellow-100": "bg-[var(--color-warning)]/10",
    "bg-yellow-500": "bg-[var(--color-warning)]",
    "border-yellow-200": "border-[var(--color-warning)]/30",
    "bg-yellow": "bg-[var(--color-warning)]",
    "text-orange-600": "text-[var(--color-warning)]",
    "bg-orange-100": "bg-[var(--color-warning)]/10",
    "bg-orange-500": "bg-[var(--color-warning)]",
    "bg-orange": "bg-[var(--color-warning)]",
    "text-pink-600": "text-[var(--color-error)]",
    "bg-pink-100": "bg-[var(--color-error)]/10",
    "text-purple-600": "text-[var(--brand-purple)]",
    "bg-purple-100": "bg-[var(--brand-purple)]/10",
    "bg-purple-500": "bg-[var(--brand-purple)]",
    "bg-purple-600": "bg-[var(--brand-purple)]",
    "bg-purple-700": "bg-[var(--brand-purple)]",
    "hover:bg-purple-700": "hover:bg-[var(--brand-purple)]",
    "text-indigo-600": "text-[var(--brand-purple)]",
    "bg-indigo-100": "bg-[var(--brand-purple)]/10",
    "bg-indigo-600": "bg-[var(--brand-purple)]",
    "bg-indigo-700": "bg-[var(--brand-purple)]",
    "from-red-500/20": "from-[var(--color-error)]/20",
    "to-red-600/20": "to-[var(--color-error)]/20",
    "from-orange-500/20": "from-[var(--color-warning)]/20",
    "to-orange-600/20": "to-[var(--color-warning)]/20",
    "to-purple-500": "to-[var(--brand-purple)]",
    "to-gray-600/20": "to-[var(--neutral-gray-600)]/20",
    "text-red-900/50": "text-[var(--color-error)]/50",
    "text-red-500/50": "text-[var(--color-error)]/50",
    "text-yellow-700/50": "text-[var(--color-warning)]/50",
    "text-green-700/50": "text-[var(--color-success)]/50",
    "text-blue-700/50": "text-[var(--color-info)]/50",
}

# Opacity variants for white should be skipped in white-allowed files.
WHITE_PREFIX = ("bg-white", "text-white", "border-white", "placeholder-white", "from-white", "to-white")

def should_replace(token, rel):
    if token in TOKEN_MAP:
        if rel in SKIP_WHITE_FILES and token.startswith(WHITE_PREFIX):
            return False
        return True
    return False

# className attribute patterns: double quotes, single quotes, backticks
CLASSNAME_RE = re.compile(
    r'className\s*=\s*(?:\{\s*(?:`([^`]*)`|"([^"]*)"|\'([^\']*)\'))|\{\s*(?:`([^`]*)`|"([^"]*)"|\'([^\']*)\')\s*\}|`([^`]*)`|"([^"]*)"|\'([^\']*)\''
)

def process_file(path):
    rel = path.relative_to(ROOT).as_posix()
    text = path.read_text(encoding="utf-8")
    new_text = text
    changed = set()

    def replacer(match):
        groups = [g for g in match.groups() if g is not None]
        if not groups:
            return match.group(0)
        block = groups[0]
        tokens = block.split()
        new_tokens = []
        for tok in tokens:
            if tok in TOKEN_MAP and not (rel in SKIP_WHITE_FILES and tok.startswith(WHITE_PREFIX)):
                new_tokens.append(TOKEN_MAP[tok])
                changed.add(tok)
            else:
                new_tokens.append(tok)
        new_block = " ".join(new_tokens)
        full = match.group(0)
        # Replace the captured block in the original match
        return full.replace(block, new_block)

    new_text = CLASSNAME_RE.sub(replacer, text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        print(f"updated {rel} ({len(changed)} unique tokens: {', '.join(sorted(changed))})")
        return True
    return False


def main():
    count = 0
    for target in TARGETS:
        for p in target.rglob("*.tsx"):
            if process_file(p):
                count += 1
    print(f"\n{count} files updated")


if __name__ == "__main__":
    main()
