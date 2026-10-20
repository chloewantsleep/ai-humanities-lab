// Preserve every base resolution. Import only the added packages' exact versions/integrities
// from Poetry Gem's npm lockfile, because registry access is unavailable in this session.
const fs = require('node:fs');
const path = require('node:path');
const poetry = '/Users/madeleinewoods/Development/eng-298ai-mw/poetry-gem';
const yaml = require(path.join(poetry, 'node_modules/js-yaml'));
const root = path.resolve(__dirname, '../../nextjs');
const lockPath = path.join(root, 'pnpm-lock.yaml');
const original = fs.readFileSync(lockPath, 'utf8');
const lock = yaml.load(original);
const npm = JSON.parse(fs.readFileSync(path.join(poetry, 'package-lock.json'), 'utf8')).packages;
const addedPackages = {}, addedSnapshots = {};
function add(name) {
  const p = npm[`node_modules/${name}`];
  if (!p) throw Error(`Missing source lock entry: ${name}`);
  const key = `${name}@${p.version}`;
  const peers = name === '@anthropic-ai/sdk' ? '(zod@4.6.7)' : '';
  const snapKey = key + peers;
  if (lock.packages[key] && lock.snapshots[snapKey]) return p.version + peers;
  if (addedPackages[key]) return p.version + peers;
  const meta = {resolution: {integrity: p.integrity}};
  for (const k of ['engines', 'peerDependencies', 'peerDependenciesMeta']) if (p[k]) meta[k] = p[k];
  if (p.bin) meta.hasBin = true;
  addedPackages[key] = meta;
  const deps = Object.fromEntries(Object.keys(p.dependencies || {}).map(n => [n, add(n)]));
  if (peers) deps.zod = '4.6.7';
  addedSnapshots[snapKey] = Object.keys(deps).length ? {dependencies: deps} : {};
  return p.version + peers;
}
const sdk = add('@anthropic-ai/sdk');
const server = add('server-only');
const ts = add('typescript');
const dump = value => yaml.dump(value, {lineWidth: -1, noRefs: true});
const indent = text => text.split('\n').filter(Boolean).map(l => '  '+l).join('\n')+'\n';
let text = original.replace('    dependencies:\n', `    dependencies:\n      '@anthropic-ai/sdk':\n        specifier: 0.135.0\n        version: ${sdk}\n      server-only:\n        specifier: 0.0.1\n        version: ${server}\n`);
text = text.replace('\npackages:\n', `\n    devDependencies:\n      typescript:\n        specifier: 5.9.3\n        version: ${ts}\n      '@types/node':\n        specifier: 26.6.5\n        version: 26.6.5\n      '@types/react':\n        specifier: 19.3.0\n        version: 19.3.0\n\npackages:\n\n${indent(dump(addedPackages))}`);
text += '\n' + indent(dump(addedSnapshots));
const next = yaml.load(text);
for (const section of ['packages','snapshots']) for (const [key, value] of Object.entries(lock[section])) {
  if (JSON.stringify(next[section][key]) !== JSON.stringify(value)) throw Error(`Changed base resolution ${key}`);
}
fs.writeFileSync(lockPath, text);
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.dependencies['@anthropic-ai/sdk'] = '0.135.0';
pkg.dependencies['server-only'] = '0.0.1';
pkg.devDependencies = {typescript: '5.9.3', '@types/node': '26.6.5', '@types/react': '19.3.0'};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2)+'\n');
console.log(`Added ${Object.keys(addedPackages).length} locked packages; all original resolutions unchanged.`);
