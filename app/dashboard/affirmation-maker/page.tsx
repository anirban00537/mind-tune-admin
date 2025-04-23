
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Affirmation {
  id: number;
  text: string;
}

export default function AffirmationMaker() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [newAffirmation, setNewAffirmation] = useState("");

  // --- AI Affirmation Maker State ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState(3);
  const [aiLoading, setAiLoading] = useState(false);

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
      { id: Date.now(), text: newAffirmation }
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
          <div className="px-4 lg:px-6 max-w-2xl mx-auto w-full">
            <Card className="mb-8 border bg-white dark:bg-black shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
                  AI Affirmation Maker
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* AI Affirmation Generator Section */}
                <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                  <div className="flex-1 w-full">
                    <Label htmlFor="ai-prompt" className="mb-1 block text-sm font-medium text-muted-foreground">
                      Prompt for AI (e.g., "self-love", "confidence for students")
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
                  <div className="w-28">
                    <Label htmlFor="ai-count" className="mb-1 block text-sm font-medium text-muted-foreground">
                      How many?
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
                    className="bg-black hover:bg-neutral-800 text-white flex items-center gap-2 shadow-none border border-muted-foreground/10"
                    disabled={aiLoading || !aiPrompt.trim() || aiCount < 1}
                    onClick={handleAIGenerate}
                  >
                    {aiLoading ? (
                      <span>Generating...</span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Generate
                      </>
                    )}
                  </Button>
                </div>
                {/* Manual Affirmation Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                  }}
                  className="flex flex-col md:flex-row gap-4 items-end"
                >
                  <div className="flex-1 w-full">
                    <Label htmlFor="affirmation" className="mb-1 block text-sm font-medium text-muted-foreground">
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
                  <Button type="submit" className="bg-black hover:bg-neutral-800 text-white flex items-center gap-2 shadow-none border border-muted-foreground/10">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="p-0 shadow-xs border bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Your Affirmations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of your affirmations.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-full">Affirmation</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {affirmations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-gray-400 text-lg py-8">
                            No affirmations yet. Add your first one!
                          </TableCell>
                        </TableRow>
                      ) : (
                        affirmations.map((affirmation) => (
                          <TableRow key={affirmation.id}>
                            <TableCell className="text-base text-gray-800">{affirmation.text}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleEdit(affirmation.id, affirmation.text)}
                                      aria-label="Edit"
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
                                      aria-label="Delete"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

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
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="bg-blue-500 text-white">
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Separator className="my-8" />
            <div className="text-center text-xs text-gray-400">Made with <span className="text-pink-400">♥</span> using shadcn/ui</div>
          </div>
        </div>
      </div>
    </div>
  );
}

