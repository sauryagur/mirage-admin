import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Team } from "../types";

const teamsCollection = collection(db, "mirage-teams");

export const getTeams = async (): Promise<Team[]> => {
  const snapshot = await getDocs(teamsCollection);
  return snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
      }) as Team,
  );
};
