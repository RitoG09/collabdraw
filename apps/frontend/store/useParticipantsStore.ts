import { create } from "zustand";
import { ParticipantStore, ParticipantType } from "../types/types";

export const useParticipantsStore = create<ParticipantStore>((set) => ({
  participants: [],
  setParticipants: (participants: ParticipantType[]) => set({ participants }),
}));
