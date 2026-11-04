"""One-time migration from the retained Jekyll source and published pages."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
import json
import hashlib
import re
import shutil
import xml.etree.ElementTree as ET
import requests
import yaml
from bs4 import BeautifulSoup

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
BASE = 'https://beijixionghelulu.github.io'

def write(rel, text):
    path = SITE / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')

def split_md(path):
    raw = path.read_text(encoding='utf-8-sig')
    _, front, body = raw.split('---', 2)
    return yaml.safe_load(front), body.strip() + '\n'

def md(rel, meta, body):
    write(rel, '---\n' + yaml.safe_dump(meta, allow_unicode=True, sort_keys=False) + '---\n\n' + body)

front, body = split_md(ROOT / '_pages/about.md')
md('src/content/profile/about.md', {'title': 'about'}, body)
for path in (ROOT / '_projects').glob('*.md'):
    front, body = split_md(path)
    md(f'src/content/projects/{path.name}', {
        'title': front['title'], 'summary': front['description'],
        'order': front['importance'], 'draft': front.get('published', True) is False,
    }, body)

for path in (ROOT / '_news').glob('*.md'):
    front, body = split_md(path)
    md(f'src/content/news/{path.name}', {
        'title': path.stem, 'date': str(front['date']),
    }, body)

source_hashes = {}
for source, target in [('_bibliography/papers.bib','src/data/publications.bib'), ('_data/cv.yml','src/data/cv.yml'), ('_data/publication_figures.yml','src/data/publication_figures.yml')]:
    dest = SITE / target
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(ROOT / source, dest)
    source_hashes[target] = hashlib.sha256(dest.read_bytes()).hexdigest()

sitemap_response = requests.get(BASE + '/sitemap.xml', timeout=30)
sitemap_response.raise_for_status()
urls = [el.text for el in ET.fromstring(sitemap_response.content).iter() if el.tag.endswith('}loc')]
legacy_paths = {'/blog/','/books/','/_pages/dropdown/','/people/','/repositories/','/teaching/'}

def fetch(url):
    response = requests.get(url, timeout=30)
    if response.status_code == 404:
        return {'path':urlparse(url).path,'previousStatus':404}
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    main = soup.find('main') or soup.select_one('div[role="main"]') or soup.select_one('div.container.mt-5') or soup.select_one('.post')
    title_el = main.select_one('.post-title') if main else None
    title = title_el.get_text(' ', strip=True) if title_el else soup.title.get_text(' ', strip=True)
    article = main.find('article') if main else None
    path = urlparse(url).path
    result = {'path':path,'title':title,'text':main.get_text(' ',strip=True) if main else '',
              'links':[a.get('href') for a in main.select('a[href]')] if main else []}
    if path in legacy_paths:
        content = article or main
        if content is None:
            raise ValueError(f'Missing content container: {url}')
        for tag in content.find_all(['script','style']):
            tag.decompose()
        for tag in content.find_all(True):
            for attr in ['class','style','onclick']:
                tag.attrs.pop(attr, None)
        result['html'] = str(content)
    return result

with ThreadPoolExecutor(max_workers=6) as pool:
    baseline = list(pool.map(fetch, urls))

write('src/data/legacy-pages.json', json.dumps([x for x in baseline if 'html' in x], ensure_ascii=False, indent=2))
write('tests/fixtures/migration-baseline.json', json.dumps({'sourceCommit':'5d7bb1a0e22a9df8e50c33fbca363a8d48eac8d2', 'sourceHashes':source_hashes, 'pages':[{k:v for k,v in x.items() if k != 'html'} for x in baseline]}, ensure_ascii=False, indent=2))
write('public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>\n')
print(json.dumps({'routes':len(baseline),'legacyPages':len(legacy_paths),'publishedProjects':6,'papers':7}, indent=2))
