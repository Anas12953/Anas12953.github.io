from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import json,re,subprocess
root=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.h1=0;self.links=[];self.ids=[];self.meta={};self.canonical=[];self.json=[];self.title='';self.in_title=False;self.in_json=False;self.buffer='';self.img=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id' in d:self.ids.append(d['id'])
  if tag in ['a','script','link','img']:
   key='href' if tag in ['a','link'] else 'src'
   if d.get(key):self.links.append(d[key])
  if tag=='meta':self.meta[d.get('name',d.get('property',''))]=d.get('content','')
  if tag=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if tag=='title':self.in_title=True
  if tag=='script' and d.get('type')=='application/ld+json':self.in_json=True;self.buffer=''
  if tag=='img':self.img.append(d)
 def handle_data(self,data):
  if self.in_title:self.title+=data
  if self.in_json:self.buffer+=data
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_json:self.json.append(json.loads(self.buffer));self.in_json=False
errors=[];titles=set();descs=set();parses={p:Page(p.read_text()) for p in root.rglob('*.html') if '.git' not in str(p) and 'qa' not in p.parts}
for p,s in parses.items():
 rel=p.relative_to(root)
 if s.h1!=1:errors.append(f'{rel}: {s.h1} h1')
 if not s.title or s.title in titles:errors.append(f'{rel}: title missing/duplicate')
 titles.add(s.title)
 desc=s.meta.get('description')
 if not desc or desc in descs:errors.append(f'{rel}: description missing/duplicate')
 descs.add(desc)
 if len(s.canonical)!=1 or not s.canonical[0].startswith('https://anas12953.github.io'):errors.append(f'{rel}: canonical')
 if len(s.ids)!=len(set(s.ids)):errors.append(f'{rel}: duplicate IDs')
 if not s.json:errors.append(f'{rel}: missing structured data')
 for key in ['og:title','og:description','og:image','og:image:alt','twitter:image','twitter:image:alt']:
  if not s.meta.get(key):errors.append(f'{rel}: missing {key}')
 for img in s.img:
  if 'alt' not in img:errors.append(f'{rel}: missing image alt')
 for link in s.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=root/unquote(u.path).lstrip('/') if u.path.startswith('/') else p.parent/unquote(u.path)
  if not u.path:target=p
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{rel}: broken {link}')
  elif u.fragment and target.suffix=='.html' and unquote(u.fragment) not in parses[target.resolve()].ids:errors.append(f'{rel}: missing anchor {link}')
for p in (root/'js').rglob('*.js'):
 result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
 if result.returncode:errors.append(result.stderr)
if errors:
 print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(parses)} pages, unique titles/descriptions, one H1, canonical and social metadata, JSON-LD, all local assets/links/anchors, JavaScript syntax.')
