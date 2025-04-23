"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Pencil, Trash2, Plus, Volume2, Upload } from "lucide-react";
import { AffirmationCard } from "@/components/AffirmationCard";

interface Voice {
  id: number;
  name: string;
  isGenerated: boolean;
}

interface Affirmation {
  id: number;
  text: string;
  category?: string;
  isGenerating?: boolean;
  selectedVoice?: Voice;
}

export default function AffirmationMaker() {
  const voices: Voice[] = [
    { id: 1, name: "Emma (Female)", isGenerated: true },
    { id: 2, name: "James (Male)", isGenerated: true },
    { id: 3, name: "Sophia (Female)", isGenerated: false },
    { id: 4, name: "Michael (Male)", isGenerated: false },
    { id: 5, name: "Isabella (Female)", isGenerated: true },
    { id: 6, name: "William (Male)", isGenerated: false },
    { id: 7, name: "Olivia (Female)", isGenerated: true },
    { id: 8, name: "Alexander (Male)", isGenerated: false },
    { id: 9, name: "Ava (Female)", isGenerated: true },
    { id: 10, name: "Daniel (Male)", isGenerated: false },
  ];

  const [affirmations, setAffirmations] = useState<Affirmation[]>([
    {
      id: 1,
      text: "I am capable of achieving anything I set my mind to",
      category: "Confidence",
    },
    {
      id: 2,
      text: "Every day, I am growing stronger and healthier",
      category: "Health",
    },
    {
      id: 3,
      text: "I attract abundance and opportunities effortlessly",
      category: "Success",
    },
  ]);
  const [listSelectedCategory, setListSelectedCategory] = useState<string>("");

  const categories = [
    "Self-Love",
    "Confidence",
    "Success",
    "Health",
    "Relationships",
    "Career",
    "Personal Growth",
  ];

  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiQuantity, setAiQuantity] = useState<number>(3);
  const [aiSelectedVoice, setAiSelectedVoice] = useState<Voice | null>(null);
  const [aiSelectedCategory, setAiSelectedCategory] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for the AI.");
      return;
    }
    if (!aiSelectedVoice) {
      toast.error("Please select a voice for the AI affirmations.");
      return;
    }
    if (!aiSelectedCategory) {
      toast.error("Please select a category for the AI affirmations.");
      return;
    }
    if (aiQuantity <= 0) {
      toast.error("Please enter a valid number of affirmations to generate.");
      return;
    }

    setIsGeneratingAi(true);
    toast.info(
      `Generating ${aiQuantity} affirmations based on your prompt... (Simulated)`
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedAffirmations: Affirmation[] = Array.from({
      length: aiQuantity,
    }).map((_, i) => ({
      id: Date.now() + i,
      text: `AI Generated Affirmation ${i + 1} for prompt: ${aiPrompt.substring(
        0,
        20
      )}...`,
      category: aiSelectedCategory,
      selectedVoice: aiSelectedVoice,
      isGenerating: false,
    }));

    setAffirmations((prev) => [...prev, ...generatedAffirmations]);

    setIsGeneratingAi(false);
    setAiPrompt("");
    toast.success(`${aiQuantity} affirmations generated successfully!`);
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
    setAffirmations((prev) => {
      const affirmation = prev.find((a) => a.id === id);

      return prev.filter((a) => a.id !== id);
    });
    toast.success("Affirmation deleted!");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="border bg-white dark:bg-black shadow-xs">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      AI Affirmation Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        handleGenerateAI();
                      }}
                      className="flex flex-col gap-4"
                    >
                      <div className="w-full">
                        <Label
                          htmlFor="ai-prompt"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Prompt (e.g., "financial abundance",
                          "self-confidence")
                        </Label>
                        <Textarea
                          id="ai-prompt"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Describe the theme for your affirmations..."
                          className="w-full bg-white dark:bg-black border border-muted-foreground/20 text-black dark:text-white"
                          rows={3}
                        />
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor="ai-quantity"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Number of Affirmations
                        </Label>
                        <Input
                          id="ai-quantity"
                          type="number"
                          min="1"
                          max="10"
                          value={aiQuantity}
                          onChange={(e) =>
                            setAiQuantity(parseInt(e.target.value) || 1)
                          }
                          className="w-full bg-white dark:bg-black border border-muted-foreground/20 text-black dark:text-white"
                        />
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor="ai-voice-select"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Select Voice
                        </Label>
                        <Select
                          value={aiSelectedVoice?.id.toString()}
                          onValueChange={(value) => {
                            const voice = voices.find(
                              (v) => v.id === parseInt(value)
                            );
                            setAiSelectedVoice(voice || null);
                          }}
                        >
                          <SelectTrigger
                            id="ai-voice-select"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select voice for AI affirmations" />
                          </SelectTrigger>
                          <SelectContent>
                            {voices.map((voice) => (
                              <SelectItem
                                key={voice.id}
                                value={voice.id.toString()}
                                disabled={!voice.isGenerated}
                              >
                                {voice.name}{" "}
                                {!voice.isGenerated && "(Coming Soon)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor="ai-category-select"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Select Category
                        </Label>
                        <Select
                          value={aiSelectedCategory}
                          onValueChange={setAiSelectedCategory}
                        >
                          <SelectTrigger
                            id="ai-category-select"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select category for AI affirmations" />
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

                      <div className="w-full pt-2">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center gap-2 shadow-none border-none"
                          disabled={isGeneratingAi}
                        >
                          {isGeneratingAi ? (
                            <>
                              <span
                                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent rounded-full"
                                role="status"
                                aria-label="loading"
                              ></span>
                              Generating...
                            </>
                          ) : (
                            <>Generate Affirmations</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Affirmations</h2>
                  {listSelectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => setListSelectedCategory("")}
                      className="text-sm"
                    >
                      Clear Filter: {listSelectedCategory}
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
                          !listSelectedCategory ||
                          a.category === listSelectedCategory
                      )
                      .map((affirmation) => (
                        <AffirmationCard
                          key={affirmation.id}
                          affirmation={affirmation}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          selectedVoice={affirmation.selectedVoice}
                        />
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
