"""Create a source folder/ZIP ready to extract and upload as a GitHub repository."""
from pathlib import Path
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent.parent
NAME = 'ourspace-github'
RELEASES = ROOT / 'releases'
FOLDER = RELEASES / NAME
ARCHIVE = RELEASES / (NAME + '-20261101.zip')
FILES = ['index.html', 'loading.js', 'local.css', 'myspace.css', 'local.js', 'transitions.js',
         'ourspace.js', 'myspace.js', 'interactive-text.js', 'handwritten-assets.js', 'handwritten-pictures.js', 'brush-cursor.js',
         '.gitignore', '.nojekyll', 'start.command', 'README.md', 'DEPLOYMENT.md',
         'REVIEW.md', 'SOURCES.md', 'SOURCES.json']
HELPERS = ['serve.py', 'check_site.py', 'prepare_pages.py', 'package_release.py']

if __name__ == '__main__':
    RELEASES.mkdir(exist_ok=True)
    if FOLDER.exists():
        shutil.rmtree(FOLDER)
    FOLDER.mkdir()
    for name in FILES:
        shutil.copy2(ROOT / name, FOLDER / name)
    for name in ['assets', 'data', 'vendor', '.github']:
        shutil.copytree(ROOT / name, FOLDER / name,
                        ignore=shutil.ignore_patterns('.DS_Store', '__pycache__', '*.pyc'))
    (FOLDER / 'work').mkdir()
    for name in HELPERS:
        shutil.copy2(ROOT / 'work' / name, FOLDER / 'work' / name)
    with zipfile.ZipFile(ARCHIVE, 'w', zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(FOLDER.rglob('*')):
            if file.is_file():
                archive.write(file, Path(NAME) / file.relative_to(FOLDER))
    with zipfile.ZipFile(ARCHIVE) as archive:
        assert archive.testzip() is None
        names = set(archive.namelist())
        for required in ['index.html', '.github/workflows/pages.yml', '.nojekyll',
                         'work/check_site.py', 'work/prepare_pages.py',
                         'assets/fonts/PatrickHand-Regular.ttf', 'assets/fonts/OFL-PatrickHand.txt']:
            assert NAME + '/' + required in names, required
        assert not any('/_site/' in name or '/releases/' in name or 'preview-' in name for name in names)
    print(f'ZIP: {ARCHIVE}\nFolder: {FOLDER}\nZIP bytes: {ARCHIVE.stat().st_size:,}')
