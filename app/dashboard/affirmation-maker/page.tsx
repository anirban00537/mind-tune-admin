"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Affirmation {
  id: number;
  text: string;
  category?: string;
}

export default function AffirmationMaker() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [newAffirmation, setNewAffirmation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // --- AI Affirmation Maker State ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState(3);
  const [aiLoading, setAiLoading] = useState(false);

  const categories = [
    "Self-Love",
    "Confidence",
    "Success",
    "Health",
    "Relationships",
    "Career",
    "Personal Growth",
  ];

  // Async placeholder for AI generation (replace with real API call)
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() || aiCount < 1) return;
    setAiLoading(true);
    try {
      // Simulate API call delay
      await new Promise((res) => setTimeout(res, 1200));
      // Generate dummy affirmations (replace this with real API result)
      const generated = Array.from({ length: aiCount }, (_, i) => ({
        id: Date.now() + Math.random() * 1000 + i,
        text: `${aiPrompt} affirmation #${i + 1}`,
      }));
      setAffirmations((prev: Affirmation[]) => [...generated, ...prev]);
      toast.success(`${generated.length} affirmations generated!`);
    } catch (err) {
      toast.error("Failed to generate affirmations.");
    } finally {
      setAiLoading(false);
    }
  };

  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleAdd = () => {
    if (!newAffirmation.trim()) {
      toast.error("Affirmation cannot be empty");
      return;
    }
    setAffirmations([
      ...affirmations,
      {
        id: Date.now(),
        text: newAffirmation,
        category: selectedCategory,
      },
    ]);
    setNewAffirmation("");
    toast.success("Affirmation added!");
  };

  const handleEdit = (id: number, text: string) => {
    setEditId(id);
    setEditText(text);
    setOpenDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) {
      toast.error("Affirmation cannot be empty");
      return;
    }
    setAffirmations((prev) =>
      prev.map((a) => (a.id === editId ? { ...a, text: editText } : a))
    );
    setOpenDialog(false);
    toast.success("Affirmation updated!");
  };

  const handleDelete = (id: number) => {
    setAffirmations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Affirmation deleted!");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Forms */}
              <div className="space-y-6">
                <Card className="border bg-white dark:bg-black shadow-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
                      AI Affirmation Maker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="w-full">
                        <Label
                          htmlFor="category"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Category
                        </Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full">
                        <Label
                          htmlFor="ai-prompt"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Prompt for AI
                        </Label>
                        <Input
                          id="ai-prompt"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Describe the theme or style for affirmations..."
                          className="w-full bg-white dark:bg-black border border-muted-foreground/20 text-black dark:text-white"
                          maxLength={100}
                        />
                      </div>
                      <div className="w-full">
                        <Label
                          htmlFor="ai-count"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Number of Affirmations
                        </Label>
                        <Input
                          id="ai-count"
                          type="number"
                          min={1}
                          max={10}
                          value={aiCount}
                          onChange={(e) => setAiCount(Number(e.target.value))}
                          className="w-full bg-white dark:bg-black border border-muted-foreground/20 text-black dark:text-white"
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center gap-2 shadow-none border border-muted-foreground/10"
                        disabled={aiLoading || !aiPrompt.trim() || aiCount < 1}
                        onClick={handleAIGenerate}
                      >
                        {aiLoading ? (
                          <span>Generating...</span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Generate Affirmations
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-white dark:bg-black shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Add Manual Affirmation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd();
                      }}
                      className="flex flex-col gap-4"
                    >
                      <div className="w-full">
                        <Label
                          htmlFor="affirmation"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          New Affirmation
                        </Label>
                        <Input
                          id="affirmation"
                          value={newAffirmation}
                          onChange={(e) => setNewAffirmation(e.target.value)}
                          placeholder="Write a new affirmation..."
                          className="w-full bg-white dark:bg-black border border-muted-foreground/20 text-black dark:text-white"
                          maxLength={120}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center gap-2 shadow-none border border-muted-foreground/10"
                      >
                        <Plus className="w-4 h-4" /> Add Affirmation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Affirmation Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Affirmations</h2>
                  {selectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory("")}
                      className="text-sm"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {affirmations.length === 0 ? (
                    <Card className="p-6 text-center text-gray-400">
                      <p className="text-lg">
                        No affirmations yet. Add your first one!
                      </p>
                    </Card>
                  ) : (
                    affirmations
                      .filter(
                        (a) =>
                          !selectedCategory || a.category === selectedCategory
                      )
                      .map((affirmation) => (
                        <Card
                          key={affirmation.id}
                          className="group relative hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <p className="text-base text-gray-800 dark:text-gray-200">
                              {affirmation.text}
                            </p>
                            {affirmation.category && (
                              <span className="inline-block mt-2 text-xs text-gray-500">
                                {affirmation.category}
                              </span>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      handleEdit(
                                        affirmation.id,
                                        affirmation.text
                                      )
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="w-4 h-4 text-blue-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(affirmation.id)}
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </div>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Affirmation</DialogTitle>
                </DialogHeader>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  maxLength={120}
                  className="mb-4"
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-blue-500 text-white"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Separator className="my-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
