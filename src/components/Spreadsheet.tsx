import React, { useState, useCallback, useEffect } from "react";
import Grid from "./Grid";
import Toolbar from "./Toolbar";
import FormulaBar from "./FormulaBar";
import FindReplaceDialog from "./FindReplaceDialog";
import {
  CellType,
  GridData,
  Position,
  SelectionRange,
  ColumnSize,
  RowSize,
  CellDependency,
} from "../types/spreadsheet";
import {
  createEmptyCell,
  createInitialGridData,
  getCellDisplayValue,
  getCellReference,
  parseCellReference,
  toggleFormatting,
} from "../utils/cellUtils";
import { evaluateFormula, parseFormula } from "../utils/formulaFunctions";
import { toast } from "sonner";

const DEFAULT_ROWS = 25;
const DEFAULT_COLS = 12;

const Spreadsheet: React.FC = () => {
  // Grid state
  const [gridData, setGridData] = useState<GridData>(
    createInitialGridData(DEFAULT_ROWS, DEFAULT_COLS)
  );
  const [activeCell, setActiveCell] = useState<Position | null>(null);
  const [selection, setSelection] = useState<SelectionRange | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  
  // Column and row sizes
  const [columnSizes, setColumnSizes] = useState<ColumnSize[]>([]);
  const [rowSizes, setRowSizes] = useState<RowSize[]>([]);
  
  // Cell dependencies
  const [dependencies, setDependencies] = useState<CellDependency[]>([]);
  
  // History for undo/redo
  const [history, setHistory] = useState<GridData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Find and replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceOptions, setFindReplaceOptions] = useState({
    find: "",
    replace: "",
    matchCase: false,
  });
  
  // Initialize grid data and history
  useEffect(() => {
    const initialData = createInitialGridData(DEFAULT_ROWS, DEFAULT_COLS);
    setGridData(initialData);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);
  
  // Add current grid state to history
  const addToHistory = useCallback((newGridData: GridData) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [...newHistory, JSON.parse(JSON.stringify(newGridData))];
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  }, [historyIndex]);
  
  // Handle cell click
  const handleCellClick = useCallback((position: Position) => {
    setActiveCell(position);
    setSelection({
      start: position,
      end: position,
    });
    
    // If already editing, commit the change first
    if (isEditing) {
      commitEdit();
    }
    
    // Set the edit value based on the selected cell
    if (position.row >= 0 && position.row < gridData.length &&
        position.col >= 0 && position.col < gridData[0].length) {
      const cell = gridData[position.row][position.col];
      setEditValue(cell.formula ? cell.formula : cell.value !== null ? String(cell.value) : "");
    }
  }, [gridData, isEditing]);
  
  // Handle cell double click to start editing
  const handleCellDoubleClick = useCallback((position: Position) => {
    setActiveCell(position);
    setSelection({
      start: position,
      end: position,
    });
    
    if (position.row >= 0 && position.row < gridData.length &&
        position.col >= 0 && position.col < gridData[0].length) {
      const cell = gridData[position.row][position.col];
      setEditValue(cell.formula ? cell.formula : cell.value !== null ? String(cell.value) : "");
      setIsEditing(true);
    }
  }, [gridData]);
  
  // Handle selection change
  const handleSelectionChange = useCallback((newSelection: SelectionRange) => {
    setSelection(newSelection);
  }, []);
  
  // Handle edit value change
  const handleEditValueChange = useCallback((value: string) => {
    setEditValue(value);
  }, []);
  
  // Update a cell in the grid
  const updateCell = useCallback((rowIndex: number, colIndex: number, updates: Partial<CellType>) => {
    setGridData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = {
        ...newData[rowIndex][colIndex],
        ...updates,
      };
      return newData;
    });
  }, []);
  
  // Commit the edit and update the cell
  const commitEdit = useCallback(() => {
    if (!activeCell || !isEditing) return;
    
    const { row, col } = activeCell;
    const value = editValue.trim();
    
    // Store the previous grid data for history
    const prevGridData = JSON.parse(JSON.stringify(gridData));
    
    // Check if it's a formula
    if (value.startsWith("=")) {
      try {
        // Extract cell references from the formula to update dependencies
        const references = parseFormula(value);
        
        // Update dependencies for this cell
        const cellRef = getCellReference(row, col);
        setDependencies((prevDeps) => {
          const filteredDeps = prevDeps.filter((dep) => dep.cell !== cellRef);
          return [
            ...filteredDeps,
            {
              cell: cellRef,
              dependencies: references,
            },
          ];
        });
        
        // Calculate the formula result
        const result = evaluateFormula(value, gridData);
        
        // Check if this is a special action (e.g., find and replace)
        if (typeof result === 'object' && result !== null && 'action' in result) {
          if (result.action === 'FIND_AND_REPLACE' && typeof result.find === 'string' &&
              typeof result.replace === 'string' && typeof result.range === 'string') {
            // Handle find and replace
            setFindReplaceOptions({
              find: result.find,
              replace: result.replace,
              matchCase: false,
            });
            setShowFindReplace(true);
          } else if (result.action === 'REMOVE_DUPLICATES' && typeof result.range === 'string') {
            // Handle remove duplicates
            handleRemoveDuplicates(result.range);
          }
          
          // Clear the cell after special action
          updateCell(row, col, {
            value: null,
            formula: null,
          });
        } else {
          // Update the cell with the formula and result
          updateCell(row, col, {
            value: result,
            formula: value,
          });
        }
      } catch (error) {
        console.error("Formula error:", error);
        updateCell(row, col, {
          value: "#ERROR",
          formula: value,
        });
      }
    } else {
      // It's not a formula, just a regular value
      // Check if it could be a number
      const numericValue = parseFloat(value);
      const isNumber = !isNaN(numericValue) && isFinite(numericValue);
      
      updateCell(row, col, {
        value: isNumber ? numericValue : value,
        formula: null,
        type: isNumber ? "number" : "text",
      });
    }
    
    // Add to history
    addToHistory(gridData);
    
    // Update dependent cells
    updateDependentCells();
    
    setIsEditing(false);
  }, [activeCell, isEditing, editValue, gridData, updateCell, addToHistory]);
  
  // Update cells that depend on modified cells
  const updateDependentCells = useCallback(() => {
    if (!activeCell) return;
    
    const cellRef = getCellReference(activeCell.row, activeCell.col);
    
    // Find all cells that depend on the active cell
    const dependentCells = dependencies.filter((dep) =>
      dep.dependencies.includes(cellRef)
    );
    
    // Update each dependent cell
    dependentCells.forEach((dep) => {
      const pos = parseCellReference(dep.cell);
      if (pos) {
        const { row, col } = pos;
        const cell = gridData[row][col];
        
        if (cell.formula) {
          try {
            const result = evaluateFormula(cell.formula, gridData);
            updateCell(row, col, {
              value: result,
            });
          } catch (error) {
            console.error("Error updating dependent cell:", error);
            updateCell(row, col, {
              value: "#ERROR",
            });
          }
        }
      }
    });
  }, [activeCell, dependencies, gridData, updateCell]);
  
  // Cancel the edit
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue("");
  }, []);
  
  // Start editing
  const startEditing = useCallback(() => {
    if (!activeCell) return;
    
    const { row, col } = activeCell;
    const cell = gridData[row][col];
    setEditValue(cell.formula ? cell.formula : cell.value !== null ? String(cell.value) : "");
    setIsEditing(true);
  }, [activeCell, gridData]);
  
  // Handle key down events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If editing, let the input handle the keypress
      if (isEditing) return;
      
      if (e.key === "Enter") {
        if (activeCell) {
          e.preventDefault();
          startEditing();
        }
      } else if (e.key === "Escape") {
        if (isEditing) {
          e.preventDefault();
          handleCancelEdit();
        }
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
      } else if (e.key === "y" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && 
                activeCell && /^[a-zA-Z0-9=+\-*/().,:;'"]$/.test(e.key)) {
        // Start editing when typing a character
        e.preventDefault();
        setEditValue(e.key);
        setIsEditing(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, activeCell, handleCancelEdit, startEditing]);
  
  // Handle column resize
  const handleColumnResize = useCallback((index: number, width: number) => {
    setColumnSizes((prevSizes) => {
      const newSizes = [...prevSizes];
      const existingIndex = newSizes.findIndex((col) => col.index === index);
      
      if (existingIndex !== -1) {
        newSizes[existingIndex] = { index, width };
      } else {
        newSizes.push({ index, width });
      }
      
      return newSizes;
    });
  }, []);
  
  // Handle row resize
  const handleRowResize = useCallback((index: number, height: number) => {
    setRowSizes((prevSizes) => {
      const newSizes = [...prevSizes];
      const existingIndex = newSizes.findIndex((row) => row.index === index);
      
      if (existingIndex !== -1) {
        newSizes[existingIndex] = { index, height };
      } else {
        newSizes.push({ index, height });
      }
      
      return newSizes;
    });
  }, []);
  
  // Handle cell formatting
  const handleFormatClick = useCallback((format: string) => {
    if (!activeCell) return;
    
    const { row, col } = activeCell;
    const cell = gridData[row][col];
    
    // Toggle the formatting
    const updatedCell = toggleFormatting(cell, format);
    
    // Update the cell
    updateCell(row, col, updatedCell);
    
    // Add to history
    addToHistory(gridData);
  }, [activeCell, gridData, updateCell, addToHistory]);
  
  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      setGridData(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  }, [history, historyIndex]);
  
  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setGridData(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  }, [history, historyIndex]);
  
  // Save the spreadsheet to localStorage
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(
        "spreadsheet-data",
        JSON.stringify({
          gridData,
          columnSizes,
          rowSizes,
          dependencies,
        })
      );
      toast.success("Spreadsheet saved successfully");
    } catch (error) {
      console.error("Error saving spreadsheet:", error);
      toast.error("Failed to save spreadsheet");
    }
  }, [gridData, columnSizes, rowSizes, dependencies]);
  
  // Load the spreadsheet from localStorage
  const handleLoad = useCallback(() => {
    try {
      const savedData = localStorage.getItem("spreadsheet-data");
      if (savedData) {
        const { gridData: savedGridData, columnSizes: savedColumnSizes, 
                rowSizes: savedRowSizes, dependencies: savedDependencies } = JSON.parse(savedData);
        
        setGridData(savedGridData);
        setColumnSizes(savedColumnSizes);
        setRowSizes(savedRowSizes);
        setDependencies(savedDependencies);
        
        // Reset history with the loaded data
        setHistory([savedGridData]);
        setHistoryIndex(0);
        
        toast.success("Spreadsheet loaded successfully");
      } else {
        toast.error("No saved spreadsheet found");
      }
    } catch (error) {
      console.error("Error loading spreadsheet:", error);
      toast.error("Failed to load spreadsheet");
    }
  }, []);
  
  // Handle find and replace
  const handleFindReplace = useCallback((find: string, replace: string, matchCase: boolean) => {
    if (!find) {
      toast.error("Find value cannot be empty");
      return;
    }
    
    setGridData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let replaceCount = 0;
      
      // Apply to the currently selected range, or the entire grid if no selection
      const range = selection 
        ? {
            startRow: Math.min(selection.start.row, selection.end.row),
            endRow: Math.max(selection.start.row, selection.end.row),
            startCol: Math.min(selection.start.col, selection.end.col),
            endCol: Math.max(selection.start.col, selection.end.col),
          }
        : {
            startRow: 0,
            endRow: newData.length - 1,
            startCol: 0,
            endCol: newData[0].length - 1,
          };
      
      for (let r = range.startRow; r <= range.endRow; r++) {
        for (let c = range.startCol; c <= range.endCol; c++) {
          const cell = newData[r][c];
          
          if (cell.value && typeof cell.value === "string") {
            const oldValue = cell.value;
            let newValue;
            
            if (matchCase) {
              newValue = oldValue.replaceAll(find, replace);
            } else {
              // Case-insensitive replace
              const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              newValue = oldValue.replace(regex, replace);
            }
            
            if (oldValue !== newValue) {
              newData[r][c] = {
                ...cell,
                value: newValue,
              };
              replaceCount++;
            }
          }
        }
      }
      
      if (replaceCount > 0) {
        toast.success(`Replaced ${replaceCount} occurrences`);
        addToHistory(newData);
      } else {
        toast.info("No matches found");
      }
      
      return newData;
    });
    
    setShowFindReplace(false);
  }, [selection, addToHistory]);
  
  // Handle remove duplicates
  const handleRemoveDuplicates = useCallback((rangeStr: string) => {
    try {
      const [start, end] = rangeStr.split(":");
      const startPos = parseCellReference(start);
      const endPos = parseCellReference(end);
      
      if (!startPos || !endPos) {
        toast.error("Invalid range");
        return;
      }
      
      setGridData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));
        
        const range = {
          startRow: Math.min(startPos.row, endPos.row),
          endRow: Math.max(startPos.row, endPos.row),
          startCol: Math.min(startPos.col, endPos.col),
          endCol: Math.max(startPos.col, endPos.col),
        };
        
        // Get all rows in the range
        const rows: Array<Array<CellType>> = [];
        for (let r = range.startRow; r <= range.endRow; r++) {
          const row: Array<CellType> = [];
          for (let c = range.startCol; c <= range.endCol; c++) {
            row.push(newData[r][c]);
          }
          rows.push(row);
        }
        
        // Remove duplicates
        const uniqueRows: Array<Array<CellType>> = [];
        const seenValues = new Set<string>();
        
        rows.forEach((row) => {
          const rowValues = row.map((cell) => 
            cell.value !== null ? String(cell.value) : ""
          ).join("|");
          
          if (!seenValues.has(rowValues)) {
            seenValues.add(rowValues);
            uniqueRows.push(row);
          }
        });
        
        // Replace rows in the grid with unique rows
        for (let r = range.startRow; r <= range.endRow; r++) {
          const rowIndex = r - range.startRow;
          
          if (rowIndex < uniqueRows.length) {
            // This is a unique row, keep it
            for (let c = range.startCol; c <= range.endCol; c++) {
              const colIndex = c - range.startCol;
              newData[r][c] = uniqueRows[rowIndex][colIndex];
            }
          } else {
            // This is a duplicate row, clear it
            for (let c = range.startCol; c <= range.endCol; c++) {
              newData[r][c] = createEmptyCell();
            }
          }
        }
        
        const removedCount = rows.length - uniqueRows.length;
        toast.success(`Removed ${removedCount} duplicate rows`);
        
        // Add to history
        addToHistory(newData);
        
        return newData;
      });
    } catch (error) {
      console.error("Error removing duplicates:", error);
      toast.error("Failed to remove duplicates");
    }
  }, [addToHistory]);
  
  // Add row to the grid
  const handleAddRow = useCallback(() => {
    setGridData((prevData) => {
      const newData = [...prevData];
      const newRow = Array(prevData[0].length)
        .fill(null)
        .map(() => createEmptyCell());
      
      newData.push(newRow);
      
      // Add to history
      addToHistory(newData);
      
      return newData;
    });
  }, [addToHistory]);
  
  // Add column to the grid
  const handleAddColumn = useCallback(() => {
    setGridData((prevData) => {
      const newData = prevData.map((row) => {
        return [...row, createEmptyCell()];
      });
      
      // Add to history
      addToHistory(newData);
      
      return newData;
    });
  }, [addToHistory]);
  
  // Delete row from the grid
  const handleDeleteRow = useCallback((index: number) => {
    setGridData((prevData) => {
      const newData = [...prevData];
      
      // Don't delete if there's only one row left
      if (newData.length <= 1) {
        toast.error("Cannot delete the last row");
        return prevData;
      }
      
      newData.splice(index, 1);
      
      // Add to history
      addToHistory(newData);
      
      return newData;
    });
  }, [addToHistory]);
  
  // Delete column from the grid
  const handleDeleteColumn = useCallback((index: number) => {
    setGridData((prevData) => {
      // Don't delete if there's only one column left
      if (prevData[0].length <= 1) {
        toast.error("Cannot delete the last column");
        return prevData;
      }
      
      const newData = prevData.map((row) => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      });
      
      // Add to history
      addToHistory(newData);
      
      return newData;
    });
  }, [addToHistory]);
  
  return (
    <div className="h-full flex flex-col">
      <Toolbar
        onFormatClick={handleFormatClick}
        onSave={handleSave}
        onLoad={handleLoad}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onFindReplaceOpen={() => setShowFindReplace(true)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      
      <FormulaBar
        activeCell={activeCell}
        value={editValue}
        onChange={setEditValue}
        onSubmit={commitEdit}
        onCancel={handleCancelEdit}
      />
      
      <div className="flex-1 overflow-hidden">
        <Grid
          gridData={gridData}
          activeCell={activeCell}
          selection={selection}
          isEditing={isEditing}
          editValue={editValue}
          columnSizes={columnSizes}
          rowSizes={rowSizes}
          onCellClick={handleCellClick}
          onCellDoubleClick={handleCellDoubleClick}
          onSelectionChange={handleSelectionChange}
          onEditValueChange={handleEditValueChange}
          onColumnResize={handleColumnResize}
          onRowResize={handleRowResize}
          onAddRow={handleAddRow}
          onAddColumn={handleAddColumn}
          onDeleteRow={handleDeleteRow}
          onDeleteColumn={handleDeleteColumn}
        />
      </div>
      
      <FindReplaceDialog
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        onFindReplace={handleFindReplace}
        initialFind={findReplaceOptions.find}
        initialReplace={findReplaceOptions.replace}
        initialMatchCase={findReplaceOptions.matchCase}
      />
    </div>
  );
};

export default Spreadsheet;
