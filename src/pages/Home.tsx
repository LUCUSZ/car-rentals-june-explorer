
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterButton from "@/components/FilterButton";
import CarCard from "@/components/CarCard";
import { Car } from "@/lib/types";
import { getAvailableCars, populateMockData } from "@/services/carService";
import { toast } from "sonner";

const Home = () => {
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
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
      } catch (error) {
        console.error("Error loading cars:", error);
        toast.error("Failed to load available cars");
      } finally {
        setLoading(false);
      }
    };
    
    loadCars();
  }, []);
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Find Your Perfect Car</h1>
        <div className="space-y-4">
          <SearchBar />
          <div className="flex justify-between items-center">
            <FilterButton />
            <span className="text-sm text-gray-600">
              {availableCars.length} cars available
            </span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg" />
            <div className="h-48 bg-gray-200 rounded-lg" />
            <div className="h-48 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCars.map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/rental-confirmation/${car.id}`)}
              className="cursor-pointer"
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
