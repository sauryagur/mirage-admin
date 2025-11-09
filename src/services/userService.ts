// src/services/userService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { UserProfile } from "../types";

const usersCollection = collection(db, "users");

export const getUsers = async (): Promise<UserProfile[]> => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(
    (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      }) as UserProfile,
  );
};
