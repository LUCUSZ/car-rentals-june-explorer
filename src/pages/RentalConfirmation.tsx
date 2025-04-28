
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { getCarById, createRental } from "@/services/carService";
import { Car } from "@/lib/types";
import { toast } from "sonner";

const RentalConfirmation = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse the date from the URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");
  const rentDate = dateParam ? new Date(dateParam) : null;
  
  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        toast.error("No car selected");
        navigate("/home");
        return;
      }
      
      if (!rentDate) {
        toast.error("Please select a valid date");
        navigate("/home");
        return;
      }
      
      try {
        setLoading(true);
        const carData = await getCarById(carId);
        if (!carData) {
          toast.error("Car not found");
          navigate("/home");
          return;
        }
        setCar(carData);
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast.error("Failed to load car details");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [carId, navigate, rentDate]);
  
  const handleConfirmRental = async () => {
    if (!car || !currentUser || !rentDate) {
      toast.error("Missing required information");
      return;
    }
    
    try {
      setProcessing(true);
      await createRental(car.id, currentUser.id, currentUser.fullName, rentDate);
      toast.success("Car rented successfully!");
      navigate("/my-rentals");
    } catch (error) {
      console.error("Error confirming rental:", error);
      toast.error("Failed to confirm rental");
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading car details...</p>
      </div>
    );
  }
  
  if (!car || !rentDate) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Car or rental date not available.</p>
        <Button className="mt-4" onClick={() => navigate("/home")}>
          Return to search
        </Button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Confirm Your Rental</h1>
      
      <Card className="mb-8">
        <CardHeader className="bg-car-light">
          <CardTitle className="text-xl text-center text-car-secondary">Rental Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Car Make</p>
              <p className="font-medium">{car.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium">{car.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{car.color}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Rental Date</p>
            <p className="font-medium">{format(rentDate, "MMMM d, yyyy")}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Renter Name</p>
            <p className="font-medium">{currentUser?.fullName}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Important Notes</p>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              <li>Return date will be automatically set (1-3 days after rental).</li>
              <li>No payment is required for this demonstration.</li>
              <li>You can view all your rentals in the "My Rentals" section.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 items-center justify-end pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRental}
            className="bg-car hover:bg-car-secondary sm:ml-2 w-full sm:w-auto"
            disabled={processing}
          >
            {processing ? "Confirming..." : "Confirm Rental"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RentalConfirmation;
