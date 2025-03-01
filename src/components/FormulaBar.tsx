
import React, { useEffect, useRef } from "react";
import { Position } from "../types/spreadsheet";
import { getCellReference } from "../utils/cellUtils";

interface FormulaBarProps {
  activeCell: Position | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({
  activeCell,
  value,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCell]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };
  
  return (
    <div className="flex items-center h-10 border-b border-border bg-sheet-toolbar">
      <div className="flex items-center justify-center w-12 h-full border-r border-border">
        fx
      </div>
      <div className="flex items-center h-full px-2 text-sm font-medium min-w-[80px] border-r border-border">
        {activeCell ? getCellReference(activeCell.row, activeCell.col) : ""}
      </div>
      <div className="flex-1 h-full">
        <input
          ref={inputRef}
          className="formula-input w-full h-full"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter formula or value"
        />
      </div>
    </div>
  );
};

export default FormulaBar;
