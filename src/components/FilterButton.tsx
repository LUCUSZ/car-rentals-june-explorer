
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const FilterButton = () => {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      <Filter className="h-4 w-4" />
      <span>Filters</span>
    </Button>
  );
};

export default FilterButton;
