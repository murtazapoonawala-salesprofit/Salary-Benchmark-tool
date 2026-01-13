export enum DealSize {
  LESS_THAN_10 = "Less than 10 Lakhs",
  BETWEEN_10_50 = "Between 10–50 Lakhs",
  BETWEEN_50_100 = "Between 50–100 Lakhs",
  ABOVE_100 = "Above 100 Lakhs"
}

export enum Region {
  INDIA = "India",
  GLOBAL = "Global",
  BOTH = "Both"
}

export enum Achievement {
  LESS_THAN_70 = "<70%",
  BETWEEN_70_90 = "70–90%",
  BETWEEN_90_100 = "90–100%",
  BETWEEN_100_120 = "100–120%",
  ABOVE_120 = ">120%"
}

// New Enums for Profile Context
export enum CurrentRole {
  SDR_BDR = "SDR / BDR",
  AE_SMB = "Account Executive – SMB",
  AE_ENT = "Account Executive – Enterprise / New Logo",
  AM_FARMING = "Account Manager – Farming",
  SALES_MANAGER_IC = "Sales Manager – IC role",
  SALES_HEAD = "Sales Head / Director"
}

export enum RevenueResponsibility {
  IC_ROLE = "IC role",
  IC_TEAM_MGMT = "IC+ Team management",
  TEAM_MGMT = "Team management"
}

export enum PrimaryDomain {
  SAAS_HORIZONTAL = "SaaS – Horizontal",
  SAAS_VERTICAL = "SaaS – Vertical / Niche",
  IT_SERVICES = "IT Services – Digital Transformation",
  CYBERSECURITY = "Cybersecurity",
  FINTECH_AI = "Fintech / AI / Data",
  ERP_ITSM = "ERP / ITSM /",
  OTHERS = "Others"
}

export enum BuyingCommittee {
  PROCUREMENT = "Procurement",
  BUSINESS_TECH = "Business + Tech",
  TECH_PROCUREMENT = "Tech + Procurement",
  CXO_MULTI = "CXO + Multi-stakeholder"
}

export interface Inputs {
  // Section 1
  yearsExperience: number | '';
  currentRole: CurrentRole;
  revenueResponsibility: RevenueResponsibility;
  
  // Section 2
  primaryDomain: PrimaryDomain;
  dealSize: DealSize;

  // Section 3
  region: Region;
  buyingCommittee: BuyingCommittee;

  // Section 4
  fixedSalaryLacs: number | '';
  variablePercentage: number | ''; // stored as percentage value e.g., 30 for 30%
  
  // Section 5
  achievement: Achievement;
}

export interface CalculationResult {
  totalCtc: number;
  dealFactor: number;
  regionFactor: number;
  achievementFactor: number;
  zValue: number;
  xValue: number;
  benchmarkSalary: number;
  isUnderpaid: boolean;
  status: "Underpaid" | "Market Aligned";
}