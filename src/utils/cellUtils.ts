
import { CellType, CellValue, GridData, Position } from "../types/spreadsheet";

// Convert a column index to a letter (e.g., 0 -> A, 1 -> B, etc.)
export const indexToColumn = (index: number): string => {
  let columnName = "";
  while (index >= 0) {
    columnName = String.fromCharCode((index % 26) + 65) + columnName;
    index = Math.floor(index / 26) - 1;
  }
  return columnName;
};

// Convert a column letter to an index (e.g., A -> 0, B -> 1, etc.)
export const columnToIndex = (column: string): number => {
  let index = -1;
  for (let i = 0; i < column.length; i++) {
    index = (index + 1) * 26 + column.charCodeAt(i) - 65;
  }
  return index;
};

// Get cell reference (e.g., A1, B2, etc.)
export const getCellReference = (row: number, col: number): string => {
  return `${indexToColumn(col)}${row + 1}`;
};

// Parse cell reference (e.g., A1 -> { row: 0, col: 0 })
export const parseCellReference = (ref: string): Position | null => {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const col = columnToIndex(match[1]);
  const row = parseInt(match[2], 10) - 1;
  
  return { row, col };
};

// Get a cell value by reference from the grid data
export const getCellValueByReference = (
  gridData: GridData,
  ref: string
): CellValue | null => {
  const position = parseCellReference(ref);
  if (!position) return null;
  
  const { row, col } = position;
  if (
    row < 0 ||
    row >= gridData.length ||
    col < 0 ||
    col >= gridData[0].length
  ) {
    return null;
  }
  
  return gridData[row][col].value;
};

// Evaluate if a string can be converted to a number
export const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

// Convert a cell value to a display value
export const getCellDisplayValue = (cell: CellType): string => {
  if (cell.formula) {
    return cell.value !== null ? String(cell.value) : '';
  }
  return cell.value !== null ? String(cell.value) : '';
};

// Check if a cell has a specific formatting
export const hasFormatting = (cell: CellType, format: string): boolean => {
  return cell.formatting?.includes(format) || false;
};

// Add formatting to a cell
export const addFormatting = (cell: CellType, format: string): CellType => {
  const formatting = cell.formatting || [];
  if (!formatting.includes(format)) {
    return {
      ...cell,
      formatting: [...formatting, format],
    };
  }
  return cell;
};

// Remove formatting from a cell
export const removeFormatting = (cell: CellType, format: string): CellType => {
  const formatting = cell.formatting || [];
  return {
    ...cell,
    formatting: formatting.filter((f) => f !== format),
  };
};

// Toggle formatting on a cell
export const toggleFormatting = (cell: CellType, format: string): CellType => {
  return hasFormatting(cell, format)
    ? removeFormatting(cell, format)
    : addFormatting(cell, format);
};

// Create a new empty cell
export const createEmptyCell = (): CellType => ({
  value: null,
  formula: null,
  formatting: [],
  type: 'text',
});

// Create initial grid data with empty cells
export const createInitialGridData = (
  rows: number,
  cols: number
): GridData => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => createEmptyCell())
    );
};

// Get a range of cells from grid data (e.g., A1:B3)
export const getCellRangeValues = (
  gridData: GridData,
  range: string
): CellValue[] => {
  const [start, end] = range.split(':');
  const startPos = parseCellReference(start);
  const endPos = parseCellReference(end);
  
  if (!startPos || !endPos) return [];
  
  const values: CellValue[] = [];
  
  for (let r = startPos.row; r <= endPos.row; r++) {
    for (let c = startPos.col; c <= endPos.col; c++) {
      if (
        r >= 0 &&
        r < gridData.length &&
        c >= 0 &&
        c < gridData[0].length
      ) {
        values.push(gridData[r][c].value);
      }
    }
  }
  
  return values;
};
