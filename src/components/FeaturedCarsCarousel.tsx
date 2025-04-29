
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CarCard from "./CarCard";
import { Car } from "@/lib/types";

interface FeaturedCarsCarouselProps {
  cars: Car[];
}

const FeaturedCarsCarousel = ({ cars }: FeaturedCarsCarouselProps) => {
  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Featured Cars</h2>
        <button className="text-car text-sm font-medium">View All</button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {cars.map((car) => (
            <CarouselItem key={car.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <CarCard car={car} featured={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedCarsCarousel;
