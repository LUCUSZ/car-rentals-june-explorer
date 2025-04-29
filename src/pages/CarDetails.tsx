
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById } from "@/services/carService";
import { Car } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, ArrowLeft, Star, Users, Fuel, Zap, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const CarDetails = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  // Mock data for car details
  const carDetails = {
    rating: 4.8,
    reviews: 42,
    pricePerHour: Math.floor(Math.random() * 50) + 20,
    transmission: ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
    fuelType: ["Gasoline", "Diesel", "Electric"][Math.floor(Math.random() * 3)],
    seats: [2, 4, 5, 7][Math.floor(Math.random() * 4)],
    features: ["Bluetooth", "Navigation", "Parking Sensors", "Backup Camera", "Heated Seats"]
  };

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

  const handleBookNow = () => {
    if (car) {
      navigate(`/booking/${car.id}`);
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const toggleFavorite = () => {
    setFavorite(!favorite);
    toast.success(favorite ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Car Not Found</h2>
        <p className="text-gray-500 mb-6">The car you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleGoBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Car Details</h1>
        <Button variant="ghost" size="icon" onClick={() => toast.success("Share link copied!")}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="aspect-video bg-muted relative rounded-lg mb-4 overflow-hidden">
        <img
          src={car.image || "/placeholder.svg"}
          alt={`${car.make} ${car.model}`}
          className="object-cover w-full h-full"
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 bg-white rounded-full shadow-md"
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
      
      <div className="space-y-4 px-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">{carDetails.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({carDetails.reviews} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-2xl text-car">${carDetails.pricePerHour}</span>
            <span className="text-sm text-gray-500">/hour</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 my-4">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Zap className="h-4 w-4 mr-2" />
            <span className="text-sm">{carDetails.transmission}</span>
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Fuel className="h-4 w-4 mr-2" />
            <span className="text-sm">{carDetails.fuelType}</span>
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{carDetails.seats} Seats</span>
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Badge variant="outline" className="bg-transparent border-none p-0">
              <span className="text-sm">{car.color}</span>
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
            <TabsTrigger value="host" className="flex-1">Host</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm">
                Experience the luxury and comfort of the {car.make} {car.model}. 
                This {car.color} beauty is perfect for both city drives and long journeys.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {carDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 bg-car rounded-full mr-2"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold ml-2">{carDetails.rating}</span>
                <span className="text-gray-500 ml-2">({carDetails.reviews} reviews)</span>
              </div>
              <p className="text-gray-600 text-sm">
                Reviews are not available in this demo version.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="host">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                <img src="/placeholder.svg" alt="Host" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold">Car Owner</h3>
                <p className="text-gray-500 text-sm">Available 24/7</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm ml-1">4.9</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">Chat with Host</Button>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button onClick={handleBookNow} className="w-full bg-car hover:bg-car-secondary">
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default CarDetails;
