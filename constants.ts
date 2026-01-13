import { Achievement, DealSize, Region, CurrentRole, RevenueResponsibility, PrimaryDomain, BuyingCommittee } from "./types";

export const DEAL_SIZE_OPTIONS = [
  { value: DealSize.LESS_THAN_10, label: "Less than 10 Lakhs" },
  { value: DealSize.BETWEEN_10_50, label: "Between 10–50 Lakhs" },
  { value: DealSize.BETWEEN_50_100, label: "Between 50–100 Lakhs" },
  { value: DealSize.ABOVE_100, label: "Above 100 Lakhs" },
];

export const REGION_OPTIONS = [
  { value: Region.INDIA, label: "India" },
  { value: Region.GLOBAL, label: "Global" },
  { value: Region.BOTH, label: "Both" },
];

export const ACHIEVEMENT_OPTIONS = [
  { value: Achievement.LESS_THAN_70, label: "<70%" },
  { value: Achievement.BETWEEN_70_90, label: "70–90%" },
  { value: Achievement.BETWEEN_90_100, label: "90–100%" },
  { value: Achievement.BETWEEN_100_120, label: "100–120%" },
  { value: Achievement.ABOVE_120, label: ">120%" },
];

// New Options Arrays

export const CURRENT_ROLE_OPTIONS = [
  { value: CurrentRole.SDR_BDR, label: "SDR / BDR" },
  { value: CurrentRole.AE_SMB, label: "Account Executive – SMB" },
  { value: CurrentRole.AE_ENT, label: "Account Executive – Enterprise / New Logo" },
  { value: CurrentRole.AM_FARMING, label: "Account Manager – Farming" },
  { value: CurrentRole.SALES_MANAGER_IC, label: "Sales Manager – IC role" },
  { value: CurrentRole.SALES_HEAD, label: "Sales Head / Director" },
];

export const REVENUE_RESPONSIBILITY_OPTIONS = [
  { value: RevenueResponsibility.IC_ROLE, label: "IC role" },
  { value: RevenueResponsibility.IC_TEAM_MGMT, label: "IC+ Team management" },
  { value: RevenueResponsibility.TEAM_MGMT, label: "Team management" },
];

export const PRIMARY_DOMAIN_OPTIONS = [
  { value: PrimaryDomain.SAAS_HORIZONTAL, label: "SaaS – Horizontal" },
  { value: PrimaryDomain.SAAS_VERTICAL, label: "SaaS – Vertical / Niche" },
  { value: PrimaryDomain.IT_SERVICES, label: "IT Services – Digital Transformation" },
  { value: PrimaryDomain.CYBERSECURITY, label: "Cybersecurity" },
  { value: PrimaryDomain.FINTECH_AI, label: "Fintech / AI / Data" },
  { value: PrimaryDomain.ERP_ITSM, label: "ERP / ITSM /" },
  { value: PrimaryDomain.OTHERS, label: "Others" },
];

export const BUYING_COMMITTEE_OPTIONS = [
  { value: BuyingCommittee.PROCUREMENT, label: "Procurement" },
  { value: BuyingCommittee.BUSINESS_TECH, label: "Business + Tech" },
  { value: BuyingCommittee.TECH_PROCUREMENT, label: "Tech + Procurement" },
  { value: BuyingCommittee.CXO_MULTI, label: "CXO + Multi-stakeholder" },
];