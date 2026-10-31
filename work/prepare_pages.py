"""Prepare a GitHub Pages artifact from the site's runtime files only."""
from pathlib import Path
import shutil
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / '_site'
FILES = ['index.html', 'local.css', 'myspace.css', 'local.js', 'transitions.js',
         'ourspace.js', 'myspace.js', 'interactive-text.js', 'brush-cursor.js', 'SOURCES.md']

def prepare():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for name in FILES:
        shutil.copy2(ROOT / name, OUTPUT / name)
    for name in ['assets', 'data', 'vendor']:
        shutil.copytree(ROOT / name, OUTPUT / name,
                        ignore=shutil.ignore_patterns('.DS_Store', '__pycache__', '*.pyc'))
    # Change cache keys whenever an entry script/style or engine data file changes.
    html = (OUTPUT / 'index.html').read_text()
    def versioned(match):
        path = match.group(2).split('?')[0]
        file = OUTPUT / path
        if not file.is_file():
            return match.group(0)
        digest = hashlib.sha256(file.read_bytes()).hexdigest()[:12]
        return match.group(1) + path + '?v=' + digest + '"'
    html = re.sub(r'((?:src|href)=")([^"]+)"', versioned, html)
    def config_versions(match):
        config = json.loads(match.group(1))
        for key in ('presets', 'svgMeta', 'timeline_en', 'timeline_fr', 'shadersBundle', 'info_json'):
            path = config[key].split('?')[0]
            file = OUTPUT / 'assets' / path
            digest = hashlib.sha256(file.read_bytes()).hexdigest()[:12]
            config[key] = path + '?v=' + digest
        return 'window.appConfig=' + json.dumps(config, separators=(',', ':')) + ';'
    html = re.sub(r'window.appConfig=(\{.*?\});', config_versions, html)
    (OUTPUT / 'index.html').write_text(html)
    (OUTPUT / '.nojekyll').touch()
    print(f'Pages artifact: {OUTPUT} ({sum(p.stat().st_size for p in OUTPUT.rglob("*") if p.is_file()):,} bytes)')

if __name__ == '__main__':
    prepare()
