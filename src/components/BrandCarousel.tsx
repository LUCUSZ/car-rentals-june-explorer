
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const BrandCarousel = () => {
  const brands = [
    { name: "BMW", logo: "https://placehold.co/100?text=BMW" },
    { name: "Toyota", logo: "https://placehold.co/100?text=Toyota" },
    { name: "Mercedes", logo: "https://placehold.co/100?text=Mercedes" },
    { name: "Tesla", logo: "https://placehold.co/100?text=Tesla" },
    { name: "Honda", logo: "https://placehold.co/100?text=Honda" },
    { name: "Ford", logo: "https://placehold.co/100?text=Ford" },
    { name: "Audi", logo: "https://placehold.co/100?text=Audi" },
    { name: "Lexus", logo: "https://placehold.co/100?text=Lexus" },
  ];

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-3">Popular Brands</h2>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {brands.map((brand) => (
            <CarouselItem key={brand.name} className="pl-2 md:pl-4 basis-1/4 md:basis-1/5 lg:basis-1/6">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-xs font-medium">{brand.name}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BrandCarousel;
