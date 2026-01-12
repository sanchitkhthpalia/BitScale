
export interface RowData {
  id: number;
  importedData: string;
  lastUpdated: string;
  companyName: string;
  companyWebsite: string;
  linkedinUrl: string;
  emailWaterfall: 'Found' | 'Not Met' | 'Pending' | 'None';
  companyLogo?: string;
}

export enum EmailStatus {
  FOUND = 'Found',
  NOT_MET = 'Not Met',
  PENDING = 'Pending',
  NONE = 'None'
}
