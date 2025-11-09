// src/services/authService.ts
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../types";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  await auth.signOut();
};

export const checkUserRole = async (user: User): Promise<boolean> => {
  console.log("Checking user role for:", user);
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const userProfile = userDoc.data() as UserProfile;
    console.log("User profile from Firestore:", userProfile);
    const role = userProfile.role || "";
    console.log("User role:", role);
    return role === "admin" || role === "events-admin" || role === "mirage-admin";
  }
  console.log("User document not found in Firestore for UID:", user.uid);
  return false;
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
  }
  return null;
};
