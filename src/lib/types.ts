
export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  color: string;
  rentals: CarRental[];
}

export interface CarRental {
  rentalId: string;
  rentDate: Date;
  returnDate: Date;
}

export interface Rental {
  id: string;
  carId: string;
  userId: string;
  rentDate: Date;
  returnDate: Date;
  userName: string;
  car?: Car; // For joined data
}
