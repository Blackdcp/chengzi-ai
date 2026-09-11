import glob
import os

files = glob.glob("/Users/black/Documents/Chengzi/src/content/guides/**/*.md", recursive=True)
count = 0
for f in files:
    with open(f, "r", encoding="utf-8") as fp:
        content = fp.read()
    if "1300" in content:
        new_content = content.replace("¥1300", "¥1400").replace("￥1300", "￥1400").replace("¥ 1300", "¥ 1400").replace("1300 (", "1400 (")
        with open(f, "w", encoding="utf-8") as fp:
            fp.write(new_content)
        count += 1
        print(f"Updated: {os.path.basename(f)}")

print(f"Total updated files: {count}")
