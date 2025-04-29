
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SearchBar = () => {
  const [location, setLocation] = useState("New York, USA");
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-car mb-2">
        <MapPin className="h-5 w-5" />
        <button className="text-base font-medium flex items-center">
          {location} <span className="ml-1 text-xs">▼</span>
        </button>
      </div>
      
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search by brand, model, or type..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
};

export default SearchBar;
