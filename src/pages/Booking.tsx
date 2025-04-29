
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { getCarById, createRental } from "@/services/carService";
import { Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Booking = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock pricing data
  const pricing = {
    hourlyRate: Math.floor(Math.random() * 30) + 20,
    hours: 24,
    cleaningFee: 15,
    serviceFee: 25,
    total: 0
  };

  // Calculate total
  pricing.total = (pricing.hourlyRate * pricing.hours) + pricing.cleaningFee + pricing.serviceFee;

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) return;
      
      try {
        setLoading(true);
        const carData = await getCarById(carId);
        setCar(carData);
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast.error("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [carId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookNow = async () => {
    if (!car || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      await createRental(car.id, currentUser.id, currentUser.fullName, selectedDate);
      navigate(`/rental-confirmation/${car.id}`);
    } catch (error) {
      console.error("Error creating rental:", error);
      toast.error("Failed to book the car");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
        <p className="text-gray-500 mb-6">The car you're trying to book doesn't exist or has been removed.</p>
        <Button onClick={handleGoBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Book Your Rental</h1>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-20 w-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={car.image || "/placeholder.svg"}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-semibold">{car.make} {car.model}</h2>
          <p className="text-gray-500 text-sm">{car.color}</p>
          <div className="mt-1">
            <span className="font-semibold text-car">${pricing.hourlyRate}</span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-car" />
            Pick-up Date
          </h3>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-car" />
            Rental Duration
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pick-up</p>
              <p className="font-medium">{format(selectedDate, "h:mm a")}</p>
              <p className="text-sm">{format(selectedDate, "EEE, MMM d")}</p>
            </div>
            <div className="h-0.5 w-10 bg-gray-300"></div>
            <div>
              <p className="text-sm text-gray-500">Drop-off</p>
              <p className="font-medium">{format(addDays(selectedDate, 1), "h:mm a")}</p>
              <p className="text-sm">{format(addDays(selectedDate, 1), "EEE, MMM d")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-car" />
            Price Details
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>${pricing.hourlyRate} x {pricing.hours} hours</span>
              <span>${pricing.hourlyRate * pricing.hours}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${pricing.cleaningFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${pricing.serviceFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${pricing.total}</span>
        </div>
        <Button 
          onClick={handleBookNow} 
          className="w-full bg-car hover:bg-car-secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default Booking;
