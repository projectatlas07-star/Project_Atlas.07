import re
import os

root = os.getcwd()
targets = [
    os.path.join(root, "apps", "web", "src"),
    os.path.join(root, "packages", "ui", "src"),
]

patterns = {}

for t in targets:
    if not os.path.isdir(t):
        continue

    for dirpath, _, files in os.walk(t):
        for fn in files:
            if fn.endswith((".tsx", ".ts", ".jsx", ".js")):
                p = os.path.join(dirpath, fn)

                with open(p, "r", encoding="utf-8") as f:
                    text = f.read()

                for m in re.finditer(
                    r"<(input|textarea|select)([^>]*?)>",
                    text,
                    re.S | re.I,
                ):
                    attrs = m.group(2)
                    cls = re.search(
                        r'className=["\'`{]([^"\'`}]+)',
                        attrs,
                    )

                    if cls:
                        patterns.setdefault(cls.group(1), []).append(
                            os.path.relpath(p, root).replace("\\", "/")
                        )

for cls, locs in sorted(patterns.items(), key=lambda x: -len(x[1])):
    print(f"({len(locs)}x) {cls}")
    for loc in sorted(set(locs)):
        print(f"    {loc}")
    print()
    