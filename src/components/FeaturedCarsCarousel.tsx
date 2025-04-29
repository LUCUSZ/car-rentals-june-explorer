
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarCard from "./CarCard";
import { Car } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface FeaturedCarsCarouselProps {
  cars: Car[];
}

const FeaturedCarsCarousel = ({ cars }: FeaturedCarsCarouselProps) => {
  const navigate = useNavigate();

  const handleCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };
  
  const handleViewAll = () => {
    // In a real app, this would navigate to a page with all featured cars
    navigate('/home');
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Featured Cars</h2>
        <button className="text-car text-sm font-medium" onClick={handleViewAll}>View All</button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {cars.map((car) => (
            <CarouselItem 
              key={car.id} 
              className="pl-4 md:basis-1/2 lg:basis-1/3"
              onClick={() => handleCarClick(car.id)}
            >
              <div className="cursor-pointer">
                <CarCard car={car} featured={true} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedCarsCarousel;
