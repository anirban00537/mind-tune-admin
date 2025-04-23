"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Define Voice interface (or import if defined centrally)
interface Voice {
  id: number;
  name: string;
}

interface AffirmationCardProps {
  affirmation: {
    id: number;
    text: string;
    category?: string;
  };
  selectedVoice?: Voice; // Add selectedVoice prop
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export function AffirmationCard({
  affirmation,
  selectedVoice, // Destructure selectedVoice
  onEdit,
  onDelete,
}: AffirmationCardProps) {
  return (
    <Card className="relative transition-all border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm">
      <div className="absolute top-1.5 right-1.5 flex gap-0.5 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              disabled
              onClick={() => toast.info("Playback coming soon!")}
            >
              <Volume2 className="w-3.5 h-3.5 text-green-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Play (Coming Soon)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(affirmation.id, affirmation.text)}
              className="h-6 w-6"
            >
              <Pencil className="w-3.5 h-3.5 text-blue-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(affirmation.id)}
              className="h-6 w-6"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>

      <CardContent className="p-3 pt-7">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {affirmation.text}
        </p>

        <div className="flex flex-wrap gap-1.5 text-xs mt-1">
          {affirmation.category && (
            <Badge variant="secondary" className="font-normal">
              {affirmation.category}
            </Badge>
          )}
          {selectedVoice && (
            <Badge variant="outline" className="font-normal">
              {selectedVoice.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
