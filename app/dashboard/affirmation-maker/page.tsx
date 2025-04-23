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

  // Initialize affirmations state with an empty array
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  /*
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
  */
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
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt for the AI.");
      return;
    }
    if (aiQuantity <= 0) {
      toast.error("Please enter a valid number of affirmations to generate.");
      return;
    }

    setIsGeneratingAi(true);
    toast.info(`Generating ${aiQuantity} affirmations...`);

    try {
      const response = await fetch("/api/generate-affirmations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt, quantity: aiQuantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors (e.g., validation, OpenAI refusal, server errors)
        console.error("API Error:", data);
        toast.error("Failed to generate affirmations.", {
          description: data.error || data.details || "Unknown error",
        });
      } else {
        // Success - format and add affirmations to state
        const newAffirmations: Affirmation[] = data.affirmations.map(
          (text: string, i: number) => ({
            id: Date.now() + i, // Simple unique ID generation
            text: text,
            // No category or voice assigned initially from AI
          })
        );

        setAffirmations((prev) => [...prev, ...newAffirmations]);
        setAiPrompt(""); // Clear prompt on success
        toast.success(
          `${data.affirmations.length} affirmations generated successfully!`
        );
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error("Failed to fetch affirmations:", error);
      toast.error(
        "An unexpected error occurred while generating affirmations."
      );
    } finally {
      setIsGeneratingAi(false);
    }
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
      // TODO: Add logic for handling deletion, maybe confirm?
      return prev.filter((a) => a.id !== id);
    });
    toast.success("Affirmation deleted!");
  };

  // Define the handleAdd function
  const handleAdd = (
    affirmationToAdd: Affirmation,
    selectedCategory: string | null
  ) => {
    console.log(
      "Adding affirmation:",
      affirmationToAdd,
      "with category:",
      selectedCategory
    );
    // Example: Update the affirmation list with the selected category (or remove it)
    setAffirmations((prev) =>
      prev.map((a) =>
        a.id === affirmationToAdd.id
          ? { ...a, category: selectedCategory || undefined } // Update category or set to undefined if null
          : a
      )
    );
    // In a real app, you might add this to a separate "My Affirmations" list
    toast.info(
      `Affirmation '${affirmationToAdd.text.substring(
        0,
        20
      )}...' added/category updated.`
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
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
                          className="mb-1 block text-sm font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          Prompt (e.g., "financial abundance",
                          "self-confidence")
                        </Label>
                        <Textarea
                          id="ai-prompt"
                          value={aiPrompt}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => setAiPrompt(e.target.value)}
                          placeholder="Describe the theme for your affirmations..."
                          className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                          rows={3}
                        />
                      </div>

                      <div className="w-full">
                        <Label
                          htmlFor="ai-quantity"
                          className="mb-1 block text-sm font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          Number of Affirmations
                        </Label>
                        <Input
                          id="ai-quantity"
                          type="number"
                          min="1"
                          max="80"
                          value={aiQuantity}
                          onChange={(e) =>
                            setAiQuantity(parseInt(e.target.value) || 1)
                          }
                          className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      <div className="w-full pt-2">
                        <Button
                          type="submit"
                          className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-zinc-100 flex items-center justify-center gap-2 shadow-none border-none"
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
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Your Affirmations
                  </h2>
                  {listSelectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => setListSelectedCategory("")}
                      className="text-sm border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
                          availableCategories={categories}
                          onAdd={handleAdd}
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
