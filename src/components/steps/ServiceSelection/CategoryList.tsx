/**
 * CategoryList Component
 * Displays categories with service count
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

interface CategoryListProps {
  categories: ServiceCategory[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  // Add "All Services" option
  const allOption = {
    id: null,
    name: "All",
    count: categories.reduce((sum, cat) => sum + (cat.serviceCount || 0), 0),
  };

  const options = [
    allOption,
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: cat.serviceCount || 0,
    })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {options.map((option) => (
        <button
          key={option.id ?? "all"}
          onClick={() => onSelectCategory(option.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border",
            "hover:bg-muted/50",
            selectedCategoryId === option.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border"
          )}
        >
          <span>{option.name}</span>
          <Badge
            variant="secondary"
            className={cn(
              "h-5 min-w-5 px-1.5 text-xs",
              selectedCategoryId === option.id && "bg-primary-foreground/20"
            )}
          >
            {option.count}
          </Badge>
        </button>
      ))}
    </div>
  );
}
