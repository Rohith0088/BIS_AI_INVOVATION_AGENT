export type OfficialStandardRecord = {
  code: string;
  isCode?: string;
  title?: string;
  category?: string;
  department?: string;
  summary?: string;
  scope?: string;
  year?: string;
  source?: string;
  pdfExcerptSnippet?: string;
  isMandatoryQCO?: boolean;
  keyClauses?: string[];
  isoEquivalence?: string;
  isoComparisonNotes?: string;
  sampleTestParameters?: string[];
  viewsCount?: number;
  lastUpdated?: string;
};

export function normalizeStandardCode(code: string): string {
  return String(code || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function mergeStandardRecords(
  official: OfficialStandardRecord[] = [],
  fallback: OfficialStandardRecord[] = [],
): OfficialStandardRecord[] {
  const map = new Map<string, OfficialStandardRecord>();

  const addRecord = (record: OfficialStandardRecord) => {
    const code = String(record?.isCode || record?.code || '').trim();
    if (!code) return;

    const key = normalizeStandardCode(code);
    const current = map.get(key);
    if (!current) {
      map.set(key, {
        ...record,
        isCode: record.isCode || record.code,
        code: record.isCode || record.code,
      });
      return;
    }

    map.set(key, {
      ...current,
      ...record,
      isCode: record.isCode || current.isCode || record.code || current.code,
      code: record.code || current.code || record.isCode || current.isCode,
      title: record.title || current.title,
      summary: record.summary || current.summary,
      scope: record.scope || current.scope,
      category: record.category || current.category,
      department: record.department || current.department,
      source: record.source || current.source,
      year: record.year || current.year,
    });
  };

  [...official, ...fallback].forEach(addRecord);
  return Array.from(map.values());
}
