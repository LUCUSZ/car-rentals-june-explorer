
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search by brand, model, or type..."
        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
    </div>
  );
};

export default SearchBar;
