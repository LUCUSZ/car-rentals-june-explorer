
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getAvailableCars, isJune2025, populateMockData } from "@/services/carService";
import { Car } from "@/lib/types";
import { toast } from "sonner";

const Home = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigate = useNavigate();
  
  // Check and populate mock data if needed (first render only)
  useEffect(() => {
    const initializeMockData = async () => {
      try {
        const wasPopulated = await populateMockData();
        if (wasPopulated) {
          console.log("Mock data populated successfully");
        }
      } catch (error) {
        console.error("Error initializing mock data:", error);
      }
    };
    
    initializeMockData();
  }, []);
  
  const handleSearch = async () => {
    if (!date) {
      toast.error("Please select a date in June 2025");
      return;
    }
    
    if (!isJune2025(date)) {
      toast.error("Please select a date in June 2025 only");
      return;
    }
    
    try {
      setLoading(true);
      const cars = await getAvailableCars(date);
      setAvailableCars(cars);
      setHasSearched(true);
      
      if (cars.length === 0) {
        toast.info("No available cars found for the selected date");
      } else {
        toast.success(`Found ${cars.length} available cars`);
      }
    } catch (error) {
      console.error("Error searching for available cars:", error);
      toast.error("Failed to search for available cars");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRentCar = (carId: string) => {
    if (!date) {
      toast.error("Please select a valid rental date");
      return;
    }
    navigate(`/rental-confirmation/${carId}?date=${date.toISOString()}`);
  };
  
  // Function to determine if a day is in June 2025
  const isDateInJune2025 = (day: Date) => {
    return !isJune2025(day);
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Find Available Cars</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search by Date</h2>
        <p className="text-gray-600 mb-6">Select a date in June 2025 to see available cars.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM d, yyyy") : <span>Select a date in June 2025</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDateInJune2025}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleSearch}
            disabled={loading || !date}
            className="bg-car hover:bg-car-secondary"
          >
            {loading ? "Searching..." : "Search Available Cars"}
          </Button>
        </div>
      </div>
      
      {hasSearched && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {availableCars.length > 0 
                ? `Available Cars (${availableCars.length})` 
                : "No cars available"}
            </h2>
            {date && (
              <p className="text-sm text-gray-600">
                For {format(date, "MMMM d, yyyy")}
              </p>
            )}
          </div>
          
          {availableCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCars.map((car) => (
                <Card key={car.id} className="car-card">
                  <CardHeader className={`bg-car-light text-car`}>
                    <CardTitle>{car.make} {car.model}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Color</span>
                      <span className="text-gray-700">{car.color}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button onClick={() => handleRentCar(car.id)} className="bg-car hover:bg-car-secondary">
                      Rent Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : hasSearched && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No cars available for the selected date. Please try another date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
