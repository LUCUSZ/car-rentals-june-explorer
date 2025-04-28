
import { Car as CarIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Car } from "@/lib/types";

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="car-card">
      <div className="aspect-video bg-muted relative">
        <img
          src={car.image || "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <CardHeader className="bg-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
          <span className="text-car">{car.color}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-gray-600">
          <CarIcon className="h-4 w-4" />
          <span className="text-sm">Available Now</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
