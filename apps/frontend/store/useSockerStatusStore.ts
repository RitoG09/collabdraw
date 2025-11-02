import { create } from "zustand";
import { ESocketStatus, SocketStatusStore } from "types/types";

export const useSocketStatusStore = create<SocketStatusStore>((set) => ({
  socketStatus: ESocketStatus.connecting,
  setSocketStatus: (status: ESocketStatus) => set({ socketStatus: status }),
}));
