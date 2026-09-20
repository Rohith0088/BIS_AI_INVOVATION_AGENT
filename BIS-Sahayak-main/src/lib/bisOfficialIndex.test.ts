import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeStandardCode, mergeStandardRecords } from './bisOfficialIndex';

describe('bisOfficialIndex', () => {
  it('normalizes BIS standard numbers consistently', () => {
    assert.equal(normalizeStandardCode('IS 1786:2008'), 'IS17862008');
    assert.equal(normalizeStandardCode('is 6003 : 2010'), 'IS60032010');
  });

  it('merges official and local index records without duplicates', () => {
    const merged = mergeStandardRecords(
      [
        { code: 'IS 1786:2008', title: 'Steel bars', source: 'official-site' },
        { code: 'IS 6003:2010', title: 'Indented wire', source: 'official-site' },
      ],
      [
        { code: 'IS 1786:2008', title: 'Steel bars', source: 'local-index' },
        { code: 'IS 10500:2012', title: 'Drinking water', source: 'local-index' },
      ],
    );

    assert.equal(merged.length, 3);
    assert.equal(merged.some((item) => item.isCode === 'IS 1786:2008'), true);
    assert.equal(merged.some((item) => item.isCode === 'IS 10500:2012'), true);
  });
});
