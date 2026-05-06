// Auto-generation pipeline for token-derived documentation.
//
// Reads src/theme/tokens.ts and regenerates the marked sections of:
//   - CLAUDE.md
//   - docs/strategy/cornr-design-system-for-claude-design.md
//
// Usage:
//   node scripts/generate-token-docs.ts          # regenerate
//   node scripts/generate-token-docs.ts --check  # exit 1 if drift
//
// See scripts/README.md for the full pipeline contract.
//
// Design notes:
// - Single file by intent. Audit value of "open one file, see everything"
//   beats modularity for a script of this size.
// - Zero new npm dependencies. Node 24 strips TypeScript types natively;
//   .ts extensions on imports are required at runtime (hence
//   allowImportingTsExtensions in tsconfig).
// - Date stamps use git-derived ISO date of HEAD when the script runs,
//   not Date.now(), so regenerated output is deterministic across days.

import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import {
  colors,
  spacing,
  typography,
  shadow,
} from '../src/theme/tokens.ts';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_PATH = join(REPO_ROOT, 'src', 'theme', 'tokens.ts');
const CLAUDE_MD = join(REPO_ROOT, 'CLAUDE.md');
const DESIGN_SYSTEM_MD = join(
  REPO_ROOT,
  'docs',
  'strategy',
  'cornr-design-system-for-claude-design.md',
);

// ───── PREFLIGHT ─────────────────────────────────────────────────────────

const FORBIDDEN_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bprocess\./g, 'process.'],
  [/\brequire\(/g, 'require('],
  [/(?<![a-zA-Z_])import\s*\(/g, 'dynamic import('],
];

function lintTokensSource(source: string): string[] {
  const errors: string[] = [];
  for (const [re, name] of FORBIDDEN_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(source)) {
      errors.push(`tokens.ts contains forbidden runtime pattern: ${name}`);
    }
  }
  return errors;
}

const MARKER_RE =
  /<!-- TOKEN-DOCS:START name=([a-z0-9_-]+) -->([\s\S]*?)<!-- TOKEN-DOCS:END name=\1 -->/g;
const START_RE = /<!-- TOKEN-DOCS:START name=([a-z0-9_-]+) -->/g;
const END_RE = /<!-- TOKEN-DOCS:END name=([a-z0-9_-]+) -->/g;

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

// Preflight check (a): nested TOKEN-DOCS literal inside marker content
// Preflight check (b): unpaired markers (open without matching close, etc.)
function validateTargetIntegrity(source: string, filePath: string): string[] {
  const errors: string[] = [];
  const startCounts = new Map<string, number[]>();
  const endCounts = new Map<string, number[]>();

  let m: RegExpExecArray | null;
  START_RE.lastIndex = 0;
  while ((m = START_RE.exec(source)) !== null) {
    const name = m[1];
    const lineNum = lineNumberAt(source, m.index);
    const arr = startCounts.get(name) ?? [];
    arr.push(lineNum);
    startCounts.set(name, arr);
  }
  END_RE.lastIndex = 0;
  while ((m = END_RE.exec(source)) !== null) {
    const name = m[1];
    const lineNum = lineNumberAt(source, m.index);
    const arr = endCounts.get(name) ?? [];
    arr.push(lineNum);
    endCounts.set(name, arr);
  }

  const allNames = new Set([...startCounts.keys(), ...endCounts.keys()]);
  for (const name of allNames) {
    const starts = startCounts.get(name) ?? [];
    const ends = endCounts.get(name) ?? [];
    if (starts.length !== ends.length) {
      errors.push(
        `${filePath}: marker '${name}' unpaired — ${starts.length} START vs ${ends.length} END`,
      );
    }
  }

  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(source)) !== null) {
    const [, name, content] = m;
    if (/TOKEN-DOCS:(START|END)/.test(content)) {
      const lineNum = lineNumberAt(source, m.index);
      errors.push(
        `${filePath}:${lineNum}: marker '${name}' content contains nested TOKEN-DOCS literal`,
      );
    }
  }

  return errors;
}

// ───── HELPERS ───────────────────────────────────────────────────────────

function getHeadIsoDate(): string {
  const isoFull = execSync('git log -1 --format=%cI', { cwd: REPO_ROOT })
    .toString()
    .trim();
  return isoFull.split('T')[0];
}

// camelCase → kebab-case (warm600 → warm-600, swipeOverlayLove → swipe-overlay-love)
function kebab(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

// ───── SOURCE-TEXT EXTRACTORS (for comments + section headers) ──────────

type ColorEntry = { key: string; value: string; comment: string };
type ColorGroup = { name: string; items: ColorEntry[] };

function sliceObjectLiteralBody(source: string, exportName: string): string {
  const start = source.indexOf(`export const ${exportName} = {`);
  if (start === -1) {
    throw new Error(`Could not find export const ${exportName} in tokens.ts`);
  }
  const end = source.indexOf('\n} as const;', start);
  if (end === -1) {
    throw new Error(`Could not find closing of ${exportName} object literal`);
  }
  const openBrace = source.indexOf('{', start);
  return source.slice(openBrace + 1, end);
}

function extractColorGroups(source: string): ColorGroup[] {
  const block = sliceObjectLiteralBody(source, 'colors');
  const groups: ColorGroup[] = [];
  let current: ColorGroup | null = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim()) continue;

    const keyMatch = line.match(
      /^\s*(\w+):\s*'([^']+)'\s*,?\s*(?:\/\/\s*(.+))?$/,
    );
    if (keyMatch) {
      const [, key, value, comment] = keyMatch;
      if (!current) {
        current = { name: 'Tokens', items: [] };
        groups.push(current);
      }
      current.items.push({ key, value, comment: (comment ?? '').trim() });
      continue;
    }

    const sectionMatch = line.match(/^\s*\/\/\s+(.+)$/);
    if (sectionMatch) {
      const name = sectionMatch[1].trim();
      current = { name, items: [] };
      groups.push(current);
      continue;
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

type RadiusEntry = { key: string; value: number; comment: string };

function extractRadiusEntries(source: string): RadiusEntry[] {
  const block = sliceObjectLiteralBody(source, 'radius');
  const entries: RadiusEntry[] = [];
  for (const rawLine of block.split('\n')) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim()) continue;
    const m = line.match(/^\s*(\w+):\s*(\d+)\s*,?\s*(?:\/\/\s*(.+))?$/);
    if (m) {
      const [, key, value, comment] = m;
      entries.push({
        key,
        value: Number(value),
        comment: (comment ?? '').trim(),
      });
    }
  }
  return entries;
}

// ───── CONTENT GENERATORS ────────────────────────────────────────────────

const WARNING_LINES = [
  '> ⚠️ AUTO-GENERATED from `src/theme/tokens.ts` by `scripts/generate-token-docs.ts`.',
  '> Do not edit by hand — changes here are overwritten on next regeneration.',
  '> Re-run `npm run docs:tokens` after any tokens.ts change.',
];

function withWarning(body: string): string {
  return `\n${WARNING_LINES.join('\n')}\n\n${body.trim()}\n`;
}

// Family / weight extraction from fontFamily strings
type FamilyWeight = { family: string; weight: string };

function splitFontFamily(fontFamily: string): FamilyWeight {
  const m = fontFamily.match(/^([A-Z][A-Za-z]+)-(.+)$/);
  if (m) {
    const [, fam, weight] = m;
    return { family: humaniseFamily(fam), weight: humaniseWeight(weight) };
  }
  if (fontFamily === 'NewsreaderItalic') {
    return { family: 'Newsreader Italic', weight: '400' };
  }
  if (fontFamily === 'DMSans') {
    return { family: 'DM Sans', weight: '400' };
  }
  return { family: fontFamily, weight: '400' };
}

function humaniseFamily(fam: string): string {
  if (fam === 'DMSans') return 'DM Sans';
  if (fam === 'NewsreaderItalic') return 'Newsreader Italic';
  return fam;
}

function humaniseWeight(weight: string): string {
  const map: Record<string, string> = {
    Regular: '400',
    Medium: '500',
    SemiBold: '600',
    Bold: '700',
    Italic: '400 italic',
  };
  return map[weight] ?? weight;
}

// Role display labels for CLAUDE.md (sentence case)
const ROLE_LABELS_CLAUDE: Record<string, string> = {
  display: 'Display',
  screenTitle: 'Screen title',
  sectionHeading: 'Section heading',
  cardHeading: 'Card heading',
  body: 'Body',
  uiLabel: 'UI label',
  badge: 'Badge/chip',
  cta: 'CTA label',
  quote: 'Quote',
  essence: 'Essence',
  behaviouralTruth: 'Behavioural truth',
  observation: 'Observation',
};

function claudeMdPalette(source: string): string {
  const groups = extractColorGroups(source);
  const lines: string[] = [];
  lines.push('| Token | Hex | Use |');
  lines.push('|---|---|---|');
  for (const group of groups) {
    for (const item of group.items) {
      lines.push(`| ${kebab(item.key)} | ${item.value} | ${item.comment || '—'} |`);
    }
  }
  return withWarning(lines.join('\n'));
}

function claudeMdTypography(): string {
  const lines: string[] = [];
  lines.push('| Role | Family | Size | Weight | Line height | Letter spacing |');
  lines.push('|---|---|---|---|---|---|');
  for (const [role, def] of Object.entries(typography) as Array<
    [string, { fontFamily: string; fontSize: number; lineHeight: number; letterSpacing?: number }]
  >) {
    const { family, weight } = splitFontFamily(def.fontFamily);
    const size = `${def.fontSize}px`;
    const lh = `${def.lineHeight}px`;
    const ls = def.letterSpacing;
    const tracking = ls === undefined ? '—' : `${ls}px`;
    const label = ROLE_LABELS_CLAUDE[role] ?? role;
    lines.push(`| ${label} | ${family} | ${size} | ${weight} | ${lh} | ${tracking} |`);
  }
  return withWarning(lines.join('\n'));
}

// Design-system markdown generators

// Palette generator: Tier 1 cluster ONLY (core neutrals, accent, semantic,
// AI teal, swipe overlays). Tier 2 (archetype themes) and Tier 3 (tinted
// surfaces) stay hand-curated outside the marker per Stage 2 amendment 2.
function designSystemPalette(source: string): string {
  const groups = extractColorGroups(source);
  const lines: string[] = [];
  for (const [i, group] of groups.entries()) {
    lines.push(`**${group.name}**`);
    lines.push('');
    lines.push('| Token | Value | Use |');
    lines.push('|---|---|---|');
    for (const item of group.items) {
      lines.push(`| \`${item.key}\` | \`${item.value}\` | ${item.comment || '—'} |`);
    }
    if (i < groups.length - 1) lines.push('');
  }
  return withWarning(lines.join('\n'));
}

function designSystemTypography(): string {
  const lines: string[] = [];
  lines.push('| Role | Family | Size | Line height | Letter spacing |');
  lines.push('|---|---|---|---|---|');
  for (const [role, def] of Object.entries(typography) as Array<
    [string, { fontFamily: string; fontSize: number; lineHeight: number; letterSpacing?: number }]
  >) {
    const fam = def.fontFamily;
    const ls = def.letterSpacing;
    const tracking = ls === undefined ? '—' : ls;
    lines.push(`| \`${role}\` | ${fam} | ${def.fontSize} | ${def.lineHeight} | ${tracking} |`);
  }
  return withWarning(lines.join('\n'));
}

function designSystemSpacing(): string {
  const lines: string[] = [];
  lines.push('| Token | px |');
  lines.push('|---|---|');
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`| \`${key}\` | ${value} |`);
  }
  return withWarning(lines.join('\n'));
}

function designSystemRadii(source: string): string {
  const entries = extractRadiusEntries(source);
  const lines: string[] = [];
  const hasComments = entries.some((e) => e.comment);
  if (hasComments) {
    lines.push('| Token | px | Use |');
    lines.push('|---|---|---|');
    for (const e of entries) {
      lines.push(`| \`${e.key}\` | ${e.value} | ${e.comment || '—'} |`);
    }
  } else {
    lines.push('| Token | px |');
    lines.push('|---|---|');
    for (const e of entries) {
      lines.push(`| \`${e.key}\` | ${e.value} |`);
    }
  }
  return withWarning(lines.join('\n'));
}

function designSystemShadows(): string {
  const c = shadow.card;
  const s = shadow.swipe;
  const lines: string[] = [];
  lines.push('```ts');
  lines.push(
    `shadow.card  → { shadowOpacity: ${c.shadowOpacity}, shadowRadius: ${c.shadowRadius}, shadowOffset: { width: ${c.shadowOffset.width}, height: ${c.shadowOffset.height} }, elevation: ${c.elevation} }`,
  );
  lines.push(
    `shadow.swipe → { shadowOpacity: ${s.shadowOpacity}, shadowRadius: ${s.shadowRadius}, shadowOffset: { width: ${s.shadowOffset.width}, height: ${s.shadowOffset.height} }, elevation: ${s.elevation} }`,
  );
  lines.push('```');
  lines.push('');
  lines.push(`\`shadowColor\` for both is \`colors.ink\` (\`${colors.ink}\`).`);
  return withWarning(lines.join('\n'));
}

// ───── TARGETS TABLE ─────────────────────────────────────────────────────

type Target = {
  path: string;
  markers: { name: string; generator: () => string }[];
};

function buildTargets(tokensSource: string): Target[] {
  return [
    {
      path: CLAUDE_MD,
      markers: [
        { name: 'palette', generator: () => claudeMdPalette(tokensSource) },
        { name: 'typography', generator: () => claudeMdTypography() },
      ],
    },
    {
      path: DESIGN_SYSTEM_MD,
      markers: [
        { name: 'palette', generator: () => designSystemPalette(tokensSource) },
        { name: 'typography', generator: () => designSystemTypography() },
        { name: 'spacing', generator: () => designSystemSpacing() },
        { name: 'radii', generator: () => designSystemRadii(tokensSource) },
        { name: 'shadows', generator: () => designSystemShadows() },
      ],
    },
  ];
}

// ───── MARKER ENGINE ─────────────────────────────────────────────────────

function applyMarker(
  source: string,
  name: string,
  generator: () => string,
): string {
  const re = new RegExp(
    `<!-- TOKEN-DOCS:START name=${name} -->([\\s\\S]*?)<!-- TOKEN-DOCS:END name=${name} -->`,
  );
  if (!re.test(source)) {
    throw new Error(`Marker '${name}' not found in target file`);
  }
  const replacement = `<!-- TOKEN-DOCS:START name=${name} -->${generator()}<!-- TOKEN-DOCS:END name=${name} -->`;
  return source.replace(re, replacement);
}

function applyAllMarkers(source: string, target: Target): string {
  let result = source;
  for (const { name, generator } of target.markers) {
    result = applyMarker(result, name, generator);
  }
  // Normalise: \r\n → \n, ensure exactly one trailing newline
  result = result.replace(/\r\n/g, '\n');
  if (!result.endsWith('\n')) result += '\n';
  result = result.replace(/\n+$/, '\n');
  return result;
}

// ───── CLI ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const isCheck = process.argv.includes('--check');

  // 1. Lint tokens.ts
  const tokensSource = await readFile(TOKENS_PATH, 'utf8');
  const lintErrors = lintTokensSource(tokensSource);
  if (lintErrors.length > 0) {
    for (const e of lintErrors) console.error(e);
    process.exit(2);
  }

  const targets = buildTargets(tokensSource);

  // 2. Validate target integrity (both modes, before any regen)
  const integrityErrors: string[] = [];
  for (const target of targets) {
    const text = await readFile(target.path, 'utf8');
    integrityErrors.push(...validateTargetIntegrity(text, target.path));
  }
  if (integrityErrors.length > 0) {
    for (const e of integrityErrors) console.error(e);
    process.exit(3);
  }

  // 3. Regenerate or check
  let drift = false;
  for (const target of targets) {
    const onDisk = await readFile(target.path, 'utf8');
    const regenerated = applyAllMarkers(onDisk, target);
    const rel = relative(REPO_ROOT, target.path).replaceAll('\\', '/');
    if (regenerated !== onDisk) {
      if (isCheck) {
        console.error(`drift: ${rel}`);
        drift = true;
      } else {
        await writeFile(target.path, regenerated, 'utf8');
        console.log(`regenerated: ${rel}`);
      }
    } else if (!isCheck) {
      console.log(`unchanged:   ${rel}`);
    }
  }

  if (isCheck && drift) {
    console.error('Run `npm run docs:tokens` to regenerate.');
    process.exit(1);
  }
  if (isCheck) {
    console.log('All token docs in sync.');
  } else {
    // Print the head date for traceability (not embedded in output today)
    console.log(`HEAD ISO date: ${getHeadIsoDate()}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(99);
});
