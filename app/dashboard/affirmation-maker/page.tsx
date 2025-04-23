"use client";

import { useState, useRef, useEffect } from "react";
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
  const [newAffirmation, setNewAffirmation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  const handleAdd = async () => {
    if (!newAffirmation.trim()) {
      toast.error("Affirmation cannot be empty");
      return;
    }
    if (!selectedVoice) {
      toast.error("Please select a voice");
      return;
    }

    setAffirmations([
      ...affirmations,
      {
        id: Date.now(),
        text: newAffirmation,
        category: selectedCategory,

        selectedVoice,
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
              {/* Left Column - Forms */}
              <div className="space-y-6">
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
                      <div className="w-full">
                        <Label
                          htmlFor="audio-upload"
                          className="mb-1 block text-sm font-medium text-muted-foreground"
                        >
                          Select Voice
                        </Label>
                        <Select
                          value={selectedVoice?.id.toString()}
                          onValueChange={(value) => {
                            const voice = voices.find(
                              (v) => v.id === parseInt(value)
                            );
                            setSelectedVoice(voice || null);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a voice" />
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
                        <AffirmationCard
                          key={affirmation.id}
                          affirmation={affirmation}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
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
