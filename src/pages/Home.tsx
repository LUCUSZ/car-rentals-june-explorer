
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterButton from "@/components/FilterButton";
import CarCard from "@/components/CarCard";
import BrandCarousel from "@/components/BrandCarousel";
import FeaturedCarsCarousel from "@/components/FeaturedCarsCarousel";
import CarCategories from "@/components/CarCategories";
import { Car } from "@/lib/types";
import { getAvailableCars, populateMockData } from "@/services/carService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Home = () => {
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const initializeMockData = async () => {
      try {
        await populateMockData();
      } catch (error) {
        console.error("Error initializing mock data:", error);
      }
    };
    
    initializeMockData();
  }, []);
  
  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const cars = await getAvailableCars(new Date());
        setAvailableCars(cars);
        
        // Select random cars to be featured
        const randomFeatured = [...cars]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setFeaturedCars(randomFeatured);
      } catch (error) {
        console.error("Error loading cars:", error);
        toast.error("Failed to load available cars");
      } finally {
        setLoading(false);
      }
    };
    
    loadCars();
  }, []);
  
  // Handler for when a car is clicked
  const handleCarClick = (carId: string) => {
    navigate(`/rental-confirmation/${carId}`);
  };
  
  return (
    <div className="animate-fade-in pb-16">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Your Perfect Car</h1>
        <SearchBar />
        
        <div className="flex justify-between items-center mt-4">
          <FilterButton />
          <span className="text-sm text-gray-600">
            {availableCars.length} cars available
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-lg" />
            <div className="h-48 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ) : (
        <>
          <BrandCarousel />
          
          {featuredCars.length > 0 && (
            <FeaturedCarsCarousel cars={featuredCars} />
          )}
          
          <CarCategories cars={availableCars} />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Recommended For You</h2>
              <button className="text-car text-sm font-medium">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCars.slice(0, 6).map((car) => (
                <div
                  key={car.id}
                  onClick={() => handleCarClick(car.id)}
                  className="cursor-pointer"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
