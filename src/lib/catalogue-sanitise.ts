/**
 * Catalogue sanitiser — strips control characters from catalogue entries
 * and flags entries whose descriptions begin with imperative prefixes
 * commonly used in prompt-injection payloads.
 *
 * Design: sanitiser never drops entries. Flags are surfaced for human review
 * (future wire-up: Sentry event). Production must continue serving
 * recommendations even if the catalogue contains flagged entries — false
 * positives are acceptable; dropping legitimate products is not.
 *
 * Not yet wired into the recommend-products Edge Function. That wire-up
 * lands with SP-1B alongside Sprint 3 T1A.
 */

const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

const IMPERATIVE_PREFIXES = [
  'always',
  'ignore',
  'system',
  'assistant',
  'user:',
  'please rank',
  'you must',
  'override',
  'disregard',
];

export type CatalogueEntry = {
  id: string;
  title: string;
  description: string;
  [key: string]: unknown;
};

export function sanitiseCatalogueEntry(entry: CatalogueEntry): {
  entry: CatalogueEntry;
  flags: string[];
} {
  const flags: string[] = [];
  const originalDescription = entry.description ?? '';
  const cleanDescription = originalDescription.replace(CONTROL_CHAR_REGEX, '');

  if (cleanDescription !== originalDescription) flags.push('control_chars_stripped');

  const lowerStart = cleanDescription.trim().toLowerCase().slice(0, 30);
  for (const prefix of IMPERATIVE_PREFIXES) {
    if (lowerStart.startsWith(prefix)) {
      flags.push(`imperative_prefix:${prefix}`);
      break;
    }
  }

  return {
    entry: { ...entry, description: cleanDescription },
    flags,
  };
}

export function sanitiseCatalogue(entries: CatalogueEntry[]): {
  clean: CatalogueEntry[];
  flagged: Array<{ id: string; reasons: string[] }>;
} {
  const clean: CatalogueEntry[] = [];
  const flagged: Array<{ id: string; reasons: string[] }> = [];
  for (const entry of entries) {
    const { entry: cleanEntry, flags } = sanitiseCatalogueEntry(entry);
    clean.push(cleanEntry);
    if (flags.length) flagged.push({ id: entry.id, reasons: flags });
  }
  return { clean, flagged };
}
