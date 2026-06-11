// Static site build: copies the site into public/ and replaces
// <!-- @include name --> markers with the matching partials/<name>.html.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'public');
const EXCLUDE = new Set([
  '.git', '.claude', '.vercel', 'node_modules', 'public', 'partials',
  'build.js', 'package.json', 'package-lock.json', '.gitignore', 'README.md',
]);

const partials = {};
for (const f of fs.readdirSync(path.join(ROOT, 'partials'))) {
  partials[path.basename(f, '.html')] = fs.readFileSync(path.join(ROOT, 'partials', f), 'utf8');
}

let pages = 0;
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (src === ROOT && EXCLUDE.has(e.name)) continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) {
      copyDir(s, d);
    } else if (e.name.endsWith('.html')) {
      let html = fs.readFileSync(s, 'utf8');
      html = html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (m, name) => {
        if (!partials[name]) throw new Error(`Unknown partial "${name}" in ${s}`);
        return partials[name];
      });
      fs.writeFileSync(d, html);
      pages++;
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyDir(ROOT, OUT);
console.log(`Built ${pages} pages to public/`);
