import { StandardItem, TestingLab, CertificationScheme } from '../types';

export const BIS_STANDARDS: StandardItem[] = [
  {
    id: 'is-10500-2012',
    isCode: 'IS 10500:2012',
    year: '2012',
    title: 'Drinking Water — Specification (Second Revision)',
    category: 'Food & Agriculture / Public Health',
    department: 'Civil & Food Engineering',
    isMandatoryQCO: false,
    summary: 'Specifies the quality tolerances and testing guidelines for drinking water intended for direct human consumption, covering 48 essential physical, chemical, toxic, and bacteriological parameters.',
    scope: 'This standard prescribes the requirements and the methods of sampling and test for drinking water provided through piped networks, borewells, municipal supply, and communal tankers.',
    keyClauses: [
      {
        clauseNumber: 'Clause 3.1',
        title: 'Essential Characteristics',
        summary: 'Acceptable limit for Total Dissolved Solids (TDS) is 500 mg/L (permissible limit 2000 mg/L in absence of alternate source). Turbidity limit is 1 NTU (max 5 NTU).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 3.2 (Table 2)',
        title: 'Toxic Substances Limits',
        summary: 'Arsenic (max 0.01 mg/L), Lead (max 0.01 mg/L), Cadmium (max 0.003 mg/L), Mercury (max 0.001 mg/L), and Chromium (max 0.05 mg/L).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 4.2 (Table 5)',
        title: 'Bacteriological Quality',
        summary: 'All samples must show zero (0) E. coli or thermotolerant coliform bacteria in any 100 mL portion tested.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 5.1',
        title: 'Residual Free Chlorine',
        summary: 'Minimum 0.2 mg/L residual free chlorine is required when water is chlorinated for public health protection.',
        mandatory: false
      }
    ],
    isoEquivalence: 'ISO 24510 / WHO Guidelines for Drinking-Water Quality 4th Ed.',
    isoComparisonNotes: 'IS 10500 includes dual limits (Acceptable Limit vs Permissible Limit in absence of alternate sources), whereas WHO and ISO set single health-based guideline values.',
    sampleTestParameters: ['pH Value (6.5 to 8.5)', 'TDS (<500 mg/L)', 'Total Hardness (<200 mg/L)', 'Coliform count (0/100ml)', 'Heavy Metals ICP-MS'],
    pdfExcerptSnippet: 'Bureau of Indian Standards (BIS) Document Ref: FAD 25 (2050) — Indian Standard Drinking Water Specification (Second Revision with Amendments 1, 2 & 3 incorporated).',
    viewsCount: 14200,
    lastUpdated: '2h ago'
  },
  {
    id: 'is-14543-2016',
    isCode: 'IS 14543:2016',
    year: '2016',
    title: 'Packaged Drinking Water (Other than Natural Mineral Water) — Specification',
    category: 'Food & Agriculture / Mandatory Consumer Goods',
    department: 'Food & Agriculture Division (FAD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'S.O. 1109(E) under BIS Act & FSSAI',
    summary: 'Mandatory standard governing all commercially packaged drinking water sealed in bottles, pouches, or 20-litre jars across India with mandatory ISI mark certification.',
    scope: 'Prescribes physical, chemical, microbiological limits, mandatory multi-barrier disinfection treatments (RO, Ozonation, UV), packaging material standards, and tamper-proof labeling requirements.',
    keyClauses: [
      {
        clauseNumber: 'Clause 4.1',
        title: 'Mandatory Treatment Methods',
        summary: 'Water must undergo multi-stage purification including filtration, reverse osmosis (or demineralization), remineralization, and mandatory disinfection via ozonation and UV irradiation.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 5.2 (Table 2 & 3)',
        title: 'Chemical & Toxic Substance Requirements',
        summary: 'Pesticide residues: Individual pesticide max 0.0001 mg/L; Total pesticide residues max 0.0005 mg/L. Bromate max 0.01 mg/L.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 6.1 (Table 4)',
        title: 'Microbiological Standards',
        summary: 'Zero count for E. coli, Coliform, Faecal Streptococci, Pseudomonas aeruginosa, and Yeast & Moulds in 250 mL samples.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Mandatory ISI Certification & QR Marking',
        summary: 'Every container must bear the Standard ISI Mark with CM/L License Number and batch tracking.',
        mandatory: true
      }
    ],
    isoEquivalence: 'Codex STAN 227-2001 (General Standard for Bottled/Packaged Waters)',
    isoComparisonNotes: 'IS 14543 has stricter limits for individual and total pesticide residues (tested via GC-MS/MS) compared to Codex STAN 227.',
    sampleTestParameters: ['Pesticide residue testing', 'Ozone residual concentration', 'Bacteriological incubation', 'Bromate analysis'],
    pdfExcerptSnippet: 'Bureau of Indian Standards — Packaged Drinking Water Mandatory Scheme: CM/L Number and BIS Standard Mark are legally compulsory before sale.',
    viewsCount: 18900,
    lastUpdated: 'Today'
  },
  {
    id: 'is-456-2000',
    isCode: 'IS 456:2000',
    year: '2000',
    title: 'Plain and Reinforced Concrete — Code of Practice (Fourth Revision)',
    category: 'Civil Engineering / Construction',
    department: 'Civil Engineering Division (CED)',
    isMandatoryQCO: false,
    summary: 'The primary structural design code across India for general building construction in plain and reinforced concrete, covering limit state design, materials, mix design, and durability criteria.',
    scope: 'Covers concrete construction practices, workability, characteristic strength, structural analysis, shear, torsion, deflection, and detailing requirements.',
    keyClauses: [
      {
        clauseNumber: 'Clause 5.1 - 5.4',
        title: 'Constituent Materials',
        summary: 'Specifications for Portland cements (IS 269, IS 8112, IS 12269), aggregates (IS 383), mixing water, and chemical admixtures (IS 9103).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 6.1 (Table 2)',
        title: 'Concrete Grades',
        summary: 'Designates concrete from Ordinary (M10-M20) to Standard (M25-M55) and High Strength (M60-M80) with minimum cement contents.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 8.2 (Table 3 & 4)',
        title: 'Durability & Environmental Exposure',
        summary: 'Specifies minimum nominal cover and maximum water-cement ratio based on exposure conditions (Mild, Moderate, Severe, Very Severe, Extreme).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 35 - 38',
        title: 'Limit State Design Method',
        summary: 'Design principles for Limit State of Collapse (Flexure, Compression, Shear) and Limit State of Serviceability (Deflection, Cracking).',
        mandatory: true
      }
    ],
    isoEquivalence: 'ISO 19338 / Eurocode 2 (EN 1992-1-1) / ACI 318',
    isoComparisonNotes: 'IS 456 uses partial safety factors γm = 1.5 for concrete and 1.15 for steel, with modular ratio m = 280 / (3 * σcbc) in working stress comparisons.',
    sampleTestParameters: ['Compressive strength (IS 516)', 'Slump test workability', 'Flexural tensile strength', 'Durability permeability'],
    pdfExcerptSnippet: 'Section 1: General provisions, Section 2: Materials, workmanship, inspection and testing, Section 3: General design requirements.',
    viewsCount: 22100,
    lastUpdated: 'Yesterday'
  },
  {
    id: 'is-9873-part1-2019',
    isCode: 'IS 9873 (Part 1):2019',
    year: '2019',
    title: 'Safety of Toys — Part 1: Safety Aspects Related to Mechanical and Physical Properties',
    category: 'Consumer Goods / Child Safety',
    department: 'Mechanical Engineering Division (MED)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Toys (Quality Control) Order 2020 (DPIIT)',
    summary: 'Mandatory safety standard for all non-electric and electric toys sold in India, enforcing sharp edge prevention, small parts choking hazard prevention, and structural integrity.',
    scope: 'Applies to all toys designed or intended for use by children under 14 years of age manufactured or imported into India.',
    keyClauses: [
      {
        clauseNumber: 'Clause 4.4',
        title: 'Small Parts Cylinder Test',
        summary: 'Toys for children under 36 months must not contain or release small parts that fit into the standard truncated test cylinder (choking hazard).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 4.7 & 4.8',
        title: 'Sharp Edges and Sharp Points',
        summary: 'Accessible glass or metal edges and sharp points must meet sharpness tester tolerances.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 5.24',
        title: 'Drop and Impact Stress Testing',
        summary: 'Toys are subjected to drop tests from specified heights onto rigid steel plates to verify that hazardous sharp pieces are not created.',
        mandatory: true
      }
    ],
    isoEquivalence: 'ISO 8124-1 / EN 71-1 / ASTM F963',
    isoComparisonNotes: 'Fully aligned with ISO 8124-1 with specific Indian climatic durability conditions and mandatory BIS license under Scheme-I.',
    sampleTestParameters: ['Small parts test cylinder', 'Tensile pull test (70N/90N)', 'Flexure test', 'Torque test'],
    pdfExcerptSnippet: 'Quality Control Order enforces Scheme-I ISI Mark certification on both domestic manufacturers and foreign toy importers.',
    viewsCount: 11500,
    lastUpdated: '3 days ago'
  },
  {
    id: 'is-1293-2019',
    isCode: 'IS 1293:2019',
    year: '2019',
    title: 'Plugs and Socket-Outlets for Domestic and Similar Purposes — Specification (Fourth Revision)',
    category: 'Electrotechnical',
    department: 'Electrotechnical Division (ETD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Electrical Accessories (Quality Control) Order, 2020',
    summary: 'Mandatory standard governing ratings up to 16A 250V AC plugs, 2-pin and 3-pin socket outlets, multi-plugs, and travel adapters to prevent electric shocks and fires.',
    scope: 'Applies to plugs and fixed or portable socket-outlets for AC only, with or without earthing contact, rated up to 16 A and 250 V.',
    keyClauses: [
      {
        clauseNumber: 'Clause 8.1',
        title: 'Protection against Electric Shock',
        summary: 'Live parts must not be accessible when the plug is partially or fully engaged with socket.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 13.1',
        title: 'Temperature Rise Limits',
        summary: 'Terminals and current-carrying contacts must not exceed 45K temperature rise during continuous rated current tests.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 20.1',
        title: 'Resistance to Heat and Fire',
        summary: 'Insulating material must pass Glow Wire Test at 750°C/850°C and Ball Pressure Test at 125°C.',
        mandatory: true
      }
    ],
    isoEquivalence: 'IEC 60884-1 (Modified)',
    isoComparisonNotes: 'Maintains India standard 3-pin round pin geometry (Type D and Type M) while adopting IEC 60884 safety testing methods.',
    sampleTestParameters: ['Glow-wire flammability test', 'Endurance test (10,000 cycles)', 'Insulation resistance at 500V DC'],
    pdfExcerptSnippet: 'Mandatory ISI Mark certification under Scheme-I for all domestic electrical outlets and appliances cords.',
    viewsCount: 9400,
    lastUpdated: '4 days ago'
  },
  {
    id: 'is-1786-2008',
    isCode: 'IS 1786:2008',
    year: '2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification',
    category: 'Metallurgical & Civil Engineering',
    department: 'Metallurgical Engineering (MTD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Steel and Steel Products (Quality Control) Order',
    summary: 'Mandatory specification for TMT and HSD rebar grades (Fe 415, Fe 500, Fe 550, Fe 600, and Fe 500D) used in RCC infrastructure.',
    scope: 'Covers physical, chemical, elongation, bend, and rebend properties of thermo-mechanically treated (TMT) steel reinforcement.',
    keyClauses: [
      {
        clauseNumber: 'Clause 4.2 (Table 1)',
        title: 'Chemical Composition Limits',
        summary: 'Maximum Carbon (0.25% for Fe 500D), Sulphur (0.040%), and Phosphorus (0.040%) with S+P limit 0.075%.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 8.1 (Table 3)',
        title: 'Mechanical Properties',
        summary: 'Yield stress, ultimate tensile strength (TS/YS ratio >= 1.10 for 500D), and minimum elongation (16% for 500D).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 9.3',
        title: 'Bend and Rebend Test',
        summary: 'Specimens must withstand reverse bending over specified mandrel diameter without rupture or visible cracking.',
        mandatory: true
      }
    ],
    isoEquivalence: 'ISO 6935-2 (Steel for reinforcement of concrete - Ribbed bars)',
    isoComparisonNotes: 'Includes specialized seismic "D" grades (Fe 415D, Fe 500D, Fe 550D) with superior uniform elongation for earthquake zones.',
    sampleTestParameters: ['Tensile yield strength', 'Carbon equivalent calculation', 'Bend & rebend verification', 'Rib pattern height'],
    pdfExcerptSnippet: 'Steel products mandatory certification — Manufacturer must mark brand, grade, and BIS standard logo embossed on bar ribs.',
    viewsCount: 16700,
    lastUpdated: '1 week ago'
  },
  {
    id: 'is-15652-2006',
    isCode: 'IS 15652:2006',
    year: '2006',
    title: 'Insulating Mats for Electrical Purposes — Specification',
    category: 'Electrotechnical / Industrial Safety',
    department: 'Electrotechnical Division (ETD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Electrical Safety Mats QCO',
    summary: 'Replaces older rubber mats (IS 5424) with high-grade elastomer composite insulation mats for high voltage substation and panel room safety.',
    scope: 'Covers elastomer insulating mats used as a floor covering for the protection of workers on AC and DC electrical installations up to 33 kV.',
    keyClauses: [
      {
        clauseNumber: 'Clause 5.1 (Table 1)',
        title: 'Voltage Classifications',
        summary: 'Class A (3.3 kV), Class B (11 kV), and Class C (33 kV) with corresponding proof voltage test and breakdown voltage test requirements.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 6.4',
        title: 'Flame Retardance Test',
        summary: 'Mats must extinguish within specified time when exposed to flame test.',
        mandatory: true
      }
    ],
    isoEquivalence: 'IEC 61111 (Live working - Electrical insulating matting)',
    isoComparisonNotes: 'Direct adoption of modern synthetic elastomer material standards.',
    sampleTestParameters: ['Dielectric breakdown test', 'Tensile strength and elongation at break', 'Low temperature fold test'],
    pdfExcerptSnippet: 'Ensures personnel safety around high-voltage switchgear and power control centers.',
    viewsCount: 6200,
    lastUpdated: '2 weeks ago'
  },
  {
    id: 'is-13252-part1-2010',
    isCode: 'IS 13252 (Part 1):2010',
    year: '2010',
    title: 'Information Technology Equipment — Safety — Part 1: General Requirements',
    category: 'Electronics & IT (Compulsory Registration Scheme - CRS)',
    department: 'Electronics & IT (LITD / MeitY)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'MeitY CRO Orders (CRS Mandatory Registration)',
    summary: 'Mandatory standard under BIS CRS scheme for laptops, servers, smartphones, power adapters, monitors, printers, and smart cards.',
    scope: 'Applies to mains-powered or battery-powered information technology equipment designed for office and residential usage.',
    keyClauses: [
      {
        clauseNumber: 'Clause 1.5 - 1.7',
        title: 'Safety of Components & Markings',
        summary: 'Requires self-declaration of conformity (R-number) on packaging and device casing.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 2.1',
        title: 'Protection from Electric Shock and Energy Hazards',
        summary: 'Insulation barriers, SELV circuits, and accessible touch currents must remain within safety limits (<0.25 mA for Class II).',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 4.5',
        title: 'Thermal Requirements and Abnormal Operations',
        summary: 'Limits maximum operating temperature of transformer windings, IC chips, and battery casings.',
        mandatory: true
      }
    ],
    isoEquivalence: 'IEC 60950-1 / IEC 62368-1',
    isoComparisonNotes: 'Administered under BIS Scheme-II (Compulsory Registration Scheme / Self Declaration of Conformity).',
    sampleTestParameters: ['Leakage current test', 'Electric strength test (Hi-Pot)', 'Temperature rise under fault conditions', 'Mechanical impact drop'],
    pdfExcerptSnippet: 'Requires R-Number registration with MeitY and BIS before importation or customs clearance.',
    viewsCount: 20400,
    lastUpdated: '3 days ago'
  },
  {
    id: 'is-694-2010',
    isCode: 'IS 694:2010',
    year: '2010',
    title: 'PVC Insulated Cables for Working Voltages up to and Including 1100 V — Specification',
    category: 'Electrical / Wire & Cable',
    department: 'Electrotechnical Division (ETD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Electrical Cables (Quality Control) Order',
    summary: 'Mandatory standard for PVC-insulated cables used in homes, commercial installations, and low-voltage power distribution.',
    scope: 'Applies to insulated electric cables of copper and aluminium for power and lighting systems up to 1100 V.',
    keyClauses: [
      {
        clauseNumber: 'Clause 5.1',
        title: 'Material and Insulation Quality',
        summary: 'Insulation must retain dielectric strength and resist water absorption, heat ageing, and mechanical damage.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 8.1',
        title: 'Voltage and Current Test',
        summary: 'Cable samples are tested for insulation resistance, conductor resistance, and continuous current capacity.',
        mandatory: true
      }
    ],
    isoEquivalence: 'IEC 60227 / IS 694 is often aligned with global PVC cable safety principles',
    isoComparisonNotes: 'Used extensively in domestic wiring, industrial consumables, and utility distribution systems.',
    sampleTestParameters: ['Insulation resistance', 'Resistance per unit length', 'Heat ageing'],
    pdfExcerptSnippet: 'Important for power distribution and building electrification safety.',
    viewsCount: 8200,
    lastUpdated: '1 week ago'
  },
  {
    id: 'is-4984-2016',
    isCode: 'IS 4984:2016',
    year: '2016',
    title: 'High Density Polyethylene Pipes for Potable Water Supply, Sewerage and Industrial Effluents — Specification',
    category: 'Plastics / Water Infrastructure',
    department: 'Plastic Division (PLD)',
    isMandatoryQCO: false,
    summary: 'Covers HDPE pipes used in water supply, drainage, gas, sewerage, and industrial effluent systems.',
    scope: 'Specifies pressure ratings, dimensions, hydrostatic design basis, and suitability tests for HDPE piping systems.',
    keyClauses: [
      {
        clauseNumber: 'Clause 6.2',
        title: 'Dimensions and Tolerances',
        summary: 'Ensures outer diameter, wall thickness, and ovality meet pipeline installation requirements.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 8',
        title: 'Hydrostatic Pressure Resistance',
        summary: 'Pipes are validated through short-term and long-term hydrostatic pressure endurance tests.',
        mandatory: true
      }
    ],
    isoEquivalence: 'ISO 4427 / PE 100 piping system standards',
    isoComparisonNotes: 'Widely used in municipal infrastructure, agriculture, and industrial water handling.',
    sampleTestParameters: ['Hydrostatic pressure', 'Burst test', 'Impact resistance'],
    pdfExcerptSnippet: 'Commonly used for potable and non-potable water piping systems.',
    viewsCount: 7600,
    lastUpdated: '2 weeks ago'
  },
  {
    id: 'is-16046-2018',
    isCode: 'IS 16046:2018',
    year: '2018',
    title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes — Safety Requirements for Lithium Batteries',
    category: 'Electronics / Battery Safety',
    department: 'Electrotechnical Division (ETD)',
    isMandatoryQCO: true,
    qcoNotificationNumber: 'Lithium Battery Safety QCO',
    summary: 'Mandatory safety specification for lithium-ion and lithium-metal batteries in electronic products and energy storage devices.',
    scope: 'Covers safety of rechargeable lithium cells and batteries with protection against overcharge, short circuit, thermal runaway, and abuse conditions.',
    keyClauses: [
      {
        clauseNumber: 'Clause 5.1',
        title: 'Abuse and Safety Tests',
        summary: 'Batteries are evaluated under short circuit, overcharge, crush, and forced discharge conditions.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 7.1',
        title: 'Thermal Runaway Prevention',
        summary: 'Battery management and protective circuits must prevent overheating and venting under abnormal conditions.',
        mandatory: true
      }
    ],
    isoEquivalence: 'IEC 62133 / UL 1642',
    isoComparisonNotes: 'Critical in EV, laptop, phone, and power-bank compliance and safety.',
    sampleTestParameters: ['Short-circuit test', 'Temperature cycling', 'Overcharge test'],
    pdfExcerptSnippet: 'A priority safety standard for modern portable electronics and EV applications.',
    viewsCount: 9100,
    lastUpdated: '5 days ago'
  },
  {
    id: 'is-2112-2012',
    isCode: 'IS 2112:2012',
    year: '2012',
    title: 'Silver — Specification',
    category: 'Precious Metals / Hallmarking',
    department: 'Hallmarking & Precious Metals',
    isMandatoryQCO: false,
    summary: 'Defines purity requirements and assay standards for silver used in jewellery and industrial applications.',
    scope: 'Applies to silver articles, bars, and other silver-based material used in jewellery and general manufacturing.',
    keyClauses: [
      {
        clauseNumber: 'Clause 4',
        title: 'Purity Grades',
        summary: 'Silver articles are designated by fineness and checked for impurity limitations.',
        mandatory: true
      },
      {
        clauseNumber: 'Clause 7',
        title: 'Marking and Assay',
        summary: 'Marking and hallmarks should clearly indicate purity and source identification as applicable.',
        mandatory: true
      }
    ],
    isoEquivalence: 'Silver purity and jewellery assay standards under global hallmarking practice',
    isoComparisonNotes: 'Useful for hallmarking and precious metal compliance in jewellery business.',
    sampleTestParameters: ['Fineness testing', 'Assay value', 'Surface contamination check'],
    pdfExcerptSnippet: 'Commonly used in the hallmarking ecosystem along with IS 1417 and HUID norms.',
    viewsCount: 5400,
    lastUpdated: '1 month ago'
  }
];

export const BIS_LABS: TestingLab[] = [
  {
    id: 'cl-sahibabad',
    name: 'Central Laboratory, Bureau of Indian Standards',
    code: 'BIS-CL-01',
    type: 'Central',
    state: 'Uttar Pradesh',
    city: 'Sahibabad / Ghaziabad (NCR)',
    address: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP - 201010',
    contactPerson: 'Director General (Laboratories)',
    phone: '+91-120-2770001',
    email: 'cl@bis.gov.in',
    capabilities: [
      'Comprehensive Chemical Analysis',
      'Microbiology & Food Testing (Water, Dairy, Oil)',
      'Electrical Appliances & Transformers',
      'Civil Construction (Cement, Concrete, Steel)',
      'Mechanical & Metallurgy (Pumps, Pipes, Valves)'
    ],
    productCategories: ['Food & Beverages', 'Civil Engineering', 'Electrical & Electronics', 'Chemical Products', 'Toys'],
    nablAccreditationNo: 'TC-5120',
    validUntil: '2028-12-31',
    isGovt: true
  },
  {
    id: 'wrl-mumbai',
    name: 'Western Regional Laboratory, BIS Mumbai',
    code: 'BIS-WRL-02',
    type: 'Regional',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Manakalaya, E9, MIDC, Andheri (East), Mumbai, Maharashtra - 400093',
    contactPerson: 'Head (WRL)',
    phone: '+91-22-28329295',
    email: 'wrl@bis.gov.in',
    capabilities: [
      'Gold & Precious Metals Hallmarking Assaying',
      'Chemical & Petroleum Products',
      'Packaged Drinking Water & Mineral Water',
      'Electrical Accessories & Switches (IS 1293)'
    ],
    productCategories: ['Hallmarking', 'Food Products', 'Electrical Goods', 'Polymers & Plastics'],
    nablAccreditationNo: 'TC-5144',
    validUntil: '2027-10-15',
    isGovt: true
  },
  {
    id: 'srl-chennai',
    name: 'Southern Regional Laboratory, BIS Chennai',
    code: 'BIS-SRL-03',
    type: 'Regional',
    state: 'Tamil Nadu',
    city: 'Chennai',
    address: 'CIT Campus, IV Cross Road, Taramani, Chennai, Tamil Nadu - 600113',
    contactPerson: 'Head (SRL)',
    phone: '+91-44-22541442',
    email: 'srl@bis.gov.in',
    capabilities: [
      'Automotive Components & Tires',
      'Cement & Clinker Testing',
      'Electronics Safety Testing (CRS)',
      'Textiles & Safety Helmets'
    ],
    productCategories: ['Automotive', 'Civil & Building Materials', 'Electronics & IT', 'Textiles'],
    nablAccreditationNo: 'TC-5188',
    validUntil: '2028-04-30',
    isGovt: true
  },
  {
    id: 'erl-kolkata',
    name: 'Eastern Regional Laboratory, BIS Kolkata',
    code: 'BIS-ERL-04',
    type: 'Regional',
    state: 'West Bengal',
    city: 'Kolkata',
    address: '1/14, C.I.T. Scheme VII (M), VIP Road, Kankurgachi, Kolkata, WB - 700054',
    contactPerson: 'Head (ERL)',
    phone: '+91-33-23207000',
    email: 'erl@bis.gov.in',
    capabilities: [
      'Steel & Heavy Metallurgical Products (IS 1786, IS 2062)',
      'Tea & Agro-processing parameters',
      'Paints, Varnishes & Industrial Chemicals',
      'Jute & Natural Fiber testing'
    ],
    productCategories: ['Metallurgy & Steel', 'Agriculture', 'Chemicals', 'Jute & Packaging'],
    nablAccreditationNo: 'TC-5210',
    validUntil: '2027-08-20',
    isGovt: true
  },
  {
    id: 'nrl-chandigarh',
    name: 'Northern Regional Laboratory, BIS Mohali',
    code: 'BIS-NRL-05',
    type: 'Regional',
    state: 'Punjab',
    city: 'Mohali / Chandigarh',
    address: 'Plot No. 4A, Sector 27B, Madhya Marg, Chandigarh / Mohali - 160019',
    contactPerson: 'Head (NRL)',
    phone: '+91-172-2790322',
    email: 'nrl@bis.gov.in',
    capabilities: [
      'Agricultural Equipment & Tractor parts',
      'Pumps & Submersible motors',
      'Water Treatment & Filter testing',
      'Solar Photovoltaic Modules'
    ],
    productCategories: ['Agriculture & Machinery', 'Renewable Energy', 'Pumps & Motors'],
    nablAccreditationNo: 'TC-5266',
    validUntil: '2028-01-14',
    isGovt: true
  },
  {
    id: 'recognized-shriram',
    name: 'Shriram Institute for Industrial Research (BIS Recognized)',
    code: 'NABL-SIIR-DEL',
    type: 'Recognized Private',
    state: 'Delhi',
    city: 'New Delhi',
    address: '19, University Road, Delhi - 110007',
    contactPerson: 'Laboratory Incharge',
    phone: '+91-11-27667267',
    email: 'customercare@shriraminstitute.org',
    capabilities: [
      'Plastic & Polymer Biodegradability (IS 17088)',
      'Toy Mechanical & Chemical Safety (IS 9873)',
      'Heavy Metals & RoHS compliance',
      'Phthalates & Endocrine Disruptor screening'
    ],
    productCategories: ['Toys', 'Plastics & Biopolymers', 'Cosmetics', 'Pharma Packaging'],
    nablAccreditationNo: 'TC-5011',
    validUntil: '2029-03-31',
    isGovt: false
  }
];

export const BIS_SCHEMES: CertificationScheme[] = [
  {
    id: 'isi-mark-scheme-1',
    title: 'Product Certification Scheme (ISI Mark)',
    markName: 'Standard ISI Mark',
    badge: 'Scheme-I',
    shortDesc: 'The flagship BIS certification granted to manufacturers demonstrating consistent conformity with relevant Indian Standards (IS).',
    fullDesc: 'Scheme-I operates under the BIS (Conformity Assessment) Regulations, 2018. It involves thorough factory inspection, independent lab testing of product samples, verification of in-house testing equipment, and continuous surveillance audits.',
    targetAudience: 'Indian and foreign manufacturers producing items under mandatory Quality Control Orders (QCOs) or voluntary high-quality assurance.',
    applicableStandardsExample: ['IS 14543 (Packaged Water)', 'IS 1786 (TMT Bars)', 'IS 9873 (Toys)', 'IS 1293 (Plugs & Sockets)', 'IS 4984 (HDPE Pipes)'],
    keyBenefits: [
      'Legal authorization to sell products under mandatory QCOs in India',
      'Builds consumer trust with the universally recognized ISI logo',
      'Eligibility for central & state government tenders (GeM Portal)',
      'Exemption from repeated incoming batch inspection by major infrastructure clients'
    ],
    processSteps: [
      {
        stepNumber: 1,
        title: 'Online Application & Document Submission',
        description: 'Submit Form-I on the Manakonline portal with manufacturing plant layout, list of machinery, in-house testing equipment, and quality personnel details.'
      },
      {
        stepNumber: 2,
        title: 'Factory Audit by BIS Inspecting Officer',
        description: 'BIS technical officer inspects the production line, witnesses test trials on factory apparatus, and draws independent samples.'
      },
      {
        stepNumber: 3,
        title: 'Sample Testing in BIS / NABL Recognized Lab',
        description: 'Drawn samples are dispatched under tamper-evident seal to an accredited laboratory for full specification compliance testing.'
      },
      {
        stepNumber: 4,
        title: 'Grant of CM/L Licence & Standard Mark',
        description: 'Upon successful test report and audit verification, BIS issues the 7 or 8 digit CM/L (Certification Marks Licence) number with the official ISI logo.'
      }
    ],
    requiredDocuments: [
      'Factory Registration / Manufacturing Proof (MSME / RoC / Industrial License)',
      'List of Manufacturing Machinery & Calibration Certificates',
      'List of In-house Quality Testing Equipment & Competent QC Staff CVs',
      'Plant Layout Drawing & Process Flow Chart',
      'Raw Material Test Certificates & Source Invoices'
    ],
    estimatedTimeline: '30 to 60 Days (Simplified Scheme: ~30 Days)',
    officialPortal: 'https://www.manakonline.in'
  },
  {
    id: 'crs-scheme-2',
    title: 'Compulsory Registration Scheme (CRS)',
    markName: 'BIS Registration (R-XXXXXXX)',
    badge: 'Scheme-II',
    shortDesc: 'Fast-track Self-Declaration of Conformity for IT, electronics, solar equipment, and smart devices mandated by MeitY and MNRE.',
    fullDesc: 'Under CRS, manufacturers test their electronic goods in BIS-recognized laboratories in India and submit test reports to BIS for grant of registration number (R-number). No preliminary factory visit is mandatory for initial grant.',
    targetAudience: 'Electronics, IT hardware, telecom devices, solar PV modules, and consumer gadget OEMs.',
    applicableStandardsExample: ['IS 13252-1 (Laptops, Servers, Adapters)', 'IS 16046 (Lithium Batteries)', 'IS 16102 (LED Lights)', 'IS 14286 (Solar Panels)'],
    keyBenefits: [
      'Rapid digital registration without awaiting upfront factory inspection',
      'Required for legal customs clearance and sale on e-commerce platforms',
      'Standardized R-number and BIS CRS symbol displayed on packaging and digital UI'
    ],
    processSteps: [
      {
        stepNumber: 1,
        title: 'Sample Testing in BIS Recognized Indian Lab',
        description: 'Send prototype or production sample to a BIS recognized laboratory in India for testing against relevant IS standard.'
      },
      {
        stepNumber: 2,
        title: 'Manakonline Portal Application',
        description: 'Upload the issued test report (valid within 90 days of issuance) along with Authorized Indian Representative (AIR) undertaking.'
      },
      {
        stepNumber: 3,
        title: 'BIS Scrutiny & Grant of Registration',
        description: 'BIS scrutinizes the test report and generates the unique R-XXXXXXX registration code within 15-20 working days.'
      }
    ],
    requiredDocuments: [
      'Original Test Report from BIS Recognized Laboratory (issued within 90 days)',
      'Letter of Authorization / AIR Agreement (for overseas manufacturers)',
      'Brand / Trademark Registration Certificate or Brand Owner Authorization',
      'Factory Business License & Affidavit of Undertaking'
    ],
    estimatedTimeline: '15 to 25 Working Days',
    officialPortal: 'https://www.crsbis.in'
  },
  {
    id: 'hallmarking-scheme',
    title: 'Hallmarking of Gold & Silver Artefacts',
    markName: 'BIS Hallmark with HUID',
    badge: 'Hallmarking',
    shortDesc: 'Mandatory purity certification for 14k, 18k, 20k, 22k, 23k, and 24k gold jewelry featuring a 6-digit alphanumeric Hallmark Unique Identification (HUID).',
    fullDesc: 'Ensures consumers receive the exact purity of precious metals marked on the piece, protecting buyers from under-caratage and fraudulent alloying.',
    targetAudience: 'Jewellers, gold/silver bullion dealers, assaying and hallmarking centers (AHCs).',
    applicableStandardsExample: ['IS 1417 (Gold & Gold Alloys)', 'IS 2112 (Silver & Silver Alloys)', 'IS 15820 (Assaying & Hallmarking Centers)'],
    keyBenefits: [
      'Zero-tolerance guarantee of precious metal purity verified through XRF and Fire Assay',
      '6-digit HUID code allows instant traceability via BIS CARE Mobile App',
      'Mandatory in over 343 districts across India'
    ],
    processSteps: [
      {
        stepNumber: 1,
        title: 'Jeweller Registration on Manakonline',
        description: 'Instant zero-fee registration for jewellers on Manakonline.'
      },
      {
        stepNumber: 2,
        title: 'Assaying at BIS-Recognized AHC',
        description: 'Jewelry items are sent to Assaying & Hallmarking Centre where laser marking stamps the BIS Logo, Purity in Carats & Fineness, and unique 6-digit HUID.'
      }
    ],
    requiredDocuments: [
      'GST Registration Certificate & PAN Card',
      'Proof of Establishment / Outlet Address',
      'Undertaking for compliance with Hallmarking regulations'
    ],
    estimatedTimeline: 'Instant online registration for Jewellers; same-day hallmarking at AHC',
    officialPortal: 'https://www.manakonline.in'
  },
  {
    id: 'fmcs-scheme',
    title: 'Foreign Manufacturers Certification Scheme (FMCS)',
    markName: 'ISI Mark for Overseas Plants',
    badge: 'FMCS',
    shortDesc: 'Enables global manufacturing units located outside India to use the prestigious standard ISI mark on products exported into Indian territory.',
    fullDesc: 'Operated by the Foreign Manufacturers Certification Department (FMCD) at BIS Headquarters, New Delhi. Requires an Authorized Indian Representative (AIR), physical audit of the foreign factory by BIS officers, and rigorous sample testing.',
    targetAudience: 'Overseas manufacturers exporting steel, electrical appliances, chemicals, auto parts, tires, or toys to India.',
    applicableStandardsExample: ['IS 15652', 'IS 9873', 'IS 1786', 'IS 694', 'IS 302-2-3'],
    keyBenefits: [
      'Seamless customs entry into Indian sea ports and air cargo terminals',
      'Compliance with Government of India Quality Control Orders (QCOs)',
      'Direct access to India’s $4+ Trillion economy'
    ],
    processSteps: [
      {
        stepNumber: 1,
        title: 'FMCD Application & Fee Payment',
        description: 'Submit comprehensive FMCS application with nomination of Authorized Indian Representative (AIR).'
      },
      {
        stepNumber: 2,
        title: 'BIS Overseas Factory Audit',
        description: 'BIS technical officer travels to overseas plant location for 2-3 days inspection of manufacturing and laboratory testing.'
      },
      {
        stepNumber: 3,
        title: 'Independent Testing & Performance Bank Guarantee',
        description: 'Drawn samples are tested in India. Applicant furnishes Performance Bank Guarantee (PBG).'
      }
    ],
    requiredDocuments: [
      'Overseas Business Registration / Factory License in Country of Origin',
      'Nomination of Authorized Indian Representative (AIR) & Power of Attorney',
      'Complete List of QC Test Machinery & Plant Layout',
      'Performance Bank Guarantee (PBG) from RBI recognized bank'
    ],
    estimatedTimeline: '3 to 6 Months',
    officialPortal: 'https://www.bis.gov.in'
  }
];

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    isCode: 'IS 10500:2012',
    title: 'Drinking Water — Specification (Second Revision)',
    timeAgo: '2h ago',
    category: 'Public Health',
    status: 'Verified'
  },
  {
    id: 'act-2',
    isCode: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    timeAgo: 'Yesterday',
    category: 'Civil Engineering',
    status: 'Active'
  },
  {
    id: 'act-3',
    isCode: 'IS 14543:2016',
    title: 'Packaged Drinking Water (Other than Natural Mineral Water)',
    timeAgo: '2 days ago',
    category: 'Mandatory QCO',
    status: 'Mandatory'
  },
  {
    id: 'act-4',
    isCode: 'IS 9873:2019',
    title: 'Safety of Toys — Part 1: Mechanical & Physical Properties',
    timeAgo: '3 days ago',
    category: 'Child Safety',
    status: 'Mandatory'
  }
];

export const SAMPLE_PROMPT_SUGGESTIONS = [
  'What are the standard requirements for packaged drinking water in India?',
  'What is the difference between IS 10500 and IS 14543?',
  'Which IS codes are mandatory for safety of toys under QCO?',
  'Explain concrete grade requirements and water-cement ratio under IS 456:2000',
  'What is the testing procedure and glow wire temperature for plugs under IS 1293?',
  'How do I verify a BIS Licence CM/L or R-Number?'
];
