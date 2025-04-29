
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [location, setLocation] = useState("New York, USA");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter cars by the search query
    // For this demo, we'll just navigate to the first car
    navigate("/car/car1");
  };
  
  return (
    <form onSubmit={handleSearch} className="space-y-3">
      <div className="flex items-center gap-2 text-car mb-2">
        <MapPin className="h-5 w-5" />
        <button type="button" className="text-base font-medium flex items-center">
          {location} <span className="ml-1 text-xs">▼</span>
        </button>
      </div>
      
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search by brand, model, or type..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </form>
  );
};

export default SearchBar;
