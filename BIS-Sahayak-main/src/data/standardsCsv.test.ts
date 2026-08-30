import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStandardsCsv } from './standardsCsv';

const csv = `isCode,title,category,department,isMandatoryQCO,summary
IS 14543:2016,Packaged Drinking Water,Food & Agriculture / Mandatory Consumer Goods,Food & Agriculture Division (FAD),true,Packaged drinking water specification
IS 456:2000,Concrete Code,Civil Engineering / Construction,Civil Engineering Division (CED),false,Concrete practice code`;

test('parseStandardsCsv reads rows and normalizes mandatory flag values', () => {
  const rows = parseStandardsCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].isCode, 'IS 14543:2016');
  assert.equal(rows[0].isMandatoryQCO, true);
  assert.equal(rows[1].title, 'Concrete Code');
});
