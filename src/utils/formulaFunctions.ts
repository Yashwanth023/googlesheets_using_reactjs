
import { CellValue, GridData } from "../types/spreadsheet";
import { getCellRangeValues, getCellValueByReference, isNumeric } from "./cellUtils";

// Parse a formula expression and extract references
export const parseFormula = (formula: string): string[] => {
  // This regex matches cell references (A1) and ranges (A1:B5)
  const referenceRegex = /[A-Z]+\d+(?::[A-Z]+\d+)?/g;
  return formula.match(referenceRegex) || [];
};

// Evaluate a function with arguments
export const evaluateFunction = (
  funcName: string,
  args: string[],
  gridData: GridData
): CellValue => {
  const functionName = funcName.toUpperCase();
  
  switch (functionName) {
    // Mathematical functions
    case "SUM":
      return calculateSum(args, gridData);
    case "AVERAGE":
      return calculateAverage(args, gridData);
    case "MAX":
      return calculateMax(args, gridData);
    case "MIN":
      return calculateMin(args, gridData);
    case "COUNT":
      return calculateCount(args, gridData);
      
    // Data quality functions
    case "TRIM":
      return applyTrim(args, gridData);
    case "UPPER":
      return applyUpper(args, gridData);
    case "LOWER":
      return applyLower(args, gridData);
    case "REMOVE_DUPLICATES":
      // This returns a special instruction that will be handled by the grid component
      return {
        type: "action",
        action: "REMOVE_DUPLICATES",
        range: args[0]
      };
    case "FIND_AND_REPLACE":
      // This returns a special instruction that will be handled by the grid component
      return {
        type: "action",
        action: "FIND_AND_REPLACE",
        find: args[0],
        replace: args[1],
        range: args[2]
      };
      
    default:
      return `#ERROR: Unknown function ${funcName}`;
  }
};

// Get values from references, handling both single cells and ranges
const getValuesFromReferences = (
  references: string[],
  gridData: GridData
): CellValue[] => {
  const values: CellValue[] = [];
  
  for (const ref of references) {
    if (ref.includes(':')) {
      // It's a range
      const rangeValues = getCellRangeValues(gridData, ref);
      values.push(...rangeValues);
    } else {
      // It's a single cell
      const value = getCellValueByReference(gridData, ref);
      if (value !== null) {
        values.push(value);
      }
    }
  }
  
  return values;
};

// Filter numeric values from an array of CellValues
const getNumericValues = (values: CellValue[]): number[] => {
  return values
    .filter((value): value is string | number => 
      value !== null && (typeof value === 'number' || isNumeric(String(value)))
    )
    .map((value) => 
      typeof value === 'number' ? value : parseFloat(String(value))
    );
};

// Mathematical Functions
const calculateSum = (args: string[], gridData: GridData): number | string => {
  const values = getValuesFromReferences(args, gridData);
  const numericValues = getNumericValues(values);
  
  if (numericValues.length === 0) return 0;
  
  return numericValues.reduce((sum, value) => sum + value, 0);
};

const calculateAverage = (args: string[], gridData: GridData): number | string => {
  const values = getValuesFromReferences(args, gridData);
  const numericValues = getNumericValues(values);
  
  if (numericValues.length === 0) return "#DIV/0!";
  
  const sum = numericValues.reduce((acc, value) => acc + value, 0);
  return sum / numericValues.length;
};

const calculateMax = (args: string[], gridData: GridData): number | string => {
  const values = getValuesFromReferences(args, gridData);
  const numericValues = getNumericValues(values);
  
  if (numericValues.length === 0) return "#N/A";
  
  return Math.max(...numericValues);
};

const calculateMin = (args: string[], gridData: GridData): number | string => {
  const values = getValuesFromReferences(args, gridData);
  const numericValues = getNumericValues(values);
  
  if (numericValues.length === 0) return "#N/A";
  
  return Math.min(...numericValues);
};

const calculateCount = (args: string[], gridData: GridData): number => {
  const values = getValuesFromReferences(args, gridData);
  const numericValues = getNumericValues(values);
  
  return numericValues.length;
};

// Data Quality Functions
const applyTrim = (args: string[], gridData: GridData): string => {
  if (args.length === 0) return "#ERROR: Missing argument";
  
  const cellValue = getCellValueByReference(gridData, args[0]);
  if (cellValue === null) return "";
  
  return String(cellValue).trim();
};

const applyUpper = (args: string[], gridData: GridData): string => {
  if (args.length === 0) return "#ERROR: Missing argument";
  
  const cellValue = getCellValueByReference(gridData, args[0]);
  if (cellValue === null) return "";
  
  return String(cellValue).toUpperCase();
};

const applyLower = (args: string[], gridData: GridData): string => {
  if (args.length === 0) return "#ERROR: Missing argument";
  
  const cellValue = getCellValueByReference(gridData, args[0]);
  if (cellValue === null) return "";
  
  return String(cellValue).toLowerCase();
};

// Main formula evaluation function
export const evaluateFormula = (
  formula: string,
  gridData: GridData
): CellValue => {
  try {
    // Check if the formula is a function call
    const functionMatch = formula.match(/^=([A-Z_]+)\((.*)\)$/);
    
    if (functionMatch) {
      const [, funcName, argsString] = functionMatch;
      
      // Parse the arguments (handling commas inside quotes)
      const args: string[] = [];
      let currentArg = "";
      let insideQuote = false;
      
      for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        
        if (char === '"' && (i === 0 || argsString[i - 1] !== '\\')) {
          insideQuote = !insideQuote;
        }
        
        if (char === ',' && !insideQuote) {
          args.push(currentArg.trim());
          currentArg = "";
        } else {
          currentArg += char;
        }
      }
      
      if (currentArg.trim()) {
        args.push(currentArg.trim());
      }
      
      return evaluateFunction(funcName, args, gridData);
    }
    
    // If it's not a function call, try to evaluate as an expression
    // First, replace cell references with their values
    const references = parseFormula(formula);
    let evalString = formula.substring(1); // Remove the = sign
    
    for (const ref of references) {
      if (ref.includes(':')) {
        // Range references can't be directly evaluated
        return "#ERROR: Cannot evaluate range in expression";
      }
      
      const value = getCellValueByReference(gridData, ref);
      if (value === null) {
        evalString = evalString.replace(ref, "0");
      } else if (typeof value === "number") {
        evalString = evalString.replace(ref, value.toString());
      } else if (typeof value === "string" && isNumeric(value)) {
        evalString = evalString.replace(ref, value);
      } else {
        return "#ERROR: Non-numeric value in expression";
      }
    }
    
    // Safely evaluate the expression
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${evalString})`)();
    return result;
  } catch (error) {
    console.error("Formula evaluation error:", error);
    return "#ERROR";
  }
};
