
// Types of cell values
export type CellValue = string | number | null | Record<string, any>;

// Cell formatting options
export type CellFormatting = 
  | "bold" 
  | "italic" 
  | "underline" 
  | "strikethrough"
  | "left"
  | "center"
  | "right";

// Cell types
export type CellDataType = "text" | "number" | "date" | "boolean";

// Cell structure
export interface CellType {
  value: CellValue;
  formula: string | null;
  formatting?: CellFormatting[];
  type?: CellDataType;
}

// Position in the grid
export interface Position {
  row: number;
  col: number;
}

// Selection range
export interface SelectionRange {
  start: Position;
  end: Position;
}

// Grid data type (2D array of cells)
export type GridData = CellType[][];

// Column size configuration
export interface ColumnSize {
  index: number;
  width: number;
}

// Row size configuration
export interface RowSize {
  index: number;
  height: number;
}

// Cell dependency type
export interface CellDependency {
  cell: string; // The cell reference (e.g., "A1")
  dependencies: string[]; // Array of cell references this cell depends on
}

// Spreadsheet state type
export interface SpreadsheetState {
  gridData: GridData;
  activeCell: Position | null;
  selection: SelectionRange | null;
  columnSizes: ColumnSize[];
  rowSizes: RowSize[];
  isEditing: boolean;
  editValue: string;
  dependencies: CellDependency[];
  history: GridData[];
  historyIndex: number;
  showFindReplace: boolean;
  findReplaceOptions: {
    find: string;
    replace: string;
    matchCase: boolean;
  };
}
