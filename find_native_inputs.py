import re, os
root = os.path.dirname(os.path.abspath(__file__))
target = os.path.join(root, "apps", "web", "src")

tag_re = re.compile(r'<(input|select|textarea)\b', re.IGNORECASE)

for dirpath, _, files in os.walk(target):
    for fn in files:
        if fn.endswith((".tsx", ".ts", ".jsx", ".js")):
            p = os.path.join(dirpath, fn)
            with open(p, "r", encoding="utf-8") as f:
                for i, line in enumerate(f, 1):
                    if tag_re.search(line):
                        print(f"{os.path.relpath(p, root).replace(os.sep, '/')}:{i}: {line.rstrip()}")
