import { StandardItem } from '../types';

export const STANDARDS_CSV = `isCode,title,category,department,isMandatoryQCO,summary,scope
IS 14543:2016,Packaged Drinking Water (Other than Natural Mineral Water) — Specification,"Food & Agriculture / Mandatory Consumer Goods",Food & Agriculture Division (FAD),true,"Mandatory specification for packaged drinking water and bottled water in India.","Covers treatment, microbiological safety, toxic substances, labeling, and mandatory certification requirements for packaged drinking water."
IS 10500:2012,Drinking Water — Specification (Second Revision),"Food & Agriculture / Public Health",Civil & Food Engineering,false,"Drinking water quality requirements for public and domestic supply.","Specifies drinking water quality in terms of physical, chemical, toxic, and bacteriological parameters."
IS 456:2000,Plain and Reinforced Concrete — Code of Practice (Fourth Revision),"Civil Engineering / Construction",Civil Engineering Division (CED),false,"Primary code for concrete design and construction in India.","Covers design, material provisions, durability requirements, and detailing for RCC and plain concrete structures."
IS 9873 (Part 1):2019,Safety of Toys — Part 1: Safety Aspects Related to Mechanical and Physical Properties,"Consumer Goods / Child Safety",Mechanical Engineering Division (MED),true,"Safety of toys and child products sold in India.","Covers mechanical safety, sharp edges, small parts risk, and physical integrity of toys."
IS 1293:2019,Plugs and Socket-Outlets for Domestic and Similar Purposes — Specification (Fourth Revision),"Electrotechnical",Electrotechnical Division (ETD),true,"Electrical plug and socket safety requirements.","Covers domestic plugs, socket-outlets, and accessories up to specified loads with shock and fire protection requirements."
IS 1786:2008,High Strength Deformed Steel Bars and Wires for Concrete Reinforcement,"Metallurgical & Civil Engineering",Metallurgical Engineering (MTD),true,"Mandatory TMT steel bar specification for reinforcement.","Defines chemical and mechanical properties including strength, elongation, and bend behavior of rebars."
IS 13252 (Part 1):2010,Information Technology Equipment — Safety — Part 1: General Requirements,"Electronics & IT (Compulsory Registration Scheme - CRS)",Electronics & IT (LITD / MeitY),true,"Safety requirements for IT equipment under BIS CRS.","Includes insulation, energy hazard, temperature, and performance safety requirements for IT equipment."
IS 1417:2016,Gold and Gold Alloys — Jewellery/Artefacts,"Hallmarking & Precious Metals",Hallmarking Assaying,true,"Gold purity and hallmarking requirements.","Outlines assaying, hallmarking, and purity requirements for precious jewellery and gold artefacts."
IS 694:2010,PVC Insulated Cables for Working Voltages up to and Including 1100 V — Specification,"Electrical / Wire & Cable",Electrotechnical Division (ETD),true,"Mandatory cable specification for low-voltage electrical wiring.","Defines insulation, conductor quality, and current-carrying requirements for PVC cables."
IS 4984:2016,High Density Polyethylene Pipes for Potable Water Supply, Sewerage and Industrial Effluents — Specification,"Plastics / Water Infrastructure",Plastic Division (PLD),false,"HDPE pipe specification for infrastructure and water supply.","Covers pressure ratings, dimensions, mechanical properties, and hydrostatic endurance of HDPE pipes."
IS 16046:2018,Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes — Safety Requirements for Lithium Batteries,"Electronics / Battery Safety",Electrotechnical Division (ETD),true,"Mandatory lithium battery safety specification.","Covers abnormal and abusive safety conditions including overheating, short-circuit and overcharge tests."
IS 2112:2012,Silver — Specification,"Precious Metals / Hallmarking",Hallmarking & Precious Metals,false,"Silver purity and product specification.","Defines purity, assay, and marking requirements for silver articles and industrial silver."
`;

export function parseStandardsCsv(csvText: string): Partial<StandardItem>[] {
  const rows = csvText.trim().split(/\r?\n/);
  if (rows.length < 2) return [];

  const headers = rows[0].split(',').map((header) => header.trim().replace(/^"|"$/g, ''));
  const result: Partial<StandardItem>[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const line = rows[i];
    if (!line.trim()) continue;

    const values = splitCsvLine(line);
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = values[index]?.trim() ?? '';
    });

    if (!record.isCode) continue;

    result.push({
      id: `${record.isCode}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      isCode: record.isCode,
      title: record.title || 'Unnamed standard',
      category: record.category || 'General',
      department: record.department || 'BIS',
      isMandatoryQCO: /^true$/i.test(record.isMandatoryQCO || 'false'),
      summary: record.summary || record.scope || 'Standard information available.',
      scope: record.scope || 'Scope details are not available in the CSV record.',
    });
  }

  return result;
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values.map((value) => value.replace(/^"|"$/g, ''));
}
