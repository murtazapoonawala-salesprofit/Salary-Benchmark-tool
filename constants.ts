import { Achievement, DealSize, Region } from "./types";

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