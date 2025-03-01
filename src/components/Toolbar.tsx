
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Position } from "@/types/spreadsheet";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  FileSpreadsheet,
  ChevronDown,
  Search,
  Undo,
  Redo
} from "lucide-react";

interface ToolbarProps {
  onFormatClick: (format: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFindReplaceOpen: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFormatClick,
  onSave,
  onLoad,
  onUndo,
  onRedo,
  onFindReplaceOpen,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex items-center h-10 px-2 border-b border-border bg-sheet-toolbar gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            File <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-1">
            <button
              className="dropdown-item"
              onClick={onSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </button>
            <button
              className="dropdown-item"
              onClick={onLoad}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Load
            </button>
          </div>
        </PopoverContent>
      </Popover>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onUndo()}
        disabled={!canUndo}
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onRedo()}
        disabled={!canRedo}
      >
        <Redo className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("strikethrough")}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("left")}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("center")}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={() => onFormatClick("right")}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onFindReplaceOpen}
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            Functions <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <Tabs defaultValue="math">
            <TabsList className="w-full">
              <TabsTrigger value="math" className="flex-1">Math</TabsTrigger>
              <TabsTrigger value="data" className="flex-1">Data Quality</TabsTrigger>
            </TabsList>
            <TabsContent value="math" className="p-1">
              <div className="space-y-1">
                <div className="dropdown-item">
                  <strong>SUM</strong> - =SUM(A1:A5)
                </div>
                <div className="dropdown-item">
                  <strong>AVERAGE</strong> - =AVERAGE(A1:A5)
                </div>
                <div className="dropdown-item">
                  <strong>MAX</strong> - =MAX(A1:A5)
                </div>
                <div className="dropdown-item">
                  <strong>MIN</strong> - =MIN(A1:A5)
                </div>
                <div className="dropdown-item">
                  <strong>COUNT</strong> - =COUNT(A1:A5)
                </div>
              </div>
            </TabsContent>
            <TabsContent value="data" className="p-1">
              <div className="space-y-1">
                <div className="dropdown-item">
                  <strong>TRIM</strong> - =TRIM(A1)
                </div>
                <div className="dropdown-item">
                  <strong>UPPER</strong> - =UPPER(A1)
                </div>
                <div className="dropdown-item">
                  <strong>LOWER</strong> - =LOWER(A1)
                </div>
                <div className="dropdown-item">
                  <strong>REMOVE_DUPLICATES</strong> - =REMOVE_DUPLICATES(A1:B5)
                </div>
                <div className="dropdown-item">
                  <strong>FIND_AND_REPLACE</strong> - =FIND_AND_REPLACE("old","new","A1:B5")
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Toolbar;
