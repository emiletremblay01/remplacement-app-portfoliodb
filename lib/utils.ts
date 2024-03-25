import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import Papa from "papaparse";
export const convertToCSV = (jsonData: unknown[]) => {
  const csv = Papa.unparse(jsonData);
  return csv;
};
