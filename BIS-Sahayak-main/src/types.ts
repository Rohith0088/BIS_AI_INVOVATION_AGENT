export type AppMode = 'consumer' | 'industry';

export type NavigationTab = 
  | 'home' 
  | 'assistant' 
  | 'finder' 
  | 'services' 
  | 'labs' 
  | 'saved' 
  | 'profile' 
  | 'history' 
  | 'feedback' 
  | 'support';

export interface StandardClause {
  clauseNumber: string;
  title: string;
  summary: string;
  mandatory?: boolean;
}

export interface StandardItem {
  id: string;
  isCode: string;
  year: string;
  title: string;
  category: string;
  department: string;
  isMandatoryQCO: boolean;
  qcoNotificationNumber?: string;
  summary: string;
  scope: string;
  keyClauses: StandardClause[];
  isoEquivalence?: string;
  isoComparisonNotes?: string;
  sampleTestParameters?: string[];
  pdfExcerptSnippet?: string;
  viewsCount?: number;
  lastUpdated?: string;
}

export interface CitedClause {
  clause: string;
  description: string;
}

export interface SourceCardInfo {
  isCode: string;
  title: string;
  category?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  confidence?: 'high' | 'medium' | 'low';
  intent?: string;
  clarificationNeeded?: boolean;
  warnings?: string[];
  nextActions?: string[];
  citedClauses?: CitedClause[];
  sourceCard?: SourceCardInfo;
  mode?: AppMode;
  suggestedActions?: {
    label: string;
    actionType: 'download' | 'compare' | 'open_finder' | 'verify' | 'complaint' | 'custom';
    payload?: string;
  }[];
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface TestingLab {
  id: string;
  name: string;
  code: string;
  type: 'Central' | 'Regional' | 'Branch' | 'Recognized Private';
  state: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  capabilities: string[];
  productCategories: string[];
  nablAccreditationNo: string;
  validUntil: string;
  isGovt: boolean;
}

export interface CertificationScheme {
  id: string;
  title: string;
  markName: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  targetAudience: string;
  applicableStandardsExample: string[];
  keyBenefits: string[];
  processSteps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  requiredDocuments: string[];
  estimatedTimeline: string;
  officialPortal: string;
}

export interface LicenceVerificationResult {
  valid: boolean;
  licenceNumber: string;
  cmlNumber?: string;
  manufacturerName?: string;
  factoryAddress?: string;
  isCode?: string;
  productName?: string;
  brandName?: string;
  validFrom?: string;
  validTo?: string;
  status: 'Operative' | 'Expired' | 'Suspended' | 'Invalid';
  scheme: string;
}
