"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface AffirmationCardProps {
  affirmation: {
    id: number;
    text: string;
    category?: string;
  };
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export function AffirmationCard({
  affirmation,
  onEdit,
  onDelete,
}: AffirmationCardProps) {
  return (
    <Card className="group relative hover:shadow-md transition-all border-2 hover:border-blue-200 dark:hover:border-blue-800">
      <CardContent className="p-4 relative">
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
                onClick={() => onEdit(affirmation.id, affirmation.text)}
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
                onClick={() => onDelete(affirmation.id)}
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
  );
}
