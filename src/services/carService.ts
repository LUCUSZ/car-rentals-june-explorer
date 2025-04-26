
import { collection, doc, getDocs, getDoc, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Car, CarRental, Rental } from "@/lib/types";

// Mock data for initial database setup
const mockCars = [
  { make: "Toyota", model: "Camry", color: "White" },
  { make: "Honda", model: "Civic", color: "Black" },
  { make: "Ford", model: "Mustang", color: "Red" },
  { make: "Tesla", model: "Model 3", color: "Blue" },
  { make: "BMW", model: "X5", color: "Silver" },
  { make: "Mercedes", model: "C-Class", color: "Black" },
  { make: "Audi", model: "A4", color: "Gray" },
  { make: "Chevrolet", model: "Malibu", color: "White" },
  { make: "Nissan", model: "Altima", color: "Blue" },
  { make: "Hyundai", model: "Sonata", color: "Silver" },
  { make: "Kia", model: "Optima", color: "Red" },
  { make: "Subaru", model: "Outback", color: "Green" },
  { make: "Mazda", model: "CX-5", color: "Black" },
  { make: "Lexus", model: "RX", color: "White" },
  { make: "Volkswagen", model: "Passat", color: "Gray" },
  { make: "Volvo", model: "XC60", color: "Blue" },
  { make: "Jeep", model: "Grand Cherokee", color: "Black" },
  { make: "Dodge", model: "Charger", color: "Red" },
  { make: "Chrysler", model: "300", color: "White" },
  { make: "Buick", model: "Enclave", color: "Silver" }
];

// Function to populate mock data - we'll call this from the Home component if no cars exist
export async function populateMockData() {
  const carsRef = collection(db, "cars");
  const carsSnapshot = await getDocs(carsRef);
  
  if (carsSnapshot.empty) {
    console.log("Populating mock data...");
    const batch = [];
    for (const car of mockCars) {
      batch.push(addDoc(collection(db, "cars"), {
        ...car,
        rentals: []
      }));
    }
    await Promise.all(batch);
    return true;
  }
  return false;
}

// Function to check if a date is in June 2025
export function isJune2025(date: Date): boolean {
  return date.getFullYear() === 2025 && date.getMonth() === 5; // Note: months are 0-indexed
}

// Get all cars available on a specific date
export async function getAvailableCars(selectedDate: Date): Promise<Car[]> {
  try {
    const carsRef = collection(db, "cars");
    const carsSnapshot = await getDocs(carsRef);
    
    if (carsSnapshot.empty) {
      return [];
    }
    
    const cars: Car[] = [];
    
    for (const doc of carsSnapshot.docs) {
      const carData = doc.data();
      const rentals: CarRental[] = carData.rentals || [];
      
      // Check if the car is available on the selected date
      const isAvailable = !rentals.some(rental => {
        const rentDate = rental.rentDate instanceof Timestamp 
          ? rental.rentDate.toDate() 
          : new Date(rental.rentDate);
        
        const returnDate = rental.returnDate instanceof Timestamp 
          ? rental.returnDate.toDate() 
          : new Date(rental.returnDate);
        
        // Check if selected date falls within the rental period
        return selectedDate >= rentDate && selectedDate <= returnDate;
      });
      
      if (isAvailable) {
        cars.push({
          id: doc.id,
          make: carData.make,
          model: carData.model,
          color: carData.color,
          rentals: rentals
        });
      }
    }
    
    return cars;
  } catch (error) {
    console.error("Error getting available cars:", error);
    throw error;
  }
}

// Get car by ID
export async function getCarById(carId: string): Promise<Car | null> {
  try {
    const carRef = doc(db, "cars", carId);
    const carDoc = await getDoc(carRef);
    
    if (!carDoc.exists()) {
      return null;
    }
    
    const carData = carDoc.data();
    return {
      id: carDoc.id,
      make: carData.make,
      model: carData.model,
      color: carData.color,
      rentals: carData.rentals || []
    };
  } catch (error) {
    console.error("Error getting car by ID:", error);
    throw error;
  }
}

// Create a new rental
export async function createRental(
  carId: string, 
  userId: string, 
  userName: string, 
  rentDate: Date
): Promise<string> {
  try {
    // Calculate return date (random 1-3 days later)
    const returnDate = new Date(rentDate);
    returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 3) + 1);
    
    // Add rental to rentals collection
    const rentalRef = await addDoc(collection(db, "rentals"), {
      carId,
      userId,
      userName,
      rentDate,
      returnDate
    });
    
    // Get the car document
    const carRef = doc(db, "cars", carId);
    const carDoc = await getDoc(carRef);
    
    if (carDoc.exists()) {
      // Get existing rentals
      const carData = carDoc.data();
      const rentals = carData.rentals || [];
      
      // Add new rental to car document
      await doc(carRef).update({
        rentals: [
          ...rentals,
          {
            rentalId: rentalRef.id,
            rentDate,
            returnDate
          }
        ]
      });
    }
    
    return rentalRef.id;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
}

// Get user rentals
export async function getUserRentals(userId: string): Promise<Rental[]> {
  try {
    const rentalsRef = collection(db, "rentals");
    const q = query(rentalsRef, where("userId", "==", userId));
    const rentalsSnapshot = await getDocs(q);
    
    if (rentalsSnapshot.empty) {
      return [];
    }
    
    const rentals: Rental[] = [];
    
    for (const rentalDoc of rentalsSnapshot.docs) {
      const rentalData = rentalDoc.data();
      
      // Get car details for each rental
      const carRef = doc(db, "cars", rentalData.carId);
      const carDoc = await getDoc(carRef);
      
      let car: Car | undefined = undefined;
      
      if (carDoc.exists()) {
        const carData = carDoc.data();
        car = {
          id: carDoc.id,
          make: carData.make,
          model: carData.model,
          color: carData.color,
          rentals: carData.rentals || []
        };
      }
      
      const rentDate = rentalData.rentDate instanceof Timestamp 
        ? rentalData.rentDate.toDate() 
        : new Date(rentalData.rentDate);
      
      const returnDate = rentalData.returnDate instanceof Timestamp 
        ? rentalData.returnDate.toDate() 
        : new Date(rentalData.returnDate);
      
      rentals.push({
        id: rentalDoc.id,
        carId: rentalData.carId,
        userId: rentalData.userId,
        rentDate,
        returnDate,
        userName: rentalData.userName,
        car
      });
    }
    
    // Sort rentals by rent date in descending order (newest first)
    return rentals.sort((a, b) => b.rentDate.getTime() - a.rentDate.getTime());
  } catch (error) {
    console.error("Error getting user rentals:", error);
    throw error;
  }
}
