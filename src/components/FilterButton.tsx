
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { CheckIcon } from "lucide-react";

const FilterButton = () => {
  const [priceRange, setPriceRange] = useState([20, 100]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [transmission, setTransmission] = useState<string | null>(null);
  const [seats, setSeats] = useState<number | null>(null);

  const carTypes = ["SUV", "Sedan", "Coupe", "EV"];
  const transmissionTypes = ["Automatic", "Manual"];
  const seatOptions = [2, 4, 7];

  const handleTypeSelect = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const handleTransmissionSelect = (type: string) => {
    setTransmission(transmission === type ? null : type);
  };

  const handleSeatsSelect = (num: number) => {
    setSeats(seats === num ? null : num);
  };

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-medium text-base">Filters</h3>
          
          {/* Price Range */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Price Range ($/hour)</h4>
            <div className="pt-4">
              <Slider
                defaultValue={[20, 100]}
                max={200}
                step={5}
                value={priceRange}
                onValueChange={handleSliderChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          
          {/* Car Type */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Car Type</h4>
            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeSelect(type)}
                  className={selectedType === type ? "bg-car text-white" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Transmission */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Transmission</h4>
            <div className="flex gap-2">
              {transmissionTypes.map((type) => (
                <Button
                  key={type}
                  variant={transmission === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTransmissionSelect(type)}
                  className={transmission === type ? "bg-car text-white" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Seats */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Seats</h4>
            <div className="flex gap-2">
              {seatOptions.map((num) => (
                <Button
                  key={num}
                  variant={seats === num ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSeatsSelect(num)}
                  className={seats === num ? "bg-car text-white" : ""}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Apply Button */}
          <Button className="w-full bg-car hover:bg-car-secondary">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;
