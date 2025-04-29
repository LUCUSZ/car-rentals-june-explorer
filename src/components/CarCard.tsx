
import { Car as CarIcon, Heart, Star, Users, Fuel, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Car } from "@/lib/types";
import { useState } from "react";

interface CarCardProps {
  car: Car;
  featured?: boolean;
}

const CarCard = ({ car, featured = false }: CarCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Mock data for additional car details
  const carDetails = {
    rating: 4.8,
    pricePerHour: Math.floor(Math.random() * 50) + 20,
    transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
    fuelType: ["Gasoline", "Diesel", "Electric"][Math.floor(Math.random() * 3)],
    seats: [2, 4, 5, 7][Math.floor(Math.random() * 4)]
  };

  return (
    <Card className={`car-card ${featured ? 'border-car border-2' : ''}`}>
      <div className="aspect-video bg-muted relative">
        <img
          src={car.image || "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="object-cover w-full h-full rounded-t-lg"
        />
        {featured && (
          <div className="absolute top-2 left-2 bg-car text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>
      </div>
      
      <CardHeader className="bg-white pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">{carDetails.rating}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{car.color}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-car">${carDetails.pricePerHour}</span>
            <span className="text-xs text-gray-500">/hour</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-gray-600">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span className="text-xs">{carDetails.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span className="text-xs">{carDetails.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="text-xs">{carDetails.seats} Seats</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
