// src/services/markerService.ts
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Marker } from "../types";

const markersCollection = collection(db, "mirage-locations");

export const getMarkers = async (): Promise<Marker[]> => {
  const snapshot = await getDocs(markersCollection);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Marker,
  );
};

export const addMarker = async (
  marker: Omit<Marker, "id">,
): Promise<void> => {
  await addDoc(markersCollection, marker);
};

export const updateMarker = async (
  id: string,
  data: Partial<Omit<Marker, "id">>,
) => {
  const markerDoc = doc(db, "mirage-locations", id);
  await updateDoc(markerDoc, data);
};

export const deleteMarker = async (id: string) => {
  const markerDoc = doc(db, "mirage-locations", id);
  await deleteDoc(markerDoc);
};
