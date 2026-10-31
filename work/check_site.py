"""Check the actual entry point and relative runtime assets without a browser/network."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

ROOT = Path(__file__).resolve().parent.parent
# Use a project-site prefix, not just /, to catch GitHub Pages path assumptions.
BASE = 'https://example.github.io/ourspace/'
checked = set()


def check(value, parent='index.html'):
    if not value or value.startswith(('#', 'data:', 'blob:', 'http:', 'https:', '//')):
        return
    url = urlparse(urljoin(urljoin(BASE, parent), value))
    if not url.path.startswith('/ourspace/'):
        raise AssertionError(f'Resource escapes the repository subdirectory: {parent}: {value}')
    relative = unquote(url.path[len('/ourspace/'):])
    path = ROOT / relative
    assert path.is_file(), f'Missing resource: {parent}: {value}'
    # Linux/GitHub Pages paths are case-sensitive; macOS often is not.
    current = ROOT
    for part in Path(relative).parts:
        assert part in {p.name for p in current.iterdir()}, f'Incorrect filename case: {relative}'
        current /= part
    checked.add(relative)


class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('src', 'href'):
                check(value)


def run():
    html = (ROOT / 'index.html').read_text()
    Links().feed(html)
    for source in ('myspace.js', 'ourspace.js'):
        for value in re.findall(r'(?:src|href)="([^"]+)"', (ROOT / source).read_text()):
            check(value)
    for source in ('local.css', 'myspace.css'):
        for value in re.findall(r'url\([\'"]?([^\)\'\"]+)', (ROOT / source).read_text()):
            check(value, source)
    config = json.loads(re.search(r'window.appConfig=(\{.*?\});', html).group(1))
    for key in ('presets', 'svgMeta', 'timeline_en', 'timeline_fr', 'shadersBundle', 'info_json'):
        check(config[key], 'assets/entry.js')
    meta = json.loads((ROOT / 'data/svg-meta.json').read_text())
    title = meta['svg/seq_title_en_3']
    check('assets/svgc/seq_title_en_3.' + title['checksum'] + '.svgc')
    assert not (ROOT / 'index.html').is_symlink()
    print(f'PASS: {len(checked)} entry-point, style, scene, font and engine resources resolve under /ourspace/ with exact case.')


if __name__ == '__main__':
    run()
