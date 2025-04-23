"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Volume2, Play, Pause, Loader2 } from "lucide-react";
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
import { toast } from "sonner";

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

  // Audio State
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAddClick = () => {
    onAdd?.(affirmation, selectedCategory);
    setIsModalOpen(false);
  };

  // Function to handle audio generation and playback toggle
  const handleAudioButtonClick = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }

    // If no audio URL, generate it
    setIsGeneratingAudio(true);
    toast.info("Generating audio...");
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: affirmation.text }), // Send text to API
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Revoke previous URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(url);
      // Playback will start via useEffect when audioUrl updates
      toast.success("Audio ready!");
    } catch (error: unknown) {
      console.error("Audio generation error:", error);
      toast.error("Failed to generate audio", {
        description: error instanceof Error ? error.message : String(error),
      });
      // Clean up URL if error occurs after creation but before setting state
      if (audioUrl && !audioRef.current?.src) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null); // Reset audio URL on error
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Effect to handle playing audio when URL is ready
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      // Ensure event listeners are added only once or managed correctly
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.play().catch((e) => console.error("Error playing audio:", e));

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl]);

  // Cleanup effect for object URL
  useEffect(() => {
    // This function will run when the component unmounts
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        console.log("Revoked audio URL:", audioUrl); // For debugging
      }
    };
  }, [audioUrl]); // Dependency ensures cleanup happens if URL changes too

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black hover:shadow-md">
      <CardContent className="p-3 flex items-center justify-between gap-2">
        <p className="text-sm leading-snug text-zinc-700 dark:text-zinc-300 font-normal flex-1 mr-1 line-clamp-2">
          {affirmation.text}
        </p>

        <div className="flex items-center flex-shrink-0 gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleAudioButtonClick}
            disabled={isGeneratingAudio}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-700 h-7 w-7 rounded-full"
            aria-label={
              audioUrl
                ? isPlaying
                  ? "Pause audio"
                  : "Play audio"
                : "Generate audio"
            }
          >
            {isGeneratingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : audioUrl ? (
              isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 h-7 w-7 rounded-full shadow-sm"
                aria-label="Add affirmation to category"
              >
                <Plus className="w-4 h-4" />
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
                      <Label
                        htmlFor={`cat-${category}`}
                        className="font-normal"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
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
        </div>

        <audio ref={audioRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
