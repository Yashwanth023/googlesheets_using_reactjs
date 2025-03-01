
import React, { useCallback, useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import {
  CellType,
  GridData,
  Position,
  SelectionRange,
  ColumnSize,
  RowSize,
} from "../types/spreadsheet";
import { getCellReference, indexToColumn } from "../utils/cellUtils";
import { cn } from "@/lib/utils";

interface GridProps {
  gridData: GridData;
  activeCell: Position | null;
  selection: SelectionRange | null;
  isEditing: boolean;
  editValue: string;
  columnSizes: ColumnSize[];
  rowSizes: RowSize[];
  onCellClick: (position: Position) => void;
  onCellDoubleClick: (position: Position) => void;
  onSelectionChange: (selection: SelectionRange) => void;
  onEditValueChange: (value: string) => void;
  onColumnResize: (index: number, width: number) => void;
  onRowResize: (index: number, height: number) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: (index: number) => void;
  onDeleteColumn: (index: number) => void;
}

const DEFAULT_CELL_WIDTH = 100;
const DEFAULT_CELL_HEIGHT = 28;
const HEADER_SIZE = 30;

const Grid: React.FC<GridProps> = ({
  gridData,
  activeCell,
  selection,
  isEditing,
  editValue,
  columnSizes,
  rowSizes,
  onCellClick,
  onCellDoubleClick,
  onSelectionChange,
  onEditValueChange,
  onColumnResize,
  onRowResize,
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [isResizingColumn, setIsResizingColumn] = useState(false);
  const [isResizingRow, setIsResizingRow] = useState(false);
  const [resizingIndex, setResizingIndex] = useState<number | null>(null);
  const [startSize, setStartSize] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  
  // Focus the edit input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(0, editValue.length);
    }
  }, [isEditing, editValue]);
  
  // Get the cell width based on columnSizes or default
  const getCellWidth = useCallback(
    (colIndex: number) => {
      const column = columnSizes.find((col) => col.index === colIndex);
      return column ? column.width : DEFAULT_CELL_WIDTH;
    },
    [columnSizes]
  );
  
  // Get the cell height based on rowSizes or default
  const getCellHeight = useCallback(
    (rowIndex: number) => {
      const row = rowSizes.find((r) => r.index === rowIndex);
      return row ? row.height : DEFAULT_CELL_HEIGHT;
    },
    [rowSizes]
  );
  
  // Check if a cell is in the current selection
  const isInSelection = useCallback(
    (row: number, col: number) => {
      if (!selection) return false;
      
      const { start, end } = selection;
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const minCol = Math.min(start.col, end.col);
      const maxCol = Math.max(start.col, end.col);
      
      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    },
    [selection]
  );
  
  // Handle cell click
  const handleCellClick = useCallback(
    (position: Position) => {
      onCellClick(position);
    },
    [onCellClick]
  );
  
  // Handle cell double click
  const handleCellDoubleClick = useCallback(
    (position: Position) => {
      onCellDoubleClick(position);
    },
    [onCellDoubleClick]
  );
  
  // Handle mouse down on cell (start selection)
  const handleCellMouseDown = useCallback(
    (position: Position) => {
      setIsDragSelecting(true);
      setSelectionStart(position);
      
      const selection: SelectionRange = {
        start: position,
        end: position,
      };
      
      onSelectionChange(selection);
    },
    [onSelectionChange]
  );
  
  // Handle mouse enter on cell (during selection)
  const handleCellMouseEnter = useCallback(
    (position: Position) => {
      if (isDragSelecting && selectionStart) {
        const selection: SelectionRange = {
          start: selectionStart,
          end: position,
        };
        
        onSelectionChange(selection);
      }
    },
    [isDragSelecting, selectionStart, onSelectionChange]
  );
  
  // Handle mouse up (end selection)
  const handleMouseUp = useCallback(() => {
    setIsDragSelecting(false);
    setIsDragging(false);
    setIsResizingColumn(false);
    setIsResizingRow(false);
    setResizingIndex(null);
  }, []);
  
  // Add mouse up event listener
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);
  
  // Handle input change in edit mode
  const handleEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onEditValueChange(e.target.value);
    },
    [onEditValueChange]
  );
  
  // Handle column resize start
  const handleColumnResizeStart = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizingColumn(true);
      setResizingIndex(index);
      setStartSize(getCellWidth(index));
      setStartPosition(e.clientX);
    },
    [getCellWidth]
  );
  
  // Handle row resize start
  const handleRowResizeStart = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizingRow(true);
      setResizingIndex(index);
      setStartSize(getCellHeight(index));
      setStartPosition(e.clientY);
    },
    [getCellHeight]
  );
  
  // Handle mouse move for resizing
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isResizingColumn && resizingIndex !== null) {
        const diff = e.clientX - startPosition;
        const newWidth = Math.max(50, startSize + diff);
        onColumnResize(resizingIndex, newWidth);
      } else if (isResizingRow && resizingIndex !== null) {
        const diff = e.clientY - startPosition;
        const newHeight = Math.max(20, startSize + diff);
        onRowResize(resizingIndex, newHeight);
      }
    },
    [
      isResizingColumn,
      isResizingRow,
      resizingIndex,
      startPosition,
      startSize,
      onColumnResize,
      onRowResize,
    ]
  );

  // Handle column header context menu
  const handleColumnHeaderContextMenu = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      const contextMenu = [
        {
          label: "Insert column to the left",
          action: () => {
            // Insert column logic
          }
        },
        {
          label: "Insert column to the right",
          action: () => {
            // Insert column logic
          }
        },
        {
          label: "Delete column",
          action: () => onDeleteColumn(index)
        }
      ];
      
      // For simplicity, we're using a confirm dialog instead of a custom context menu
      if (window.confirm("Delete this column?")) {
        onDeleteColumn(index);
      }
    },
    [onDeleteColumn]
  );

  // Handle row header context menu
  const handleRowHeaderContextMenu = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      
      // For simplicity, we're using a confirm dialog instead of a custom context menu
      if (window.confirm("Delete this row?")) {
        onDeleteRow(index);
      }
    },
    [onDeleteRow]
  );

  // Render the grid content
  return (
    <div 
      className="cell-grid overflow-auto" 
      ref={gridRef}
      onMouseMove={handleMouseMove}
    >
      <div className="relative">
        {/* Corner cell (top-left empty cell) */}
        <div
          className="absolute top-0 left-0 z-10 row-header column-header flex items-center justify-center border-right border-bottom"
          style={{
            width: `${HEADER_SIZE}px`,
            height: `${HEADER_SIZE}px`,
            borderRight: "1px solid hsl(var(--border))",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        ></div>
        
        {/* Column headers */}
        <div 
          className="absolute top-0 left-0 flex z-10 ml-[30px]"
          style={{ height: `${HEADER_SIZE}px` }}
        >
          {gridData[0].map((_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className="column-header relative flex items-center justify-center border-right border-bottom"
              style={{
                width: `${getCellWidth(colIndex)}px`,
                height: `${HEADER_SIZE}px`,
                borderRight: "1px solid hsl(var(--border))",
                borderBottom: "1px solid hsl(var(--border))",
              }}
              onContextMenu={(e) => handleColumnHeaderContextMenu(colIndex, e)}
            >
              {indexToColumn(colIndex)}
              <div
                className="resizer hover:bg-primary/20"
                onMouseDown={(e) => handleColumnResizeStart(colIndex, e)}
              ></div>
            </div>
          ))}
          {/* Add column button */}
          <div
            className="column-header flex items-center justify-center border-right border-bottom bg-accent/50 hover:bg-accent cursor-pointer"
            style={{
              width: `${HEADER_SIZE}px`,
              height: `${HEADER_SIZE}px`,
              borderRight: "1px solid hsl(var(--border))",
              borderBottom: "1px solid hsl(var(--border))",
            }}
            onClick={onAddColumn}
          >
            +
          </div>
        </div>
        
        {/* Row headers */}
        <div 
          className="absolute top-0 left-0 flex flex-col z-10 mt-[30px]"
          style={{ width: `${HEADER_SIZE}px` }}
        >
          {gridData.map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="row-header relative flex items-center justify-center border-right border-bottom"
              style={{
                width: `${HEADER_SIZE}px`,
                height: `${getCellHeight(rowIndex)}px`,
                borderRight: "1px solid hsl(var(--border))",
                borderBottom: "1px solid hsl(var(--border))",
              }}
              onContextMenu={(e) => handleRowHeaderContextMenu(rowIndex, e)}
            >
              {rowIndex + 1}
              <div
                className="row-resizer hover:bg-primary/20"
                onMouseDown={(e) => handleRowResizeStart(rowIndex, e)}
              ></div>
            </div>
          ))}
          {/* Add row button */}
          <div
            className="row-header flex items-center justify-center border-right border-bottom bg-accent/50 hover:bg-accent cursor-pointer"
            style={{
              width: `${HEADER_SIZE}px`,
              height: `${HEADER_SIZE}px`,
              borderRight: "1px solid hsl(var(--border))",
              borderBottom: "1px solid hsl(var(--border))",
            }}
            onClick={onAddRow}
          >
            +
          </div>
        </div>
        
        {/* Cell grid */}
        <div 
          className="mt-[30px] ml-[30px]"
        >
          {gridData.map((row, rowIndex) => (
            <div 
              key={`row-${rowIndex}`} 
              className="flex"
              style={{ height: `${getCellHeight(rowIndex)}px` }}
            >
              {row.map((cell, colIndex) => {
                const position = { row: rowIndex, col: colIndex };
                const isActive = 
                  activeCell?.row === rowIndex && activeCell?.col === colIndex;
                const isCurrentlySelected = isInSelection(rowIndex, colIndex);
                
                return (
                  <React.Fragment key={`cell-${rowIndex}-${colIndex}`}>
                    {isActive && isEditing ? (
                      <div
                        className="relative cell cell-active"
                        style={{
                          width: `${getCellWidth(colIndex)}px`,
                          height: `${getCellHeight(rowIndex)}px`,
                          zIndex: 100,
                        }}
                      >
                        <input
                          ref={editInputRef}
                          className="formula-input absolute top-0 left-0 w-full h-full outline-none border-2 border-primary bg-white"
                          value={editValue}
                          onChange={handleEditInputChange}
                          style={{
                            width: `${getCellWidth(colIndex)}px`,
                            height: `${getCellHeight(rowIndex)}px`,
                          }}
                        />
                      </div>
                    ) : (
                      <Cell
                        cell={cell}
                        position={position}
                        isActive={isActive}
                        isSelected={isCurrentlySelected}
                        isEditing={isEditing && isActive}
                        onCellClick={handleCellClick}
                        onCellDoubleClick={handleCellDoubleClick}
                        onCellMouseDown={handleCellMouseDown}
                        onCellMouseEnter={handleCellMouseEnter}
                        width={getCellWidth(colIndex)}
                        height={getCellHeight(rowIndex)}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
