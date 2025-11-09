// src/types.ts
import { GeoPoint, Timestamp } from "firebase/firestore";

export interface Marker {
  id: string;
  location: GeoPoint;
  title: string;
  question: string;
  answer: string;
  hint?: string;
  points: number;
  geohash: string;
  createdAt: Timestamp;
  createdBy: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: "admin" | "player" | "events-admin" | "mirage-admin";
  teamId?: string;
  score: number;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // array of user uids
  score: number;
}
