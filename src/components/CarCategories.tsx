
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/lib/types";
import CarCard from "./CarCard";

interface CarCategoriesProps {
  cars: Car[];
}

const CarCategories = ({ cars }: CarCategoriesProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = ["All", "SUV", "Sedan", "Coupe", "Electric"];
  
  // Filter cars by category (this would be replaced with actual filtering logic)
  const filteredCars = cars.slice(0, 6);
  
  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "bg-car hover:bg-car-secondary" : ""}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarCategories;
