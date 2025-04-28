import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast: toastNotification } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, "id">;
            setCurrentUser({
              id: firebaseUser.uid,
              ...userData
            });
          } else {
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'User'
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (firebaseUser.email) {
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || 'User'
            });
          } else {
            setCurrentUser(null);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        console.log("Using mock auth in demo/dev mode");
        const mockUserId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const mockUserData = { 
          id: mockUserId,
          fullName,
          email
        };
        localStorage.setItem(`mock-user-${email}`, JSON.stringify(mockUserData));
        toast("Account created successfully", {
          description: "You can now log in with your credentials",
        });
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          email
        });
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError);
      }

      toastNotification({
        description: "Account created successfully. You can now log in with your credentials"
      });
    } catch (error: any) {
      let errorMessage = "Error creating account";
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use. Try logging in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Use at least 6 characters.";
      } else if (error.code === 'auth/api-key-not-valid') {
        errorMessage = "Demo mode active. Your account has been created successfully!";
        toast("Demo Mode", {
          description: "Account created successfully in demo mode",
        });
        return;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastNotification({
        variant: "destructive",
        description: errorMessage
      });
      
      if (!error.code?.includes('api-key-not-valid')) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        console.log("Using mock auth in demo/dev mode");
        const mockUserData = localStorage.getItem(`mock-user-${email}`);
        if (mockUserData) {
          const userData = JSON.parse(mockUserData) as User;
          setCurrentUser(userData);
          
          toast("Logged in successfully", {
            description: "Welcome back!"
          });
          return;
        } else {
          throw new Error("Invalid email or password");
        }
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      
      toastNotification({
        description: "Logged in successfully. Welcome back!"
      });
    } catch (error: any) {
      let errorMessage = "Error logging in";
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Account not found. Try signing up instead.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Wrong password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastNotification({
        variant: "destructive",
        description: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        setCurrentUser(null);
        toastNotification({
          description: "Logged out successfully"
        });
        return;
      }
      
      await firebaseSignOut(auth);
      toastNotification({
        description: "Logged out successfully"
      });
    } catch (error: any) {
      toastNotification({
        variant: "destructive",
        description: error.message || "Error logging out"
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
