
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FindReplaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFindReplace: (find: string, replace: string, matchCase: boolean) => void;
  initialFind?: string;
  initialReplace?: string;
  initialMatchCase?: boolean;
}

const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  isOpen,
  onClose,
  onFindReplace,
  initialFind = "",
  initialReplace = "",
  initialMatchCase = false,
}) => {
  const [find, setFind] = useState(initialFind);
  const [replace, setReplace] = useState(initialReplace);
  const [matchCase, setMatchCase] = useState(initialMatchCase);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindReplace(find, replace, matchCase);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find and Replace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="find">Find</Label>
            <Input
              id="find"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="replace">Replace with</Label>
            <Input
              id="replace"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="matchCase"
              checked={matchCase}
              onCheckedChange={(checked) => setMatchCase(checked === true)}
            />
            <Label htmlFor="matchCase" className="cursor-pointer">
              Match case
            </Label>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Find and Replace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FindReplaceDialog;
