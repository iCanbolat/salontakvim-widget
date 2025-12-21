/**
 * CategoryList Component
 * Displays categories with service count
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWidget } from "@/contexts";
import type { ServiceCategory, Service } from "@/types";

interface CategoryListProps {
  categories: ServiceCategory[];
  services: Service[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export function CategoryList({
  categories,
  services,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  const { config } = useWidget();

  // Add "All Services" option
  const allOption = {
    id: null,
    name: "All",
    count: services.length,
  };

  const options = [
    allOption,
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: services.filter((s) => s.categoryId === cat.id).length,
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
            selectedCategoryId === option.id
              ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
              : "bg-background border-border hover:bg-muted/50"
          )}
        >
          <span>{option.name}</span>
          <Badge
            variant="secondary"
            className={cn(
              "h-5 min-w-5 px-1.5 text-xs",
              selectedCategoryId === option.id && "bg-primary-foreground/20"
            )}
            style={
              selectedCategoryId === option.id
                ? { color: config?.styling.secondaryColor }
                : undefined
            }
          >
            {option.count}
          </Badge>
        </button>
      ))}
    </div>
  );
}
