
import React, { useMemo } from "react";
import { CellType, Position } from "../types/spreadsheet";
import { getCellDisplayValue, hasFormatting } from "../utils/cellUtils";
import { cn } from "@/lib/utils";

interface CellProps {
  cell: CellType;
  position: Position;
  isActive: boolean;
  isSelected: boolean;
  isEditing: boolean;
  onCellClick: (position: Position) => void;
  onCellDoubleClick: (position: Position) => void;
  onCellMouseDown: (position: Position) => void;
  onCellMouseEnter: (position: Position) => void;
  width: number;
  height: number;
}

const Cell: React.FC<CellProps> = ({
  cell,
  position,
  isActive,
  isSelected,
  isEditing,
  onCellClick,
  onCellDoubleClick,
  onCellMouseDown,
  onCellMouseEnter,
  width,
  height,
}) => {
  const { row, col } = position;
  
  const handleClick = () => {
    onCellClick(position);
  };
  
  const handleDoubleClick = () => {
    onCellDoubleClick(position);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onCellMouseDown(position);
  };
  
  const handleMouseEnter = () => {
    onCellMouseEnter(position);
  };
  
  const cellValue = useMemo(() => {
    return getCellDisplayValue(cell);
  }, [cell]);
  
  const cellClasses = cn(
    "cell",
    "transition-all duration-150 ease-out",
    {
      "cell-selected": isSelected,
      "cell-active": isActive,
      "font-bold": hasFormatting(cell, "bold"),
      "italic": hasFormatting(cell, "italic"),
      "underline": hasFormatting(cell, "underline"),
      "line-through": hasFormatting(cell, "strikethrough"),
      "text-left": hasFormatting(cell, "left"),
      "text-center": hasFormatting(cell, "center"),
      "text-right": hasFormatting(cell, "right"),
    }
  );
  
  return (
    <div
      className={cellClasses}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        padding: "0 4px",
        display: "flex",
        alignItems: "center",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      data-row={row}
      data-col={col}
    >
      {!isEditing && cellValue}
    </div>
  );
};

export default React.memo(Cell);
