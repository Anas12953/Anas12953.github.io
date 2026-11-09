from pathlib import Path
import json,gzip
root=Path(__file__).resolve().parent.parent
modules=[{'file':str(p.relative_to(root)),'raw':p.stat().st_size,'gzip':len(gzip.compress(p.read_bytes(),mtime=0))} for p in sorted((root/'js').rglob('*.js'))]
shared=['js/app.js','js/motion.js','js/premium.js','js/studio.js','js/studio-state.js']
by={}
for page,extra in {'home':['js/pages/home.js','js/portrait.js','js/world.js'],'about':['js/pages/about.js','js/portrait.js'],'projects':['js/pages/projects.js'],'project':[],'journey':[],'resources':[],'arabic':[],'play':['js/pages/play.js','js/game-state.js'],'notfound':['js/pages/notfound.js','js/game-state.js'],'contact':['js/pages/contact.js']}.items():
 names=shared+extra;by[page]={k:sum(m[k] for m in modules if m['file'] in names) for k in ['raw','gzip']}
report={'strategy':'Static multipage HTML, route-split native ESM. No third-party runtime. 3D scene lazy-loaded near viewport; sound loads only on opt-in. No production source maps. gzip values are deterministic local compression estimates, not measured wire transfer.','initial':{k:sum(m[k] for m in modules if m['file'] in ['js/app.js','js/motion.js']) for k in ['raw','gzip']},'byPageIncludingLazyFeatures':by,'optional':{m['file']:m for m in modules if m['file'] in ['js/cursor.js','js/sound.js']},'modules':modules,'total':{k:sum(m[k] for m in modules) for k in ['raw','gzip']}}
(root/'bundle-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'initial':report['initial'],'homeIncludingLazy':by['home'],'allModules':report['total']}))
