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
  createdAt: string;
  eventId: string;
  eventName: string;
  eventType: string;
  inviteCode: string;
  leaderUserId: string;
  members: {
    collegeName: string;
    email: string;
    name: string;
    phoneNumber: string;
    rollNumber: string;
    userId: string;
  }[];
  status: string;
  teamId: string;
  teamName: string;
  points: number;
  answered_questions: {
    answer: string;
    createdAt: string;
    createdBy: string;
    geohash: string;
    hint: string;
    location: string;
    points: number;
    question: string;
    title: string;
  }[];
}

export interface Registration {
  checkingStatus: string;
  eventCategory: string;
  eventId: string;
  eventName: string;
  eventType: string;
  paymentDetails: null;
  registeredAt: string;
  teamId: string;
  teamInviteCode: string;
  user: {
    collegeName: string;
    email: string;
    name: string;
    phoneNumber: string;
    rollNumber: string;
    userId: string;
  };
}
