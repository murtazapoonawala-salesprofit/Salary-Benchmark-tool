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

export interface Inputs {
  yearsExperience: number | '';
  fixedSalaryLacs: number | '';
  variablePercentage: number | ''; // stored as percentage value e.g., 30 for 30%
  dealSize: DealSize;
  region: Region;
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