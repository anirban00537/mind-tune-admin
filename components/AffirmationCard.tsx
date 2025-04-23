"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Affirmation {
  id: number;
  text: string;
  category?: string;
}

interface AffirmationCardProps {
  affirmation: Affirmation;
  availableCategories: string[];
  onAdd?: (affirmation: Affirmation, selectedCategory: string | null) => void;
}

export function AffirmationCard({
  affirmation,
  availableCategories,
  onAdd,
}: AffirmationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    affirmation.category || null
  );

  const handleAddClick = () => {
    onAdd?.(affirmation, selectedCategory);
    setIsModalOpen(false); // Close modal after adding
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black hover:shadow-md">
      <CardContent className="p-3 flex items-center justify-between gap-3">
        <p className="text-sm leading-snug text-zinc-700 dark:text-zinc-300 font-normal flex-1 mr-2 line-clamp-2">
          {affirmation.text}
        </p>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 h-7 w-7 flex-shrink-0 rounded-full shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Add Affirmation</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Affirmation to Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 italic">
                "{affirmation.text}"
              </p>
              <Label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select a Category (Optional)
              </Label>
              <RadioGroup
                value={selectedCategory || ""}
                onValueChange={(value: string) =>
                  setSelectedCategory(value || null)
                }
                className="space-y-2"
              >
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={`cat-${category}`} />
                    <Label htmlFor={`cat-${category}`} className="font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
                {/* Option to select no category */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="cat-none" />
                  <Label
                    htmlFor="cat-none"
                    className="font-normal italic text-zinc-500"
                  >
                    None
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleAddClick}
                className="bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                Add Affirmation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
