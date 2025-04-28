import { db } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc, setDoc, addDoc } from 'firebase/firestore';
import { Car, Rental } from '../lib/types';
import { toast } from 'sonner';

// Get all available cars for a specific date
export const getAvailableCars = async (selectedDate: Date): Promise<Car[]> => {
  try {
    // Format the date to reset the time part (start of day)
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all cars
    const carsRef = collection(db, 'cars');
    const carsSnapshot = await getDocs(carsRef);
    const cars: Car[] = [];
    
    // Check availability for each car
    for (const carDoc of carsSnapshot.docs) {
      const carData = carDoc.data() as Car;
      carData.id = carDoc.id;
      
      // Check if car has rentals for the selected date
      const rentalsRef = collection(db, 'rentals');
      const q = query(
        rentalsRef,
        where('carId', '==', carData.id),
        where('rentDate', '<=', endOfDay),
        where('returnDate', '>=', startOfDay)
      );
      
      const rentalsSnapshot = await getDocs(q);
      
      // If no rentals found for this date range, car is available
      if (rentalsSnapshot.empty) {
        cars.push(carData);
      }
    }
    
    return cars;
  } catch (error) {
    console.error('Error getting available cars:', error);
    throw new Error('Failed to get available cars');
  }
};

// Get a car by ID
export const getCarById = async (carId: string): Promise<Car | null> => {
  try {
    const carRef = doc(db, 'cars', carId);
    const carDoc = await getDoc(carRef);
    
    if (carDoc.exists()) {
      const carData = carDoc.data() as Car;
      carData.id = carDoc.id;
      return carData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting car by ID:', error);
    throw new Error('Failed to get car details');
  }
};

// Create a new rental
export const createRental = async (
  carId: string, 
  userId: string, 
  userName: string,
  rentDate: Date
): Promise<void> => {
  try {
    // Calculate a random return date (1-3 days after rent date)
    const returnDate = new Date(rentDate);
    const randomDays = Math.floor(Math.random() * 3) + 1; // 1 to 3 days
    returnDate.setDate(returnDate.getDate() + randomDays);
    
    // Create the rental document
    const rentalData: Omit<Rental, 'id'> = {
      carId,
      userId,
      userName,
      rentDate,
      returnDate,
    };
    
    // Add to rentals collection
    const rentalRef = await addDoc(collection(db, 'rentals'), rentalData);
    
    // Update the car's rentals array
    const carRef = doc(db, 'cars', carId);
    const carDoc = await getDoc(carRef);
    
    if (carDoc.exists()) {
      const carData = carDoc.data() as Car;
      const rentals = carData.rentals || [];
      
      rentals.push({
        rentalId: rentalRef.id,
        rentDate,
        returnDate,
      });
      
      // Update the car document
      await setDoc(carRef, { ...carData, rentals }, { merge: true });
    }
    
    toast.success('Car rented successfully!');
  } catch (error) {
    console.error('Error creating rental:', error);
    throw new Error('Failed to create rental');
  }
};

// Get user's rentals
export const getUserRentals = async (userId: string): Promise<Rental[]> => {
  try {
    const rentalsRef = collection(db, 'rentals');
    const q = query(rentalsRef, where('userId', '==', userId));
    const rentalsSnapshot = await getDocs(q);
    
    const rentals: Rental[] = [];
    
    for (const rentalDoc of rentalsSnapshot.docs) {
      const rentalData = rentalDoc.data();
      const rental: Rental = {
        id: rentalDoc.id,
        carId: rentalData.carId,
        userId: rentalData.userId,
        userName: rentalData.userName,
        // Convert Firebase timestamps to JavaScript Dates
        rentDate: rentalData.rentDate instanceof Date 
          ? rentalData.rentDate 
          : rentalData.rentDate && typeof rentalData.rentDate.toDate === 'function'
            ? rentalData.rentDate.toDate()
            : new Date(),
        returnDate: rentalData.returnDate instanceof Date 
          ? rentalData.returnDate 
          : rentalData.returnDate && typeof rentalData.returnDate.toDate === 'function'
            ? rentalData.returnDate.toDate()
            : new Date(),
      };
      
      // Get car details
      const carRef = doc(db, 'cars', rental.carId);
      const carDoc = await getDoc(carRef);
      
      if (carDoc.exists()) {
        const carData = carDoc.data() as Car;
        carData.id = carDoc.id;
        rental.car = carData;
      }
      
      rentals.push(rental);
    }
    
    return rentals;
  } catch (error) {
    console.error('Error getting user rentals:', error);
    throw new Error('Failed to get user rentals');
  }
};

// Populate mock data for cars if the collection is empty
export const populateMockData = async (): Promise<boolean> => {
  try {
    // Check if cars collection already has data
    const carsRef = collection(db, 'cars');
    const carsSnapshot = await getDocs(carsRef);
    
    if (!carsSnapshot.empty) {
      console.log('Car data already exists, skipping population');
      return false;
    }
    
    // Define mock car data with images
    const mockCars = [
      { make: 'Toyota', model: 'Camry', color: 'White', rentals: [], image: '/placeholder.svg' },
      { make: 'Honda', model: 'Civic', color: 'Black', rentals: [], image: '/placeholder.svg' },
      { make: 'Ford', model: 'Mustang', color: 'Red', rentals: [] },
      { make: 'Tesla', model: 'Model 3', color: 'Blue', rentals: [] },
      { make: 'BMW', model: 'X5', color: 'Silver', rentals: [] },
      { make: 'Mercedes', model: 'C-Class', color: 'Black', rentals: [] },
      { make: 'Audi', model: 'A4', color: 'Gray', rentals: [] },
      { make: 'Lexus', model: 'RX', color: 'White', rentals: [] },
      { make: 'Nissan', model: 'Altima', color: 'Blue', rentals: [] },
      { make: 'Chevrolet', model: 'Malibu', color: 'Red', rentals: [] },
      { make: 'Hyundai', model: 'Sonata', color: 'Silver', rentals: [] },
      { make: 'Kia', model: 'Optima', color: 'Black', rentals: [] },
      { make: 'Mazda', model: 'CX-5', color: 'Red', rentals: [] },
      { make: 'Subaru', model: 'Outback', color: 'Green', rentals: [] },
      { make: 'Volkswagen', model: 'Passat', color: 'Gray', rentals: [] },
      { make: 'Volvo', model: 'S60', color: 'Blue', rentals: [] },
      { make: 'Jeep', model: 'Grand Cherokee', color: 'Black', rentals: [] },
      { make: 'Land Rover', model: 'Range Rover', color: 'White', rentals: [] },
      { make: 'Porsche', model: 'Cayenne', color: 'Silver', rentals: [] },
      { make: 'Acura', model: 'MDX', color: 'Blue', rentals: [] },
    ];
    
    // Add mock cars to Firestore
    for (const car of mockCars) {
      await addDoc(carsRef, car);
    }
    
    console.log('Successfully populated mock car data');
    return true;
  } catch (error) {
    console.error('Error populating mock data:', error);
    return false;
  }
};
