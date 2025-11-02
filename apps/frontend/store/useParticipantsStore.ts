import { ParticipantStore, ParticipantType } from "types/types";
import { create } from "zustand";

export const useParticipantsStore = create<ParticipantStore>((set) => ({
  participants: [],
  setParticipants: (participants: ParticipantType[]) => set({ participants }),
}));
