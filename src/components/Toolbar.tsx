import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Redo,
  Plus,
  Copy,
  Scissors,
  Clipboard,
  Printer,
  FileEdit,
  Eye,
  Filter,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Percent,
  DollarSign,
  Menu
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
    <div className="flex flex-col border-b border-border bg-white">
      {/* Main Menu Bar */}
      <div className="flex items-center h-9 px-2 border-b border-border">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              File <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <FileEdit className="mr-2 h-4 w-4" />
                New
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Open
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={onLoad}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Load
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Edit <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Undo className="mr-2 h-4 w-4" />
                Undo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Redo className="mr-2 h-4 w-4" />
                Redo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
              </button>
              <Separator className="my-1" />
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Copy className="mr-2 h-4 w-4" />
                Copy <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Scissors className="mr-2 h-4 w-4" />
                Cut <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Clipboard className="mr-2 h-4 w-4" />
                Paste <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
              </button>
              <Separator className="my-1" />
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={onFindReplaceOpen}>
                <Search className="mr-2 h-4 w-4" />
                Find and replace <span className="ml-auto text-xs text-muted-foreground">Ctrl+H</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              View <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Eye className="mr-2 h-4 w-4" />
                Formulas
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Menu className="mr-2 h-4 w-4" />
                Gridlines
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Insert <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Plus className="mr-2 h-4 w-4" />
                Cells
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <ArrowRight className="mr-2 h-4 w-4" />
                Row
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <ArrowDown className="mr-2 h-4 w-4" />
                Column
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Format <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("bold")}>
                <Bold className="mr-2 h-4 w-4" />
                Bold
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("italic")}>
                <Italic className="mr-2 h-4 w-4" />
                Italic
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("underline")}>
                <Underline className="mr-2 h-4 w-4" />
                Underline
              </button>
              <Separator className="my-1" />
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("left")}>
                <AlignLeft className="mr-2 h-4 w-4" />
                Align left
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("center")}>
                <AlignCenter className="mr-2 h-4 w-4" />
                Align center
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded" onClick={() => onFormatClick("right")}>
                <AlignRight className="mr-2 h-4 w-4" />
                Align right
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              Data <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Filter className="mr-2 h-4 w-4" />
                Create filter
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <ArrowDown className="mr-2 h-4 w-4" />
                Sort range
              </button>
              <button className="dropdown-item w-full text-left flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded">
                <Search className="mr-2 h-4 w-4" />
                Data cleanup
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Formatting Toolbar */}
      <div className="flex items-center h-10 px-2 gap-1">
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
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <select className="h-8 px-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Arial</option>
          <option>Calibri</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
        </select>
        
        <select className="h-8 w-16 px-2 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary">
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>14</option>
          <option>16</option>
          <option>18</option>
        </select>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
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
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
        >
          <Percent className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
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
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
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
            <Button variant="ghost" size="sm" className="h-8 gap-1 ml-1">
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
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>SUM</strong> - =SUM(A1:A5)
                    <div className="text-xs text-muted-foreground">Returns the sum of a series of numbers</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>AVERAGE</strong> - =AVERAGE(A1:A5)
                    <div className="text-xs text-muted-foreground">Returns the average of a series of numbers</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>MAX</strong> - =MAX(A1:A5)
                    <div className="text-xs text-muted-foreground">Returns the maximum value in a series</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>MIN</strong> - =MIN(A1:A5)
                    <div className="text-xs text-muted-foreground">Returns the minimum value in a series</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>COUNT</strong> - =COUNT(A1:A5)
                    <div className="text-xs text-muted-foreground">Counts the number of numeric values</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="data" className="p-1">
                <div className="space-y-1">
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>TRIM</strong> - =TRIM(A1)
                    <div className="text-xs text-muted-foreground">Removes leading and trailing spaces</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>UPPER</strong> - =UPPER(A1)
                    <div className="text-xs text-muted-foreground">Converts text to uppercase</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>LOWER</strong> - =LOWER(A1)
                    <div className="text-xs text-muted-foreground">Converts text to lowercase</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>REMOVE_DUPLICATES</strong> - =REMOVE_DUPLICATES(A1:B5)
                    <div className="text-xs text-muted-foreground">Removes duplicate rows from a range</div>
                  </div>
                  <div className="dropdown-item p-2 hover:bg-accent rounded">
                    <strong>FIND_AND_REPLACE</strong> - =FIND_AND_REPLACE("old","new","A1:B5")
                    <div className="text-xs text-muted-foreground">Finds and replaces text in a range</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Toolbar;
