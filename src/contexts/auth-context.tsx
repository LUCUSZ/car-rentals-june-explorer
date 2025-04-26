
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
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

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
            // Create a basic user object from firebase auth data
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'User'
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Create basic user from auth even if Firestore fails
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          email
        });
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError);
        // Continue even if Firestore fails - user is still authenticated
      }

      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
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
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
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
      
      toast({
        title: "Error logging in",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
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
